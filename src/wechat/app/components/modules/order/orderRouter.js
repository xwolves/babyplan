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
      });
  }
}());
