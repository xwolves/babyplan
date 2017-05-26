<?php
class WechatPayment{
    private $APP_ID;
    private $MCH_ID;
    private $APP_KEY;

    public function __construct($appid,$mchid,$appkey){
        $this->APP_ID = $appid;
        $this->MCH_ID = $mchid;
        $this->APP_KEY = $appkey;
    }

    // APPID (开户邮件中可查看)
    //define("APP_ID",  "wx3814600bfd67bfe6");

    // 商户号 (开户邮件中可查看)
    //define("MCH_ID",  "1396305302");

    // 商户支付密钥 (https://pay.weixin.qq.com/index.php/account/api_cert)
    //define("APP_KEY", "ZXyFyT2qBWc8fv02qjXQmuikZHKdHrsN");

    public function getOrder(){
        // get prepay id
        $prepay_id = $this->generatePrepayId();

        // re-sign it
        $response = array(
            'appid'     => $this->APP_ID,
            'partnerid' => $this->MCH_ID,
            'prepayid'  => $prepay_id,
            'package'   => 'Sign=WXPay',
            'noncestr'  => $this->generateNonce(),
            'timestamp' => time(),
        );
        $response['sign'] = $this->calculateSign($response);

        // send it to APP
        return json_encode($response);
    }

    /**
     * Generate a nonce string
     *
     * @link https://pay.weixin.qq.com/wiki/doc/api/app.php?chapter=4_3
     */
    function generateNonce()
    {
        return md5(uniqid('', true));
    }

    /**
     * Get a sign string from array using app key
     *
     * @link https://pay.weixin.qq.com/wiki/doc/api/app.php?chapter=4_3
     */
    function calculateSign($arr)
    {
        ksort($arr);

        $buff = "";
        foreach ($arr as $k => $v) {
            if ($k != "sign" && $k != "key" && $v != "" && !is_array($v)){
                $buff .= $k . "=" . $v . "&";
            }
        }

        $buff = trim($buff, "&");

        return strtoupper(md5($buff . "&key=" . $this->APP_KEY));
    }

    /**
     * Get xml from array
     */
    function getXMLFromArray($arr)
    {
        $xml = "<xml>";
        foreach ($arr as $key => $val) {
            if (is_numeric($val)) {
                $xml .= sprintf("<%s>%s</%s>", $key, $val, $key);
            } else {
                $xml .= sprintf("<%s><![CDATA[%s]]></%s>", $key, $val, $key);
            }
        }

        $xml .= "</xml>";

        return $xml;
    }

    /**
     * Generate a prepay id
     *
     * @link https://pay.weixin.qq.com/wiki/doc/api/app.php?chapter=9_1
     */
    function generatePrepayId()
    {
        echo 0;
        $params = array(
            'appid'            => $this->APP_ID,
            'mch_id'           => $this->MCH_ID,
            'nonce_str'        => $this->generateNonce(),
            'body'             => 'app member order',
            'out_trade_no'     => time(),
            'total_fee'        => 1,
            'spbill_create_ip' => '8.8.8.8',
            'notify_url'       => 'http://localhost',
            'trade_type'       => 'APP',
        );

        // add sign
        $params['sign'] = $this->calculateSign($params);
        var_dump($params);
        // create xml
        $xml = $this->getXMLFromArray($params);
        echo $xml;
        // send request
        $ch = curl_init();

  	    curl_setopt_array($ch, array(
            CURLOPT_URL            => "https://api.mch.weixin.qq.com/pay/unifiedorder",
            CURLOPT_POST           => true,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_SSL_VERIFYPEER => true,
            CURLOPT_SSL_VERIFYHOST => 2,
            CURLOPT_FOLLOWLOCATION => 1,
            CURLOPT_AUTOREFERER    => 1,
            CURLOPT_USERAGENT      => $_SERVER['HTTP_USER_AGENT'],
            CURLOPT_TIMEOUT        => 30,
            CURLOPT_HTTPHEADER     => array('Content-Type: text/xml'),
            CURLOPT_POSTFIELDS     => $xml,
        ));

        $result = curl_exec($ch);
        curl_close($ch);
        echo $result;
        // get the prepay id from response
        $xml = simplexml_load_string($result);
        return (string)$xml->prepay_id;
    }

}
