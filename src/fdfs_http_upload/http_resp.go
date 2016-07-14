package main

import (
	"encoding/json"
	"io"
	"log"
	"net/http"
)

const (
	ERR_JSON_MARSHAL_FAIL = 1101
	ERR_TMP_FILE_FAIL     = 1110
	ERR_FDFS_FAIL         = 1120
)

var g_err_msg map[int]string

func init() {
	g_err_msg = make(map[int]string)
	g_err_msg[ERR_JSON_MARSHAL_FAIL] = "JSON数据序列化失败"
	g_err_msg[ERR_TMP_FILE_FAIL] = "文件服务器上传生成临时文件错误"
	g_err_msg[ERR_FDFS_FAIL] = "文件服务器上传到FDFS失败"
}

type HttpResp struct {
	Errno  int         `json:"errno"`
	ErrMsg string      `json:"error"`
	Data   interface{} `json:"data"`
}

func SendHttpRespSucc(w http.ResponseWriter, val interface{}) {
	rsp := HttpResp{Errno: 0, ErrMsg: "", Data: val}
	d, err := json.Marshal(&rsp)
	if err != nil {
		log.Printf("http response json marshal fail. %v", err)
		SendHttpRespFail(w, ERR_JSON_MARSHAL_FAIL)
		return
	}
	io.WriteString(w, string(d))
}

func SendHttpRespFail(w http.ResponseWriter, errno int) {
	var (
		ok bool
	)
	rsp := HttpResp{Errno: errno}
	if rsp.ErrMsg, ok = g_err_msg[errno]; !ok {
		rsp.ErrMsg = "Unknown Error"
	}
	d, err := json.Marshal(&rsp)
	if err != nil {
		log.Printf("http response json marshal fail. %v", err)
		http.Error(w, err.Error(), 499)
		return
	}

	http.Error(w, string(d), 499)
}
