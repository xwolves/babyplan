(function() {
  'use strict';

  angular.module('PriceListRouter', [])
    .config(DocumentRouter);

  function DocumentRouter($stateProvider, Constants, $urlRouterProvider) {
    'ngInject';
    $stateProvider
    .state('portal.priceList', {
      url: "/priceList",
      templateUrl: 'PriceList/priceList.html',
      params:{"accountID":null},
      controller: 'PriceListCtrl',
      controllerAs: 'vm',
      allowAnonymous: false,
      authorizedRoles: [Constants.USER_ROLES.normal,Constants.USER_ROLES.teacher,Constants.USER_ROLES.admin]
    });

  }
}());
