(function() {
  "use strict";
  angular.module('AuthService', []).factory('AuthService', function(Session) {
    'ngInject';

    var authService = {
      getLoginID: getLoginID,
      getLoginToken: getLoginToken,
      getUserRoles: getUserRoles
    };

    function getLoginID() {
      return Session.userId;
    };

    function getLoginToken() {
      return Session.token;
    };

    function getUserRoles() {
      return Session.userRole;
    };

    return authService;
  });

}());
