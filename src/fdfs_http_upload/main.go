package main

import (
	"fdfs_http_upload/config"
	"fdfs_http_upload/gofdfs"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"time"
)

type UploadResp struct {
	FileUrl  string `json:"fileurl"`
	FileName string `json:"filename"`
}

func helloHandle(w http.ResponseWriter, r *http.Request) {
	io.WriteString(w, "hello world!")
}

func tmpFilename(filename string) string {
	tmpname := time.Now().Format("20060102.150405.") + fmt.Sprintf("%v", time.Now().UnixNano())
	return config.TmpPath() + "/" + tmpname + "." + filename
}

func uploadToFdfs(w http.ResponseWriter, filename string, reader io.ReadCloser) {
	tmpfilename := tmpFilename(filename)
	log.Printf("UploadFile(%s): Receive a file.", tmpfilename)

	fW, err := os.Create(tmpfilename)
	if err != nil {
		log.Printf("UploadFile(%s): Create tmp file fail. %v", tmpfilename, err)
		SendHttpRespFail(w, ERR_TMP_FILE_FAIL)
		return
	}
	defer fW.Close()
	defer func() {
		if !config.TmpRemove() {
			return
		}
		err := os.Remove(tmpfilename)
		if err != nil {
			log.Printf("UploadFile(%s): Remove tmp file fail. %v", tmpfilename, err)
		} else {
			log.Printf("UploadFile(%s): Remove tmp file OK. ", tmpfilename)
		}
	}()

	_, err = io.Copy(fW, reader)
	if err != nil {
		log.Printf("UploadFile(%s): Save tmp file data fail. %v", tmpfilename, err)
		SendHttpRespFail(w, ERR_TMP_FILE_FAIL)
		return
	}
	log.Printf("UploadFile(%s): Save tmp file data OK. ", tmpfilename)

	rsp := UploadResp{FileName: filename}
	rsp.FileUrl, err = gofdfs.UploadFile(config.FdfsConf(), tmpfilename)
	if err != nil {
		log.Printf("UploadFile(%s): Upload file to fdfs fail. %v", tmpfilename, err)
		SendHttpRespFail(w, ERR_FDFS_FAIL)
		return
	}
	rsp.FileUrl = "http://" + config.FdfsDownloadAddr() + "/" + rsp.FileUrl
	SendHttpRespSucc(w, rsp)
	log.Printf("UploadFile(%s): Upload file to fdfs OK. url = %v", tmpfilename, rsp.FileUrl)
}

func uploadHandle(w http.ResponseWriter, r *http.Request) {
	if r.Method == "GET" {
		io.WriteString(w, "<html><head><title>Upload Files</title></head><body><form action='' method=\"post\" enctype=\"multipart/form-data\"><label>上传图片</label><input type=\"file\" name='file'  /><br/><label><input type=\"submit\" value=\"Upload File\"/></label></form></body></html>")
	} else if r.Method == "POST" {
		file, head, err := r.FormFile("file")
		if err != nil {
			log.Println(err)
			http.Error(w, err.Error(), 400)
			return
		}
		defer file.Close()
		uploadToFdfs(w, head.Filename, file)
	} else if r.Method == "PUT" {
		r.ParseForm()
		defer r.Body.Close()
		if len(r.Form["filename"]) <= 0 {
			log.Println("UploadFile(PUT): Can not find 'filename' parameter.")
			http.Error(w, "Can not find 'filename' parameter", 400)
			return
		}
		uploadToFdfs(w, r.Form["filename"][0], r.Body)
	}
}

func main() {
	// start http server
	http.HandleFunc("/hello", helloHandle)

	// upload
	http.HandleFunc("/upload", uploadHandle)

	servAddr := config.ServAddr()
	log.Printf("To start  HTTP Upload server on %v \n", servAddr)
	err := http.ListenAndServe(servAddr, nil)
	if err != nil {
		log.Printf("HTTP Upload server start on %v fail. %v\n", servAddr, err)
		return
	}
	log.Printf("HTTP Upload server start on %v OK\n", servAddr)
}
