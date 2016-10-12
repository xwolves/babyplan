(function() {
  'use strict';

  angular.module('commentService', [])
    .factory('commentService', commentService);

  function commentService($q, $http, Constants, ResultHandler) {
    'ngInject';
    var service = {
        queryDepositComment:queryDepositComment
    };

    //http://172.18.1.166/api/v1/comment/deposit/fetch/:depositid
    function queryDepositComment(Id) {
        var url = Constants.serverUrl + 'comment/deposit/fetch/'+id;
        return $http.get(url).then(ResultHandler.successedFuc, ResultHandler.failedFuc);
    };

    return service;
  }

}());
