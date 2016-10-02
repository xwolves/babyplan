(function() {
  'use strict';

  angular.module('depositChildrenRouter', [])
    .config(myRouter);


  function myRouter($stateProvider, $urlRouterProvider) {
    'ngInject';
    $stateProvider
      .state('tabs.depositChildren', {
        url: "/depositChildren",
        views: {
          'tab-depositChildren': {
            templateUrl: 'depositChildren/depositChildren.html',
            controller: 'teacherDepositChildrenCtrl',
            controllerAs: 'vm'
          }
        }
      })
      .state('depositChildren', {
        url: "/depositChildren",
        templateUrl: 'depositChildren/depositChildren.html',
        controller: 'depositChildrenCtrl',
        controllerAs: 'vm'
      })
    ;
  }
}());
