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
        .state('buy', {
          url: "/buy?:index",
          params:{
              index:0
          },
          templateUrl: 'vipBuy/buy.html',
          controller: 'buyCtrl',
          controllerAs: 'vm'
        });
  }
}());
