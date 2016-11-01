<?php

class Charge{

    public function __construct($sql_db){
        $this->DB = $sql_db;
    }

    public function getMenuList(){
        try{
            $rsp_data = array();
            $sql_str = "SELECT price, numofdays, FORMAT(price/numofdays, 2) AS uprice FROM tb_price_setting where status=1 order by price";
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



    private $DB;
}
?>
