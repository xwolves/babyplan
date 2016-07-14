package gofdfs

/*
#cgo LDFLAGS: -lfdfs -lfastcommon -lfdfsclient  -lpthread -ldl -L/usr/lib
#cgo CFLAGS: -I/usr/include/fastcommon -I/usr/include/fastdfs
#include "fdfs.h"
*/
import "C"

import "errors"

import "unsafe"

// 上传文件到fdfs
// conf:配置文件的文件,example:/etc/fdfs/client.conf
// imgPath:需要上传文件的完整路径,example:"/root/Desktop/logo.jpg"
func UploadFile(conf, imgPath string) (string, error) {
	c_conf := C.CString(conf)
	c_imagePath := C.CString(imgPath)
	var resData C.responseData = C.upload_file(c_conf, c_imagePath)
	defer C.free(unsafe.Pointer(c_conf))
	defer C.free(unsafe.Pointer(c_imagePath))

	if resData.result == 0 { //１表示成功，０表示失败
		return "", errors.New(C.GoString(resData.msg))
	}
	//当成功的时候，resData.msg 是返回图片的id,example:group1/M00/00/00/wKgBP1NxvSqH9qNuAAAED6CzHYE179.jpg ,当失败的时候是返回错误消息
	url := C.GoString(resData.msg)
	return url, nil
}

//删除fdfs文件
//conf:配置文件的文件,example:/etc/fdfs/client.conf
//imagePath:图片的id,example:"group1/M00/00/00/wKgBP1Nx1S7bSab8AAAED6CzHYE352.jpg"
func DeleteFile(conf string, fileId string) error {
	c_conf := C.CString(conf)
	c_fileId := C.CString(fileId)
	var resData C.responseData = C.delete_file(c_conf, c_fileId)
	defer C.free(unsafe.Pointer(c_conf))
	defer C.free(unsafe.Pointer(c_fileId))

	if resData.result == 0 { //删除文件失败,
		return errors.New(C.GoString(resData.msg))
	}
	return nil
}
