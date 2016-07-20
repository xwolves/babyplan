(function() {
  'use strict';

  angular.module('nearbyService', [])
    .factory('nearbyService', myService);

  function myService( $q, $http) {
    'ngInject';
    var service = {
    };
    return service;


  }

}());
