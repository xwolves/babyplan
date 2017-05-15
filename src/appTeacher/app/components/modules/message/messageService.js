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

    function getMsg(depositid,offset,limit) {
      var url = Constants.serverUrl + 'deposit/allInformation/'+depositid+'?offset='+offset+'&limitcount='+limit;
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

    //function postPhoto(data){
    //  var url = Constants.serverUrl + 'upload?filename=photo'+new Date().getTime()+'.jpg';
    //  return $http({
    //    method: 'put',
    //    url: url,
    //    data: data
    //  }).then(ResultHandler.successedFuc, ResultHandler.failedFuc);
    //};
    //"Content-Type": "multipart/form-data"
   // Content-Type	multipart/form-data; boundary=----WebKitFormBoundaryVCKz6Byvi4TF2rpa
    function postPhoto(data){
      var fd = new FormData();
      fd.append('file', data);
      var url = Constants.dfsUrl + 'upload';
      console.log(fd);
      return $http({
        method: 'post',
        url: url,
        data: fd,
        headers:{
          'Content-Type':undefined
        },
        transformRequest: angular.identity
      }).then(ResultHandler.successedFuc, ResultHandler.failedFuc);
    };


    return service;


  }

}());
