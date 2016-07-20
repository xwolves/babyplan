(function() {
    "use strict";
    angular.module('environmentConfig', [])
        .constant('Constants', {
            'serverUrl': 'http://10.20.0.72/duty-Api/Api/',
            'buildID': '20160627v2',
            'ENVIRONMENT':'dev'
        });
}());
