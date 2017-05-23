(function() {
    "use strict";
    angular.module('environmentConfig', [])
        .constant('Constants', {
            'appTitle':'托管之家',
            'serverUrl': 'http://wx.zxing-tech.cn/api/v1/',
            'eshopApiUrl': 'http://api.mall.zxing-tech.cn/v2/',
            'dfsUrl': 'http://wx.zxing-tech.cn/',
            'buildID': '20170520v1',
            'ENVIRONMENT':'release'
        });
}());
//'serverUrl': 'http://120.76.226.47/api/v2/',
//    'dfsUrl': 'http://120.76.226.47/',
//http://localhost:8090/
//http://wx.zxing-tech.cn
