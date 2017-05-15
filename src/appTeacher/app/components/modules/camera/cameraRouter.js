(function() {
  'use strict';

  angular.module('cameraRouter', [])
    .config(myRouter);


  function myRouter($stateProvider, $urlRouterProvider) {
    'ngInject';
    $stateProvider
      .state('camera', {
        url: "/camera",
        templateUrl: 'camera/camera.html',
        controller: 'cameraCtrl',
        controllerAs: 'vm'
      });
  }
}());
