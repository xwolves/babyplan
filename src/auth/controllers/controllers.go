package controllers

import (
	"auth/controllers/bindext"
	"auth/params"
	"log"

	"github.com/martini-contrib/render"
)

func doLogin(base bindext.Base, uid int, req params.ReqLogin, stat *bindext.Stat, r render.Render) {
	var (
		err error
		res params.RspLogin
		id  int = uid
	)
	if id == 0 {
		id = req.Uid
	}
	log.Printf("Login[uid='%v']: receive request, req = %v", id, req)

	if err != nil {
		bindext.Err(err, stat, r)
		log.Printf("Login[uid='%v']: receive request, req = %v", id, req)
		return
	}

	bindext.Res(res, stat, r)
	log.Printf("Login[uid='%v']: login successful", id)
	return
}

func Login(base bindext.Base, req params.ReqLogin, stat *bindext.Stat, r render.Render) {
	doLogin(base, req.Uid, req, stat, r)
}

func LoginByUid(base bindext.Base, uid params.Uid, req params.ReqLogin, stat *bindext.Stat, r render.Render) {
	doLogin(base, int(uid), req, stat, r)
}
