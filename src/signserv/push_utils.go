package main

import (
	"bytes"
	"log"
	"signserv/config"
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

	msg.SigninTime = time.Now().Format("20060102 15:04:05")

	if tmpl, err = template.New("signin_push_temp").Parse(temp); err != nil {
		log.Printf("push: parse template fail. %v, temp = %v", err, temp)
		return "", ""
	}

	if err = tmpl.Execute(&buf, msg); err != nil {
		log.Printf("push: execute template fail. %v, temp = %v", err, temp)
		return "", ""
	}

	return buf.String(), c.ParentPhone
}

func SigninPush(depositId, childId, signinMode int) {
	msg, phone := getSigninMessage(depositId, childId, signinMode)
	if len(msg) == 0 || len(phone) == 0 {
		return
	}
	JgPush(msg, phone)
}
