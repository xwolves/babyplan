(function() {
  'use strict';

  angular.module('childrenSettingRouter', [])
    .config(myRouter);


  function myRouter($stateProvider, $urlRouterProvider) {
    'ngInject';
    $stateProvider
      .state('childrenSetting', {
        url: "/childrenSetting",
        templateUrl: 'childrenSetting/childrenSetting.html',
        controller: 'childrenSettingCtrl',
        controllerAs: 'vm'
      })
      .state('childrenAdd', {
        url: "/childrenAdd",
        templateUrl: 'childrenSetting/childrenAdd.html',
        controller: 'childrenAddCtrl',
        controllerAs: 'vm'
      })
      .state('childrenEdit', {
        url: "/childrenEdit?:cid&:type",
        params: {
          cid : null,
          type : '0'
        },
        templateUrl: 'childrenSetting/childrenEdit.html',
        controller: 'childrenEditCtrl',
        controllerAs: 'vm'
      })
    ;
  }
}());
