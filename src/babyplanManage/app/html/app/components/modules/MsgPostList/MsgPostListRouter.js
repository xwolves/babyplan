(function() {
  'use strict';

  angular.module('MsgPostListRouter', [])
    .config(DocumentRouter);

  function DocumentRouter($stateProvider, Constants, $urlRouterProvider) {
    'ngInject';
    $stateProvider
    .state('portal.msgPostList', {
      url: "/msgPostList",
      templateUrl: 'MsgPostList/msgPostList.html',
      params:{"accountID":null},
      controller: 'MsgPostListCtrl',
      controllerAs: 'vm',
      allowAnonymous: false,
      authorizedRoles: [Constants.USER_ROLES.normal,Constants.USER_ROLES.teacher,Constants.USER_ROLES.admin]
    });

  }
}());
