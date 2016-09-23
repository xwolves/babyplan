(function() {
    "use strict";
    angular.module('environmentConfig', [])
        .constant('Constants', {
            'appTitle':'托管系统',
            'serverUrl': 'http://babyplan.sam911.cn/api/v1/',
            'dfsUrl': 'http://babyplan.sam911.cn/',
            'buildID': '20160923v1',
            'ENVIRONMENT':'release'
        });
}());
