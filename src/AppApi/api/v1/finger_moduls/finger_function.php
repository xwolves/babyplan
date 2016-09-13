<?php

class Finger{

    public function __construct($sql_db){
        $this->DB = $sql_db;
    }

    public function deviceRegister($orguid, $deviceid){
    }

    public function childrenRegister($params){
        try{
            $ar_params = array();
            $childuid = $params['childuid'];
            $column = array('fingerfeature', 'fingerimglink1', 'fingerimglink2', 'fingerimglink3', 'fingerimglink4', 'fingerimglink5');
            foreach($params as $key => $val){
                if(in_array($key, $column))
                    $ar_params[$key] = $val;
            }
            if(!array_key_exists("fingerfeature", $ar_params) || empty($ar_params['fingerfeature']))
                return 13002;

            $sql_str = "update tb_accnt_children set modifytime=now()";
            $tail = "";
            foreach($ar_params as $key => $val){
                $tail .= ", $key=:$key";
            }
            $sql_str .= $tail." where accountid=$childuid";
            $stmt = $this->DB->prepare($sql_str);
            if(!$stmt->execute($ar_params))
                return 10001;

            if($stmt->rowCount() <= 0)
                return 10002;

            return 0;
        }catch (PDOException $e) {
            $errs = $e->getMessage();
            return 10000;
        }
    }

    public function childrenFetch($childuid){
        try{
            $sql_str = "select * from tb_accnt_children where accountid=:childuid";
            $stmt = $this->DB->prepare($sql_str);
            $stmt->bindParam(":childuid", $childuid, PDO::PARAM_INT);
            if(!$stmt->execute())
                return 10001;
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            if(!$row)
                return 10003;
            
            return $row;

        }catch (PDOException $e) {
            $errs = $e->getMessage();
            return 10000;
        }
    }

    public function childrenSignin($params){
        try{
            if(!array_key_exists("deviceid", $params) || !array_key_exists("signinid", $params)
                || !array_key_exists("childid", $params) || !array_key_exists("depositid", $params))
                return 13002; 
            $signinid = $params['signinid'];
            $deviceid = $params['deviceid'];
            $childid = $params['childid'];
            $depositid = $params['depositid'];
            if(empty($signinid) || empty($deviceid) || empty($childid) || empty($depositid))
                return 13002;
            $column = array('deviceid', 'signinid', 'childid', 'depositid');
            $ar_params = array();
            foreach($params as $key => $val){
                if(in_array($key, $column))
                    $ar_params[$key] = $val;
            }
            $sql_str = "insert into tb_children_signin (signintime, createtime";
            $keys = "";
            $vals = "";
            foreach($ar_params as $key => $val){
                $keys .= ", $key";
                $vals .= ", :$key";
            }
            $tail = ") values (now(), now()";
            $sql_str .= $keys.$tail.$vals.")";
            $stmt = $this->DB->prepare($sql_str);
            if(!$stmt->execute($ar_params))
                return 10001;

            if($stmt->rowCount() <= 0)
                return 10002;

            return 0;
        }catch (PDOException $e) {
            $errs = $e->getMessage();
            return 10000;
        }
    }

    public function setDevice($type, $params){
        try{
            if(!array_key_exists("deviceid", $params) || !array_key_exists("depositid", $params)
                ||  !array_key_exists("status", $params))
                return 13002; 
            $deviceid = $params['deviceid'];
            $status = $params['status'];
            $depositid = $params['depositid'];
            if(empty($deviceid) || empty($depositid))
                return 13002;
            $column = array('deviceid', 'status', 'maintainername', 'depositid','maintainerphone');
            $ar_params = array();
            foreach($params as $key => $val){
                if(in_array($key, $column))
                    $ar_params[$key] = $val;
            }
            $sql_str = "";
            if($type == 1){
                $sql_str = "insert into tb_device_detail (createtime";
                $keys = "";
                $vals = "";
                foreach($ar_params as $key => $val){
                    if($key == "status" && $val == 1){
                        $keys .= ", starttime";
                        $vals .= ", now()";
                    }
                    $keys .= ", $key";
                    $vals .= ", :$key";
                }
                $tail = ") values (now()";
                $sql_str .= $keys.$tail.$vals.")";
            }else if($type == 0){
                $ar_params['deviceid'];
                $sql_str = "update tb_device_detail";
                $con_str = "";
                foreach($ar_params as $key => $val){
                    if(empty($con_str)){
                        if($key == "status" && $val == 1){
                            $con_str .= " set starttime=now()";
                        }
                        $con_str .= " set $key=:$key";
                    }else{
                        if($key == "status" && $val == 1){
                            $con_str .= ", starttime=now()";
                        }
                        $con_str .= ", $key=:$key";
                    }
                }
                $sql_str .= $con_str."where deviceid=$deviceid";
            }
            $stmt = $this->DB->prepare($sql_str);
            if(!$stmt->execute($ar_params))
                return 10001;

            if($stmt->rowCount() <= 0)
                return 10002;

            return 0;
        }catch (PDOException $e) {
            $errs = $e->getMessage();
            return 10000;
        }
    }

    public function deviceSettingFetch($deviceid){
        try{
            $sql_str = "select * from tb_device_detail where deviceid=:deviceid";
            $stmt = $this->DB->prepare($sql_str);
            $stmt->bindParam(":deviceid", $deviceid, PDO::PARAM_STR);
            if(!$stmt->execute())
                return 10001;
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            if(!$row)
                return 10003;
            
            return $row;
        }catch (PDOException $e) {
            $errs = $e->getMessage();
            return 10000;
        }
    }

    public function DeviceReport($params){
        try{
            if(!array_key_exists("deviceid", $params))
                return 13002;
            $deviceid = $params['deviceid'];
            if(empty($deviceid))
                return 13002;
            $sql_str = "SELECT depositid FROM tb_device_detail WHERE deviceid=:deviceid";
            $stmt = $this->DB->prepare($sql_str);
            $stmt->bindParam(":deviceid", $deviceid, PDO::PARAM_STR);
            if(!$stmt->execute())
                return 10001;
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            if(!$row)
                return 10003;
            $depositid = $row['depositid'];
            $params['depositid'] = $depositid;

            $column = array('deviceid', 'depositid', 'succrate', 'samplecount', 'remark', 'longitude', 'latitude');
            $ar_params = array();
            foreach($params as $key => $val){
                if(in_array($key, $column))
                    $ar_params[$key] = $val;
            }
            $sql_str = "insert into tb_device_status (createtime";
            $keys = "";
            $vals = "";
            foreach($ar_params as $key => $val){
                $keys .= ", $key";
                $vals .= ", :$key";
            }
            $tail = ") values (now()";
            $sql_str .= $keys.$tail.$vals.")";
            $stmt = $this->DB->prepare($sql_str);
            if(!$stmt->execute($ar_params))
                return 10001;

            if($stmt->rowCount() <= 0)
                return 10002;

            return 0;
        }catch (PDOException $e) {
            $errs = $e->getMessage();
            return 10000;
        }
    }

    public function deviceFetchParentChildre($depositid){
        try{
            $sql_str = "SELECT parentid, childrenid FROM tb_parent_children WHERE ChildrenID IN 
                (SELECT  ChildrenID FROM tb_deposit_children WHERE depositid=:depositid)";
            $stmt = $this->DB->prepare($sql_str);
            $stmt->bindParam(":depositid", $depositid, PDO::PARAM_INT);
            if(!$stmt->execute())
                return 10001;
            $person_ar = array();
            while($row = $stmt->fetch(PDO::FETCH_ASSOC)){
                $person_ar['p_id'] = $row['parentid'];
                $person_ar['c_id'] = $row['childrenid'];
            }
            $rsp_data = array();
            $p_c_ar = array();
            foreach($person_ar as $key => $val){
                if($key == "p_id"){
                    $p_ar = array();
                    $sql_str = "select name, sex, mobile from tb_accnt_parent where accountid=:pid";
                    $stmt = $this->DB->prepare($sql_str);
                    $stmt->bindParam(":pid", intval($val), PDO::PARAM_INT);
                    if(!$stmt->execute())
                        return 10001;
                    $row = $stmt->fetch(PDO::FETCH_ASSOC);
                    if(!$row)
                        return 10003;
                    $p_ar['parentid'] = $val;
                    $p_ar['name'] = $row['name'];
                    $p_ar['sex'] = $row['sex'];
                    $p_ar['mobile'] = $row['mobile'];
                    $p_c_ar['parent'] = $p_ar;
                }else if($key == "c_id"){
                    $c_ar = array();
                    $sql_str = "select name, sex from tb_accnt_children where accountid=:cid";
                    $stmt = $this->DB->prepare($sql_str);
                    $stmt->bindParam(":cid", intval($val), PDO::PARAM_INT);
                    if(!$stmt->execute())
                        return 10001;
                    $row = $stmt->fetch(PDO::FETCH_ASSOC);
                    if(!$row)
                        return 10003;
                    $c_ar['childid'] = $val;
                    $c_ar['name'] = $row['name'];
                    $c_ar['sex'] = $row['sex'];
                    $p_c_ar['children'] = $c_ar;
                }
            }

            $rsp_data[] = $p_c_ar;
            
            return $rsp_data;
        }catch (PDOException $e) {
            $errs = $e->getMessage();
            return 10000;
        }
    }

    private $DB;
}
?>
