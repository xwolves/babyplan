(function() {
  'use strict';

  angular.module('ChildrenListRouter', [])
    .config(DocumentRouter);

  function DocumentRouter($stateProvider, Constants, $urlRouterProvider) {
    'ngInject';
    $stateProvider
    .state('portal.childrenList', {
      url: "/childrenList",
      templateUrl: 'ChildrenList/childrenList.html',
      params:{"accountID":null},
      controller: 'ChildrenListCtrl',
      controllerAs: 'vm',
      allowAnonymous: false,
      authorizedRoles: [Constants.USER_ROLES.normal,Constants.USER_ROLES.teacher,Constants.USER_ROLES.admin]
    });

  }
}());
