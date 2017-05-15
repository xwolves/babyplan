(function() {
    "use strict";
    angular.module('CacheData', []).service('CacheData', function($window) {
        'ngInject';

        var cacheData = {
            put: put,
            get: get,
            putObject: putObject,
            getObject: getObject,
            remove: remove,
            clearAll: clearAll
        };
        function put(key, value) {
            $window.localStorage[key] = value;
        };

        function get(key, defaultValue) {
            return $window.localStorage[key] || defaultValue;
        };

        function putObject(key, value) {
            $window.localStorage[key] = JSON.stringify(value);
        };

        function getObject(key) {
            return JSON.parse($window.localStorage[key] || '{}');
        };

        function remove(key) {
            $window.localStorage.removeItem(key);
        };

        function clearAll() {
            $window.localStorage.clear();
        };
        return cacheData;
    });

}());
