<?php
static $errCode = array(
    1000 => 'insert database Error',
    1001 => 'insert database Failed',
    1010 => 'delete database Error',
    1011 => 'delete database Failed',
    1020 => 'modify database Error',
    1021 => 'modify database Failed',
    1030 => 'query database Error',
    1031 => 'query no data',
    1050 => 'Operation database exception',
    1060 => 'incomplete parameter',
    1070 => 'redis set failed'
);

function rspData($ret, $data = ""){
    $ar_ret = array();
    if(intval($ret) < 10000000){
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
?>
