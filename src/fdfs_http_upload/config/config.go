package config

import (
	"encoding/json"
	"io"
	"log"
	"log/syslog"
	"os"
	"os/exec"
	"path/filepath"
)

type config struct {
	ServAddr         string `json:"serv_addr"`
	TmpPath          string `json:"tmp_path"`
	TmpRemove        bool   `json:"tmp_remove"`
	FdfsConf         string `json:"fdfs_conf"`
	FdfsDownloadAddr string `json:"fdfs_download_addr"`
}

var Config config
var w io.Writer

func ServAddr() string {
	return Config.ServAddr
}

func TmpPath() string {
	return Config.TmpPath
}

func TmpRemove() bool {
	return Config.TmpRemove
}

func FdfsConf() string {
	return Config.FdfsConf
}

func FdfsDownloadAddr() string {
	return Config.FdfsDownloadAddr
}

func Print() {
	buf, _ := json.Marshal(Config)
	log.Println(string(buf))
}

// init logger
func init() {
	filePath, _ := exec.LookPath(os.Args[0])
	binname := filepath.Base(filePath)

	var err error
	w, err = syslog.New(syslog.LOG_LOCAL0|syslog.LOG_INFO, binname)
	if err != nil {
		log.Fatalln("new syslog failed")
		return
	}

	//
	//log.SetOutput(w)
	log.SetOutput(io.MultiWriter(os.Stdout, w))

	log.SetFlags(log.Lshortfile)
	log.SetPrefix("")

}

// init config
func init() {
	fi, err := os.Open("conf/main.conf")
	if err != nil {
		log.Fatalln("non exist conf/main.conf")
		return
	}
	defer fi.Close()

	dec := json.NewDecoder(fi)
	if err := dec.Decode(&Config); err != nil {
		log.Fatalln("decode json failed")
		return
	}

}
