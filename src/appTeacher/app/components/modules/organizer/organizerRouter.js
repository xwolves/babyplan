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
      })
      .state('organizerInfo', {
        url: "/organizerInfo",
        templateUrl: 'organizer/organizerInfo.html',
        controller: 'organizerInfoCtrl',
        controllerAs: 'vm'
      })
      .state('organizerEdit', {
        url: "/organizerEdit",
        templateUrl: 'organizer/organizerEdit.html',
        controller: 'organizerEditCtrl',
        controllerAs: 'vm'
      })
    ;
  }
}());
