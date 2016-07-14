package main

import (
	"fdfs_http_upload/gofdfs"
	"log"
)

func main() {
	url, err := gofdfs.UploadFile("/etc/fdfs/client.conf", "../test.txt")
	if err != nil {
		log.Printf("upload fail. %v", err)
		return
	}
	log.Printf("url = %v", url)
}
