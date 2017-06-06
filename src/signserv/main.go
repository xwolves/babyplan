package main

import (
	"encoding/json"
	"io/ioutil"
	"log"
	"net/http"
	"signserv/config"
	"strconv"
)

type BindReq struct {
	DepositId   int    `json:"deposit_id"`
	ChildId     int    `json:"child_id"`
	DepositType int    `json:"deposit_type"`
	Remark      string `json:"remark"`
}

type SignInReq struct {
	DepositId int    `json:"deposit_id"`
	ChildId   int    `json:"child_id"`
	PhotoLink string `json:"photo_link"`
	Mode      int    `json:"mode"`
}

type ApiRsp struct {
	Errno  int         `json:"errno"`
	Errmsg string      `json:"error"`
	Data   interface{} `json:"data"`
}

func httpReqCheck(w http.ResponseWriter, req *http.Request, bizReq interface{}) bool {
	if req.Method != "POST" {
		log.Printf("http not allowed this method: %v", req.Method)
		w.WriteHeader(http.StatusMethodNotAllowed)
		w.Write([]byte("http not allowed this method"))
		return false
	}
	data, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.Printf("http get post body fail. %v", err)
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte("get post body fail."))
		return false
	}
	err = json.Unmarshal(data, bizReq)
	if err != nil {
		log.Printf("unmarshal http request from post body fail. %v", err)
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte("unmarshal http request from post body fail."))
		return false
	}
	log.Printf("signin server receive data: %v", string(data))

	return true
}

func httpRspProcess(w http.ResponseWriter, data interface{}, err error) {
	var rsp ApiRsp
	if err != nil {
		switch err.(type) {
		case SignErr:
			rsp.Errno = err.(SignErr).Errno
			rsp.Errmsg = err.(SignErr).Errmsg
		default:
			rsp.Errno = ERR_UNKNOWN
			rsp.Errmsg = err.Error()
		}
	} else {
		rsp.Data = data
	}
	rspData, err := json.Marshal(rsp)
	if err != nil {
		log.Printf("json marshal response fail. %v", err)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte("json marshal response fail"))
	}
	w.Write(rspData)
	log.Printf("signin server send response: %v", string(rspData))
}

func childBind(w http.ResponseWriter, r *http.Request) {
	var req BindReq
	if !httpReqCheck(w, r, &req) {
		return
	}
	httpRspProcess(w, nil, binding(req.DepositId, req.ChildId, req.DepositType, req.Remark))
}

func childSignIn(w http.ResponseWriter, r *http.Request) {
	var req SignInReq
	if !httpReqCheck(w, r, &req) {
		return
	}
	httpRspProcess(w, nil, signIn("", req.DepositId, req.ChildId, req.Mode, req.PhotoLink))
}

type childInfo struct {
	ChildId          int    `json:"child_id"`
	ChildName        string `json:"child_name"`
	ParentId         int    `json:"parent_id"`
	ParentName       string `json:"parent_name"`
	ParentPhone      string `json:"parent_phone"`
	RelationShip     int    `json:"relationship"`
	DepositStartTime string `json:"deposit_start_time"`
	DepositEndTime   string `json:"deposit_end_time"`
	DepositType      int    `json:"deposit_type"`
}

type depositInfo struct {
	DepositId   int          `json:"deposit_id"`
	DepositName string       `json:"deposit_name"`
	Address     string       `json:"deposit_address"`
	Password    string       `json:"deposit_password"`
	LicenseType int          `json:"deposit_license_type"`
	Children    []*childInfo `json:"children"`
}

func deposit(w http.ResponseWriter, r *http.Request) {
	var (
		err       error
		depositId int
		rsp       *depositInfo
	)
	r.ParseForm()
	if len(r.Form["id"]) > 0 {
		if depositId, err = strconv.Atoi(r.Form["id"][0]); err == nil {
			log.Printf("receive request for deposit, id = %v", depositId)
			rsp, err = getDepositInfo(depositId)
			httpRspProcess(w, rsp, err)
			return
		}
	}
	log.Printf("http request deposit info can not get 'id' parameter. %v", err)
	w.WriteHeader(http.StatusBadRequest)
	w.Write([]byte("http request deposit info can not get 'id' parameter. "))
}

func child(w http.ResponseWriter, r *http.Request) {
	var (
		err     error
		childId int
		rsp     *childInfo
	)
	r.ParseForm()
	if len(r.Form["id"]) > 0 {
		if childId, err = strconv.Atoi(r.Form["id"][0]); err == nil {
			log.Printf("receive request for child, id = %v", childId)
			rsp, err = getChildInfo(childId)
			httpRspProcess(w, rsp, err)
			return
		}
	}
	log.Printf("http request child info can not get 'id' parameter. %v", err)
	w.WriteHeader(http.StatusBadRequest)
	w.Write([]byte("http request child info can not get 'id' parameter. "))
}

func main() {
	http.HandleFunc("/signin/v1/bind", childBind)
	http.HandleFunc("/signin/v1/signin", childSignIn)
	http.HandleFunc("/signin/v1/deposit", deposit)
	http.HandleFunc("/signin/v1/child", child)

	log.Printf("Start on server: [%v]", config.GetServAddr())
	if err := http.ListenAndServe(config.GetServAddr(), nil); err != nil {
		log.Fatalf("ListenAndServe fail. %v", err)
	}
}
