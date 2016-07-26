(function() {
  'use strict';

  angular.module('parentService', [])
    .factory('parentService', parentService);

  function parentService( $q, $http) {
    'ngInject';
    var service = {
    };
    return service;


  }

}());
