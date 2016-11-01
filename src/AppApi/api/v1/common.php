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
    12007 => 'Deposit Account No Exist',

    13001 => 'Finger Parames Empty',
    13002 => 'Finger Parames Required Defect',
    13003 => 'Device Not Register',
    13004 => 'Finger Not register',

    15001 => 'Comment Parames Empty',
    15002 => 'Comment Parames Required Defect',

    16001 => 'Charge Parames Empty',
    16002 => 'Charge Parames Required Defect',
    16004 => 'No Charge Menu List',
    16005 => 'No payment'
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

function redirectWechat($code, $app_id, $secret, $app, $redis)
{
    $response = $app->response();

    $accessInfo = getAccessToken($app_id, $secret, $code, $app);
    if (empty($accessInfo)){
        return;
    }
    $userInfo = getUserInfo($accessInfo['access_token'], $accessInfo['openid'], $app, $redis);
    if (empty($userInfo)){
        return;
    }
    return $userInfo;
}

function getWechatUserInfo($wid, $app_id, $secret, $app, $redis)
{
    $url = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=".$app_id."&secret=".$secret;
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HEADER, 0);
    $data = curl_exec($ch);
    curl_close($ch);
    $arr_data = json_decode($data, true);
    $access_token=$arr_data['access_token'];
    $app->getLog()->debug("accesstoken in getWechatUserInfo = ".$access_token);
    if(!empty($access_token)){
        $url = "https://api.weixin.qq.com/cgi-bin/user/info?access_token=".$access_token."&openid=".$wid."&lang=zh_CN";
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HEADER, 0);
        $data = curl_exec($ch);
        curl_close($ch);
        $redis->set("wechat_user_".$wid, $data);
        $userInfo = json_decode($data, true);
        $app->getLog()->debug("userInfo in getWechatUserInfo = ".$data);
        return $userInfo;
    }else{
      return null;
    }
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

function getUserInfo($access_token, $open_id, $app, $redis)
{
    $url = "https://api.weixin.qq.com/sns/userinfo?access_token=".$access_token."&openid=".$open_id."&lang=zh_CN";

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HEADER, 0);
    $data = curl_exec($ch);
    curl_close($ch);

    $arr_data = json_decode($data, true);
    $redis->set("wechat_user_".$open_id, $data);
    return $arr_data;
}

function getParentPurview($sql_db, $parentid){
    try{
        $sql_str = "SELECT parentid, TIMESTAMPDIFF(DAY, NOW(), cutofftime) as retdays, businessid FROM tb_parent_order 
            WHERE ordertype = 1 AND paystatus = 1 AND NOW() <= cutofftime AND parentid=:parentid";
        $stmt = $sql_db->prepare($sql_str);
        $stmt->bindParam(":parentid", $parentid, PDO::PARAM_STR);
        if(!$stmt->execute())
            return false;
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        if(!$row)
            return false;

        return true;
    }catch (PDOException $e) {
        $errs = $e->getMessage();
        return 10000;
    }

}

?>
