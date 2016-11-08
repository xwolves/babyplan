(function() {
  'use strict';

  angular.module('DeviceStatusListRouter', [])
    .config(DocumentRouter);

  function DocumentRouter($stateProvider, Constants, $urlRouterProvider) {
    'ngInject';
    $stateProvider
    .state('portal.deviceStatusList', {
      url: "/deviceStatusList",
      templateUrl: 'DeviceStatusList/deviceStatusList.html',
      params:{"accountID":null},
      controller: 'DeviceStatusListCtrl',
      controllerAs: 'vm',
      allowAnonymous: false,
      authorizedRoles: [Constants.USER_ROLES.normal,Constants.USER_ROLES.teacher,Constants.USER_ROLES.admin]
    });

  }
}());
