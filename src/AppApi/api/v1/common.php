<?php
static $errCode = array(
    10000 => 'Catch Exeption',
    10001 => 'Database Operation Error',
    10002 => 'Database Operation Failed',
    10003 => 'No Data',
    10004 => 'Redis Set Failed',
    10005 => 'Redis Get No Data',
    12001 => 'Account Parames Empty',
    12002 => 'Account Parames Required Defect',
    12003 => 'Choose Account',
    12004 => 'Account Weixin Not Bound',
    12005 => 'Account Have No Children Related',
    12006 => 'Account Have No Teacher Related',
    13001 => 'Finger Parames Empty'
);

function rspData($ret, $data = ""){
    global $errCode;
    $ar_ret = array();
    if(intval($ret) < 10000000 && intval($ret) != 0){
        $ar_ret['errno'] = $ret;
        $ar_ret['error'] = $errCode[$ret];
        $ar_ret['data'] = "";
    }else{
        $ar_ret['errno'] = 0;
        $ar_ret['error'] = "";
        $ar_ret['data'] = $data;
    }
    return json_encode($ar_ret);
}

function redirectWechat($code, $app_id, $secret, $app)
{
    $response = $app->response();

    $accessInfo = getAccessToken($app_id, $secret, $code, $app);
    if (empty($accessInfo)){
        return;
    }   
    $userInfo = getUserInfo($accessInfo['access_token'], $accessInfo['openid'], $app);
    if (empty($userInfo)){
        return;
    }   
    return $userInfo;
}

function getAccessToken($app_id, $secret, $code, $app)
{       
    $access_token = "";
    $url = "https://api.weixin.qq.com/sns/oauth2/access_token?appid=".$app_id."&secret=".$secret."&code=".$code."&grant_type=authorization_code";
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HEADER, 0);
    $data = curl_exec($ch);
    curl_close($ch);

    $arr_data = json_decode($data, true);

    return $arr_data;
}       

function getUserInfo($access_token, $open_id, $app)
{
    $url = "https://api.weixin.qq.com/sns/userinfo?access_token=".$access_token."&openid=".$open_id."&lang=zh_CN";

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HEADER, 0);
    $data = curl_exec($ch);
    curl_close($ch);

    $arr_data = json_decode($data, true);

    return $arr_data;
}
?>
