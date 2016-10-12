(function() {
  'use strict';

  angular.module('nearbyRouter', [])
    .config(myRouter);


  function myRouter($stateProvider, $urlRouterProvider) {
    'ngInject';
    $stateProvider
      .state('tabs.nearby', {
        url: "/nearby",
          views: {
            'tab-nearby': {
              templateUrl: 'nearby/nearbyList.html',
              controller: 'nearbyCtrl',
              controllerAs: 'vm'
            }
          }
      })
      .state('nearbyDepositInfo', {
        url: "/nearbyDepositInfo?:id",
        params: {
          id : null
        },
        templateUrl: 'nearby/nearbyDepositInfo.html',
        controller: 'nearbyDepositInfoCtrl',
        controllerAs: 'vm'
      });
  }
}());
