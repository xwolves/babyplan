<?php

class Info{

    public function __construct($sql_db){
        $this->DB = $sql_db;
    }

    private function getId(){
        try{
            $infoId = 0;
            $startId = 0;
            $sql_str = "select max(infoid) nextid from tb_deposit_daily";

            $stmt = $this->DB->prepare($sql_str);
            if(!$stmt->execute())
                return 10001;

            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            if(empty($row['nextid']))
                $infoId = $startId+1;
            else
                $infoId = $row['nextid']+1;

            return $infoId;
        }catch (PDOException $e) {
            $errs = $e->getMessage();
            return 10000;
        }
    }


    public function publish($params){
        try{
            $infoid = $this->getId();
            $imgs = array();
            if(array_key_exists("imgs", $params))
                $imgs = $params['imgs'];

            $column = array("depositid", "publisherid", "infotype", "latitude", "longitude", "description");
            $ar_params = array();
            foreach($params as $key => $val){
                if(in_array($key, $column))
                    $ar_params[$key] = $val;
            }
            $ar_params['infoid'] = $infoid;
            $ar_params['status'] = 1;
            $photolink = "photolink";
            for($i = 0; $i < count($imgs); $i++){
                $index = $i+1;
                $tmp_cl = $photolink.$index;
                $ar_params[$tmp_cl] = $imgs[$i];
            }

            $sql_str = "insert into tb_deposit_daily ";
            $key_col = "(createtime";
            $val_col = ") values (now()";
            $keys = "";
            $vals = "";
            foreach($ar_params as $key => $val){
                $keys .= ", $key";
                $vals .= ", :$key";
            }
            $keys = $key_col.$keys;
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

    public function getChldrenList($parentuid){
        try{
            $sql_str = "SELECT b.`AccountID`, b.`Name` FROM tb_accnt_children b WHERE b.`AccountID` IN
                (SELECT a.`ChildrenID` FROM tb_parent_children a WHERE a.`ParentID`=:parentuid)";
            $stmt = $this->DB->prepare($sql_str);
            $stmt->bindParam(":parentuid", $parentuid, PDO::PARAM_STR);
            if(!$stmt->execute())
                return 10001;
            $info = array();
            while($row = $stmt->fetch(PDO::FETCH_ASSOC)){
                $tmp_ar = array();
                $tmp_ar['uid'] = $row['AccountID'];
                $tmp_ar['name'] = $row['Name'];
                $info[] = $tmp_ar;
            }
            return $info;
        }catch (PDOException $e) {
            $errs = $e->getMessage();
            return 10000;
        }
    }

    public function getChildrenDepositInfo($childuid){
        try{
            $info = array();
            $sql_str = "select name, sex from tb_accnt_children where accountid=:childuid";
            $stmt = $this->DB->prepare($sql_str);
            $stmt->bindParam(":childuid", $childuid, PDO::PARAM_STR);
            if(!$stmt->execute())
                return 10001;
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            if(!$row)
                return 10002;

            $info['childuid'] = $childuid;
            $info['childname'] = $row['name'];

            $sql_str = "SELECT * FROM tb_deposit_daily a WHERE a.`DepositID` =
                (SELECT b.`DepositID` FROM tb_deposit_children b WHERE b.`ChildrenID` = :childuid)";
            $stmt = $this->DB->prepare($sql_str);
            $stmt->bindParam(":childuid", $childuid, PDO::PARAM_STR);
            if(!$stmt->execute())
                return 10001;
            $rec_ar = array();
            while($row = $stmt->fetch(PDO::FETCH_ASSOC)){
                $tmp_ar = array();
                $tmp_ar['infoid'] = $row['InfoID'];
                $tmp_ar['publisherid'] = $row['PublisherID'];
                $tmp_ar['depositid'] = $row['DepositID'];
                $tmp_ar['longitude'] = $row['Longitude'];
                $tmp_ar['latitude'] = $row['Latitude'];
                $tmp_ar['clickcount'] = $row['ClickCount'];
                $tmp_ar['infotype'] = $row['InfoType'];
                $tmp_ar['description'] = $row['Description'];
                $tmp_ar['photolink1'] = $row['PhotoLink1'];
                $tmp_ar['photolink2'] = $row['PhotoLink2'];
                $tmp_ar['photolink3'] = $row['PhotoLink3'];
                $tmp_ar['photolink4'] = $row['PhotoLink4'];
                $tmp_ar['photolink5'] = $row['PhotoLink5'];
                $tmp_ar['photolink6'] = $row['PhotoLink6'];
                $tmp_ar['status'] = $row['Status'];
                $tmp_ar['createtime'] = $row['CreateTime'];
                $rec_ar[] = $tmp_ar;
            }
            $info['timeline'] = $rec_ar;
            return $info;
        }catch (PDOException $e) {
            $errs = $e->getMessage();
            return 10000;
        }
    }

    public function getDepositWithTeacherID($tId){
        try{
            $sql_str = "";
            if (strpos($tId, '3')===0) {
              $sql_str = "select * from tb_accnt_deposit where AccountID = ( SELECT DepositID from tb_deposit_teacher  where TeacherID = :tId);";
            }else{
              $sql_str = "select * from tb_accnt_deposit where AccountID = :tId";
            }
            $stmt = $this->DB->prepare($sql_str);
            $stmt->bindParam(":tId", $tId, PDO::PARAM_STR);
            if(!$stmt->execute())
                return 10001;
            $info = array();
            while($row = $stmt->fetch(PDO::FETCH_ASSOC)){
                $tmp_ar = array();
                $tmp_ar['depositname'] = $row['OrgName'];
                $tmp_ar['depositid'] = $row['AccountID'];
                $tmp_ar['address'] = $row['Address'];
                $tmp_ar['contactname'] = $row['ContactName'];
                $tmp_ar['contactphone'] = $row['ContactPhone'];
                $tmp_ar['longitude'] = $row['Longitude'];
                $tmp_ar['latitude'] = $row['Latitude'];
                $info[] = $tmp_ar;
            }
            return $info;
        }catch (PDOException $e) {
            $errs = $e->getMessage();
            return 10000;
        }
    }

    public function getDailyWithDepositID($depositId){
      try{
          $sql_str = "select * ,if(dd.PublisherID like '3%',
              (select at.Name from tb_accnt_teacher at WHERE at.AccountID = dd.PublisherID) ,
              (select ad.ContactName from tb_accnt_deposit ad WHERE ad.AccountID = dd.PublisherID)
              ) as PublisherName
              from tb_deposit_daily dd
              where DepositID = (if( :depositId like '3%',
              (select dt.DepositID from tb_deposit_teacher dt WHERE dt.TeacherID = :depositId) ,
              :depositId
              )) ORDER BY CreateTime DESC;";
          $stmt = $this->DB->prepare($sql_str);
          $stmt->bindParam(":depositId", $depositId, PDO::PARAM_STR);
          if(!$stmt->execute())
              return 10001;
          $info = array();
          while($row = $stmt->fetch(PDO::FETCH_ASSOC)){
              $tmp_ar = array();
              $tmp_ar['infoid'] = $row['InfoID'];
              $tmp_ar['publisherid'] = $row['PublisherID'];
              $tmp_ar['publishername'] = $row['PublisherName'];
              $tmp_ar['depositid'] = $row['DepositID'];
              $tmp_ar['longitude'] = $row['Longitude'];
              $tmp_ar['latitude'] = $row['Latitude'];
              $tmp_ar['clickcount'] = $row['ClickCount'];
              $tmp_ar['infotype'] = $row['InfoType'];
              $tmp_ar['description'] = $row['Description'];
              $tmp_ar['photolink1'] = $row['PhotoLink1'];
              $tmp_ar['photolink2'] = $row['PhotoLink2'];
              $tmp_ar['photolink3'] = $row['PhotoLink3'];
              $tmp_ar['photolink4'] = $row['PhotoLink4'];
              $tmp_ar['photolink5'] = $row['PhotoLink5'];
              $tmp_ar['photolink6'] = $row['PhotoLink6'];
              $tmp_ar['status'] = $row['Status'];
              $tmp_ar['createtime'] = $row['CreateTime'];
              $info[] = $tmp_ar;
          }
          return $info;
      }catch (PDOException $e) {
          $errs = $e->getMessage();
          return 10000;
      }
    }

    public function getChldrenDailyFromParentId($parentuid){
        try{
            $sql_str =  "select * from tb_deposit_daily dd left join (
                select dc.ChildrenID, dc.DepositID,
                (select pc.ParentID from tb_parent_children pc WHERE pc.ChildrenID = dc.ChildrenID) as parentID,
                (select ac.Name from tb_accnt_children ac WHERE ac.AccountID = dc.ChildrenID) as childName
                from tb_deposit_children dc ) b
                on b.DepositID = dd.DepositID
                where b.parentID = :parentuid
                ORDER BY CreateTime DESC;";
            $stmt = $this->DB->prepare($sql_str);
            $stmt->bindParam(":parentuid", $parentuid, PDO::PARAM_STR);
            if(!$stmt->execute())
                return 10001;
            $info = array();
            while($row = $stmt->fetch(PDO::FETCH_ASSOC)){
                $tmp_ar = array();
                $tmp_ar['childrenID'] = $row['ChildrenID'];
                $tmp_ar['parentID'] = $row['parentID'];
                $tmp_ar['childrenName'] = $row['childName'];
                $tmp_ar['infoid'] = $row['InfoID'];
                $tmp_ar['publisherid'] = $row['PublisherID'];
                $tmp_ar['depositid'] = $row['DepositID'];
                $tmp_ar['longitude'] = $row['Longitude'];
                $tmp_ar['latitude'] = $row['Latitude'];
                $tmp_ar['clickcount'] = $row['ClickCount'];
                $tmp_ar['infotype'] = $row['InfoType'];
                $tmp_ar['description'] = $row['Description'];
                $tmp_ar['photolink1'] = $row['PhotoLink1'];
                $tmp_ar['photolink2'] = $row['PhotoLink2'];
                $tmp_ar['photolink3'] = $row['PhotoLink3'];
                $tmp_ar['photolink4'] = $row['PhotoLink4'];
                $tmp_ar['photolink5'] = $row['PhotoLink5'];
                $tmp_ar['photolink6'] = $row['PhotoLink6'];
                $tmp_ar['status'] = $row['Status'];
                $tmp_ar['createtime'] = $row['CreateTime'];
                $info[] = $tmp_ar;
            }
            return $info;
        }catch (PDOException $e) {
            $errs = $e->getMessage();
            return 10000;
        }
    }

    public function getParentDepositInfo($parentid){
        try{
            $info = array();
            $sql_str = "select childrenid from tb_parent_children where parentid=:parentid";
            $stmt = $this->DB->prepare($sql_str);
            $stmt->bindParam(":parentid", $parentid, PDO::PARAM_STR);
            if(!$stmt->execute())
                return 10001;
            while($row = $stmt->fetch(PDO::FETCH_ASSOC)){
                $child_ar = array();

                $childuid = $row['childrenid'];
                $sql_str = "select name, sex from tb_accnt_children where accountid=:childuid";
                $stmt = $this->DB->prepare($sql_str);
                $stmt->bindParam(":childuid", $childuid, PDO::PARAM_INT);
                if(!$stmt->execute())
                    return 10001;
                $row = $stmt->fetch(PDO::FETCH_ASSOC);
                if(!$row)
                    return 10002;

                $child_ar['childuid'] = $childuid;
                $child_ar['childname'] = $row['name'];

                $sql_str = "SELECT * FROM tb_deposit_daily a WHERE a.`DepositID` =
                    (SELECT b.`DepositID` FROM tb_deposit_children b WHERE b.`ChildrenID` = :childuid)";
                $stmt = $this->DB->prepare($sql_str);
                $stmt->bindParam(":childuid", $childuid, PDO::PARAM_STR);
                if(!$stmt->execute())
                    return 10001;
                $rec_ar = array();
                while($row = $stmt->fetch(PDO::FETCH_ASSOC)){
                    $tmp_ar = array();
                    $tmp_ar['infoid'] = $row['InfoID'];
                    $tmp_ar['publisherid'] = $row['PublisherID'];
                    $tmp_ar['depositid'] = $row['DepositID'];
                    $tmp_ar['longitude'] = $row['Longitude'];
                    $tmp_ar['latitude'] = $row['Latitude'];
                    $tmp_ar['clickcount'] = $row['ClickCount'];
                    $tmp_ar['infotype'] = $row['InfoType'];
                    $tmp_ar['description'] = $row['Description'];
                    $tmp_ar['photolink1'] = $row['PhotoLink1'];
                    $tmp_ar['photolink2'] = $row['PhotoLink2'];
                    $tmp_ar['photolink3'] = $row['PhotoLink3'];
                    $tmp_ar['photolink4'] = $row['PhotoLink4'];
                    $tmp_ar['photolink5'] = $row['PhotoLink5'];
                    $tmp_ar['photolink6'] = $row['PhotoLink6'];
                    $tmp_ar['status'] = $row['Status'];
                    $tmp_ar['createtime'] = $row['CreateTime'];
                    $rec_ar[] = $tmp_ar;
                }
                $child_ar['timeline'] = $rec_ar;
                $info[] = $child_ar;
            }
            return $info;

        }catch (PDOException $e) {
            $errs = $e->getMessage();
            return 10000;
        }
    }

    public function getSigninInfo($childuid){
        try{
            $sql_str = "SELECT deviceid, depositid, signintime FROM tb_children_signin where childid=:childuid order by signintime desc";
            $stmt = $this->DB->prepare($sql_str);
            $stmt->bindParam(":childuid", $childuid, PDO::PARAM_STR);
            if(!$stmt->execute())
                return 10001;
            $info = array();
            while($row = $stmt->fetch(PDO::FETCH_ASSOC)){
                $tmp_ar = array();
                $tmp_ar['deviceid'] = $row['deviceid'];
                $tmp_ar['depositid'] = $row['depositid'];
                $tmp_ar['signintime'] = $row['signintime'];
                $info[] = $tmp_ar;
            }

            return $info;

        }catch (PDOException $e) {
            $errs = $e->getMessage();
            return 10000;
        }
    }

    public function getChldrenSignInFromParentId($parentuid){
        try{
            $sql_str =  "select * from (
            select * ,
            (select pc.ParentID from tb_parent_children pc WHERE pc.ChildrenID = cs.ChildID) as parentID,
            (select ac.Name from tb_accnt_children ac WHERE ac.AccountID = cs.ChildID) as childName
            from tb_children_signin cs ) a
            where a.parentID = :parentuid ORDER BY SignInTime DESC;";
            $stmt = $this->DB->prepare($sql_str);
            $stmt->bindParam(":parentuid", $parentuid, PDO::PARAM_STR);
            if(!$stmt->execute())
                return 10001;
            $info = array();
            while($row = $stmt->fetch(PDO::FETCH_ASSOC)){
                $tmp_ar = array();
                $tmp_ar['childrenID'] = $row['ChildID'];
                $tmp_ar['parentID'] = $row['parentID'];
                $tmp_ar['childrenName'] = $row['childName'];
                $tmp_ar['deviceid'] = $row['DeviceID'];
                $tmp_ar['depositid'] = $row['DepositID'];
                $tmp_ar['signintime'] = $row['SignInTime'];
                $info[] = $tmp_ar;
            }
            return $info;
        }catch (PDOException $e) {
            $errs = $e->getMessage();
            return 10000;
        }
    }

    public function getAllSigninInfo($parentid){
        try{
            $info = array();

            $sql_str = "select childrenid from tb_parent_children where parentid=:parentid";
            $stmt = $this->DB->prepare($sql_str);
            $stmt->bindParam(":parentid", $parentid, PDO::PARAM_STR);
            if(!$stmt->execute())
                return 10001;
            while($row = $stmt->fetch(PDO::FETCH_ASSOC)){
                $child_ar = array();
                $childuid = $row['childrenid'];
                $child_ar['childuid'] = $childuid;
                $sql_str = "SELECT deviceid, depositid, signintime FROM tb_children_signin where childid=:childuid order by signintime desc";
                $stmt = $this->DB->prepare($sql_str);
                $stmt->bindParam(":childuid", $childuid, PDO::PARAM_STR);
                if(!$stmt->execute())
                    return 10001;
                $timeline = array();
                while($row = $stmt->fetch(PDO::FETCH_ASSOC)){
                    $tmp_ar = array();
                    $tmp_ar['deviceid'] = $row['deviceid'];
                    $tmp_ar['depositid'] = $row['depositid'];
                    $tmp_ar['signintime'] = $row['signintime'];
                    $timeline[] = $tmp_ar;
                }
                $child_ar['timeline'] = $timeline;
                $info[] = $child_ar;
            }

            return $info;

        }catch (PDOException $e) {
            $errs = $e->getMessage();
            return 10000;
        }
    }


    private $DB;
}
?>
