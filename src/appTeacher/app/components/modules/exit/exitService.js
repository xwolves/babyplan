(function() {
  'use strict';

  angular.module('exitService', [])
    .factory('exitService', eService);

  function eService( $q, $http,Constants,ResultHandler) {
    'ngInject';
    var service = {
      exit:exit
    };

    function exit(id) {
        var url;
        if(id.substring(0,1)=='3'){
          url = Constants.serverUrl + 'exitTeacher/'+id;
        }else if(id.substring(0,1)=='1'){
          url = Constants.serverUrl + 'exitDeposit/'+id;
        }else{
          return $q.reject('不支持此业务');
        }
        return $http.get(url).then(ResultHandler.successedFuc, ResultHandler.failedFuc);
    };

    return service;


  }

}());
