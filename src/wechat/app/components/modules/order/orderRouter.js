(function() {
  'use strict';

  angular.module('orderRouter', [])
    .config(myRouter);


  function myRouter($stateProvider, $urlRouterProvider) {
    'ngInject';
    $stateProvider
      .state('tabs.order', {
        url: "/order",
          views: {
            'tab-order': {
              templateUrl: 'order/order.html',
              controller: 'orderCtrl',
              controllerAs: 'vm'
            }
          }
      })
      .state('orders', {
        url: "/orders",
        templateUrl: 'order/order.html',
        controller: 'orderCtrl',
        controllerAs: 'vm'
      })
      .state('vipOrg', {
        url: "/vipOrg",
        templateUrl: 'order/depositList.html',
        controller: 'depositListctrl',
        controllerAs: 'vm'
      })
    ;
  }
}());
