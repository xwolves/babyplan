(function() {
  'use strict';

  angular.module('organizerService', [])
    .factory('organizerService', organizerService);

  function organizerService( $q, $http,Constants,ResultHandler) {
    'ngInject';
    var service = {
      queryOrganizer:queryOrganizer
    };


    //GET /api/v1/account/query/deposit/{deposit_accnt_id}
    //return
    //{
    //  "errno":0,
    //  "error":"",
    //  "data":{
    //    "uid":10000001,
    //     …………
    //  }
    //}
    function queryOrganizer(id) {
      var url = Constants.serverUrl + 'account/query/deposit/'+id;
      return $http.get(url).then(ResultHandler.successedFuc, ResultHandler.failedFuc);
    };


    return service;


  }

}());
