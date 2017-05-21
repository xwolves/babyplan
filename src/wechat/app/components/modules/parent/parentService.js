(function() {
  'use strict';

  angular.module('parentService', [])
    .factory('parentService', parentService);

  function parentService( $q, $http, Constants, ResultHandler) {
    'ngInject';
    var service = {
      queryParent:queryParent,
      updateParent:updateParent,
      queryChildren:queryChildren
    };

    //-----HTTP Header => Authorization: Bearer-{$token}-----//

    //GET /api/v1/account/query/parent/{parent_accnt_id}
    //return
    //{
    //  "errno":0,
    //  "error":"",
    //  "data":{
    //  "uid":10000001,
    //      "name":"张粑粑",
    //      "sex":1,
    //      "mobile":"18612345678",
    //      "nick":"sam"
    //  }
    //}
    function queryParent(id) {
      console.log($http.defaults.headers);
      var url = Constants.serverUrl + 'account/query/parent/'+id;
      return $http.get(url).then(ResultHandler.successedFuc, ResultHandler.failedFuc);
    };

    function updateParent(parent) {
      var url = Constants.serverUrl + 'account/parent/update/'+parent.AccountID;
      return $http({
        method: 'post',
        url: url,
        data: data
      }).then(ResultHandler.successedFuc, ResultHandler.failedFuc);
      };



    //GET /api/v1/account/query/parentChildren/{parent_accnt_id}
    //return
    //{
    //  "errno":0,
    //  "error":"",
    //  "data":[
    //    {
    //      "uid":10000001,
    //      "relationship":1,
    //      "name":"赵大萌",
    //      "sex":1,
    //      "fingerfeature":"xxxxx",
    //      "remark":"xxxx"
    //    },
    //    ...
    //  ]
    //}
    function queryChildren(id) {
      var url = Constants.serverUrl + 'account/query/parentChildren/'+id;
      return $http.get(url).then(ResultHandler.successedFuc, ResultHandler.failedFuc);
    };

    return service;

  };
}());
