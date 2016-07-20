(function() {
  'use strict';

  angular.module('orgnizeRouter', [])
    .config(myRouter);


  function myRouter($stateProvider, $urlRouterProvider) {
    'ngInject';
    $stateProvider
      .state('tabs.orgnize', {
        url: "/orgnize",
          views: {
            'tab-orgnize': {
              templateUrl: 'orgnize/orgnize.html',
              controller: 'orgnizeCtrl',
              controllerAs: 'vm'
            }
          }
      });
  }
}());
