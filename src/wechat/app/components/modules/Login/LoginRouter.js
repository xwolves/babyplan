(function() {
  'use strict';

  angular.module('LoginRouter', [])
    .config(LoginRouter);


  function LoginRouter($stateProvider,$urlRouterProvider) {
    'ngInject';
    $stateProvider
    .state('wxlogin', {
      url: "/wxlogin?:user&:role&:token",
      params:{
        user:null,
        role:null,
        token:null
      },
      templateUrl: 'Login/wxlogin.html',
      controller: 'WXLoginCtrl',
      controllerAs: 'vm'
    });
    // $urlRouterProvider.when('', '/wxlogin');
    $urlRouterProvider.otherwise('/wxlogin');

  }
}());
