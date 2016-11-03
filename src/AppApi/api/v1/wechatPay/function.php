<?php
require_once "lib/WxPay.Api.php";

function createOrder($app){
  $response = $app->response();
  $request = $app->request->getBody();
  $j_request = json_decode($request, true);
  //{goodsId,goodsName,goodsExt,goodsPrice //可以仅从前端获得产品id，然后从数据库中查询其他信息
  // userId}//用户的微信openid
  if(!array_key_exists("goodsId", $j_request) || !array_key_exists("userId", $j_request)){
      $response->setBody(rspData(FAILED, "请求参数非法，请确认必填参数"));
      return;
  }

  $openId = $j_request['userId'];
  $goodsTag = $j_request['goodsId'];
  $goodsName="From database";
  $goodsExt="From database";
  $goodsPrice="1";//from database and with sale

  $input = new WxPayUnifiedOrder();
  $input->SetBody($goodsName);//商品描述
  $input->SetAttach($goodsExt);//附加数据
  $input->SetOut_trade_no(WxPayConfig::MCHID.date("YmdHis"));//商品订单号
  $input->SetTotal_fee($goodsPrice);//总金额
  $input->SetTime_start(date("YmdHis"));//交易起始时间
  $input->SetTime_expire(date("YmdHis", time() + 600));//交易结束时间
  $input->SetGoods_tag($goodsTag);//商品标记
  $input->SetNotify_url("http://10.20.68.73:8080/result.html");//通知地址
  $input->SetTrade_type("JSAPI");//交易类型
  $input->SetOpenid($openId);//用户标识
  //var_dump($input);
  $order = WxPayApi::unifiedOrder($input);
  //var_dump($order);

  //get pay sign
  $jsapi = new WxPayJsApiPay();
  $jsapi->SetAppid($order['appid']);
  $jsapi->SetTimeStamp(time());
  $jsapi->SetNonceStr(WxPayApi::getNonceStr());
  $jsapi->SetPackage("prepay_id=" . $order['prepay_id']);
  $jsapi->SetSignType("MD5");
  $jsapi->SetPaySign($jsapi->MakeSign());
  //var_dump($jsapi);

  if(!array_key_exists("return_code", $order) || !$jsapi->IsPaySignSet()){
      $response->setBody(rspData(10000, "查询失败"));
      return;
  }
  if($order['return_code']=='SUCCESS'){
      $rsp_data = array();
      $rsp_data['appId'] = $order['appid'];
      $rsp_data['timeStamp'] = $jsapi->GetTimeStamp();
      $rsp_data['nonceStr'] = $jsapi->GetReturn_code();
      $rsp_data['prepay_id'] = $order['prepay_id'];
      $rsp_data['paySign'] = $jsapi->GetPaySign();
      $response->setBody(rspData(0,  $rsp_data));
  }else{
      $response->setBody(rspData(10001,  $order['return_msg']));
  }
}

function queryOrder($app,$orderId){
	$response = $app->response();
        //$request = $app->request->getBody();
        $input = new WxPayOrderQuery();
        $input->SetOut_trade_no($orderId);
        $input->SetAppid(WxPayConfig::APPID);
        $input->SetMch_id(WxPayConfig::MCHID);
        $input->SetNonce_str(WxPayApi::getNonceStr());
        $input->SetSign($input->MakeSign());
        //var_dump($input);
        $order=WxPayApi::orderQuery($input);
        //var_dump($order);

        if(!array_key_exists("return_code", $order) ){
            $response->setBody(rspData(10000, "查询失败"));
            return;
        }
        if($order['result_code']=='SUCCESS'){
            $rsp_data = array();
            $rsp_data['orderId'] = $order['out_trade_no'];
            $rsp_data['wechatOrderId'] = $order['transaction_id'];
            $rsp_data['totalFee'] = $order['total_fee'];
            $rsp_data['payState'] = $order['trade_state'];
            $rsp_data['payTime'] = $order['time_end'];
            $response->setBody(rspData(0,  $rsp_data));
        }else{
            $response->setBody(rspData(10001,  $order['err_code_des']));
        }
}

