(function() {
  'use strict';

  angular.module('LoginRouter', [])
    .config(LoginRouter);

  function LoginRouter($stateProvider, Constants, $urlRouterProvider) {
    'ngInject';
    $stateProvider
    .state('login', {
      url: "/login",
      templateUrl: 'Login/login.html',
      controller: 'LoginCtrl',
      controllerAs: 'vm',
      params: {
          needLogin: false
      },
      allowAnonymous: true,
      authorizedRoles: [Constants.USER_ROLES.all]
    });

    // $urlRouterProvider.when('', '/wxlogin');
    $urlRouterProvider.otherwise('/login');

  }
}());
