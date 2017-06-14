package main

import (
	"bytes"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"signserv/config"
	"time"
)

type audience struct {
	Tag    []string `json:"tag"`
	Alias  []string `json:"alias"`
	RegIds []string `json:"registration_id"`
}

type notification struct {
	Alert string `json:"alert"`
}

type jgdata struct {
	Platform string       `json:"platform"`
	Receiver audience     `json:"audience"`
	Data     notification `json:"notification"`
}

func doJgPost(reqbody []byte) ([]byte, error) {
	var (
		err    error
		url    = config.GetPushConfig().JgUrl
		client = http.Client{
			Timeout: time.Second * time.Duration(config.GetPushConfig().JgPushTimeout),
		}
		rsp  *http.Response
		body []byte
	)

	if len(url) == 0 {
		return nil, fmt.Errorf("invalid push url, url = %v", url)
	}
	auth := config.GetPushConfig().JgAuthSchema
	if len(auth) == 0 {
		return nil, fmt.Errorf("invalid push auth schema, auth_schema = %v", auth)
	}
	auth = "Basic " + base64.StdEncoding.EncodeToString([]byte(auth))

	req, err := http.NewRequest("POST", url, bytes.NewReader(reqbody))
	if err != nil {
		return nil, err
	}
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", auth)

	rsp, err = client.Do(req)
	if err != nil {
		return nil, err
	}
	defer rsp.Body.Close()

	body, err = ioutil.ReadAll(rsp.Body)
	if err != nil {
		return nil, err
	}

	if rsp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("bad status code %v", rsp.StatusCode)
	}
	return body, nil
}

func JgPush(msg, phone string) {
	d := jgdata{
		Platform: "all",
		Receiver: audience{
			Alias: []string{phone},
		},
		Data: notification{
			Alert: msg,
		},
	}

	buf, err := json.Marshal(d)
	if err != nil {
		log.Printf("JgPush: json marshal fail. %v", err)
		return
	}

	rsp, err := doJgPost(buf)

	if err != nil {
		log.Printf("JgPush: push fail. %v, data = %v", err, string(buf))
		return
	}
	log.Printf("JgPush: push ok. data = %v, rsp = %v", string(buf), string(rsp))
}
