(function() {
  'use strict';

  angular.module('CreateDocRouter', [])
    .config(CreateDocRouter);

  function CreateDocRouter($stateProvider, Constants, $urlRouterProvider) {
    'ngInject';
    $stateProvider
    .state('createDoc', {
      url: "/createDoc",
      templateUrl: 'CreateDoc/createDoc.html',
      controller: 'CreateDocCtrl',
      controllerAs: 'vm',
      allowAnonymous: false,
      authorizedRoles: [Constants.USER_ROLES.normal,Constants.USER_ROLES.teacher,Constants.USER_ROLES.admin]
    });

  }
}());
