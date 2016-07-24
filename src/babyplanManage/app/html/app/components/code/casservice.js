(function() {

    'use strict';

    angular.module('CasService', []).factory('CasService', casService);
    function casService($q, $http, Env) {

        var url = Env.servletUrl;
        var service = {
            queryCasInfo:queryCasInfo,
            logoutCas:logoutCas
        };
        return service;

        function queryCasInfo(){
            return $http.get(url + "?action=login")
                .then(function (response) {
                    if (response.data.status == 0) {
                        return response.data.content;
                    } else {
                        return $q.reject(response);
                    }
                }, function (error) {
                    return $q.reject(error);
                });
        };

        function logoutCas(){
            return $http.get(url + "?action=logout")
                .then(function (response) {
                    if (response.data.status == 0) {
                        console.log("退出返回数据："+JSON.stringify(response.data));
                        return response.data;
                    } else {
                        return $q.reject(response);
                    }
                }, function (error) {
                    return $q.reject(error);
                });
        }
    }
}());
