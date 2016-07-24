(function() {
  'use strict';

  angular.module('AboutRouter', [])
    .config(AboutRouter);

  function AboutRouter($stateProvider, Constants, $urlRouterProvider) {
    'ngInject';
    $stateProvider
    .state('about', {
      url: "/about",
      templateUrl: 'About/about.html',
      controller: 'AboutCtrl',
      controllerAs: 'vm',
      allowAnonymous: false,
      authorizedRoles: [Constants.USER_ROLES.normal,Constants.USER_ROLES.receiver,Constants.USER_ROLES.admin]
    });

  }
}());
