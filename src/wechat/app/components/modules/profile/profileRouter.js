(function() {
  'use strict';

  angular.module('profileRouter', [])
    .config(myRouter);


  function myRouter($stateProvider, $urlRouterProvider) {
    'ngInject';
    $stateProvider
      .state('tabs.profile', {
        url: "/profile",
          views: {
            'tab-profile': {
              templateUrl: 'profile/profile.html',
              controller: 'profileCtrl',
              controllerAs: 'vm'
            }
          }
      });
  }
}());
