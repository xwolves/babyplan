(function() {
  'use strict';

  angular.module('childrenSettingService', [])
    .factory('childrenSettingService', childrenSettingService);

  function childrenSettingService( $q, $http) {
    'ngInject';
    var service = {
    };

    //POST
    //URL: /api/v1/account/register/children
    //Request Body:
    //{
    //  "name":"小强",
    //    "sex":1,
    //    "fingerfeature":"value"
    //}
    //Response Body:
    //{
    //  "errno":0,
    //    "error":"",
    //    "data":{
    //      "uid":40000001
    //    }
    //}
    //need token in headers
    function registerChildren(child) {
      var data = {
        "name": child.name,
        "sex": child.gendar,
      };
      var url = Constants.serverUrl + 'account/register/children';
      return $http({
        method: 'post',
        url: url,
        data: data
      }).then(ResultHandler.successedFuc, ResultHandler.failedFuc);
    };

    return service;


  }

}());
