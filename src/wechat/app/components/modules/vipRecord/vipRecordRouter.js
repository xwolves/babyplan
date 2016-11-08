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
        .state('record', {
          url: "/record?:index",
          params:{
            index:0
          },
          templateUrl: 'vipRecord/record.html',
          controller: 'recordCtrl',
          controllerAs: 'vm'
        });
  }
}());
