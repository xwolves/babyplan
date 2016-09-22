<?php
date_default_timezone_set("Asia/Shanghai");
require_once '../../Slim/Slim/Slim.php';
require_once '../../Slim/Slim/LogWriter.php';
require_once './account_moduls/accnt_function.php';
require_once './finger_moduls/finger_function.php';
require_once './info_moduls/info_function.php';
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
$app->response->headers->set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, token, if-modified-since, cache-control, pragma');
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

//log 日志案例
//$app->getLog()->debug("Debug ".date('Y-m-d H:i:s')." : "."debug log");
//$app->logWriter->write("log");

//配对所有option
$app->options('/:a', function() {});
$app->options('/:a/:b', function() {});
$app->options('/:a/:b/:c', function() {});
$app->options('/:a/:b/:c/:d', function() {});

$app->get(
    '/redirect/',
    function () use ($app, $APP_ID, $SECRET, $REDIRECT_URL, $orc_db, $redis){
        $req=$app->request();

        $queryStr = $_SERVER['QUERY_STRING'];
        $reUrl=$req->getUrl().$req->getPath();
        $businessUrl=$req->params("businessUrl");
        $type=$req->params("type");
        if(strlen($queryStr)>0){
            $reUrl=$reUrl."?".$queryStr;
        }

        $code=$req->params("code");
        $redirect_url = urlencode($reUrl);
        $url = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=".$APP_ID."&redirect_uri=".$redirect_url."&response_type=code&scope=snsapi_userinfo&state=BABY_PLAN#wechat_redirect ";
        if($code!=null){
            $userInfo=redirectWechat($code, $APP_ID, $SECRET, $app, $redis);
            if (empty($userInfo)){
                echo "no userid find";
            }
            $go2Url = urldecode($businessUrl);
            $tail = "#/wxlogin";
            $tmp_str = substr($go2Url, strlen($go2Url) - strlen($tail));
            if($tail != $tmp_str)
                $go2Url .= $tail;

            header("Location: ".$go2Url."?user=".$userInfo['openid']."&type=".$type);
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

//$app->options('/account/register/children', function(){});
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

$app->get(
    '/wechat/:wechat_id',
    function ($wechat_id) use ($app, $APP_ID, $SECRET, $redis){
        $response = $app->response;
        $token = $app->request->headers('token');
        $depositInfo = $redis->get($token);
        if(!$depositInfo){
            $response->setBody(rspData(10005));
            return;
        }

        $data=$redis->get("wechat_user_".$wechat_id);
        $app->getLog()->debug("Debug ".date('Y-m-d H:i:s')." : "." get wechat user info with ".$wechat_id);
        $app->logWriter->write("get redis cache data : ".$data);
        if(empty($data)){
          $data=getWechatUserInfo($wechat_id, $APP_ID, $SECRET, $app, $redis);
          $response->setBody(rspData(0,$data));
        }else{
          $arr_data = json_decode($data, true);
          $response->setBody(rspData(0,$arr_data));
        }
    }
);

//$app->options('/account/query/parent/:parent_accnt_id', function(){});
$app->get(
    '/account/query/parent/:parent_accnt_id',
    function ($parent_accnt_id) use ($app, $sql_db, $redis){
        $response = $app->response;
        $token = $app->request->headers('token');
        $depositInfo = $redis->get($token);
        if(!$depositInfo){
            $response->setBody(rspData(10005));
            return;
        }

        $account = new Account($sql_db);
        $ret = $account->queryParentInfo($parent_accnt_id);
        if(gettype($ret) != "array"){
            $response->setBody(rspData($ret));
        }else{
            $response->setBody(rspData(0, $ret));
        }
    }
);

//$app->options('/account/query/parentChildren/:parent_accnt_id', function(){});
$app->get(
    '/account/query/parentChildren/:parent_accnt_id',
    function ($parent_accnt_id) use ($app, $sql_db, $redis){
        $response = $app->response;
        $token = $app->request->headers('token');
        $depositInfo = $redis->get($token);
        if(!$depositInfo){
            $response->setBody(rspData(10005));
            return;
        }
        $account = new Account($sql_db);
        $ret = $account->queryChildrenInfo($parent_accnt_id);
        if(count($ret) == 0)
            $response->setBody(rspData(12005));
        else
            $response->setBody(rspData(0, $ret));

    }
);

//$app->options('/account/query/deposit/:deposit_accnt_id', function(){});
$app->get(
    '/account/query/deposit/:deposit_accnt_id',
    function ($deposit_accnt_id) use ($app, $sql_db, $redis){
        $response = $app->response;
        $token = $app->request->headers('token');
        $depositInfo = $redis->get($token);
        if(!$depositInfo){
            $response->setBody(rspData(10005));
            return;
        }
        $account = new Account($sql_db);
        $ret = $account->queryDepositInfo($deposit_accnt_id);
        if(gettype($ret) != "array"){
            $response->setBody(rspData($ret));
        }else{
            $response->setBody(rspData(0, $ret));
        }
    }
);

//$app->options('/account/query/depositTeacher/:deposit_accnt_id', function(){});
$app->get(
    '/account/query/depositTeacher/:deposit_accnt_id',
    function ($deposit_accnt_id) use ($app, $sql_db, $redis){
        $response = $app->response;
        $token = $app->request->headers('token');
        $depositInfo = $redis->get($token);
        if(!$depositInfo){
            $response->setBody(rspData(10005));
            return;
        }
        $account = new Account($sql_db);
        $ret = $account->queryTeacherInfo($deposit_accnt_id);
        if(count($ret) == 0)
            $response->setBody(rspData(12006));
        else
            $response->setBody(rspData(0, $ret));

    }
);
//=========================================== finger moduls==================================================
/*
$app->get(
    '/manager/v1/finger/register',
    function() use($app, $sql_db){
        $response = $app->response;
        $params = $app->request->params();
        $params = array_change_key_case($params, CASE_LOWER);
        if(empty($params) || !array_key_exists("orguid", $params)){
            $response->setBody(rspData(13001));
            return;
        }
        $orguid = $params['orguid'];
        $deviceid = "";
        if(array_key_exists("deviceid", $params))
            $deviceid = $params['deviceid'];
    }
);
 */

/*
 * 孩子指纹注册
 */
$app->post(
    '/finger/children/register/:childuid',
    function ($childuid) use ($app, $sql_db){
        $rsp_data = array();
        $response = $app->response;
        $request = $app->request->getBody();

        $a_request = json_decode($request, true);
        if(empty($a_request)){
            $response->setBody(rspData(13001));
            return;
        }
        $a_request = array_change_key_case($a_request, CASE_LOWER);
        $a_request['childuid'] = $childuid;

        $finger = new Finger($sql_db);
        $ret = $finger->childrenRegister($a_request);
        $response->setBody(rspData($ret));
    }
);

/*
 * 孩子指纹信息拉取
 */
$app->get(
    '/finger/children/fetch/:childuid',
    function ($childuid) use ($app, $sql_db){
        $rsp_data = array();
        $response = $app->response;

        $finger = new Finger($sql_db);
        $ret = $finger->childrenFetch($childuid);
        if(gettype($ret) != "array"){
            $response->setBody(rspData($ret));
        }else{
            $response->setBody(rspData(0, $ret));
        }
    }
);

/*
 * 孩子打卡上报
 */
$app->post(
    '/manager/v1/finger/signin',
    function () use ($app, $sql_db){
        $response = $app->response;
        $request = $app->request->getBody();
        $a_request = json_decode($request, true);
        if(empty($a_request)){
            $response->setBody(rspData(13001));
            return;
        }
        $a_request = array_change_key_case($a_request, CASE_LOWER);

        $finger = new Finger($sql_db);
        $ret = $finger->childrenSignin($a_request);
        if(gettype($ret) != "array"){
            $response->setBody(rspData($ret));
        }else{
            $response->setBody(rspData(0, $ret));
        }
    }
);

/*
 * 指纹机设置
 */
$app->post(
    '/device/setting/set',
    function () use ($app, $sql_db){
        $response = $app->response;
        $request = $app->request->getBody();
        $a_request = json_decode($request, true);
        if(empty($a_request)){
            $response->setBody(rspData(13001));
            return;
        }
        $a_request = array_change_key_case($a_request, CASE_LOWER);

        $finger = new Finger($sql_db);
        $ret = $finger->setDevice(1, $a_request);
        if(gettype($ret) != "array"){
            $response->setBody(rspData($ret));
        }else{
            $response->setBody(rspData(0, $ret));
        }
    }
);

/*
 * 获取指纹机设置
 */
$app->get(
    '/device/setting/fetch/:deviceid',
    function ($deviceid) use ($app, $sql_db){
        $rsp_data = array();
        $response = $app->response;

        $finger = new Finger($sql_db);
        $ret = $finger->deviceSettingFetch($deviceid);
        if(gettype($ret) != "array"){
            $response->setBody(rspData($ret));
        }else{
            $response->setBody(rspData(0, $ret));
        }
    }
);

/*
 * 设备状态上报
 */
$app->post(
    '/device/status/report',
    function() use ($app, $sql_db){
        $response = $app->response;
        $request = $app->request->getBody();
        $a_request = json_decode($request, true);
        if(empty($a_request)){
            $response->setBody(rspData(13001));
            return;
        }
        $a_request = array_change_key_case($a_request, CASE_LOWER);

        $finger = new Finger($sql_db);
        $ret = $finger->DeviceReport($a_request);
        if(gettype($ret) != "array"){
            $response->setBody(rspData($ret));
        }else{
            $response->setBody(rspData(0, $ret));
        }
    }
);

/*
 * 机构获取家长孩子信息
 */
$app->get(
    '/deposit/parent/children/:depositid',
    function ($depositid) use ($app, $sql_db){
        $response = $app->response;

        $finger = new Finger($sql_db);
        $ret = $finger->deviceFetchParentChildre($depositid);
        if(gettype($ret) != "array"){
            $response->setBody(rspData($ret));
        }else{
            $response->setBody(rspData(0, $ret));
        }
    }
);
//===========================================info moduls==================================================

/*
 * 老师发布信息
 */
$app->post(
    '/deposit/publish',
    function () use ($app, $sql_db){
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
        $a_request = array_change_key_case($a_request, CASE_LOWER);
        $info = new Info($sql_db);
        $ret = $info->publish($a_request);
        $response->setBody(rspData($ret));

    }
);

/*
 * 获取老师所在机构信息
 */
$app->get(
    '/deposit/teacher/:tid',
    function ($tid) use ($app, $sql_db){
        $rsp_data = array();
        $response = $app->response;
        $request = $app->request->getBody();
        /*
        $token = $app->request->headers('token');
        $depositInfo = $redis->get($token);
        if(!$depositInfo){
            $response->setBody(rspData(10005));
            return;
        }
        */
        $info = new Info($sql_db);
        $ret = $info->getDepositWithTeacherID($tid);
        if(gettype($ret) != "array"){
            $response->setBody(rspData($ret));
        }else{
            $response->setBody(rspData(0, $ret));
        }
    }
);

/*
 * 获取所有机构发布过的信息
 */
$app->get(
    '/deposit/allInformation/:id',
    function ($id) use ($app, $sql_db){
        $rsp_data = array();
        $response = $app->response;
        $request = $app->request->getBody();
        /*
        $token = $app->request->headers('token');
        $depositInfo = $redis->get($token);
        if(!$depositInfo){
            $response->setBody(rspData(10005));
            return;
        }
        */
        $info = new Info($sql_db);
        $ret = $info->getDailyWithDepositID($id);
        if(gettype($ret) != "array"){
            $response->setBody(rspData($ret));
        }else{
            $response->setBody(rspData(0, $ret));
        }
    }
);

/*
 * 家长获取相关孩子的信息
 */
//$app->options('/parent/childrenList/:parentuid', function(){});
$app->get(
    '/parent/childrenList/:parentuid',
    function ($parentuid) use ($app, $sql_db){
        $rsp_data = array();
        $response = $app->response;
        $request = $app->request->getBody();
        $token = $app->request->headers('token');
        /*
        $depositInfo = $redis->get($token);
        if(!$depositInfo){
            $response->setBody(rspData(10005));
            return;
        }
         */
        $info = new Info($sql_db);
        $ret = $info->getChldrenList($parentuid);
        if(gettype($ret) != "array"){
            $response->setBody(rspData($ret));
        }else{
            $response->setBody(rspData(0, $ret));
        }
    }
);

/*
 * 获取孩子在机构的情况信息
 */
$app->get(
    '/parent/children/information/:childuid',
    function ($childuid) use ($app, $sql_db){
        $rsp_data = array();
        $response = $app->response;
        $request = $app->request->getBody();
        /*
        $token = $app->request->headers('token');
        $depositInfo = $redis->get($token);
        if(!$depositInfo){
            $response->setBody(rspData(10005));
            return;
        }
         */
        $info = new Info($sql_db);
        $ret = $info->getChildrenDepositInfo($childuid);
        if(gettype($ret) != "array"){
            $response->setBody(rspData($ret));
        }else{
            $response->setBody(rspData(0, $ret));
        }
    }
);

/*
 * 获取家长所有孩子在机构的情况信息
 */
$app->get(
    '/parent/children/allInformation/:parentid',
    function ($parentid) use ($app, $sql_db){
        $rsp_data = array();
        $response = $app->response;
        $request = $app->request->getBody();
        /*
        $token = $app->request->headers('token');
        $depositInfo = $redis->get($token);
        if(!$depositInfo){
            $response->setBody(rspData(10005));
            return;
        }
         */
        $info = new Info($sql_db);
        //$ret = $info->getParentDepositInfo($parentid);
        $ret = $info->getChldrenDailyFromParentId($parentid);
        if(gettype($ret) != "array"){
            $response->setBody(rspData($ret));
        }else{
            $response->setBody(rspData(0, $ret));
        }
    }
);

/*
 * 获取孩子的打卡信息
 */
$app->get(
    '/parent/children/signin/:childuid',
    function($childuid) use($app, $sql_db){
        $rsp_data = array();
        $response = $app->response;
        $request = $app->request->getBody();
        /*
        $token = $app->request->headers('token');
        $depositInfo = $redis->get($token);
        if(!$depositInfo){
            $response->setBody(rspData(10005));
            return;
        }
         */
        $info = new Info($sql_db);
        $ret = $info->getSigninInfo($childuid);
        if(gettype($ret) != "array"){
            $response->setBody(rspData($ret));
        }else{
            $response->setBody(rspData(0, $ret));
        }
    }
);

/*
 * 获取所有孩子的打卡信息
 */
$app->get(
    '/parent/children/allSignin/:parentid',
    function($parentid) use($app, $sql_db){
        $rsp_data = array();
        $response = $app->response;
        $request = $app->request->getBody();
        /*
        $token = $app->request->headers('token');
        $depositInfo = $redis->get($token);
        if(!$depositInfo){
            $response->setBody(rspData(10005));
            return;
        }
         */
        $info = new Info($sql_db);
        //$ret = $info->getAllSigninInfo($parentid);
        $ret = $info->getChldrenSignInFromParentId($parentid);
        if(gettype($ret) != "array"){
            $response->setBody(rspData($ret));
        }else{
            $response->setBody(rspData(0, $ret));
        }
    }
);


$app->run();
