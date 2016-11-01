<?php
include "../charge_moduls/charge_function.php";

class Comment extends Charge{

    public function __construct($sql_db){
        $this->DB = $sql_db;
    }

    public function parentCommentDeposit($params){
        try{
            $column = array("targetid", "targettype", "commentby", "commentbytype", "starcount", "commenttext","commenttag");
            if(!array_key_exists("targetid", $params) || !array_key_exists("commentby", $params) || !array_key_exists("starcount", $params))
                return 15002;
            $ar_params = array();
            foreach($params as $key => $val){
                if(in_array($key, $column))
                    $ar_params[$key] = $val;
            }

            $sql_str = "insert into tb_comments (createtime";
            $cols = "";
            $vals = "";
            foreach($ar_params as $key => $val){
                $cols .= ", $key";
                $vals .= ", :$key";
            }
            $sql_str .= $cols.") values (now()".$vals.")";
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

    public function getDepositComments($depositid){
        try{
            $rsp_data = array();
            $sql_str = "select * from tb_comments where targetid=:depositid order by createtime desc";
            $stmt = $this->DB->prepare($sql_str);
            $stmt->bindParam(":depositid", $depositid, PDO::PARAM_INT);
            if(!$stmt->execute())
                return 10001;

            $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
            for($i = 0; $i < count($rows); $i++){
                $rsp_data[] = $rows[$i];
            }

            return $rsp_data;

        }catch (PDOException $e) {
            $errs = $e->getMessage();
            return 10000;
        }
    }

    private $DB;
}
?>
