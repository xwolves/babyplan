(function() {
  'use strict';

  angular.module('depositChildrenService', [])
    .factory('depositChildrenService', depositChildrenService);

  function depositChildrenService( $q, $http, Constants, ResultHandler) {
    'ngInject';
    var service = {
      queryDepositChildren:queryDepositChildren
    };

    //'/deposit/children/:depositid',
    function queryDepositChildren(id) {
      var url = Constants.serverUrl + 'deposit/children/'+id;
      return $http.get(url).then(ResultHandler.successedFuc, ResultHandler.failedFuc);
    };

    return service;


  }

}());
