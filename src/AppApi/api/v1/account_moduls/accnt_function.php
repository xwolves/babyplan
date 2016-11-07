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

    public function login($params, $redis, $type = 0){
        try{
            $weixinno = $params['weixinno'];
            $token = "";
            $info = array();
            $redisInfo = array();

            $p_info = array();
            $t_info = array();
            $d_info = array();
            $sql_str = "SELECT accountid, name, mobile, weixinno FROM tb_accnt_parent WHERE WeiXinNo = :weixinno";
            $stmt = $this->DB->prepare($sql_str);
            $stmt->bindParam(":weixinno", $weixinno, PDO::PARAM_STR);
            if(!$stmt->execute())
                return 10001;
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            if($row){
                $p_info['uid'] = $row['accountid'];
                $p_info['type'] = substr($row['accountid'], 0, 1);
                $redisInfo['uid'] = $row['accountid'];
                $redisInfo['name'] = $row['name'];
                $redisInfo['mobile'] = $row['mobile'];
                $redisInfo['weixinno'] = $row['weixinno'];
            }

            $sql_str = "SELECT accountid, name, mobile, weixinno FROM tb_accnt_teacher WHERE WeiXinNo = :weixinno";
            $stmt = $this->DB->prepare($sql_str);
            $stmt->bindParam(":weixinno", $weixinno, PDO::PARAM_STR);
            if(!$stmt->execute())
                return 10001;
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            if($row){
                $t_info['uid'] = $row['accountid'];
                $t_info['type'] = substr($row['accountid'], 0, 1);
                $redisInfo['uid'] = $row['accountid'];
                $redisInfo['name'] = $row['name'];
                $redisInfo['mobile'] = $row['mobile'];
                $redisInfo['weixinno'] = $row['weixinno'];
            }

            $sql_str = "SELECT accountid, orgname, contactphone, weixinno  FROM tb_accnt_deposit WHERE WeiXinNo = :weixinno";
            $stmt = $this->DB->prepare($sql_str);
            $stmt->bindParam(":weixinno", $weixinno, PDO::PARAM_STR);
            if(!$stmt->execute())
                return 10001;
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            if($row){
                $d_info['uid'] = $row['accountid'];
                $d_info['type'] = substr($row['accountid'], 0, 1);
                $redisInfo['uid'] = $row['accountid'];
                $redisInfo['name'] = $row['orgname'];
                $redisInfo['mobile'] = $row['contactphone'];
                $redisInfo['weixinno'] = $row['weixinno'];
            }

            if(intval($type) == 0){
                if(!empty($p_info))
                    $info[] = $p_info;
                if(!empty($t_info))
                    $info[] = $t_info;
                if(!empty($d_info))
                    $info[] = $d_info;
            }
            if(intval($type) == 1){
                if(!empty($d_info))
                    $info[] = $d_info;
                else{
                    if(!empty($t_info)){
                        $info[] = $t_info;
                    }
                }
            }else if(intval($type) == 2){
                if(!empty($p_info))
                    $info[] = $p_info;
            }else if(intval($type) == 3){
                if(!empty($t_info))
                    $info[] = $t_info;//d_info or t_info ?
            }

            if(count($info) == 1){
                $token = strtolower($this->guid());
                if(!$redis->set($token, json_encode($redisInfo)))
                    return 10004;
                $info[0]['token'] = $token;
            }

            return $info;
        }catch (PDOException $e) {
            $errs = $e->getMessage();
            return 10000;
        }

    }

    public function createParentAccount($info, $type){
        try{
            $accountId = $this->createAccountId($type);
            if($accountId < 10000000)
                return $accountId;
            $info['accountid'] = $accountId;
            $tb_name = "";
            $column = array();
            $key_col = "(createtime";
            $val_col = ") values (now()";

            if(1 == intval($type)){
                $tb_name = "tb_accnt_deposit";
                $column = array("accountid", "orgname", "address", "markid", "contactname", "contactphone", "licensetype", "placecontracttype",
                    "frontdesklink", "publiczonelink", "kitchenlink", "diningroomlink", "restroomlink1", "restroomlink2", "classroomlink1", "classroomlink2",
                    "otherroomlink1", "otherroomlink2", "id2number", "id2photolink", "remark", "password", "weixinno", "longitude", "latitude");
            }else if(2 == intval($type)){
                $tb_name = "tb_accnt_parent";
                $column = array("accountid", "name", "sex", "mobile", "weixinno", "remark", "password", "nick");

            }else if(3 == intval($type)){
                $tb_name = "tb_accnt_teacher";
                $column = array("accountid", "mobile", "password", "name", "sex", "teachage", "age");
                $info['password'] = substr($info['mobile'], strlen($info['mobile']) - 6);
                //$sql_str = "insert into tb_deposit_teacher (depositid, teacherid, createtime) values (?, ?, now())";
                //$stmt = $this->DB->prepare($sql_str);
	        //$stmt->bindParam(1, $info['depositid'], PDO::PARAM_INT);
                //$stmt->bindParam(2, $accountId, PDO::PARAM_INT);
                //if(!$stmt->execute())
                //    return 10001;
                //if($stmt->rowCount() <= 0)
                //    return 10002;
            }else if(4 == intval($type)){
                $tb_name = "tb_accnt_children";
                $column = array("accountid", "name", "sex", "fingerfeature", "remark");
                $sql_str = "insert into tb_parent_children (parentid, childrenid, createtime) values (:parentid, :childrenid, now())";
                $stmt = $this->DB->prepare($sql_str);
                $stmt->bindParam(":parentid", intval($info['p_uid']), PDO::PARAM_INT);
                $stmt->bindParam(":childrenid", intval($accountId), PDO::PARAM_INT);
                if(!$stmt->execute())
                    return 10001;
                if($stmt->rowCount() <= 0)
                    return 10002;

            }else if(5 == intval($type)){
                $tb_name = "tb_accnt_3rd";
                $column = array("accountid", "orgname", "address", "markid", "contactname", "contactname", "password", "wexinno", "longitude", "latitude");
            }else if(6 == intval($type)){
                $tb_name = "tb_accnt_consultant";
                $column = array("accountid", "name", "mobile", "weixinno", "remark", "password");
            }

            $sql_str = "insert into ";

            $ar_params = array();
            foreach($info as $key => $val){
                if(in_array($key, $column))
                    $ar_params[$key] = $val;
            }

            $keys = "";
            $vals = "";
            foreach($ar_params as $key => $val){
                $keys .= ", $key";
                $vals .= ", :$key";
            }
            $keys = $key_col.$keys;
            $vals = $val_col.$vals;

            $sql_str .= $tb_name.$keys.$vals.")";
            $stmt = $this->DB->prepare($sql_str);
            if(!$stmt->execute($ar_params))
                return 10001;
            if($stmt->rowCount() <= 0)
                return 10002;

            if(3 == intval($type)){
                $sql_str = "insert into tb_deposit_teacher (depositid, teacherid, createtime) values (?, ?, now())";
                $stmt = $this->DB->prepare($sql_str);
                $stmt->bindParam(1, $info['depositid'], PDO::PARAM_INT);
                $stmt->bindParam(2, $accountId, PDO::PARAM_INT);
                if(!$stmt->execute())
                    return 10001;
                if($stmt->rowCount() <= 0)
                    return 10002;
            }
            return $accountId;
        }catch (PDOException $e) {
            $errs = $e->getMessage();
            return 10000;
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
                return 10001;

            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            if(empty($row['nextid']))
                $accountId = $startId+1;
            else
                $accountId = $row['nextid']+1;

            return $accountId;
        }catch (PDOException $e) {
            $errs = $e->getMessage();
            return 10000;
        }
    }

    public function weixinBind($params, $type){
        try{
            $account = $params['account'];
            $password = $params['password'];
            $weixinno = $params['weixinno'];

            $sql_str = "";

            if(intval($type) == 1)
                $sql_str = "SELECT accountid FROM tb_accnt_deposit WHERE (AccountID=:accountid OR contactphone=:mobile) AND PASSWORD=:psw";
            else if(intval($type) == 3)
                $sql_str = "SELECT accountid FROM tb_accnt_teacher WHERE (AccountID=:accountid OR mobile=:mobile) AND PASSWORD=:psw";
            $stmt = $this->DB->prepare($sql_str);
            $stmt->bindParam(":accountid", intval($account), PDO::PARAM_INT);
            $stmt->bindParam(":mobile", $account, PDO::PARAM_STR);
            $stmt->bindParam(":psw", $password, PDO::PARAM_STR);

            if(!$stmt->execute())
                return 10001;
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            if(empty($row))
                return 10003;

            $accountid = $row['accountid'];

            if(intval($type) == 1)
                $sql_str = "update tb_accnt_deposit set weixinno=:weixinno where accountid=:accountid";
            else if(intval($type) == 3)
                $sql_str = "update tb_accnt_teacher set weixinno=:weixinno where accountid=:accountid";

            $stmt = $this->DB->prepare($sql_str);
            $stmt->bindParam(":accountid", intval($accountid), PDO::PARAM_INT);
            $stmt->bindParam(":weixinno", $weixinno, PDO::PARAM_STR);
            if(!$stmt->execute())
                return 10001;
            //if($stmt->rowCount() <= 0);
            //    return 10003;

            return $accountid;
        }catch (PDOException $e) {
            $errs = $e->getMessage();
            return 10000;
        }
    }

    public function updateTeacher($params){
        try{
            $accountid = $params['accountid'];
            $column = array("name", "sex", "mobile", "teachage", "age", "photolink", "remark", "password");

            $ar_params = array();
            foreach($params as $key => $val){
                if(in_array($key, $column))
                    $ar_params[$key] = $val;
            }

            $str_tail = "";
            foreach($ar_params as $key => $val){
                if(empty($str_tail))
                    $str_tail = " set $key=:$key";
                else
                    $str_tail .= ", $key=:$key";
            }

            if(!empty($str_tail)){
                $sql_str = "update tb_accnt_teacher $str_tail , modifytime = now() where accountid = $accountid";
                $stmt = $this->DB->prepare($sql_str);
                if (!$stmt->execute($ar_params))
                    return 10001;
                if($stmt->rowCount() <= 0)
                    return 10002;
            }

            return $accountid;
        }catch (PDOException $e) {
            $errs = $e->getMessage();
            return 10000;
        }
    }

    public function updateDeposit($params){
        try{
            $accountid = $params['accountid'];
            $column = array("orgname", "address", "markid", "contactname", "contactphone", "licensetype", "placecontracttype",
                    "frontdesklink", "publiczonelink", "kitchenlink", "diningroomlink", "restroomlink1", "restroomlink2", "classroomlink1", "classroomlink2",
                    "otherroomlink1", "otherroomlink2", "id2number", "id2photolink", "remark", "password", "longitude", "latitude");

            $ar_params = array();
            foreach($params as $key => $val){
                if(in_array($key, $column))
                    $ar_params[$key] = $val;
            }

            $str_tail = "";
            foreach($ar_params as $key => $val){
                if(empty($str_tail))
                    $str_tail = " set $key=:$key";
                else
                    $str_tail .= ", $key=:$key";
            }

            if(!empty($str_tail)){
                $sql_str = "update tb_accnt_deposit $str_tail , modifytime = now() where accountid = $accountid";
                $stmt = $this->DB->prepare($sql_str);
                if (!$stmt->execute($ar_params))
                    return 10001;
                if($stmt->rowCount() <= 0)
                    return 10002;
            }

            return $accountid;
        }catch (PDOException $e) {
            $errs = $e->getMessage();
            return 10000;
        }
    }

    public function queryParentInfo($parentid){
        try{
            $info = array();
            $sql_str = "SELECT accountid, name, sex, mobile, weixinno, remark, nick FROM tb_accnt_parent where accountid=:parentid";
            $stmt = $this->DB->prepare($sql_str);
            $stmt->bindParam(":parentid", intval($parentid), PDO::PARAM_INT);
            if (!$stmt->execute())
                return 10001;
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            if(empty($row))
                return 10003;

            $info['uid'] = $row['accountid'];
            $info['name'] = $row['name'];
            $info['sex'] = $row['sex'];
            $info['mobile'] = $row['mobile'];
            $info['weixinno'] = $row['weixinno'];
            $info['remark'] = $row['remark'];

            return $info;
        }catch (PDOException $e) {
            $errs = $e->getMessage();
            return 10000;
        }
    }

    public function queryChildrenInfo($parentid){
        try{
            $info = array();
            $sql_str = "SELECT c.accountid, b.relationship, c.name, c.sex, c.fingerfeature, c.remark FROM
                (SELECT * FROM tb_parent_children a WHERE a.ParentID=:parentid) b LEFT JOIN tb_accnt_children c ON c.accountid=b.childrenid";
            $stmt = $this->DB->prepare($sql_str);
            $stmt->bindParam(":parentid", intval($parentid), PDO::PARAM_INT);
            if (!$stmt->execute())
                return 10001;
            while($row = $stmt->fetch(PDO::FETCH_ASSOC)){
                $tmp_info = array();
                $tmp_info['uid'] = $row['accountid'];
                $tmp_info['relationship'] = $row['RelationShip'];
                $tmp_info['name'] = $row['name'];
                $tmp_info['sex'] = $row['sex'];
                $tmp_info['fingerfeature'] = $row['fingerfeature'];
                $tmp_info['remark'] = $row['remark'];
                $info[] = $tmp_info;
            }

            return $info;
        }catch (PDOException $e) {
            $errs = $e->getMessage();
            return 10000;
        }
    }

    public function queryDepositInfo($depositid){
        try{
            $info = array();
            $sql_str = "SELECT * FROM tb_accnt_deposit WHERE accountid = :depositid";
            $stmt = $this->DB->prepare($sql_str);
            $stmt->bindParam(":depositid", intval($depositid), PDO::PARAM_INT);
            if (!$stmt->execute())
                return 10001;
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            if(empty($row))
                return 10003;

            $info = $row;

            return $info;
        }catch (PDOException $e) {
            $errs = $e->getMessage();
            return 10000;
        }
    }

    public function queryTeacherInfo($depositid){
        try{
            $info = array();
            $sql_str = "SELECT c.accountid, c.name, c.sex, c.mobile, c.teachage, c.age, c.photolink, c.remark FROM
                (SELECT * FROM tb_deposit_teacher a WHERE a.depositid=:depositid) b LEFT JOIN tb_accnt_teacher c ON c.accountid=b.teacherid";
            $stmt = $this->DB->prepare($sql_str);
            $stmt->bindParam(":depositid", intval($depositid), PDO::PARAM_INT);
            if (!$stmt->execute())
                return 10001;
            while($row = $stmt->fetch(PDO::FETCH_ASSOC)){
                $tmp_info = array();
                $tmp_info['uid'] = $row['accountid'];
                $tmp_info['name'] = $row['name'];
                $tmp_info['sex'] = $row['sex'];
                $tmp_info['mobile'] = $row['mobile'];
                $tmp_info['teachage'] = $row['teachage'];
                $tmp_info['age'] = $row['age'];
                $tmp_info['photolink'] = $row['photolink'];
                $tmp_info['remark'] = $row['remark'];
                $info[] = $tmp_info;
            }

            return $info;
        }catch (PDOException $e) {
            $errs = $e->getMessage();
            return 10000;
        }
    }

    public function teacherExit($teacherid){
        try{
            $sql_str = "update tb_accnt_teacher set weixinno=null where accountid=:teacherid";
            $stmt = $this->DB->prepare($sql_str);
            $stmt->bindParam(":teacherid", intval($teacherid), PDO::PARAM_INT);
            if (!$stmt->execute())
                return 10001;
            //if($stmt->rowCount() <= 0);
            //    return 10003;

            return 0;
        }catch (PDOException $e) {
            $errs = $e->getMessage();
            return 10000;
        }
    }

    public function depositExit($depositid){
        try{
            $sql_str = "update tb_accnt_deposit set weixinno=null where accountid=:depositid";
            $stmt = $this->DB->prepare($sql_str);
            $stmt->bindParam(":depositid", intval($depositid), PDO::PARAM_INT);
            if (!$stmt->execute())
                return 10001;
            //if($stmt->rowCount() <= 0);
            //    return 10003;

            return 0;
        }catch (PDOException $e) {
            $errs = $e->getMessage();
            return 10000;
        }
    }

    private $DB;
}
?>
