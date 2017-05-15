(function() {
  'use strict';

  angular.module('settingsRouter', [])
    .config(myRouter);


  function myRouter($stateProvider, $urlRouterProvider) {
    'ngInject';
    $stateProvider
        .state('tabs.settings', {
          url: "/settings",
            views: {
              'tab-profile': {
                templateUrl: 'settings/settings.html',
                controller: 'settingsCtrl',
                controllerAs: 'vm'
              }
            }
        });
  }
}());
