(function() {
    "use strict";
    angular.module('environmentConfig', [])
        .constant('Constants', {
            'serverUrl': '/api/v1/',
            'buildID': '20160725v1',
            'ENVIRONMENT':'dev'
        });
}());
