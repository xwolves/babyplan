(function() {
  'use strict';

  angular.module('LoginRouter', [])
    .config(LoginRouter);


  function LoginRouter($stateProvider,$urlRouterProvider) {
    'ngInject';
    $stateProvider
    .state('login', {
      url: "/login",
      templateUrl: 'Login/login.html',
      controller: 'LoginCtrl',
      controllerAs: 'vm'
    });
  }
}());
