
'use strict';

var sApp = angular.module('wechatPayApp', []);
sApp.controller('wechatPayCtrl', function($scope,$http,$document) {
    $scope.information = "";
    $scope.url = "http://wx.zxing-tech.cn/api/v1/wechatPay/order";
    $scope.isReady=false;
    $scope.orderId=null;
    $scope.pay=function(){
        var data={
            goodsId:"1",
	    userId:"20000069",	
            wxId:"o_Nkcw4CsZh5dbE2v8XVLUxfd96A"
        };
        $http.post($scope.url,data)
            .then(function (response) {
                var result=response.data.data;
		$scope.orderId=result.orderId;
                $scope.information = JSON.stringify(result);
                if($scope.isReady){
                    WeixinJSBridge.invoke(
                        'getBrandWCPayRequest',
                        {
                            "appId":result.appId, 
                            "timeStamp":""+result.timeStamp,  
                            "nonceStr":result.nonceStr, 
                            "package":"prepay_id="+result.prepay_id,
                            "signType":"MD5",         
                            "paySign":result.paySign 
                        },
                        function(res){
                            //alert(JSON.stringify(res));
                            //alert(res.err_msg);
                            if(res.err_msg == "get_brand_wcpay_request:ok" ) {
                                // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。
                               //保存数据．跳转页面
                                //check order make sure user had pay the order ready.
                                $scope.queryOrder($scope.orderId).then(
                                    function(result) {
                                        //{"errno":0,"error":"",
                                        // "data":{"orderId":"139630530220161103152842","wechatOrderId":"4003682001201611038611986947",
                                        // "totalFee":"1","payState":"SUCCESS","payTime":"20161103152851"}}
                                        alert(JSON.stringify(result));
                                        var status = result.data.payState;
                                        var payTime=result.data.payTime;
                                        if(status === 'SUCCESS'){
                                            //保存数据．跳转页面
                                            $scope.updateOrder(data.userId,$scope.orderId,payTime).then(
                                                function(updateResult) {
                                                    alert(JSON.stringify(updateResult));
                                                    $scope.information = "udpate success ";
                                                },
                                                function(error) {
                                                    alert(JSON.stringify(error));
                                                }
                                            );
                                        }
                                    },
                                    function (reason) {
                                        alert(JSON.stringify(reason));
                                    }
                                );
                            }else if(res.err_msg == "get_brand_wcpay_request:cancel"){
                                alert("用户取消");
                            }else if(res.err_msg == "get_brand_wcpay_request:fail"){
                                alert("付款失败");
                            }
                        }
                    );
                }
            }, function (error) {
                alert(JSON.stringify(error));
            });
    };


    $scope.queryOrder=function (id) {
        var url = "http://wx.zxing-tech.cn/api/v1/" + "wechatPay/order/";
        return 	$http.get(url+id)
            .then(function (response) {
                return response.data;
            }, function (error) {
                return $q.reject(error);
            });
    };

    $scope.updateOrder=function(parentId,orderId,payTime) {
        var url = "http://wx.zxing-tech.cn/api/v1/" + "/charge/order/update/";
        var data = {
            "paystatus":1,
            "paytime":payTime,
            "orderid":orderId
        };
        return $http.post(url+parentId,data)
            .then(function (response) {
                return response.data;
            }, function (error) {
                return $q.reject(error);
            });
    };

    $scope.onBridgeReady=function () {
        alert('wechat ok');
        $scope.isReady=true;
    };

    if (typeof WeixinJSBridge == "undefined"){
        console.log(1);
        if( document.addEventListener ){
            document.addEventListener('WeixinJSBridgeReady', $scope.onBridgeReady, false);
        }else if (document.attachEvent){
            document.attachEvent('WeixinJSBridgeReady', $scope.onBridgeReady);
            document.attachEvent('onWeixinJSBridgeReady', $scope.onBridgeReady);
        }
        console.log(2);
    }else{
        $scope.onBridgeReady();
    }
});
