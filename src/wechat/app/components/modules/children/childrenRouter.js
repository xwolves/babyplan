(function() {
  'use strict';

  angular.module('childrenRouter', [])
    .config(myRouter);


  function myRouter($stateProvider, $urlRouterProvider) {
    'ngInject';
    $stateProvider
      .state('tabs.children', {
        url: "/children",
          views: {
            'tab-children': {
              templateUrl: 'children/children.html',
              controller: 'childrenCtrl',
              controllerAs: 'vm'
            }
          }
      });
  }
}());
