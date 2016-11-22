package bindext

import (
	"fmt"
	"log"
	"net/http"
	"reflect"
	"strconv"

	"github.com/go-martini/martini"
	"github.com/martini-contrib/render"
)

type Base struct {
	IP string
}

type Response struct {
	Retcode int         `json:"retcode"`
	Retmsg  string      `json:"retmsg"`
	Content interface{} `json:"content"`
}

var okStat = []int{
	http.StatusOK,
	http.StatusBadRequest,
	http.StatusUnauthorized,
}

type FlagWrite bool

type Stat struct {
	Code  int
	Extra map[string]interface{}
}

func extra(r map[string]interface{}) string {
	s := ""
	for k, v := range r {
		s += fmt.Sprintf("{%v->%v}", k, v)
	}

	return s
}

func isOkStat(stat int) bool {
	for _, v := range okStat {
		if v == stat {
			return true
		}
	}

	return false
}

func getIP(req *http.Request) string {
	addr := req.Header.Get("X-Real-IP")
	if addr == "" {
		addr = req.Header.Get("X-Forwarded-For")
		if addr == "" {
			addr = req.RemoteAddr
		}
	}

	return addr
}

/*
	通用注入
*/
func BindBase(req *http.Request, c martini.Context) {
	val := Base{
		IP: getIP(req),
	}
	c.Map(val)

	log.Printf("BindBase: base = %+v", val)
}

func Stater(uri string) func(martini.Context) {
	return func(c martini.Context) {
		//
		//d := metrics.NewDefModelMetric(uri, "s")

		//
		stat := &Stat{Extra: map[string]interface{}{}}

		//
		c.Map(stat)
		c.Next()

		// metrics
		/*
			if config.Config.Metrics.Enable {
				d.Commit(
					fmt.Sprintf("%v", stat.Code),
					isOkStat(stat.Code),
				)
			}
		*/
	}
}

func SetFlagWrite(isWrite bool) func(martini.Context) {
	return func(c martini.Context) {
		c.Map(FlagWrite(isWrite))
	}
}

func Auth(base Base, stat *Stat, r render.Render) {
	// TODO
	//
}

func MapString(val interface{}, name string) func(martini.Context, martini.Params, *Stat, render.Render) {
	ty := reflect.TypeOf(val)

	return func(c martini.Context, params martini.Params, stat *Stat, r render.Render) {
		s, ok := params[name]
		if !ok {
			Err(fmt.Errorf("non exist path(%v)", name), stat, r)
			return
		}

		newVal := reflect.New(ty).Elem()
		newVal.SetString(s)

		val := newVal.Interface()
		c.Map(val)
	}
}

func MapInt(val interface{}, name string) func(martini.Context, martini.Params, *Stat, render.Render) {
	ty := reflect.TypeOf(val)

	return func(c martini.Context, params martini.Params, stat *Stat, r render.Render) {
		s, ok := params[name]
		if !ok {
			Err(fmt.Errorf("non exist path(%v)", name), stat, r)
			return
		}

		id, err := strconv.ParseInt(s, 10, 64)
		if err != nil {
			Err(err, stat, r)
			return
		}

		newVal := reflect.New(ty).Elem()
		newVal.SetInt(id)

		val := newVal.Interface()
		c.Map(val)
	}
}

func result(httpCode int, res interface{}, r render.Render) {
	r.JSON(httpCode, res)
}

func Res(res interface{}, stat *Stat, r render.Render) {
	stat.Code = http.StatusOK
	rsp := Response{Content: res}
	result(http.StatusOK, rsp, r)
}

func ResOK(stat *Stat, r render.Render) {
	stat.Code = http.StatusOK
	//result(http.StatusOK, bizapi.ResErr{Value: "OK"}, r)
}

func HttpErr(httpCode int, e error, stat *Stat, r render.Render) {
	stat.Code = httpCode
	if e != nil {
		rsp := Response{
			Retcode: httpCode,
			Retmsg:  e.Error(),
		}
		result(httpCode, rsp, r)
	} else {
		result(httpCode, e, r)
	}
}

func Err(e error, stat *Stat, r render.Render) {
	/*
		rsp := Response{Retcode: http.StatusBadRequest}
		if e != nil {
			rsp.Retmsg = e.Error()
		}
		switch i := e.(type) {
		case bizapi.ResErr2:
			{
				stat.Code = i.Errno
				rsp.Retcode = bizapi.ERR_BIZ
				result(bizapi.ERR_BIZ, rsp, r)
			}
		default:
			{
				stat.Code = http.StatusBadRequest
				result(http.StatusBadRequest, rsp, r)
			}
		}
	*/
}
