(function() {
  'use strict';

  angular.module('PortalRouter', [])
    .config(MySignRouter);

  function MySignRouter($stateProvider, Constants, $urlRouterProvider) {
    'ngInject';
    $stateProvider
    .state('portal', {
      url: "/portal",
      templateUrl: 'Portal/portal.html',
      controller: 'PortalCtrl',
      controllerAs: 'vm',
      allowAnonymous: false,
      authorizedRoles: [Constants.USER_ROLES.normal,Constants.USER_ROLES.teacher]
    });

  }
}());
