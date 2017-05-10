(function() {
  'use strict';

  angular.module('estimateRouter', [])
    .config(myRouter);


  function myRouter($stateProvider, $urlRouterProvider) {
    'ngInject';
    $stateProvider
        .state('estimate', {
          url: "/estimate",
          templateUrl: 'estimate/estimate.html',
          controller: 'estimateCtrl',
          controllerAs: 'vm'
        })
        .state('estimateDeposit', {
          url: "/estimateDeposit",
          templateUrl: 'estimate/estimateDeposit.html',
          controller: 'estimateDepositCtrl',
          controllerAs: 'vm'
        })
  }
}());
