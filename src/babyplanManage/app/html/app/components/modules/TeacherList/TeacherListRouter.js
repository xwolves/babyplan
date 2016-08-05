(function() {
  'use strict';

  angular.module('TeacherListRouter', [])
    .config(DocumentRouter);

  function DocumentRouter($stateProvider, Constants, $urlRouterProvider) {
    'ngInject';
    $stateProvider
    .state('portal.teacherList', {
      url: "/teacherList",
      templateUrl: 'TeacherList/teacherList.html',
      params:{"accountID":null},
      controller: 'TeacherListCtrl',
      controllerAs: 'vm',
      allowAnonymous: false,
      authorizedRoles: [Constants.USER_ROLES.normal,Constants.USER_ROLES.teacher,Constants.USER_ROLES.admin]
    });

  }
}());
