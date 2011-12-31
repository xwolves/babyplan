(function() {
  'use strict';

  angular.module('RegisterDePositRouter', [])
    .config(RegisterDePositRouter);

  function RegisterDePositRouter($stateProvider, Constants, $urlRouterProvider) {
    'ngInject';
    $stateProvider
    .state('portal.registerDePosit', {
      url: "/registerDePosit",
      templateUrl: 'RegisterDePosit/registerDePosit.html',
      params:{"accountID":null},
      controller: 'RegisterDePositCtrl',
      controllerAs: 'vm',
      allowAnonymous: false,
      authorizedRoles: [Constants.USER_ROLES.normal,Constants.USER_ROLES.teacher,Constants.USER_ROLES.admin]
    });

  }
}());
