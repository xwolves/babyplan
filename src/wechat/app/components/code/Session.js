(function() {
    "use strict";
    angular.module('Session', []).service('Session', function() {
        'ngInject';

        var session = {
            create: create,
            destroy: destroy,
            updateRoles: updateRoles
        };

        function create(token, userId, roles) {
            session.token = token;
            session.userId = userId;
            session.userRole = roles;
        }

        function destroy() {
            session.token = null;
            session.userId = null;
            session.userRole = null;
            console.log("session destroy");
            alert("my session destroyed");
        }

        function updateRoles(roles) {
            session.userRole = roles;
        };
        return session;
    });

}());
