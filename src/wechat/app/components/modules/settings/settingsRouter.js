(function() {
  'use strict';

  angular.module('settingsRouter', [])
    .config(myRouter);


  function myRouter($stateProvider, $urlRouterProvider) {
    'ngInject';
    $stateProvider
        .state('settings', {
          url: "/settings",
          templateUrl: 'settings/settings.html',
          controller: 'settingsCtrl',
          controllerAs: 'vm'
        })
        .state('about', {
          url: "/about",
          templateUrl: 'settings/about.html',
          controller: 'aboutCtrl',
          controllerAs: 'vm'
        })
        .state('changePsw', {
          url: "/changePsw",
          templateUrl: 'settings/changePsw.html',
          controller: 'changePswCtrl',
          controllerAs: 'vm'
        })
  }
}());
