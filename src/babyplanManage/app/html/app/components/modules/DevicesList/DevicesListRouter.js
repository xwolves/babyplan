(function() {
  'use strict';

  angular.module('DevicesListRouter', [])
    .config(DocumentRouter);

  function DocumentRouter($stateProvider, Constants, $urlRouterProvider) {
    'ngInject';
    $stateProvider
    .state('portal.devicesList', {
      url: "/devicesList",
      templateUrl: 'DevicesList/devicesList.html',
      params:{"accountID":null},
      controller: 'DevicesListCtrl',
      controllerAs: 'vm',
      allowAnonymous: false,
      authorizedRoles: [Constants.USER_ROLES.normal,Constants.USER_ROLES.teacher,Constants.USER_ROLES.admin]
    });

  }
}());
