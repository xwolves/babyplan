(function() {
    "use strict";
    angular.module('Session', []).service('Session', function($http) {
        'ngInject';

        var session = {
            create: create,
            destroy: destroy,
            updateRoles: updateRoles
        };

        function create(token, userId, roles, wechat) {
            session.token = token;
            session.userId = userId;
            session.userRole = roles;
            session.wechat = wechat;
            if(token!=null){
                //$http.defaults.headers.common.Authorization = "Bearer-"+token;
                $http.defaults.headers.common.token = token;
            }

            //    $httpProvider.defaults.headers.common["Authorization"] = "Bearer-"+token;
            console.log(session);
        }

        function destroy() {
            session.token = null;
            session.userId = null;
            session.userRole = null;
            session.wechat = null;
        }

        function updateRoles(roles) {
            session.userRole = roles;
        };
        return session;
    });

}());
