(function() {
    "use strict";
    angular.module('Session', []).service('Session', function(Constants) {
        'ngInject';

        var session = {
            create: create,
            destroy: destroy
        };

        //session.ry={gh:"70000103",mc:"Zhang bx",bm:"xhinfo",sjhm:"15986632761"};
        session.ry={gh:"",mc:"",bm:"",sjhm:""};
        session.userRole = Constants.USER_ROLES.all;

        function create(ry) {
            session.ry = ry;
            session.userRole = Constants.USER_ROLES.normal; //USER_ROLES.normal
        }

        function destroy() {
            session.ry = null;
            session.userRole = Constants.USER_ROLES.all;
        }

        return session;
    });

}());
