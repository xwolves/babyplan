package config

import (
	"encoding/json"
	"log"
	"os"
)

type Config struct {
	ServAddr string   `json:"serv_addr"`
	DbConfig DbConfig `json:"db_config"`
}

type DbConfig struct {
	DnsDbHost string `json:"db_host"`
	DnsDbPort int    `json:"db_port"`
	DnsDbUser string `json:"db_user"`
	DnsDbPass string `json:"db_pass"`
	DnsDbName string `json:"db_name"`
}

var g_config Config

func init() {
	log.SetFlags(log.Lshortfile | log.LstdFlags | log.Lmicroseconds)
	cfgfilename := "conf.json"
	if len(os.Args) >= 3 {
		if os.Args[1] == "-c" {
			cfgfilename = os.Args[2]
		}
	}

	fi, err := os.Open(cfgfilename)
	if err != nil {
		log.Fatal("open config file: %s fail. %v", cfgfilename, err)
		return
	}
	defer fi.Close()

	dec := json.NewDecoder(fi)
	if err := dec.Decode(&g_config); err != nil {
		log.Fatal("load config file: %s fail. %v", cfgfilename, err)
		return
	}
	buf, _ := json.MarshalIndent(&g_config, "", "  ")
	log.Printf("load config file: %s ok. data = \n%v\n", cfgfilename, string(buf))
}

func GetDbConfig() DbConfig {
	return g_config.DbConfig
}

func GetServAddr() string {
	return g_config.ServAddr
}
