(function() {
  'use strict';

  angular.module('LogoutRouter', [])
    .config(LogoutRouter);

  function LogoutRouter($stateProvider, Constants, $urlRouterProvider) {
    'ngInject';
    $stateProvider
    .state('logout', {
      url: "/logout",
      templateUrl: 'Logout/logout.html',
      controller: 'LogoutCtrl',
      controllerAs: 'vm',
      allowAnonymous: true,
      authorizedRoles: [Constants.USER_ROLES.all]
    });

  }
}());
