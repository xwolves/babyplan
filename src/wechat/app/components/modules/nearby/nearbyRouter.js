(function() {
  'use strict';

  angular.module('nearbyRouter', [])
    .config(myRouter);


  function myRouter($stateProvider, $urlRouterProvider) {
    'ngInject';
    $stateProvider
      .state('tabs.nearby', {
        url: "/nearby",
          views: {
            'tab-nearby': {
              templateUrl: 'nearby/nearby.html',
              controller: 'nearbyCtrl',
              controllerAs: 'vm'
            }
          }
      });
  }
}());
