(function() {
    'use strict';

    angular.module('LoginService', [])
        .factory('LoginService', LoginService);

    function LoginService($q, $http, ResultHandler, Constants) {
        'ngInject';
        var service = {
            login: login,
            logout: logout
        };

        function logout() {

        }

        function login(userId, password) {
            var data = {
                id: md5(userId),
                psw: md5(password)
            }
            var url = Constants.serverUrl + 'login';
            return $http({
                method: 'post',
                url: url,
                data: data
            }).then(ResultHandler.successedFuc, ResultHandler.failedFuc);
        }
        return service;


    }

}());
