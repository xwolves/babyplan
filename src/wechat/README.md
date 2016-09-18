# babyplan_wechat
完成日期在7月31号

1). 管理端后台：顾问帐号（目前可以先固定帐号）登录，顾问创建机构帐号（托管机构和第三方机构），
    创建帐号时的资料录入（入驻），帐号列表的显示。（包括管理后台的前端页面）
2). 微信端：托管机构的登录，托管机构创建和注销老师帐号；老师端的登录和绑定；家长端的登录和绑定；家长端创建孩子帐号；
3). api接口层：微信端接口服务的支持，以及逻辑处理。需要做鉴权。



微信自定义菜单

{
    "button": [
        {
            "type": "view",
            "name": "家长入口",
            "url": "http://babyplan.sam911.cn/api/v1/redirect?type=2&businessUrl=http://babyplan.sam911.cn/wechat"
        },
        {
            "type": "view",
            "name": "老师入口",
            "url": "http://babyplan.sam911.cn/api/v1/redirect?type=1&businessUrl=http://babyplan.sam911.cn/wechat"
        }
    ]
}
