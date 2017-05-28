(function() {
  'use strict';

  angular.module('depositChildrenService', [])
    .factory('depositChildrenService', depositChildrenService);

  function depositChildrenService( $q, $http, Constants, ResultHandler) {
    'ngInject';
    var service = {
      queryDepositChildren:queryDepositChildren,
      queryChildren:queryChildren
    };

    //'/deposit/children/:depositid',
    function queryDepositChildren(id) {
      var url = Constants.serverUrl + 'deposit/children/'+id;
      return $http.get(url).then(ResultHandler.successedFuc, ResultHandler.failedFuc);
    };

    function queryChildren(id){
      var url = Constants.serverUrl + 'account/children/query/'+id;
      return $http.get(url).then(ResultHandler.successedFuc, ResultHandler.failedFuc);
    }

    return service;


  }

}());
