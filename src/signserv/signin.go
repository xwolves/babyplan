package main

import (
	"database/sql"
	"fmt"
	"log"
	"signserv/config"
	"strconv"

	_ "github.com/go-sql-driver/mysql"
)

func getDB() *sql.DB {
	dbcfg := config.GetDbConfig()
	// build db schema by config
	dbSchema := fmt.Sprintf("%s:%s@tcp(%s:%d)/%s?charset=utf8",
		dbcfg.DnsDbUser, dbcfg.DnsDbPass, dbcfg.DnsDbHost, dbcfg.DnsDbPort, dbcfg.DnsDbName)

	db, err := sql.Open("mysql", dbSchema)
	if err != nil {
		log.Printf("db::GetDB open DB(dbSchema=%v) fail. %v", dbSchema, err)
		return nil
	}

	log.Printf("open DB successful. ")

	// set db max open/idle connections
	db.SetMaxOpenConns(50)
	db.SetMaxIdleConns(10)

	return db
}

const (
	ERR_DB_FAIL = 10001
	ERR_UNKNOWN = 11111
)

type SignErr struct {
	Errno  int
	Errmsg string
}

func (this SignErr) Error() string {
	return this.Errmsg
}

func dbResCheck(res sql.Result, expectRowsAffected int) error {
	/*
		rowsAffected, err := res.RowsAffected()
		if err != nil {
			e := SignErr{ERR_DB_FAIL, err.Error()}
			return e
		}
			if int(rowsAffected) != expectRowsAffected {
				e := SignErr{ERR_DB_FAIL, fmt.Sprintf("db exec result is not expected. rowsAffected = %v, expect = %v", rowsAffected, expectRowsAffected)}
				return e
			}
	*/
	return nil
}

func binding(depositId, childId int, depositType int, remark string) error {
	db := getDB()
	if db == nil {
		return SignErr{ERR_DB_FAIL, "childBinding get db fail."}
	}
	defer db.Close()

	stmt, err := db.Prepare(`REPLACE INTO tb_deposit_children(
		DepositID,
		ChildrenID,
		DepositStartTime,
		DepositType,
		Remark,
		CreateTime,
		ModifyTime)VALUES(?,?,now(),?,?,now(),now())`)
	if err != nil {
		e := SignErr{ERR_DB_FAIL, fmt.Sprintf("childBinding prepare db insert schema fail. %v", err)}
		log.Println(e.Errmsg)
		return e
	}
	defer stmt.Close()
	res, err := stmt.Exec(depositId, childId, depositType, remark)
	if err != nil {
		e := SignErr{ERR_DB_FAIL, fmt.Sprintf("childBinding exec db insert sql fail. %v", err)}
		log.Println(e.Errmsg)
		return e
	}
	if err = dbResCheck(res, 1); err != nil {
		log.Printf("replace into tb_deposit_children fail, depositId = %v, childId = %v. %v", depositId, childId, err)
		return err
	}

	log.Printf("childBinding exec db insert sql ok. depositId = %v, childId = %v, depositType = %v, remark = %v",
		depositId, childId, depositType, remark)
	return nil
}

func signIn(deviceId string, depositId, childId int, photoLink string) error {
	db := getDB()
	if db == nil {
		return SignErr{ERR_DB_FAIL, "signIn get db fail."}
	}
	defer db.Close()

	tx, err := db.Begin()
	if err != nil {
		e := SignErr{ERR_DB_FAIL, fmt.Sprintf("signIn create transation fail. %v", err)}
		log.Println(e.Errmsg)
		return e
	}

	sqlBind := `REPLACE INTO tb_deposit_children(
		DepositID,
		ChildrenID,
		ModifyTime)VALUES(?,?,now())`
	sqlSignin := `INSERT INTO tb_children_signin(
		DeviceId,
		DepositID,
		PhotoLink,
		SignInTime,
		CreateTime,
		ChildID)VALUES(?,?,?,now(),now(),?)`

	res, err := tx.Exec(sqlBind, depositId, childId)
	if err != nil {
		tx.Rollback()
		e := SignErr{ERR_DB_FAIL, fmt.Sprintf("replace into tb_deposit_children fail. %v", err)}
		log.Println(e.Errmsg)
		return e
	}
	if err = dbResCheck(res, 1); err != nil {
		log.Printf("replace into tb_deposit_children fail, depositId = %v, childId = %v. %v", depositId, childId, err)
		return err
	}

	res, err = tx.Exec(sqlSignin, deviceId, depositId, photoLink, childId)
	if err != nil {
		tx.Rollback()
		e := SignErr{ERR_DB_FAIL, fmt.Sprintf("insert into tb_children_signin fail. %v", err)}
		log.Println(e.Errmsg)
		return e
	}
	if err := dbResCheck(res, 1); err != nil {
		log.Printf("insert into tb_children_signin fail, depositId = %v, childId = %v. %v", depositId, childId, err)
		return err
	}

	err = tx.Commit()
	if err != nil {
		e := SignErr{ERR_DB_FAIL, fmt.Sprintf("signIn commit data to db fail. %v", err)}
		log.Println(e.Errmsg)
		return e
	}

	log.Printf("replace into tb_deposit_children and insert into tb_children_signin ok. deviceId = %v, depositId = %v, childId = %v",
		deviceId, depositId, childId)
	return nil
}

func getDepositInfo(depositId int) (*depositInfo, error) {
	// get deposit info
	db := getDB()
	if db == nil {
		return nil, SignErr{ERR_DB_FAIL, "getDepositInfo get db fail."}
	}
	defer db.Close()

	var (
		depName   []byte
		depAddr   []byte
		depPasswd []byte
		depLic    []byte
	)
	err := db.QueryRow("SELECT OrgName, Address, Password, LicenseType from tb_accnt_deposit where AccountID = ?",
		depositId).Scan(&depName, &depAddr, &depPasswd, &depLic)
	if err != nil {
		e := SignErr{ERR_DB_FAIL, fmt.Sprintf("getDepositInfo exec deposit query sql fail. %v", err)}
		log.Println(e.Errmsg)
		return nil, e
	}
	depInfo := &depositInfo{
		DepositId:   depositId,
		DepositName: string(depName),
		Address:     string(depAddr),
		Password:    string(depPasswd),
	}
	if len(depLic) != 0 {
		depInfo.LicenseType, _ = strconv.Atoi(string(depLic))
	}

	tmp := make(map[int]*childInfo)
	// get all children ids
	childIds := []interface{}{}
	rows, err := db.Query("SELECT ChildrenID,DepositStartTime,DepositEndTime,DepositType from tb_deposit_children where DepositID = ?", depositId)
	if err != nil {
		e := SignErr{ERR_DB_FAIL, fmt.Sprintf("getDepositInfo exec deposit children query sql fail. %v", err)}
		log.Println(e.Errmsg)
		return nil, e
	}
	for rows.Next() {
		var (
			cId     []byte
			depST   []byte
			depET   []byte
			depType []byte
		)
		if err := rows.Scan(&cId, &depST, &depET, &depType); err != nil {
			e := SignErr{ERR_DB_FAIL, fmt.Sprintf("getDepositInfo exec deposit children query sql, get row value fail. %v", err)}
			log.Println(e.Errmsg)
			continue
		}
		c := &childInfo{
			DepositStartTime: string(depST),
			DepositEndTime:   string(depET),
		}
		if len(cId) != 0 {
			c.ChildId, _ = strconv.Atoi(string(cId))
		}
		if len(depType) != 0 {
			c.DepositType, _ = strconv.Atoi(string(depType))
		}

		depInfo.Children = append(depInfo.Children, c)
		childIds = append(childIds, c.ChildId)
		tmp[c.ChildId] = c
	}
	rows.Close()

	// get children's name and parents name
	sqlDeposit := `select 
	c.AccountID ChildID, 
	c.Name ChildName, 
	p.AccountID ParentID, 
	p.Name ParentName, 
	p.Mobile ParentPhone,
	pc.RelationShip 
	RelationShip from tb_accnt_children 
	  as c left join( tb_parent_children as pc left join tb_accnt_parent as p on pc.ParentID = p.AccountID) 
	  on c.AccountID=pc.ChildrenID `
	if len(childIds) > 0 {
		sqlDeposit += " where "
	}
	for i := 0; i < len(childIds); i++ {
		if (i + 1) == len(childIds) {
			sqlDeposit += " (c.AccountID = ? )"
		} else {
			sqlDeposit += " (c.AccountID = ? ) OR "
		}
	}

	rows, err = db.Query(sqlDeposit, childIds...)
	if err != nil {
		e := SignErr{ERR_DB_FAIL, fmt.Sprintf("getDepositInfo exec deposit children parents query sql fail. %v", err)}
		log.Println(e.Errmsg)
		return nil, e
	}
	for rows.Next() {
		var (
			childId        []byte
			childName      []byte
			parentId       []byte
			parentName     []byte
			parentPhone    []byte
			relatitionShip []byte
		)
		if err := rows.Scan(&childId, &childName, &parentId, &parentName, &parentPhone, &relatitionShip); err != nil {
			e := SignErr{ERR_DB_FAIL, fmt.Sprintf("getDepositInfo exec deposit children parents query sql, get row value fail. %v", err)}
			log.Println(e.Errmsg)
			continue
		}
		cid := 0
		if len(childId) != 0 {
			cid, _ = strconv.Atoi(string(childId))
		}
		if c, ok := tmp[cid]; ok {
			c.ChildName = string(childName)
			c.ParentPhone = string(parentPhone)
			c.ParentName = string(parentName)
			if len(parentId) != 0 {
				c.ParentId, _ = strconv.Atoi(string(parentId))
			}
			if len(relatitionShip) != 0 {
				c.RelationShip, _ = strconv.Atoi(string(relatitionShip))
			}
		}
	}
	rows.Close()

	return depInfo, nil
}

func getChildInfo(childId int) (*childInfo, error) {
	// get deposit info
	db := getDB()
	if db == nil {
		return nil, SignErr{ERR_DB_FAIL, "getChildInfo get db fail."}
	}
	defer db.Close()

	// get children's name and parents name
	sqlChild := `select 
	c.AccountID ChildID, 
	c.Name ChildName, 
	p.AccountID ParentID, 
	p.Name ParentName, 
	p.Mobile ParentPhone,
	pc.RelationShip 
	RelationShip from tb_accnt_children 
	  as c left join( tb_parent_children as pc left join tb_accnt_parent as p on pc.ParentID = p.AccountID) 
	  on c.AccountID=pc.ChildrenID where c.AccountID = ?`

	var (
		cId            []byte
		childName      []byte
		parentId       []byte
		parentName     []byte
		parentPhone    []byte
		relatitionShip []byte
	)
	err := db.QueryRow(sqlChild, childId).Scan(&cId, &childName, &parentId, &parentName, &parentPhone, &relatitionShip)
	if err != nil {
		e := SignErr{ERR_DB_FAIL, fmt.Sprintf("getChildInfo exec deposit children parents query sql fail. %v", err)}
		log.Println(e.Errmsg)
		return nil, e
	}
	c := &childInfo{
		ChildId:     childId,
		ChildName:   string(childName),
		ParentPhone: string(parentPhone),
		ParentName:  string(parentName),
	}
	if len(parentId) != 0 {
		c.ParentId, _ = strconv.Atoi(string(parentId))
	}
	if len(relatitionShip) != 0 {
		c.RelationShip, _ = strconv.Atoi(string(relatitionShip))
	}
	return c, nil
}
