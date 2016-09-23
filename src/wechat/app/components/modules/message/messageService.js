(function() {
  'use strict';

  angular.module('messageService', [])
    .factory('messageService', messageService);

  function messageService($http,Constants,ResultHandler) {
    'ngInject';
    var service = {
      getMsg:getMsg,
      newMsg:newMsg,
      postPhoto:postPhoto
    };

    function getMsg(depositid) {
      var url = Constants.serverUrl + 'deposit/allInformation/'+depositid;
      return $http.get(url).then(ResultHandler.successedFuc, ResultHandler.failedFuc);
    };

    function newMsg(data) {
      var url = Constants.serverUrl + 'deposit/publish';
      return $http({
        method: 'post',
        url: url,
        data: data
      }).then(ResultHandler.successedFuc, ResultHandler.failedFuc);
    };

    function postPhoto(data){
        var url = Constants.dfsUrl + 'upload?filename=photo'+new Date().getTime()+'.jpg';
      return $http({
        method: 'put',
        url: url,
        data: data
      }).then(ResultHandler.successedFuc, ResultHandler.failedFuc);
    };


    return service;


  }

}());
