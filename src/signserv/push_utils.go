package main

import (
	"bytes"
	"log"
	"signserv/config"
	"strconv"
	"text/template"
	"time"
)

type signinMessage struct {
	ParentName  string `json:"parent_name"`
	ChildName   string `json:"child_name"`
	SigninMode  string `json:"signin_mode"`
	DepositName string `json:"deposit_name"`
	SigninTime  string `json:"signin_time"`
}

func checkParentPayment(parentId int) bool {
	sql := `SELECT parentid, TIMESTAMPDIFF(DAY, NOW(), cutofftime) as retdays, businessid 
	FROM tb_parent_order WHERE paystatus = 1 AND NOW() <= cutofftime AND parentid=?`
	db := getDB()
	if db == nil {
		log.Printf("checkParentPayment get db fail, parentId = %v", parentId)
		return false
	}
	defer db.Close()
	rows, err := db.Query(sql, parentId)
	if err != nil {
		log.Printf("checkParentPayment query db fail. parentId = %v, %v", parentId, err)
		return false
	}
	if rows.Next() {
		return true
	}
	return false
}

// return message, parent-phone
func getSigninMessage(depositId, childId, signinMode int) (string, string) {
	var (
		err  error
		buf  bytes.Buffer
		msg  signinMessage
		tmpl *template.Template
		d    *depositInfo
		c    *childInfo
		temp = config.GetPushConfig().MsgTmpl
	)
	if len(temp) == 0 {
		log.Printf("push: can not get any message template string. temp = %v", temp)
		return "", ""
	}

	if c, err = getChildInfo(childId); err != nil {
		log.Printf("push: %v", err.Error())
		return "", ""
	}
	if !checkParentPayment(c.ParentId) {
		log.Printf("push: parent not payment, we don't push this message, parentId = %v, childId = %v, parentName = %v",
			c.ParentId, childId, c.ParentName)
		return "", ""
	}
	msg.ParentName = c.ParentName
	msg.ChildName = c.ChildName

	if d, err = getDepositInfo(depositId); err != nil {
		log.Printf("push: %v", err.Error())
		return "", ""
	}
	msg.DepositName = d.DepositName

	msg.SigninMode = "到达/离开"
	if signinMode == 1 {
		msg.SigninMode = "到达"
	} else if signinMode == 2 {
		msg.SigninMode = "离开"
	}

	msg.SigninTime = time.Now().Format("2006年01月02日15:04:05")

	if tmpl, err = template.New("signin_push_temp").Parse(temp); err != nil {
		log.Printf("push: parse template fail. %v, temp = %v", err, temp)
		return "", ""
	}

	if err = tmpl.Execute(&buf, msg); err != nil {
		log.Printf("push: execute template fail. %v, temp = %v", err, temp)
		return "", ""
	}

	return buf.String(), strconv.Itoa(c.ParentId)
}

func SigninPush(depositId, childId, signinMode int) {
	msg, parentUid := getSigninMessage(depositId, childId, signinMode)
	if len(msg) == 0 || len(parentUid) == 0 {
		return
	}
	JgPush(msg, parentUid)
}
