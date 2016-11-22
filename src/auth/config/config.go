package config

import (
	"encoding/json"
	"io"
	"log"
	"os"
)

type config struct {
	Listen string `json:"listen"`
}

var Config config

func Print() {
	buf, _ := json.Marshal(Config)
	log.Println(string(buf))
}

var w io.Writer

/*
func NewLogger() *log.Logger {
	return log.New(initlog.W(), "", log.Lshortfile)
	//return log.New(io.MultiWriter(os.Stdout, initlog.W()), "", log.Lshortfile|log.Ldate|log.Ltime|log.Lmicroseconds)
	//return log.New(os.Stdout, "", log.Lshortfile|log.Ldate|log.Ltime|log.Lmicroseconds)
}
*/

// init config
func init() {

	log.SetOutput(os.Stdout)
	log.SetFlags(log.Lshortfile | log.Ldate | log.Ltime | log.Lmicroseconds)
	log.SetPrefix("")

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
