<?php
require_once '../../Slim/Slim/Slim.php';
require_once '../../Slim/Slim/LogWriter.php';
require_once './account/accnt_function.php';
require_once 'config.php';
require_once 'errcode.php';
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

$app->post(
    '/register/parent',
    function () use ($app, $sql_db) {
        $rsp_data = array();
        $response = $app->response;
        $request = $app->request->getBody();
        $a_request = json_decode($request, true);
        if(empty($a_request)){
            $response->setBody(rspData(1060));
            return;
        }
        $a_request = array_change_key_case($a_request, CASE_LOWER);
        $account = new Account($sql_db);
        $ret = $account->createParentAccount($a_request, 2);
        $rsp_data['uid'] = $ret;

        $response->setBody(rspData($ret, $rsp_data));
    }
);

$app->post(
    '/login',
    function () use ($app, $sql_db, $redis) {
        $response = $app->response;
        $request = $app->request->getBody();
        $account = new Account($sql_db);
        $a_request = json_decode($request, true);
        if(empty($a_request) ){
            $response->setBody(rspData(1060));
            return;
        }
        $a_request = array_change_key_case($a_request, CASE_LOWER);
        if(!array_key_exists("weixinno", $a_request)){
            $response->setBody(rspData(1060));
            return;
        }
        $weixinno = $a_request['weixinno'];
        $ret = $account->login($weixinno, $redis);
        if(gettype($ret) != "array"){
            $response->setBody(rspData($ret));
        }else{
            $rsp_data = array();
            $rsp_data['token'] = $ret['token'];
            $rsp_data['uid'] = $ret['uid'];
            $rsp_data['type'] = substr($ret['uid'], 0, 1);
            $response->setBody(rspData($ret['uid'], $rsp_data));
        }
    }
);
//====================================================================================================

$app->run();
