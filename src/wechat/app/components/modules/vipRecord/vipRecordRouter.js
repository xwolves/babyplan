(function() {
  'use strict';

  angular.module('vipRecordRouter', [])
    .config(myRouter);


  function myRouter($stateProvider, $urlRouterProvider) {
    'ngInject';
    $stateProvider
        .state('vipRecord', {
          url: "/vipRecord",
          templateUrl: 'vipRecord/vipRecord.html',
          controller: 'vipRecordCtrl',
          controllerAs: 'vm'
        })
  }
}());
