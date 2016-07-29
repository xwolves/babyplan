<?php
require_once '../../Slim/Slim/Slim.php';
require_once '../../Slim/Slim/LogWriter.php';
require_once './account_moduls/accnt_function.php';
require_once 'config.php';
require_once 'common.php';
require_once '../../Slim/WeiChat/WXBizMsgCrypt.php';
\Slim\Slim::registerAutoloader();

$log = new \Slim\LogWriter(fopen('../../Slim/Log/log', 'a'));
$app = new \Slim\Slim(array(
    'log.writer' => $log
));
$app->config('debug', true);
$app->response->headers->set('Content-Type', 'application/json');
$app->response->headers->set('Access-Control-Allow-Origin', '*');
$app->response->headers->set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
$app->response->headers->set('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
$app->response->headers->set('Access-Control-Max-Age', '60');

static $sql_db;
static $redis;
try {
    $sql_db = new PDO($SQL_HOST.$SQL_DB_NAME, $SQL_USER, $SQL_PASSWORD);
    $sql_db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);    
    $sql_db->exec('set names utf8'); 
} catch (PDOException $e) {
    $errs = "connect database failed, reason : " . $e->getMessage();
    die($errs);
}

try{
    $redis = new Redis();
    $redis->connect('127.0.0.1', 6379); 
} catch (PDOException $e) {
    $errs = "create redis instance failed, reson : " . $e->getMessage();
    die($errs);
}

$app->get(
    '/redirect/',
    function () use ($app, $APP_ID, $SECRET, $REDIRECT_URL, $orc_db){
        $req=$app->request();

        $queryStr = $_SERVER['QUERY_STRING'];
        $reUrl=$req->getUrl().$req->getPath();
        $businessUrl=$req->params("businessUrl");
        if(strlen($queryStr)>0){
            $reUrl=$reUrl."?".$queryStr;
        }

        $code=$req->params("code");
        $redirect_url = urlencode($reUrl);
        $url = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=".$APP_ID."&redirect_uri=".$redirect_url."&response_type=code&scope=snsapi_userinfo&state=BABY_PLAN#wechat_redirect ";
        if($code!=null){
            $userInfo=redirectWechat($code, $APP_ID, $SECRET, $app);
            if (empty($userInfo)){
                echo "no userid find";
            }   
            $go2Url = urldecode($businessUrl);
            $tail = "#/wxlogin";
            $tmp_str = substr($go2Url, strlen($go2Url) - strlen($tail));
            if($tail != $tmp_str)
                $go2Url .= $tail;

            header("Location: ".$go2Url."?user=".$userInfo['openid']);
            exit;
        }else{
            header("Location: ".$url);
            exit;
        }   
    }   
);  

$app->post(
    '/account/register/parent',
    function () use ($app, $sql_db) {
        $rsp_data = array();
        $response = $app->response;
        $request = $app->request->getBody();
        $a_request = json_decode($request, true);
        if(empty($a_request)){
            $response->setBody(rspData(12001));
            return;
        }
        $a_request = array_change_key_case($a_request, CASE_LOWER);
        if(!array_key_exists("weixinno", $a_request) || !array_key_exists("sex", $a_request) || !array_key_exists("mobile", $a_request)
            || !array_key_exists("password", $a_request) || !array_key_exists("name", $a_request)){
            $response->setBody(rspData(12002));
            return;
        }
        $account = new Account($sql_db);
        $ret = $account->createParentAccount($a_request, 2);
        $rsp_data['uid'] = $ret;
        $response->setBody(rspData($ret, $rsp_data));
    }
);

$app->post(
    '/account/register/children',
    function () use ($app, $sql_db) {
        $rsp_data = array();
        $response = $app->response;
        $request = $app->request->getBody();
        $a_request = json_decode($request, true);
        if(empty($a_request)){
            $response->setBody(rspData(12001));
            return;
        }
        $a_request = array_change_key_case($a_request, CASE_LOWER);
        if(!array_key_exists("p_uid", $a_request) || !array_key_exists("name", $a_request) || !array_key_exists("sex", $a_request)){
            $response->setBody(rspData(12002));
            return;
        }
        $account = new Account($sql_db);
        $ret = $account->createParentAccount($a_request, 4);
        $rsp_data['uid'] = $ret;
        $response->setBody(rspData($ret, $rsp_data));
    }
);

$app->post(
    '/deposit/:deposit_accnt_id/addteacher',
    function ($deposit_accnt_id) use ($app, $sql_db) {
        $rsp_data = array();
        $response = $app->response;
        $request = $app->request->getBody();
        $a_request = json_decode($request, true);
        if(empty($a_request)){
            $response->setBody(rspData(12001));
            return;
        }
        $a_request['depositid'] = $deposit_accnt_id;
        $a_request = array_change_key_case($a_request, CASE_LOWER);
        if(!array_key_exists("mobile", $a_request)){
            $response->setBody(rspData(12002));
            return;
        }
        $account = new Account($sql_db);
        $ret = $account->createParentAccount($a_request, 3);
        $rsp_data['uid'] = $ret;
        $rsp_data['passwd'] = substr($a_request['mobile'], strlen($a_request['mobile']) - 6);
        $response->setBody(rspData($ret, $rsp_data));
    }
);

$app->post(
    '/account/deposit/bind',
    function () use ($app, $sql_db) {
        $rsp_data = array();
        $response = $app->response;
        $request = $app->request->getBody();
        $a_request = json_decode($request, true);
        if(empty($a_request)){
            $response->setBody(rspData(12001));
            return;
        }
        $a_request = array_change_key_case($a_request, CASE_LOWER);
        if(!array_key_exists("account", $a_request) || !array_key_exists("password", $a_request) || !array_key_exists("weixinno", $a_request)){
            $response->setBody(rspData(12002));
            return;
        }
        $account = new Account($sql_db);
        $ret = $account->weixinBind($a_request, 1);
        $rsp_data['uid'] = $ret;
        $response->setBody(rspData($ret, $rsp_data));
    }
);

$app->post(
    '/account/deposit/:deposit_accnt_id/update',
    function ($deposit_accnt_id) use ($app, $sql_db, $redis) {
        $rsp_data = array();
        $response = $app->response;
        $request = $app->request->getBody();
        $token = $app->request->headers('token');
        $depositInfo = $redis->get($token);
        if(!$depositInfo){
            $response->setBody(rspData(10005));
            return;
        }

        $a_request = json_decode($request, true);
        if(empty($a_request)){
            $response->setBody(rspData(12001));
            return;
        }
        $a_request['accountid'] = $deposit_accnt_id;
        $a_request = array_change_key_case($a_request, CASE_LOWER);
        $account = new Account($sql_db);
        $ret = $account->updateDeposit($a_request);
        $rsp_data['uid'] = $ret;
        $response->setBody(rspData($ret, $rsp_data));
    }
);

$app->post(
    '/account/teacher/bind',
    function () use ($app, $sql_db) {
        $rsp_data = array();
        $response = $app->response;
        $request = $app->request->getBody();
        $a_request = json_decode($request, true);
        if(empty($a_request)){
            $response->setBody(rspData(12001));
            return;
        }
        $a_request = array_change_key_case($a_request, CASE_LOWER);
        if(!array_key_exists("account", $a_request) || !array_key_exists("password", $a_request) || !array_key_exists("weixinno", $a_request)){
            $response->setBody(rspData(12002));
            return;
        }
        $account = new Account($sql_db);
        $ret = $account->weixinBind($a_request, 3);
        $rsp_data['uid'] = $ret;
        $response->setBody(rspData($ret, $rsp_data));
    }
);

$app->post(
    '/account/teacher/:teacher_accnt_id/update',
    function ($teacher_accnt_id) use ($app, $sql_db) {
        $rsp_data = array();
        $response = $app->response;
        $request = $app->request->getBody();
        $token = $app->request->headers('token');
        $depositInfo = $redis->get($token);
        if(!$depositInfo){
            $response->setBody(rspData(10005));
            return;
        }

        $a_request = json_decode($request, true);
        if(empty($a_request)){
            $response->setBody(rspData(12001));
            return;
        }
        $a_request['accountid'] = $teacher_accnt_id;
        $a_request = array_change_key_case($a_request, CASE_LOWER);
        $account = new Account($sql_db);
        $ret = $account->updateTeacher($a_request);
        $rsp_data['uid'] = $ret;
        $response->setBody(rspData($ret, $rsp_data));
    }
);

$app->post(
    '/login',
    function () use ($app, $sql_db, $redis) {
        $response = $app->response;
        $request = $app->request->getBody();
        $type = 0;
        $params = $app->request->params();
        if(array_key_exists("type", $params))
            $type = $params['type'];
        $a_request = json_decode($request, true);
        if(empty($a_request) ){
            $response->setBody(rspData(12001));
            return;
        }
        $a_request = array_change_key_case($a_request, CASE_LOWER);
        if(!array_key_exists("weixinno", $a_request)){
            $response->setBody(rspData(12002));
            return;
        }


        $account = new Account($sql_db);
        $ret = $account->login($a_request, $redis, $type);
        if(gettype($ret) != "array"){
            $response->setBody(rspData($ret));
        }else{
            $rsp_data = array();
            $ret_count = count($ret);
            if($ret_count > 0){
                if($ret_count > 1){
                    for($i = 0; $i < $ret_count; $i++){
                        $tmp_ar = array();
                        $tmp_ar['uid'] = $ret[$i]['uid'];
                        $tmp_ar['type'] = $ret[$i]['type'];
                        $rsp_data[] = $tmp_ar;
                    }
                    $response->setBody(rspData(0, $rsp_data));
                }else{
                    $tmp_ar = array();
                    $tmp_ar['uid'] = $ret[0]['uid'];
                    $tmp_ar['type'] = $ret[0]['type'];
                    $tmp_ar['token'] = $ret[0]['token'];
                    $rsp_data[] = $tmp_ar;
                    $response->setBody(rspData(0, $rsp_data));
                }
            }else
                $response->setBody(rspData(12004));
        }
    }
);
//====================================================================================================

$app->run();
