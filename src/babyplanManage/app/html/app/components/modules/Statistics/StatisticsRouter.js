(function() {
  'use strict';

  angular.module('StatisticsRouter', [])
    .config(StatisticsRouter);

  function StatisticsRouter($stateProvider, Constants, $urlRouterProvider) {
    'ngInject';
    $stateProvider
    .state('statistics', {
      url: "/statistics",
      templateUrl: 'Statistics/statistics.html',
      controller: 'StatisticsCtrl',
      controllerAs: 'vm',
      allowAnonymous: false,
      authorizedRoles: [Constants.USER_ROLES.receiver,Constants.USER_ROLES.admin]
    });

  }
}());
