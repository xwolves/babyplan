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

        function login(userId, password, type) {
          if(!type)type=3;
            var data = {
                username: userId,
                password: password,
                type: type
            };
            var url = Constants.serverUrl + 'teacherLogin';
            console.log(url);
            return $http({
                method: 'post',
                url: url,
                data: data
            }).then(ResultHandler.successedFuc, ResultHandler.failedFuc);
        }

        return service;


    }

}());
