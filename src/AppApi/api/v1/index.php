<?php
date_default_timezone_set("Asia/Shanghai");
require_once '../../Slim/Slim/Slim.php';
require_once '../../Slim/Slim/LogWriter.php';
require_once './account_moduls/accnt_function.php';
require_once './finger_moduls/finger_function.php';
require_once './info_moduls/info_function.php';
require_once './charge_moduls/charge_function.php';
require_once './comment_moduls/comment_function.php';
require_once 'config.php';
require_once 'common.php';
require_once '../../Slim/WeiChat/WXBizMsgCrypt.php';
require_once './wechatPay/function.php';
require_once './wechatPay/payment.php';
require_once 'class.phpmailer.php';
require_once 'class.smtp.php';

\Slim\Slim::registerAutoloader();

$log = new \Slim\LogWriter(fopen('../../Slim/Log/log', 'a'));
$app = new \Slim\Slim(array(
    'log.writer' => $log
));
$app->config('debug', true);
$app->response->headers->set('Content-Type', 'application/json');
$app->response->headers->set('Access-Control-Allow-Origin', '*');
$app->response->headers->set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, token, if-modified-since, cache-control, pragma');
$app->response->headers->set('Access-Control-Allow-Methods', 'GET, POST, PUT,DELETE,PATCH, OPTIONS');
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

//生成微信支付订单，并将订单存在我们的数据库
$app->post(
      '/wechatPay/order',
      function () use ($app, $sql_db) {
        createOrder($app, $sql_db);
      }
);

$app->post(
      '/wechatPay/appOrder',
      function () use ($app, $sql_db) {
        createAppOrder2($app, $sql_db);
      }
);

$app->get(
      '/wechatPay/callback',
      function () use ($app, $sql_db) {
        orderCallback($app, $sql_db);
      }
);

//查询微信支付里的订单信息
$app->get(
      '/wechatPay/order/:orderId',
      function ($orderId) use ($app, $sql_db) {
        queryOrder($app, $orderId, $sql_db);
      }
);

$app->get(
    '/redirect/',
    function () use ($app, $APP_ID, $SECRET, $REDIRECT_URL, $redis){
        $req=$app->request();

        $queryStr = $_SERVER['QUERY_STRING'];
        $reUrl=$req->getUrl().$req->getPath();
        $businessUrl=$req->params("businessUrl");
        $type=$req->params("type");
        if(strlen($queryStr)>0){
            $reUrl=$reUrl."?".$queryStr;
        }

        $code=$req->params("code");
        $redirect_url = urlencode(str_replace(":8500","",$reUrl));//将端口去掉，nginx会自动转回带端口的
        $url = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=".$APP_ID."&redirect_uri=".$redirect_url."&response_type=code&scope=snsapi_userinfo&state=BABY_PLAN#wechat_redirect ";
        if($code!=null){
            $userInfo=redirectWechat($code, $APP_ID, $SECRET, $app, $redis);
            if (empty($userInfo)){
                echo "no userid find";
            }
            $go2Url = urldecode($businessUrl);
            $tail = "#/wxlogin";
            $tmp_str = substr($go2Url, strlen($go2Url) - strlen($tail));
            //if($tail != $tmp_str)
            // $go2Url .= $tail;
            $app->getLog()->debug("Debug ".date('Y-m-d H:i:s')." : "."?user=".$userInfo['openid']."&type=".$type);
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
        $ret = $account->createAccount($app, $a_request, 2);
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
        $ret = $account->createAccount($app, $a_request, 4);
        $rsp_data['uid'] = $ret;
        $response->setBody(rspData($ret, $rsp_data));
    }
);

//修改孩子信息
$app->post(
    '/account/children/update/:childid',
    function ($childid) use ($app, $sql_db, $redis){
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
        $a_request = json_decode($request, true);
        if(empty($a_request)){
            $response->setBody(rspData(12001));
            return;
        }
        $a_request['accountid'] = $childid;
        $a_request = array_change_key_case($a_request, CASE_LOWER);
        $account = new Account($sql_db);
        $ret = $account->updateChildren($a_request);
        $rsp_data['uid'] = $ret;
        $response->setBody(rspData($ret, $rsp_data));
    }
);

//查询孩子信息
$app->get(
    '/account/children/query/:childid',
    function ($childid) use ($app, $sql_db, $redis){
        $response = $app->response;
        $token = $app->request->headers('token');
        $depositInfo = $redis->get($token);
        if(!$depositInfo){
            $response->setBody(rspData(10005));
            return;
        }

        $account = new Account($sql_db);
        $ret = $account->queryChildrenInfo($childid);
        if(gettype($ret) != "array"){
            $response->setBody(rspData($ret));
        }else{
            $response->setBody(rspData(0, $ret));
        }
    }
);

$app->get(
    '/account/children/delete/:childid',
    function ($childid) use ($app, $sql_db, $redis){
        $response = $app->response;
        $token = $app->request->headers('token');
        $depositInfo = $redis->get($token);
        if(!$depositInfo){
            $response->setBody(rspData(10005));
            return;
        }

        $account = new Account($sql_db);
        $ret = $account->deleteChildrenInfo($childid);
        if($ret!=0){
            $response->setBody(rspData($ret));
        }else{
            $response->setBody(rspData(0, $ret));
        }
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
        $ret = $account->createAccount($app, $a_request, 3);
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
    function ($teacher_accnt_id) use ($app, $sql_db, $redis) {
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
                        $type = $ret[$i]['type'];
                        if(intval($type) == 2){
                            if(!getParentPurview($sql_db, $type))
                                $tmp_ar['sfjf'] = 0;
                            else
                                $tmp_ar['sfjf'] = 1;
                        }
                        $rsp_data[] = $tmp_ar;
                    }
                    $response->setBody(rspData(0, $rsp_data));
                }else{
                    $tmp_ar = array();
                    $tmp_ar['uid'] = $ret[0]['uid'];
                    $tmp_ar['type'] = $ret[0]['type'];
                    $tmp_ar['token'] = $ret[0]['token'];
                    $type = $ret[0]['token'];
                    if(intval($type) == 2){
                        if(!getParentPurview($sql_db, $type))
                            $tmp_ar['sfjf'] = 0;
                        else
                            $tmp_ar['sfjf'] = 1;
                    }
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
        /*
        $depositInfo = $redis->get($token);
        if(!$depositInfo){
            $response->setBody(rspData(10005));
            return;
        }
         */
        $account = new Account($sql_db);
        $ret = $account->queryChildrenList($parent_accnt_id);
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

/*
 * 老师账号微信退出
 */
$app->get(
    '/exitTeacher/:teacherid',
    function ($teacherid) use ($app, $sql_db, $redis){
        $response = $app->response;
        $token = $app->request->headers('token');
        $depositInfo = $redis->get($token);
        if(!$depositInfo){
            $response->setBody(rspData(10005));
            return;
        }
        $account = new Account($sql_db);
        $ret = $account->teacherExit($teacherid);
        $response->setBody(rspData($ret));
    }
);

/*
 * 机构账号微信退出
 */
$app->get(
    '/exitDeposit/:depositid',
    function ($depositid) use ($app, $sql_db, $redis){
        $response = $app->response;
        $token = $app->request->headers('token');
        $depositInfo = $redis->get($token);
        if(!$depositInfo){
            $response->setBody(rspData(10005));
            return;
        }
        $account = new Account($sql_db);
        $ret = $account->depositExit($depositid);
        $response->setBody(rspData($ret));
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
 * /finger/children/register/:childuid
 * {
 * "deviceid":"11111",
 * "fingerfeature":"asdfasdfasdf",
 * "fingerindex":1
 * }
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
        $ret = $finger->setDevice($a_request);
        $response->setBody(rspData($ret));
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
        $response->setBody(rspData($ret));
    }
);

/*
 * 根据孩子id获取家长孩子信息
 */
$app->get(
    '/infomation/parent/children/:childuid',
    function ($childuid) use ($app, $sql_db){
        $response = $app->response;

        $finger = new Finger($sql_db);
        $ret = $finger->fetchParentChildreBychilduid($childuid);
        if(gettype($ret) != "array"){
            $response->setBody(rspData($ret));
        }else{
            $response->setBody(rspData(0, $ret));
        }
    }
);

/*
 * 设备id获取对应机构下所有家长孩子信息
 */
$app->get(
    '/device/parent/children/:deviceid',
    function ($deviceid) use ($app, $sql_db){
        $response = $app->response;

        $finger = new Finger($sql_db);
        $ret = $finger->deviceFetchParentChildre($deviceid);
        if(gettype($ret) != "array"){
            $response->setBody(rspData($ret));
        }else{
            $response->setBody(rspData(0, $ret));
        }
    }
);

/*
 * 机构id获取机构下所有家长孩子信息
 */
$app->get(
    '/deposit/parent/children/:depositid',
    function ($depositid) use ($app, $sql_db){
        $response = $app->response;

        $finger = new Finger($sql_db);
        $ret = $finger->depositFetchParentChildre($depositid);
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
    function () use ($app, $sql_db, $redis){
        $rsp_data = array();
        $response = $app->response;
        $request = $app->request->getBody();
        $token = $app->request->headers('token');
        $depositInfo = $redis->get($token);
        if(!$depositInfo){
            $response->setBody(rspData(10005));
            return;
        }
        $a_request = json_decode($request,true);
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

$app->delete(
    '/deposit/publish/:Id',
    function ($Id) use ($app, $sql_db, $redis){
        $rsp_data = array();
        $response = $app->response;
        $request = $app->request->getBody();
        $token = $app->request->headers('token');
        $depositInfo = $redis->get($token);
        if(!$depositInfo){
            $response->setBody(rspData(10005));
            return;
        }
        $info = new Info($sql_db);
        $ret = $info->delPublish($Id);
        $response->setBody(rspData($ret));
    }
);

/*
 * 通过老师id获取老师所在的机构详细信息
 */
$app->get(
    '/deposit/teacher/:tid',
    function ($tid) use ($app, $sql_db, $redis){
        $rsp_data = array();
        $response = $app->response;
        $request = $app->request->getBody();
        $token = $app->request->headers('token');
        $depositInfo = $redis->get($token);
        if(!$depositInfo){
            $response->setBody(rspData(10005));
            return;
        }
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
 * 通过机构id获取机构发布过的所有信息
 */
$app->get(
    '/deposit/allInformation/:id',
    function ($id) use ($app, $sql_db, $redis){
        $rsp_data = array();
        $response = $app->response;
        $request = $app->request->getBody();
        $token = $app->request->headers('token');
        $depositInfo = $redis->get($token);
        if(!$depositInfo){
            $response->setBody(rspData(10005));
            return;
        }
        $params = $app->request->params();
        $params = array_change_key_case($params, CASE_LOWER);
        if(empty($params) || !array_key_exists("offset", $params) || !array_key_exists("limitcount", $params)){
                $response->setBody(rspData(FAILED, "请指定分页信息"));
                return;
        }
        $limitcount = $params['limitcount'];
        $offset = $params['offset'];
        $info = new Info($sql_db);
        $ret = $info->getDailyWithDepositID($id,$offset, $limitcount);
        if(gettype($ret) != "array"){
            $response->setBody(rspData($ret));
        }else{
            $response->setBody(rspData(0, $ret));
        }
    }
);

/*
 * 通过家长id获取家长相关孩子账号信息
 */
//$app->options('/parent/childrenList/:parentuid', function(){});
$app->get(
    '/parent/childrenList/:parentuid',
    function ($parentuid) use ($app, $sql_db, $redis){
        $rsp_data = array();
        $response = $app->response;
        $request = $app->request->getBody();
        $token = $app->request->headers('token');
        $depositInfo = $redis->get($token);
        if(!$depositInfo){
            $response->setBody(rspData(10005));
            return;
        }
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
 * 通过孩子id获取孩子在的机构发布的所有信息
 */
$app->get(
    '/parent/children/information/:childuid',
    function ($childuid) use ($app, $sql_db, $redis){
        $rsp_data = array();
        $response = $app->response;
        $request = $app->request->getBody();
        $token = $app->request->headers('token');
        $depositInfo = $redis->get($token);
        if(!$depositInfo){
            $response->setBody(rspData(10005));
            return;
        }
        if(!getParentPurview($sql_db, $childuid))
            return $response->setBody(rspData(16005));
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
 * 通过家长id获取家长所有孩子所在机构发布的信息
 */
$app->get(
    '/parent/children/allInformation/:parentid',
    function ($parentid) use ($app, $sql_db, $redis){
        $rsp_data = array();
        $response = $app->response;
        $request = $app->request->getBody();
        $token = $app->request->headers('token');
        $depositInfo = $redis->get($token);
        if(!$depositInfo){
            $response->setBody(rspData(10005));
            return;
        }
        if(!getParentPurview($sql_db, $parentid))
            return $response->setBody(rspData(16005));
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
 * 通过孩子id获取孩子的打卡信息
 */
$app->get(
    '/parent/children/signin/:childuid',
    function($childuid) use($app, $sql_db, $redis){
        $rsp_data = array();
        $response = $app->response;
        $request = $app->request->getBody();
        $token = $app->request->headers('token');
        $depositInfo = $redis->get($token);
        /*
        if(!$depositInfo){
            $response->setBody(rspData(10005));
            return;
        }
         */
        if(!getParentPurview($sql_db, $childuid))
            return $response->setBody(rspData(16005));
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
 * 通过家长id获取所有孩子的打卡信息
 */
$app->get(
    '/parent/children/allSignin/:parentid',
    function($parentid) use($app, $sql_db, $redis){
        $rsp_data = array();
        $response = $app->response;
        $request = $app->request->getBody();
        $token = $app->request->headers('token');
        $depositInfo = $redis->get($token);
        if(!$depositInfo){
            $response->setBody(rspData(10005));
            return;
        }
        if(!getParentPurview($sql_db, $parentid))
            return $response->setBody(rspData(16005));
        $info = new Info($sql_db);
        $ret = $info->getChldrenSignInFromParentId($parentid);
        if(gettype($ret) != "array"){
            $response->setBody(rspData($ret));
        }else{
            $response->setBody(rspData(0, $ret));
        }
    }
);

/*
* 通过家长id分批获取孩子的打卡信息
*/
$app->get(
    '/parent/children/fp/:parentid',
    function($parentid) use($app, $sql_db, $redis){
        $rsp_data = array();
        $response = $app->response;
        $request = $app->request->getBody();
        $token = $app->request->headers('token');
        $depositInfo = $redis->get($token);
        if(!$depositInfo){
            $response->setBody(rspData(10005));
            return;
        }
        if(!getParentPurview($sql_db, $parentid))
            return $response->setBody(rspData(16005));
        $params = $app->request->params();
        $params = array_change_key_case($params, CASE_LOWER);
        if(empty($params) || !array_key_exists("offset", $params) || !array_key_exists("limitcount", $params)){
                $response->setBody(rspData(FAILED, "请指定分页信息"));
                return;
            }
        $limitcount = $params['limitcount'];
        $offset = $params['offset'];
        $info = new Info($sql_db);
        $ret = $info->getChldrenFp($parentid, $offset, $limitcount);
        if(gettype($ret) != "array"){
            $response->setBody(rspData($ret));
        }else{
            $response->setBody(rspData(0, $ret));
        }
    }
);

/*
* 通过家长id分批获取孩子的机构发布信息
*/
$app->get(
    '/parent/children/msg/:parentid',
    function($parentid) use($app, $sql_db, $redis){
        $rsp_data = array();
        $response = $app->response;
        $request = $app->request->getBody();
        $token = $app->request->headers('token');
        $depositInfo = $redis->get($token);
        if(!$depositInfo){
            $response->setBody(rspData(10005));
            return;
        }
        if(!getParentPurview($sql_db, $parentid))
            return $response->setBody(rspData(16005));
        $params = $app->request->params();
        $params = array_change_key_case($params, CASE_LOWER);
        if(empty($params) || !array_key_exists("offset", $params) || !array_key_exists("limitcount", $params)){
                $response->setBody(rspData(FAILED, "请指定分页信息"));
                return;
            }
        $limitcount = $params['limitcount'];
        $offset = $params['offset'];
        $info = new Info($sql_db);
        $ret = $info->getChldrenMsg($parentid, $offset, $limitcount);
        if(gettype($ret) != "array"){
            $response->setBody(rspData($ret));
        }else{
            $response->setBody(rspData(0, $ret));
        }
    }
);

/*
 * 通过家长id获取所有孩子的打卡信息和机构发布信息
 * /parent/childrenInformation/fetch/:parentid?offset=2&limitcount=30
 */
$app->get(
    '/parent/childrenInformation/fetch/:parentid',
    function($parentid) use($app, $sql_db, $redis){
        $rsp_data = array();
        $response = $app->response;
        $request = $app->request->getBody();
        $token = $app->request->headers('token');
        $depositInfo = $redis->get($token);
        if(!$depositInfo){
            $response->setBody(rspData(10005));
            return;
        }
        if(!getParentPurview($sql_db, $parentid))
            return $response->setBody(rspData(16005));
        $params = $app->request->params();
        $params = array_change_key_case($params, CASE_LOWER);
        if(empty($params) || !array_key_exists("offset", $params) || !array_key_exists("limitcount", $params)){
                $response->setBody(rspData(FAILED, "请指定分页信息"));
                return;
            }
        $limitcount = $params['limitcount'];
        $offset = $params['offset'];
        $info = new Info($sql_db);
        $ret = $info->getChldrenAllInformation($parentid, $offset, $limitcount);
        if(gettype($ret) != "array"){
            $response->setBody(rspData($ret));
        }else{
            $response->setBody(rspData(0, $ret));
        }
    }
);

/*
 * 通过机构id获取机构中所有孩子列表
 */
$app->get(
    '/deposit/children/:depositid',
    function($depositid) use($app, $sql_db, $redis){
        $rsp_data = array();
        $response = $app->response;
        $request = $app->request->getBody();
        $token = $app->request->headers('token');
        $depositInfo = $redis->get($token);
        if(!$depositInfo){
            $response->setBody(rspData(10005));
            return;
        }
        $finger = new Finger($sql_db);
        $ret = $finger->depositFetchChildren($depositid);
        if(gettype($ret) != "array"){
            $response->setBody(rspData($ret));
        }else{
            $response->setBody(rspData(0, $ret));
        }
    }
);

/*
 * 获取附近的机构列表
 */
$app->get(
    '/nearbyDepositList/:longitude/:latitude',
    function ($longitude, $latitude) use($app, $sql_db, $redis){
        $response = $app->response;
        //$token = $app->request->headers('token');
        //$depositInfo = $redis->get($token);
        //if(!$depositInfo){
        //    $response->setBody(rspData(10005));
        //    return;
        //}
        $info = new Info($sql_db);
        $deps = $info->getNearbyDepositList($longitude, $latitude);
        if(gettype($deps) != "array"){
            $app->getLog()->debug("Error ".date('Y-m-d H:i:s')." longitude : ".$longitude.", latitude" . $latitude." rsp = ".rspData($deps));
            $response->setBody(rspData($deps));
        }else{
            $comment = new Comment($sql_db);
            $ret = array();
            foreach($deps as $v0) {
                $v = $v0;
                $sc = 8.0;
                $s = $comment->getDepositScores($v['AccountID']);
                if(gettype($s) == "array" && isset($s['scores'])) {
                    $sc = $s['scores'];
                }
                $v['Scores'] = $sc;
                $ret[] = $v;
            }
            $app->getLog()->debug("Debug ".date('Y-m-d H:i:s')." longitude : ".$longitude.", latitude" . $latitude." rsp = ".rspData(0,$ret));
            $response->setBody(rspData(0, $ret));
        }
    }
);

/*
 * 通过机构id获取机构详情信息
 */
$app->get(
    '/depositInfo/fetch/:depositid',
    function ($depositid) use ($app, $sql_db, $redis){
        $response = $app->response;
        $token = $app->request->headers('token');
        $depositInfo = $redis->get($token);
        if(!$depositInfo){
            $response->setBody(rspData(10005));
            return;
        }
        $info = new Info($sql_db);
        $ret = $info->getDepositInfo($depositid);
        if(gettype($ret) != "array"){
            $response->setBody(rspData($ret));
        }else{
            $response->setBody(rspData(0, $ret));
        }
    }
);


/*
 * 通过机构id获取机构详情信息(无token)
 */
$app->get(
    '/depositInfo/:depositid',
    function ($depositid) use ($app, $sql_db, $redis){
        $response = $app->response;
        $info = new Info($sql_db);
        $ret = $info->getDepositInfo($depositid);
        if(gettype($ret) != "array"){
            $response->setBody(rspData($ret));
        }else{
            $response->setBody(rspData(0, $ret));
        }
    }
);

//============================================================charge moduls=========================================//
/*
 * 拉取收费模块列表
 */
$app->get(
    '/charge/fetch/menuList',
    function () use ($app, $sql_db, $redis){
        $response = $app->response;
        $token = $app->request->headers('token');
        $depositInfo = $redis->get($token);
        if(!$depositInfo){
            $response->setBody(rspData(10005));
            return;
        }
        $charge = new Charge($sql_db);
        $ret = $charge->getMenuList();
        if(gettype($ret) != "array"){
            $response->setBody(rspData($ret));
        }else{
            $response->setBody(rspData(0, $ret));
        }
    }
);

/*
 * 查询parentid的订单
 */
$app->get(
    '/charge/order/fetch/:parentid',
    function ($parentid) use ($app, $sql_db, $redis){
        $response = $app->response;
        $token = $app->request->headers('token');
        $depositInfo = $redis->get($token);
        if(!$depositInfo){
            $response->setBody(rspData(10005));
            return;
        }
        $charge = new Charge($sql_db);
        $ret = $charge->getOrderListByParentid($parentid);
        if(gettype($ret) != "array"){
            $response->setBody(rspData($ret));
        }else{
            $response->setBody(rspData(0, $ret));
        }
    }
);

/*
 * 新增parent_order
 */
$app->post(
    '/charge/order/insert/:parentid',
    function($parentid) use ($app, $sql_db, $redis){
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
            $response->setBody(rspData(16001));
            return;
        }
        $a_request = array_change_key_case($a_request, CASE_LOWER);
        $a_request['parentid'] = $parentid;

        $charge = new Charge($sql_db);
        $ret = $charge->insertParentOrder($a_request);
        $response->setBody(rspData($ret));
    }
);

/*
 * 更新parent_order
 */
/*
$app->post(
    '/charge/order/update/:parentid',
    function ($parentid) use ($app, $sql_db, $redis){
        $rsp_data = array();
        $response = $app->response;
        $request = $app->request->getBody();
        $token = $app->request->headers('token');
        $depositInfo = $redis->get($token);
        if(!$depositInfo){
            //$response->setBody(rspData(10005));
            //return;
        }

        $a_request = json_decode($request, true);
        if(empty($a_request)){
            $response->setBody(rspData(16001));
            return;
        }
        $a_request = array_change_key_case($a_request, CASE_LOWER);
        $a_request['parentid'] = $parentid;

        $charge = new Charge($sql_db);
        $ret = $charge->updateParentOrder($a_request);
        $response->setBody(rspData($ret));
    }
);
 */

//==========================================================comment moduls=========================================//
/*
 * 家长评论机构
 */
$app->post(
    '/comments/parent/deposit',
    function () use ($app, $sql_db, $redis){
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
        if(empty($request)){
            $response->setBody(rspData(12001));
            return;
        }
        $a_request = json_decode($request,true);
        $a_request = array_change_key_case($a_request, CASE_LOWER);
        $parentid = $a_request['parentid'];
        //if(!getParentPurview($sql_db, $parentid))
        //    return $response->setBody(rspData(16005));

        $comment = new Comment($sql_db);
        $ret = $comment->parentCommentDeposit($a_request);
        $response->setBody(rspData($ret));
    }
);

/*
 * 获取家长对机构的评分
 * /comments/parent/deposit?parentid=30000001&depositid=10000001
 */
$app->get(
    '/comments/parent/deposit',
    function () use ($app, $sql_db, $redis){
        $response = $app->response;
        $params = $app->request->params();
        if(!array_key_exists("parentid", $params) || !array_key_exists("depositid", $params)){
            $response->setBody(rspData(15002));
            return;
        }
        $parentid = $params['parentid'];
        $depositid = $params['depositid'];
        $token = $app->request->headers('token');
        $depositInfo = $redis->get($token);
        if(!$depositInfo){
            $response->setBody(rspData(10005));
            return;
        }
        $comment = new Comment($sql_db);
        $ret = $comment->getParentDepositComments($parentid, $depositid);
        if(gettype($ret) != "array"){
            $response->setBody(rspData($ret));
        }else{
            $response->setBody(rspData(0, $ret));
        }
    }
);

/*
 * 获取总评分
 * /comments/deposit?depositid=10000001
 */
$app->get(
    '/comments/deposit',
    function () use ($app, $sql_db, $redis){
        $response = $app->response;
        $params = $app->request->params();
        if(!array_key_exists("depositid", $params)){
            $response->setBody(rspData(15002));
            return;
        }
        $depositid = $params['depositid'];
        //$token = $app->request->headers('token');
        //$depositInfo = $redis->get($token);
        //if(!$depositInfo){
        //    $response->setBody(rspData(10005));
        //    return;
        //}
        $comment = new Comment($sql_db);
        $ret = $comment->getDepositScores($depositid);
        if(gettype($ret) != "array"){
            $response->setBody(rspData($ret));
        }else{
            $response->setBody(rspData(0, $ret));
        }
    }
);

$app->put(
    '/upload',
    function () use ($app) {
        $ch = curl_init(); //初始化CURL句柄
        curl_setopt($ch, CURLOPT_URL, "http://localhost/upload?filename=".$app->request->params('filename')); //设置请求的URL
        curl_setopt($ch, CURLOPT_RETURNTRANSFER,1); //设为TRUE把curl_exec()结果转化为字串，而不是直接输出
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'PUT'); //设置请求方式
        curl_setopt($ch,CURLOPT_HTTPHEADER,array("X-HTTP-Method-Override: PUT"));//设置HTTP头信息
        $data=$app->request->getBody();
        curl_setopt($ch,CURLOPT_HTTPHEADER,array("Content-Length:".strlen($data)));
        curl_setopt($ch, CURLOPT_POSTFIELDS, $data);//设置提交的字符串
        $document = curl_exec($ch);//执行预定义的CURL
        if(!curl_errno($ch)){
        $info = curl_getinfo($ch);
        $app->getLog()->debug("Debug ".date('Y-m-d H:i:s')." : "."seconds to send a request to " . $info['url']);
      } else {
        $app->getLog()->debug("Debug ".date('Y-m-d H:i:s')." : "."Curl error: " . curl_error($ch));
      }
      curl_close($ch);
	$response = $app->response;
      $response->setBody($document);
    }
);
$app->post(
    '/teacherLogin',
    function () use ($app, $sql_db, $redis) {
        $response = $app->response;
        $request = $app->request->getBody();
        $type = 0;
        //$params = $app->request->params();
        $a_request = json_decode($request, true);
        if(empty($a_request)){
            $response->setBody(rspData(12001));
            return;
        }
        $a_request = array_change_key_case($a_request, CASE_LOWER);
        if(!array_key_exists("username", $a_request) || !array_key_exists("password", $a_request)){
            $response->setBody(rspData(12002));
            return;
        }
        $account = new Account($sql_db);
        $ret = $account->teacherLogin($a_request, $redis);
        if(gettype($ret) != "array"){
            $response->setBody(rspData($ret));
        }else{
            $response->setBody(rspData(0, $ret));
        }

});

$app->post(
    '/parentLogin',
    function () use ($app, $sql_db, $redis) {
        $response = $app->response;
        $request = $app->request->getBody();
        $type = 0;
        //$params = $app->request->params();
        $a_request = json_decode($request, true);
        if(empty($a_request)){
            $response->setBody(rspData(12001));
            return;
        }
        $a_request = array_change_key_case($a_request, CASE_LOWER);
        if(!array_key_exists("username", $a_request) || !array_key_exists("password", $a_request)){
            $response->setBody(rspData(12002));
            return;
        }
        $account = new Account($sql_db);
        $ret = $account->parentLogin($a_request, $redis);
        if(gettype($ret) != "array"){
            $response->setBody(rspData($ret));
        }else{
            $response->setBody(rspData(0, $ret));
        }

});

$app->get(
    '/parent/children/deposit/:parentid',
    function ($parentid) use ($app, $sql_db, $redis){
        $rsp_data = array();
        $response = $app->response;
        $request = $app->request->getBody();
        $token = $app->request->headers('token');
        $depositInfo = $redis->get($token);
        if(!$depositInfo){
            $response->setBody(rspData(10005));
            return;
        }
        $info = new Info($sql_db);
        $ret = $info->getChildrenDeposit($parentid);
        if(gettype($ret) != "array"){
            $response->setBody(rspData($ret));
        }else{
            $response->setBody(rspData(0, $ret));
        }
    }
);

$app->get(
    '/dailyComment/:infoId',
    function ($infoId) use ($app, $sql_db, $redis){
        $rsp_data = array();
        $response = $app->response;
        $request = $app->request->getBody();
        $params = $app->request->params();
        if(!array_key_exists("index", $params)){
            $response->setBody(rspData(10006));
            return;
        }
        $index = $params['index'];
        $token = $app->request->headers('token');
        $depositInfo = $redis->get($token);
        if(!$depositInfo){
            $response->setBody(rspData(10005));
            return;
        }
        $info = new Comment($sql_db);
        $ret = $info->getDailyComment($infoId);
        if(gettype($ret) != "array"){
            $response->setBody(rspData($ret));
        }else{
            $ret['index'] = $index;
            $response->setBody(rspData(0, $ret));
        }
    }
);

$app->post(
    '/dailyComment',
    function () use ($app, $sql_db, $redis){
        $rsp_data = array();
        $response = $app->response;
        $request = $app->request->getBody();
        $token = $app->request->headers('token');
        $depositInfo = $redis->get($token);
        if(!$depositInfo){
            $response->setBody(rspData(10005));
            return;
        }
        $a_request = json_decode($request,true);
        $a_request = array_change_key_case($a_request, CASE_LOWER);
        $info = new Comment($sql_db);
        $ret = $info->createDailyComment($a_request);
        $response->setBody(rspData($ret));
    }
);

$app->delete(
    '/dailyComment/:Id',
    function ($Id) use ($app, $sql_db, $redis){
        $rsp_data = array();
        $response = $app->response;
        $request = $app->request->getBody();
        $token = $app->request->headers('token');
        $depositInfo = $redis->get($token);
        if(!$depositInfo){
            $response->setBody(rspData(10005));
            return;
        }
        $info = new Comment($sql_db);
        $ret = $info->delDailyComment($Id);
        $response->setBody(rspData($ret));
    }
);

$app->post(
    '/account/parentRegister',
    function () use ($app, $sql_db, $redis) {
        $rsp_data = array();
        $response = $app->response;
        $request = $app->request->getBody();
        $a_request = json_decode($request, true);
        if(empty($a_request)){
            $response->setBody(rspData(12001));
            return;
        }
        $a_request = array_change_key_case($a_request, CASE_LOWER);
        if(!array_key_exists("sex", $a_request) || !array_key_exists("mobile", $a_request)
            || !array_key_exists("email", $a_request)
            || !array_key_exists("password", $a_request) || !array_key_exists("name", $a_request)){
            $response->setBody(rspData(12002));
            return;
        }
        $account = new Account($sql_db);
        $ret = $account->createAccount($app, $a_request, 2);
        if (!isset($ret) || $ret < 10000000) {
            $response->setBody(rspData($ret));
            return;
        }
        //$rsp_data['uid'] = $ret;
        //$response->setBody(rspData($ret, $rsp_data));
        //create eshop account
        $eshopData = array('username' => $ret,'password' => $a_request['password'],'email' => $a_request['email']);
        $info = new Info($sql_db);
        $eshop = $info->eshopRegister(json_encode($eshopData));
        //$eshopToken=$eshop['token'];
        //getToken
        $my_request=array('username' => $ret,'password' => $a_request['password']);
        $account = new Account($sql_db);
        $ret = $account->parentLogin($my_request, $redis);
        if(gettype($ret) != "array"){
            $response->setBody(rspData($ret));
        }else{
            $ret['eshop']=$eshop;
            $response->setBody(rspData(0, $ret));
        }
    }
);

$app->get(
    '/test',
    function() use ($app){
        echo "haha";
    }
);

$app->get(
    '/camera/:id',
    function ($id) use ($app, $sql_db, $redis){
        $response = $app->response;
        $info = new Info($sql_db);
        $ret = $info->getCamera($id);
        $response->setBody(rspData(0, $ret));

    }
);

$app->post(
    '/account/parent/:accnt_id',
    function ($accnt_id) use ($app, $sql_db, $redis) {
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
        $a_request['accountid'] = $accnt_id;
        $a_request = array_change_key_case($a_request, CASE_LOWER);
        $account = new Account($sql_db);
        $ret = $account->updateParent($a_request);
        $rsp_data['uid'] = $ret;
        $response->setBody(rspData($ret, $rsp_data));
    }
);

$app->get(
    '/account/delTeacher/:teacher_accnt_id',
    function ($teacher_accnt_id) use ($app, $sql_db, $redis) {
        $response = $app->response;
        $request = $app->request->getBody();
        $token = $app->request->headers('token');
        $depositInfo = $redis->get($token);
        if(!$depositInfo){
            $response->setBody(rspData(10005));
            return;
        }

        $account = new Account($sql_db);
        $ret = $account->deleteTeacher($teacher_accnt_id);
        $response->setBody(rspData($ret));
    }
);

//update password use update parent :V
//lost password use email reset password :x
//check mobile exist already :xxx
$app->post(
    '/account/resetPsw/:parent_accnt_id',
    function ($parent_accnt_id) use ($app, $sql_db, $redis){
        $response = $app->response;
        $request = $app->request->getBody();
        //$params = $app->request->params();
        $a_request = json_decode($request, true);
        $token=$a_request['eshopToken'];
        $info = new Account($sql_db);
        $ret = $info->resetPsw($parent_accnt_id,$token);
        $response->setBody(rspData($ret));
    }
);

$app->run();
