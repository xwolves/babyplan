(function() {
  'use strict';

  angular.module('DocumentRouter', [])
    .config(DocumentRouter);

  function DocumentRouter($stateProvider, Constants, $urlRouterProvider) {
    'ngInject';
    $stateProvider
    .state('document', {
      url: "/document",
      templateUrl: 'Documents/document.html',
      controller: 'DocumentCtrl',
      controllerAs: 'vm',
      allowAnonymous: false,
      authorizedRoles: [Constants.USER_ROLES.normal,Constants.USER_ROLES.teacher,Constants.USER_ROLES.admin]
    });

  }
}());
