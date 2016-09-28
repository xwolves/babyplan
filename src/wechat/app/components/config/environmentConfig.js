(function() {
    "use strict";
    angular.module('environmentConfig', [])
        .constant('Constants', {
            'appTitle':'托管系统',
            'serverUrl': '/api/v1/',
            'dfsUrl': '/',
            'buildID': '20160923v1',
            'ENVIRONMENT':'release'
        });
}());
//'serverUrl': 'http://120.76.226.47/api/v2/',
//    'dfsUrl': 'http://120.76.226.47/',
