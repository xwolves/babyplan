(function() {
  'use strict';

  angular.module('exitRouter', [])
    .config(myRouter);


  function myRouter($stateProvider, $urlRouterProvider) {
    'ngInject';
    $stateProvider
        .state('exit', {
          url: "/exit",
          templateUrl: 'exit/exit.html',
          controller: 'exitCtrl',
          controllerAs: 'vm'
        })
  }
}());
