(function() {
  'use strict';

  angular.module('MapRouter', [])
    .config(MapRouter);


  function MapRouter($stateProvider,$urlRouterProvider) {
    'ngInject';
    $stateProvider
    .state('tabs.map', {
      url: "/map",
      views: {
        'tab-map': {
          templateUrl: 'map/map.html',
          controller: 'MapCtrl',
          controllerAs: 'vm'
        }
      }
    })
    .state('orgmap', {
      url: "/orgmap?:type&:nav",
      templateUrl: 'map/map.html',
      params:{
        type:0,
        nav:false
      },
      controller: 'MapCtrl',
      controllerAs: 'vm'
    });
  }
}());
