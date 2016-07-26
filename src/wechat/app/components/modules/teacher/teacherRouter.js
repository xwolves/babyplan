(function() {
  'use strict';

  angular.module('teacherRouter', [])
    .config(myRouter);


  function myRouter($stateProvider, $urlRouterProvider) {
    'ngInject';
    $stateProvider
      .state('teacher', {
        url: "/teacher",
        templateUrl: 'teacher/teacher.html',
        controller: 'teacherCtrl',
        controllerAs: 'vm'
      })
      .state('teacherEdit', {
        url: "/teacherEdit?:cid&:type",
        params: {
          cid : null,
          type : '0'
        },
        templateUrl: 'teacher/teacherEdit.html',
        controller: 'teacherEditCtrl',
        controllerAs: 'vm'
      })
    ;
  }
}());
