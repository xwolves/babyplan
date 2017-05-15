(function() {
  'use strict';

  angular.module('tabsRouter', [])
    .config(myRouter);


  function myRouter($stateProvider, $urlRouterProvider) {
    'ngInject';
    $stateProvider
      .state('tabs', {
        url: '/tabs',
        abstract: true,
        templateUrl: 'tabs/tabs.html',
        controller: 'tabsCtrl',
        controllerAs: 'vm'
      })
  }

}());
