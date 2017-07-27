(function() {
  'use strict';

  angular.module('registerRouter', [])
    .config(myRouter);


  function myRouter($stateProvider, $urlRouterProvider) {
    'ngInject';
    $stateProvider
      .state('register', {
        url: "/register?type",
        params:{
          type:1
        },
        templateUrl: 'register/register.html',
        controller: 'registerCtrl',
        controllerAs: 'vm'
      })
      .state('tabs.register', {
          url: "/register?:index",
          views: {
            'tab-register': {
              templateUrl: 'register/register.html',
              controller: 'registerCtrl',
              controllerAs: 'vm'
            }
          }
      });
  }
}());
