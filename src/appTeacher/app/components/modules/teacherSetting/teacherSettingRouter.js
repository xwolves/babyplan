(function() {
  'use strict';

  angular.module('teacherSettingRouter', [])
    .config(myRouter);


  function myRouter($stateProvider, $urlRouterProvider) {
    'ngInject';
    $stateProvider
      .state('tabs.teacherSetting', {
        url: "/teacherSetting",
          views: {
            'tab-teacherSetting': {
              templateUrl: 'teacherSetting/teacherSetting.html',
              controller: 'teacherSettingCtrl',
              controllerAs: 'vm'
            }
          }
      });
  }
}());
