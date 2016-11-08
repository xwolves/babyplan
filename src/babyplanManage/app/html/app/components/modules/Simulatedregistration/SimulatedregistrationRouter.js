(function() {
  'use strict';

  angular.module('SimulatedregistrationRouter', [])
    .config(DocumentRouter);

  function DocumentRouter($stateProvider, Constants, $urlRouterProvider) {
    'ngInject';
    $stateProvider
    .state('portal.simulatedregistration', {
      url: "/simulatedregistration",
      templateUrl: 'Simulatedregistration/simulatedregistration.html',
      params:{"accountID":null},
      controller: 'SimulatedregistrationCtrl',
      controllerAs: 'vm',
      allowAnonymous: false,
      authorizedRoles: [Constants.USER_ROLES.normal,Constants.USER_ROLES.teacher,Constants.USER_ROLES.admin]
    });

  }
}());
