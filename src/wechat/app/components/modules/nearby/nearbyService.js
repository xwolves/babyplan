(function() {
  'use strict';

  angular.module('nearbyService', [])
    .factory('nearbyService', myService);

  function myService( $q, $http,Constants,ResultHandler) {
    'ngInject';
    var service = {
      findNearbyDeposit:findNearbyDeposit
    };

    //http://172.18.1.166/api/v1/nearbyDepositList/113.271/23.1353     附近的机构列表
    function findNearbyDeposit(x,y) {
      var url = Constants.serverUrl + 'nearbyDepositList/'+x+"/"+y;
      return $http.get(url).then(ResultHandler.successedFuc, ResultHandler.failedFuc);
    };

    return service;


  }

}());
