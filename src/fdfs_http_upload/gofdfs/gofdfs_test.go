package gofdfs

import (
	"fmt"
	"testing"
)

func Test_Upload_1(t *testing.T) {
	var (
		url string
		err error
	)
	if url, err = UploadFile("/etc/fdfs/client.conf", "test.txt"); err != nil { //try a unit test on function
		t.Errorf("UploadFile fail. %v", err)
	} else {
		fmt.Printf("UploadFile succ: %s\n", url)
		t.Logf("UploadFile succ: %v", url)
	}
}
