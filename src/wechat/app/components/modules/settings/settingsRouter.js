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
  }
}());
