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
    });
  }
}());
