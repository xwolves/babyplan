<?php

class Charge{

    public function __construct($sql_db){
        $this->DB = $sql_db;
    }

    public function getMenuList(){
        try{
            $rsp_data = array();
            $sql_str = "SELECT businessdesc, businessid, price, numofdays, FORMAT(price/numofdays, 2) AS uprice FROM tb_price_setting where status=1 order by price";
            $stmt = $this->DB->prepare($sql_str);
            if(!$stmt->execute())
                return 10001;
            while($row = $stmt->fetch(PDO::FETCH_ASSOC))
                $rsp_data[] = $row;

            return $rsp_data;
        }catch (PDOException $e) {
            $errs = $e->getMessage();
            return 10000;
        }
    }

    public function insertParentOrder($a_request){
        try{
            if(!array_key_exists("parentid", $params) || !array_key_exists("orderid", $params))
                return 16002; 
            $column = array("orderid", "parentid", "ordertype", "amount", "paystatus", "paytype", "paytime", "numofdays", "cutofftime", "businessid");
            $ar_params = array();
            foreach($a_request as $key => $val){
                if(in_array($key, $column))
                    $ar_params[$key] = $val;
            }
            $sql_str = "INSERT INTO tb_parent_order (createtime";
            $val_col = ") values (now()";
            $keys = "";
            $vals = "";
            foreach($ar_params as $key => $val){
                $keys .= ", $key";
                $vals .= ", :$key";
            }
            $keys = $keys;
            $vals = $val_col.$vals;
            $sql_str .= $keys.$vals.")";

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

    public function updateParentOrder($a_request){
        try{
            if(!array_key_exists("parentid", $a_request) || !array_key_exists("orderid", $a_request))
                return 16002; 
            $orderid = $a_request['orderid'];
            $parentid = $a_request['parentid'];
            $column = array("ordertype", "amount", "paystatus", "paytype", "paytime", "numofdays", "cutofftime", "businessid");
            $ar_params = array();
            foreach($a_request as $key => $val){
                if(in_array($key, $column))
                    $ar_params[$key] = $val;
            }
            $sql_str = "UPDATE tb_parent_order SET modifytime=now()";
            $str_tail = "";
            foreach($ar_params as $key => $val){
                    $str_tail .= ", $key=:$key";
            }
            $ar_params['orderid'] = $orderid;
            $ar_params['parentid'] = $parentid;
            $sql_str .= $str_tail." where orderid=:orderid and parentid=:parentid";

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

    public function getOrderListByParentid($parentid){
        try{
            $sql_str = "select * from tb_parent_order where parentid=:parentid";
            $stmt = $this->DB->prepare($sql_str);
            $stmt->bindParam(":parentid", intval($parentid), PDO::PARAM_INT);
            if (!$stmt->execute())
                return 10001;
            $rsp_data = array();
            while($row = $stmt->fetch(PDO::FETCH_ASSOC))
                $rsp_data[] = $row;

            return $rsp_data;
        }catch (PDOException $e) {
            $errs = $e->getMessage();
            return 10000;
        }
    }

    private $DB;
}
?>
