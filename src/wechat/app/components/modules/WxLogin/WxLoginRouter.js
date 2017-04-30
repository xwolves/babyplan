(function() {
  'use strict';

  angular.module('WxLoginRouter', [])
    .config(wxLoginRouter);


  function wxLoginRouter($stateProvider,$urlRouterProvider) {
    'ngInject';
    $stateProvider
    .state('wxlogin', {
      url: "/wxlogin?:user&:type",
      params:{
        user:null,
        type:0
      },
      templateUrl: 'WxLogin/wxlogin.html',
      controller: 'WxLoginCtrl',
      controllerAs: 'vm'
    });
    // $urlRouterProvider.when('', '/wxlogin');
    //$urlRouterProvider.otherwise('/wxlogin');
    $urlRouterProvider.otherwise(function($injector, $location) {
          //console.log("Could not find " + $location);
          $location.path('/wxlogin');
    });

  }
}());
