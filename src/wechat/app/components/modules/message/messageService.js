(function() {
  'use strict';

  angular.module('messageService', [])
    .factory('messageService', messageService);

  function messageService( $q, $http) {
    'ngInject';
    var service = {
    };
    return service;


  }

}());
