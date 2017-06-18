(function() {
  'use strict';

  angular.module('childrenSteamRouter', [])
    .config(myRouter);


  function myRouter($stateProvider, $urlRouterProvider) {
    'ngInject';
    $stateProvider
      .state('tabs.childrenSteam', {
          url: "/childrenSteam?:index",
          views: {
            'tab-childrenSteam': {
              templateUrl: 'childrenSteam/childrenSteam.html',
              controller: 'childrenSteamCtrl',
              controllerAs: 'vm'
            }
          }
      })
      .state('video', {
        url: "/video",
        templateUrl: 'childrenSteam/video.html',
        controller: 'videoCtrl',
        controllerAs: 'vm'
      });
  }
}());
