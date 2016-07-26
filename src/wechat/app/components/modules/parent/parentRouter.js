(function() {
  'use strict';

  angular.module('parentRouter', [])
    .config(myRouter);


  function myRouter($stateProvider, $urlRouterProvider) {
    'ngInject';
    $stateProvider
      .state('parent', {
        url: "/parent",
        templateUrl: 'parent/parent.html',
        controller: 'parentCtrl',
        controllerAs: 'vm'
      })
      .state('parentEdit', {
        url: "/parentEdit",
        templateUrl: 'parent/parentEdit.html',
        controller: 'parentEditCtrl',
        controllerAs: 'vm'
      })
    ;
  }
}());
