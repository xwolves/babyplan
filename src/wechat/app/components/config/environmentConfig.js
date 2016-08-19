(function() {
    "use strict";
    angular.module('environmentConfig', [])
        .constant('Constants', {
            'serverUrl': 'http://babyplan.sam911.cn/api/v1/',
            'buildID': '20160812v1',
            'ENVIRONMENT':'dev'
        });
}());
