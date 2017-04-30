(function() {
  'use strict';

  angular.module('eshopEntryRouter', [])
    .config(myRouter);


  function myRouter($stateProvider, $urlRouterProvider) {
    'ngInject';
    $stateProvider
      .state('tabs.eshop', {
        url: "/eshop",
          views: {
            'tab-eshop': {
              templateUrl: 'eshop/eshopEntry.html',
              controller: 'eshopEntryCtrl',
              controllerAs: 'vm'
            }
          }
      });
  }
}());
