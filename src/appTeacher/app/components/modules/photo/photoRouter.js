(function() {
  'use strict';

  angular.module('photoRouter', [])
    .config(myRouter);


  function myRouter($stateProvider, $urlRouterProvider) {
    'ngInject';
    $stateProvider
        .state('photo', {
          url: "/photo?:index",
          params:{
            index:0
          },
          templateUrl: 'photo/photo.html',
          controller: 'photoCtrl',
          controllerAs: 'vm'
        })
      ;
  }
}());
