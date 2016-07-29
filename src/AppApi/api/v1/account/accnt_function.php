<?php

class Account{

    public function __construct($sql_db){
        $this->DB = $sql_db;
    }

    public function guid(){
        if (function_exists('com_create_guid')){
            return com_create_guid();
        }else{
            mt_srand((double)microtime()*10000);
            $charid = strtoupper(md5(uniqid(rand(), true)));
            $hyphen = chr(45);
            $uuid = chr(123)
                .substr($charid, 0, 8).$hyphen
                .substr($charid, 8, 4).$hyphen
                .substr($charid,12, 4).$hyphen
                .substr($charid,16, 4).$hyphen
                .substr($charid,20,12)
                .chr(125);
            return substr(substr($uuid, 1),0, strpos(substr($uuid, 1), "}"));
        }
    }

    public function login($weixinno, $redis){
        try{
            $token = "";
            $info = array();
            $sql_str = "SELECT accountid, name, mobile, weixinno FROM tb_accnt_parent WHERE WeiXinNo = :weixinno";
            $stmt = $this->DB->prepare($sql_str);
            $stmt->bindParam(":weixinno", $weixinno, PDO::PARAM_STR);
            if(!$stmt->execute())
                return 1030;
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            if(!$row){
                $sql_str = "SELECT accountid, name, mobile, weixinno FROM tb_accnt_teacher WHERE WeiXinNo = :weixinno";
                $stmt = $this->DB->prepare($sql_str);
                $stmt->bindParam(":weixinno", $weixinno, PDO::PARAM_STR);
                if(!$stmt->execute())
                    return 1030;
                $row = $stmt->fetch(PDO::FETCH_ASSOC);
                if(!$row){
                    $sql_str = "SELECT accountid, orgname, contactphone, weixinno  FROM tb_accnt_deposit WHERE WeiXinNo = :weixinno";
                    $stmt = $this->DB->prepare($sql_str);
                    $stmt->bindParam(":weixinno", $weixinno, PDO::PARAM_STR);
                    if(!$stmt->execute())
                        return 1030;
                    $row = $stmt->fetch(PDO::FETCH_ASSOC);
                    if(!$row)
                        return 1031;
                    else{
                        $info['name'] = $row['orgname'];
                        $info['mobile'] = $row['contactname'];
                    }
                }else{
                    $info['name'] = $row['name'];
                    $info['mobile'] = $row['mobile'];
                }
            }else{
                $info['name'] = $row['name'];
                $info['mobile'] = $row['mobile'];
            }
            $info['uid'] = $row['accountid'];
            $info['weixinno'] = $row['weixinno'];

            $token = $this->guid();
            if(!$redis->set($token, json_encode($info)))
                return 1070;
            $info['token'] = $token;

            return $info;
        }catch (PDOException $e) {
            $errs = $e->getMessage();
            return 1050;
        }
        
    }

    public function createParentAccount($info, $type){
        try{
            $accountId = $this->createAccountId($type);
            if($accountId < 10000000)
                return 10000;
            $info['accountid'] = $accountId;
            $sql_str = "insert into ";
            $tb_name = "";
            $key_col = "(createtime";
            $val_col = ") values (now()";

            $keys = "";
            $vals = "";
            foreach($info as $key => $val){
                $keys .= ", $key";
                $vals .= ", :$key";
            }
            $keys = $key_col.$keys;
            $vals = $val_col.$vals;
            if(1 == intval($type)){
                $tb_name = "tb_accnt_deposit ";

            }else if(2 == intval($type)){
                $tb_name = "tb_accnt_parent";

            }else if(3 == intval($type)){
                $tb_name = "tb_accnt_teacher";

            }else if(4 == intval($type)){
                $tb_name = "tb_accnt_children";

            }else if(5 == intval($type)){
                $tb_name = "tb_accnt_3rd";

            }else if(6 == intval($type)){
                $tb_name = "tb_accnt_consultant";

            }
            $sql_str .= $tb_name.$keys.$vals.")";

            $stmt = $this->DB->prepare($sql_str);
            if(!$stmt->execute($info)){
                return 10000;
            }
            if($stmt->rowCount() <= 0){
                return 10001;
            }
            return $accountId;
        }catch (PDOException $e) {
            $errs = $e->getMessage();
            return 1050;
        }

    }

    private function createAccountId($type){
        try{
            $accountId = 0;
            $startId = 0;
            $tb_name = "";
            $sql_str = "select max(accountid) nextid from ";
            if(1 == intval($type)){
                $tb_name = "tb_accnt_deposit";
                $startId = 10000000;
            }else if(2 == intval($type)){
                $tb_name = "tb_accnt_parent";
                $startId = 20000000;
            }else if(3 == intval($type)){
                $tb_name = "tb_accnt_teacher";
                $startId = 30000000;
            }else if(4 == intval($type)){
                $tb_name = "tb_accnt_children";
                $startId = 40000000;
            }else if(5 == intval($type)){
                $tb_name = "tb_accnt_3rd";
                $startId = 50000000;
            }else if(6 == intval($type)){
                $tb_name = "tb_accnt_consultant";
                $startId = 60000000;
            }

            $sql_str .= $tb_name;
            $stmt = $this->DB->prepare($sql_str);
            if(!$stmt->execute())
                return 1030;

            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            if(empty($row['nextid']))
                $accountId = $startId+1;
            else
                $accountId = $row['nextid']+1;

            return $accountId;
        }catch (PDOException $e) {
            $errs = $e->getMessage();
            return 1050;
        }
    }

    private $DB;
}
?>
