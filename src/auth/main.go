package main

import (
	"auth/config"
	"auth/controllers"
	"auth/controllers/bindext"
	"auth/params"
	"log"
	"os"

	"github.com/go-martini/martini"
	"github.com/martini-contrib/binding"
	"github.com/martini-contrib/render"
)

func main() {
	//
	config.Print()

	// new
	m := martini.Classic()

	// logger
	//m.Map(config.NewLogger())

	// render
	m.Use(render.Renderer())

	//
	m.Group("/api/v1", func(r martini.Router) {
		m.Group("/auth", initAuth)
	})

	log.SetOutput(os.Stdout)
	log.SetFlags(log.Lshortfile | log.Ldate | log.Ltime | log.Lmicroseconds)
	log.SetPrefix("")

	//
	log.Printf("Server start on: %v", config.Config.Listen)
	m.RunOnAddr(config.Config.Listen)

}

/*
# 登录
*/

func initAuth(r martini.Router) {
	r.Post(
		"/:uid/login",
		bindext.BindBase,
		bindext.Stater("Login"),
		binding.Bind(params.ReqLogin{}),
		bindext.MapInt(params.Uid(0), "uid"),
		controllers.LoginByUid,
	)

	r.Post(
		"/login",
		bindext.BindBase,
		bindext.Stater("Login"),
		binding.Bind(params.ReqLogin{}),
		controllers.Login,
	)

}
