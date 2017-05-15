(function() {
    "use strict";
    angular.module('httpDevConfig', [])
        .config(function($httpProvider) {
            $httpProvider.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
            $httpProvider.defaults.headers.put["Content-Type"] = "application/x-www-form-urlencoded";
        });
}());
