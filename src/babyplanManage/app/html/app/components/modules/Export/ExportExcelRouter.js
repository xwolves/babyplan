(function() {
  'use strict';

  angular.module('ExportExcelRouter', [])
    .config(LoginRouter);

  function LoginRouter($stateProvider, Constants, $urlRouterProvider) {
    'ngInject';
    $stateProvider
    .state('export', {
      url: "/export",
      templateUrl: 'Export/exportExcel.html',
      controller: 'ExportExcelCtrl',
      controllerAs: 'vm',
      allowAnonymous: false,
      authorizedRoles: [Constants.USER_ROLES.receiver,Constants.USER_ROLES.admin]
    });

  }
}());
