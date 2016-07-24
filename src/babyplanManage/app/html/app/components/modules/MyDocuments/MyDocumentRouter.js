(function() {
  'use strict';

  angular.module('MyDocumentRouter', [])
    .config(MyDocumentRouter);

  function MyDocumentRouter($stateProvider, Constants, $urlRouterProvider) {
    'ngInject';
    $stateProvider
    .state('myDocument', {
      url: "/myDocument",
      templateUrl: 'MyDocuments/myDocument.html',
      controller: 'MyDocumentCtrl',
      controllerAs: 'vm',
      allowAnonymous: false,
      authorizedRoles: [Constants.USER_ROLES.normal,Constants.USER_ROLES.teacher]
    });

  }
}());
