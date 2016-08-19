(function() {
    'use strict';

    angular.module('LoginService', [])
        .factory('LoginService', LoginService);

    function LoginService($q, $http, ResultHandler, Constants) {
        'ngInject';
        var service = {
            login: login,
            logout: logout,
            wxLogin: wxLogin
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

        //POST /api/v1/login
        //Request Body:
        //{
        //    "weixinno": "xxxxxx"
        //}
        //Response Body:
        //{
        //    "errno":0,
        //    "error":"",
        //    "data":{
        //        "token":"fdddsdsdddsssssdfff",
        //        "uid":"用户id",
        //        "type":"用户类型"   uid的第一位数
        //    }
        //}
        function wxLogin(wxId,type) {
            var data = {
                weixinno: wxId
            }
            var end="";
            if(type!=null){
                //console.log("include type "+type);
                data.type=type;
                end="?type="+type;
            }
            var url = Constants.serverUrl + 'login'+end;
            return $http({
                method: 'post',
                url: url,
                data: data
            }).then(function (response) {
                return response.data;
            }, function (error) {
                return $q.reject(error);
            });
        }


        return service;


    }

}());
