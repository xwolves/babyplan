(function() {
  'use strict';

  angular.module('childrenSettingService', [])
    .factory('childrenSettingService', childrenSettingService);

  function childrenSettingService( $q, $http, Constants, ResultHandler) {
    'ngInject';
    var service = {
      registerChildren:registerChildren
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
    function registerChildren(child,parentId) {
      var data = {
        "p_uid":parentId,
        "name": child.name,
        "sex": child.sex,
        "relationship": child.relationship,
        "remark": child.remark
      };
      console.log(data);
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
