(function() {
  'use strict';

  angular.module('ChargeListRouter', [])
    .config(DocumentRouter);

  function DocumentRouter($stateProvider, Constants, $urlRouterProvider) {
    'ngInject';
    $stateProvider
    .state('portal.chargeList', {
      url: "/chargeList",
      templateUrl: 'ChargeList/chargeList.html',
      params:{"accountID":null},
      controller: 'ChargeListCtrl',
      controllerAs: 'vm',
      allowAnonymous: false,
      authorizedRoles: [Constants.USER_ROLES.normal,Constants.USER_ROLES.teacher,Constants.USER_ROLES.admin]
    });

  }
}());
