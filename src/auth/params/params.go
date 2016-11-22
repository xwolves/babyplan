package params

type Uid int

type ReqLogin struct {
	WeiXinOpenId string `json:"weixin_openid"`
	Mobile       string `json:"mobile"`
	Uid          int    `json:"uid"`
	Passwd       string `json:"passwd"`
}

type RspLogin struct {
}
