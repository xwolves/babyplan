(function() {
  'use strict';

  angular.module('helpRouter', [])
    .config(myRouter);


  function myRouter($stateProvider, $urlRouterProvider) {
    'ngInject';
    $stateProvider
        .state('help', {
          url: "/help",
          templateUrl: 'help/help.html',
          controller: 'helpCtrl',
          controllerAs: 'vm'
        })
        .state('helpDoc', {
          url: "/helpDoc",
          templateUrl: 'help/helpDoc.html',
          controller: 'helpDocCtrl',
          controllerAs: 'vm'
        })
  }
}());
