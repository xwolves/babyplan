(function() {
  'use strict';

  angular.module('SettingsRouter', [])
    .config(SettingsRouter);

  function SettingsRouter($stateProvider, Constants, $urlRouterProvider) {
    'ngInject';
    $stateProvider
    .state('settings', {
      url: "/settings",
      templateUrl: 'Settings/settings.html',
      controller: 'SettingsCtrl',
      controllerAs: 'vm',
      allowAnonymous: false,
      authorizedRoles: [Constants.USER_ROLES.receiver,Constants.USER_ROLES.admin]
    });

  }
}());
