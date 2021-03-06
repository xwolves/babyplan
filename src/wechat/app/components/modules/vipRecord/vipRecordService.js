(function() {
  'use strict';

  angular.module('vipRecordService', [])
    .factory('vipRecordService', eService);

  function eService( $q, $http,Constants,ResultHandler) {
    'ngInject';
    var service = {
      exit:exit
    };

    function exit(id) {
      var url = Constants.serverUrl + 'account/exit/'+id;
      return $http.get(url).then(ResultHandler.successedFuc, ResultHandler.failedFuc);
    };

    return service;


  }

}());
