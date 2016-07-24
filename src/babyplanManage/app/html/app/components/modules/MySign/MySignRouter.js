(function() {
  'use strict';

  angular.module('MySignRouter', [])
    .config(MySignRouter);

  function MySignRouter($stateProvider, Constants, $urlRouterProvider) {
    'ngInject';
    $stateProvider
    .state('mySign', {
      url: "/mySign",
      templateUrl: 'MySign/mySign.html',
      controller: 'MySignCtrl',
      controllerAs: 'vm',
      allowAnonymous: false,
      authorizedRoles: [Constants.USER_ROLES.normal,Constants.USER_ROLES.teacher]
    });

  }
}());
