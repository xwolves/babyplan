(function() {
  'use strict';

  angular.module('vipTipsRouter', [])
    .config(myRouter);


  function myRouter($stateProvider, $urlRouterProvider) {
    'ngInject';
    $stateProvider
        .state('vipTips', {
          url: "/vipTips",
          templateUrl: 'vipTips/vipTips.html',
          controller: 'vipTipsCtrl',
          controllerAs: 'vm'
        })
  }
}());
