(function() {
  'use strict';

  angular.module('nearbyRouter', [])
    .config(myRouter);


  function myRouter($stateProvider, $urlRouterProvider) {
    'ngInject';
    $stateProvider
      .state('tabs.nearbyList', {
        url: "/nearbyList",
          views: {
            'tab-nearby': {
              templateUrl: 'nearby/nearbyList.html',
              controller: 'nearbyListCtrl',
              controllerAs: 'vm'
            }
          }
      })
      .state('tabs.nearby', {
        url: "/nearby",
        views: {
          'tab-nearby': {
            templateUrl: 'nearby/nearby.html',
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
      })
      .state('depositComment', {
        url: "/depositComment?:id",
        params: {
          id : null,
          type : 0
        },
        templateUrl: 'nearby/depositComment.html',
        controller: 'depositCommentCtrl',
        controllerAs: 'vm'
      });
  }
}());
