(function() {
    "use strict";
    angular.module('Session', []).service('Session', function ($http, $window, JPushService,Constants,ResultHandler) {
        'ngInject';

        var session = {
            create: create,
            destroy: destroy,
            updateRoles: updateRoles,
            setData:setData,
            getData:getData,
            rmData:rmData,
            checkToken:checkToken
        };

        function create(token, eshop, userId, roles, wechat) {
            $window.localStorage.setItem("token", token);
            $window.localStorage.setItem("eshop_auth", JSON.stringify(eshop));
            $window.localStorage.setItem("userId", userId);
            $window.localStorage.setItem("userRole", roles);
            $window.localStorage.setItem("wechat", wechat);

            if(token!=null){
                //$http.defaults.headers.common.Authorization = "Bearer-"+token;
                $http.defaults.headers.common.token = token;
            }

            //�����û�ID��Ϊ֪ͨ����
            JPushService.setAlias(userId);

            //    $httpProvider.defaults.headers.common["Authorization"] = "Bearer-"+token;
            console.log(session);
        }

        function destroy() {
            $window.localStorage.removeItem("eshop_auth");
            $window.localStorage.removeItem("token");
            $window.localStorage.removeItem("userId");
            $window.localStorage.removeItem("userRole");
            $window.localStorage.removeItem("wechat");

        }

        function updateRoles(roles) {
            $window.localStorage.setItem("userRole", roles);
        };

        function setData(name,data) {
            $window.localStorage.setItem(name, data);
        }

        function getData(name) {
            return $window.localStorage.getItem(name);
        }

        function rmData(name) {
            $window.localStorage.removeItem(name);
        }

        function checkToken() {
            var url = Constants.serverUrl + 'checkToken';
            return $http.get(url).then(ResultHandler.successedFuc, ResultHandler.failedFuc);
        };

        return session;
    });

}());
