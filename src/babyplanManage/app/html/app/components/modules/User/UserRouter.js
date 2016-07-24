(function() {
  'use strict';

  angular.module('UserRouter', [])
    .config(UserRouter);

  function UserRouter($stateProvider, Constants, $urlRouterProvider) {
    'ngInject';
    $stateProvider
    .state('user', {
      url: "/user",
      templateUrl: 'User/user.html',
      controller: 'UserCtrl',
      controllerAs: 'vm',
      allowAnonymous: false,
      authorizedRoles: [Constants.USER_ROLES.normal,Constants.USER_ROLES.receiver,Constants.USER_ROLES.admin]
    });

  }
}());
