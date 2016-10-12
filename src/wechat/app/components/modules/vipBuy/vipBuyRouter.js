(function() {
  'use strict';

  angular.module('vipBuyRouter', [])
    .config(myRouter);


  function myRouter($stateProvider, $urlRouterProvider) {
    'ngInject';
    $stateProvider
        .state('vipBuy', {
          url: "/vipBuy",
          templateUrl: 'vipBuy/vipBuy.html',
          controller: 'vipBuyCtrl',
          controllerAs: 'vm'
        })
  }
}());
