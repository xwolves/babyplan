(function() {
  'use strict';

  angular.module('registerRouter', [])
    .config(myRouter);


  function myRouter($stateProvider, $urlRouterProvider) {
    'ngInject';
    $stateProvider
      .state('register', {
        url: "/register",
        templateUrl: 'register/register.html',
        controller: 'registerCtrl',
        controllerAs: 'vm'
      });
  }
}());
