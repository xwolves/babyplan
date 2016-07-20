(function() {
  'use strict';

  angular.module('organizerRouter', [])
    .config(myRouter);


  function myRouter($stateProvider, $urlRouterProvider) {
    'ngInject';
    $stateProvider
      .state('tabs.organizer', {
        url: "/organizer",
          views: {
            'tab-orgnize': {
              templateUrl: 'organizer/organizer.html',
              controller: 'organizerCtrl',
              controllerAs: 'vm'
            }
          }
      });
  }
}());
