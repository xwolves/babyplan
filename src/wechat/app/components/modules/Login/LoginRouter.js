(function() {
  'use strict';

  angular.module('LoginRouter', [])
    .config(LoginRouter);


  function LoginRouter($stateProvider,$urlRouterProvider) {
    'ngInject';
    $stateProvider
    .state('wxlogin', {
      url: "/wxlogin?:user&:type",
      params:{
        user:null,
        type:0
      },
      templateUrl: 'Login/wxlogin.html',
      controller: 'WXLoginCtrl',
      controllerAs: 'vm'
    });
    // $urlRouterProvider.when('', '/wxlogin');
    $urlRouterProvider.otherwise('/wxlogin');

  }
}());
