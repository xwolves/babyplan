(function() {
  'use strict';

  angular.module('PrintDocRouter', [])
    .config(PrintDocRouter);

  function PrintDocRouter($stateProvider, Constants, $urlRouterProvider) {
    'ngInject';
    $stateProvider
    .state('printDoc', {
      url: "/printDoc",
      templateUrl: 'PrintDoc/printDoc.html',
      controller: 'PrintDocCtrl',
      params: {
          fwbh: null
      },
      controllerAs: 'vm',
      allowAnonymous: false,
      authorizedRoles: [Constants.USER_ROLES.normal,Constants.USER_ROLES.teacher,Constants.USER_ROLES.admin]
    });

  }
}());
