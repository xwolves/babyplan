<?php
include "../charge_moduls/charge_function.php";

class Comment extends Charge{

    public function __construct($sql_db){
        $this->DB = $sql_db;
    }

    public function parentCommentDeposit($params){
        try{
            $column = array("parentid", "depositid", "kitchen", "food", "roadsafety", "edufiresafety","teacherresp", "commenttext");
            if(!array_key_exists("parentid", $params) || !array_key_exists("depositid", $params) || empty($params['parentid']) || empty($params['parentid']))
                return 15002;

            $parentid = $params['parentid'];
            $depositid = $params['depositid'];
            $update_flg = true;
            $sql_str = "select * from tb_deposit_parent_comments where parentid=:parentid and depositid=:depositid";
            $stmt = $this->DB->prepare($sql_str);
            $stmt->bindParam(":depositid", intval($depositid), PDO::PARAM_INT);
            $stmt->bindParam(":parentid", intval($parentid), PDO::PARAM_INT);
            if(!$stmt->execute())
                return 10001;

            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            if(!$row)
                $update_flg = false;

            $ar_params = array();
            if(array_key_exists("scores", $params)){
                $tmp_ar = $params['scores'];
                foreach($tmp_ar as $key => $val){
                    if(in_array($key, $column))
                        $ar_params[$key] = $val;
                }
            }
            foreach($params as $key => $val){
                if(in_array($key, $column))
                    $ar_params[$key] = $val;
            }

            $sql_str = "";
            if(!$update_flg){
                $sql_str = "insert into tb_deposit_parent_comments (commenttime";
                $cols = "";
                $vals = "";
                foreach($ar_params as $key => $val){
                    $cols .= ", $key";
                    $vals .= ", :$key";
                }
                $sql_str .= $cols.") values (now()".$vals.")";
            }else{
                unset($ar_params['parentid']);
                unset($ar_params['depositid']);
                $sql_str = "update tb_deposit_parent_comments";
                $str_tail = "";
                foreach($ar_params as $key => $val){
                    if(empty($str_tail))
                        $str_tail = " set $key=:$key";
                    else
                        $str_tail .= ", $key=:$key";
                }
                $sql_str .= $str_tail." where depositid=$depositid and parentid=$parentid";

            }
            $stmt = $this->DB->prepare($sql_str);
            if(!$stmt->execute($ar_params))
                return 10001;
            //if($stmt->rowCount() <= 0)
            //    return 10002;

            return 0;
        }catch (PDOException $e) {
            $errs = $e->getMessage();
            var_dump($errs);
            return 10000;
        }
    }

    public function getParentDepositComments($parentid, $depositid){
        try{
            $rsp_data = array();
            $sql_str = "select kitchen, food, roadsafety, edufiresafety, teacherresp, commenttext from tb_deposit_parent_comments where parentid=:parentid and depositid=:depositid";
            $stmt = $this->DB->prepare($sql_str);
            $stmt->bindParam(":depositid", $depositid, PDO::PARAM_INT);
            $stmt->bindParam(":parentid", $parentid, PDO::PARAM_INT);
            if(!$stmt->execute())
                return 10001;

            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            if(!$row)
                return 10003;
            $rsp_data['depositid'] = $depositid;
            $rsp_data['parentid'] = $parentid;
            $tmp_ar = array();
            $tmp_ar['kitchen'] = (int)$row['kitchen'];
            $tmp_ar['food'] = (int)$row['food'];
            $tmp_ar['roadsafety'] = (int)$row['roadsafety'];
            $tmp_ar['edufiresafety'] = (int)$row['edufiresafety'];
            $tmp_ar['teacherresp'] = (int)$row['teacherresp'];
            $rsp_data['scores'] = $tmp_ar;
            $rsp_data['commenttext'] = $row['commenttext'];

            return $rsp_data;

        }catch (PDOException $e) {
            $errs = $e->getMessage();
            return 10000;
        }
    }

    public function getDepositScores($depositid){
        try{
            $rsp_data = array();
            $sql_str = "select b.accountid as accountid, (IFNULL(b.score*0.4,0) + c.totalscore*0.6) as total_score from
                (select score, AccountID from tb_accnt_deposit where AccountID = :accountid) b LEFT JOIN
                (select (a.kitchenscore+a.foodscore+a.roadsafetyscore+a.edufiresafetyscore+a.teacherrespscore)/5 as totalscore, DepositID from
                (SELECT AVG(Kitchen) as kitchenscore, AVG(food) as foodscore, AVG(RoadSafety) as roadsafetyscore, AVG(edufiresafety) as edufiresafetyscore,
                AVG(TeacherResp) as teacherrespscore, DepositID FROM tb_deposit_parent_comments where depositid=:depositid) a)c
                on c.depositid = b.accountid";
            $stmt = $this->DB->prepare($sql_str);
            $stmt->bindParam(":accountid", intval($depositid), PDO::PARAM_INT);
            $stmt->bindParam(":depositid", intval($depositid), PDO::PARAM_INT);
            if(!$stmt->execute())
                return 10001;

            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            if(!$row)
                return 10003;
            $sc = (float)$row['total_score'];
            $rsp_data['scores'] = sprintf("%01.2f",(float)$sc);
            $sql_str = "select CommentText as comment, CommentTime as create_date, (select REPLACE (name,substring(name,2),'**') from tb_accnt_parent where AccountID = ParentID ) as creator from db_deposit.tb_deposit_parent_comments a where a.DepositID = :depositid";
            $stmt = $this->DB->prepare($sql_str);
            $stmt->bindParam(":depositid", intval($depositid), PDO::PARAM_INT);
            if(!$stmt->execute())
                return 10001;
            $row = $stmt->fetchAll(PDO::FETCH_CLASS);
            $rsp_data['comments'] = $row;

            return $rsp_data;

        }catch (PDOException $e) {
            $errs = $e->getMessage();
            return 10000;
        }
    }


    public function getDailyComment($infoId){
        try{
            $rsp_data = array();
            $sql_str = "select dc.*,ap.Name,ap.AvatarLink from tb_deposit_daily_comments dc left JOIN tb_accnt_parent ap on dc.CommentBy = ap.AccountID where CommentData is not NULL and InfoID = :infoId order by dc.CreateTime Desc";
            $stmt = $this->DB->prepare($sql_str);
            $stmt->bindParam(":infoId", $infoId, PDO::PARAM_INT);
            if(!$stmt->execute())
                return 10001;
            $row = $stmt->fetchAll(PDO::FETCH_CLASS);
            $rsp_data['comments'] = $row;
            $sql_str = "select dc.*,ap.Name,ap.AvatarLink from tb_deposit_daily_comments dc left JOIN tb_accnt_parent ap on dc.CommentBy = ap.AccountID where CommentData is NULL and InfoID = :infoId order by dc.CreateTime Desc";
            $stmt = $this->DB->prepare($sql_str);
            $stmt->bindParam(":infoId", $infoId, PDO::PARAM_INT);
            if(!$stmt->execute())
                return 10001;
            $row = $stmt->fetchAll(PDO::FETCH_CLASS);
            $rsp_data['likes'] = $row;

            return $rsp_data;
        }catch (PDOException $e) {
            $errs = $e->getMessage();
            return 10000;
        }
    }

    public function createDailyComment($params){
        try{
            $column = array("infoid", "commentby", "commentdata");
            if(!array_key_exists("infoid", $params) || !array_key_exists("commentby", $params) || empty($params['infoid']) || empty($params['commentby']))
                return 15002;

            $infoid = $params['infoid'];
            $commentby = $params['commentby'];
            $commentdata = $params['commentdata'];
            $update_flg = true;
            $sql_str = "insert into tb_deposit_daily_comments (infoID,commentBy,commentData,createtime) value(:infoid,:commentby,:commentdata,now());";
            $stmt = $this->DB->prepare($sql_str);
            $stmt->bindParam(":infoid", intval($infoid), PDO::PARAM_INT);
            $stmt->bindParam(":commentby", intval($commentby), PDO::PARAM_INT);
            $stmt->bindParam(":commentdata", $commentdata, PDO::PARAM_STR);
            if(!$stmt->execute())
                return 10001;
            return 0;
        }catch (PDOException $e) {
            $errs = $e->getMessage();
            //var_dump($errs);
            return 10000;
        }
    }

    public function delDailyComment($Id){
        try{
            $rsp_data = array();
            $sql_str = "delete from tb_deposit_daily_comments where COMMENTID = :Id ";
            $stmt = $this->DB->prepare($sql_str);
            $stmt->bindParam(":Id", $Id, PDO::PARAM_INT);
            if(!$stmt->execute())
                return 10001;
            return 0;
        }catch (PDOException $e) {
            $errs = $e->getMessage();
            return 10000;
        }
    }

    private $DB;
}
?>
