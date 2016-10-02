(function() {
  'use strict';

  angular.module('messageRouter', [])
    .config(myRouter);

  function myRouter($stateProvider, $urlRouterProvider) {
    'ngInject';
    $stateProvider
      .state('tabs.message', {
        url: "/message",
          views: {
            'tab-message': {
              templateUrl: 'message/message.html',
              controller: 'messageCtrl',
              controllerAs: 'vm'
            }
          }
      })
      .state('newMessage', {
          url: "/newMessage",
          templateUrl: 'message/newMessage.html',
          controller: 'newMessageCtrl',
          controllerAs: 'vm'
      });
  }
}());
