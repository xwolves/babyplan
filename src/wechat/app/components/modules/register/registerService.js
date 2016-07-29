(function() {
  'use strict';

  angular.module('registerService', [])
    .factory('registerService', registerService);

  function registerService($http, Constants, ResultHandler) {
    'ngInject';
    var service = {
      registerTeacher:registerTeacher,
      registerParent:registerParent
    };

    //POST URL: /api/v1/account/register/parent
    function registerParent(user) {
      var data = {
        "weixinno": user.wechat,
        "name": user.name,
        "sex": user.gendar,
        "mobile": user.mobile,
        "nick" : "",
        "password" : user.password
      };
      var url = Constants.serverUrl + 'account/register/parent';
      return $http({
        method: 'post',
        url: url,
        data: data
      }).then(ResultHandler.successedFuc, ResultHandler.failedFuc);
    };

    //POST URL: /api/v1/account/register/teacher
    function registerTeacher(user) {
      var data = {
        "weixinno": user.wechat,
        "name": user.name,
        "sex": user.gendar,
        "mobile": user.mobile,
        "teachage" : 0,
        "age" : 0,
        "photolink" : "",
        "password" : user.password
      };
      var url = Constants.serverUrl + 'account/register/teacher';
      return $http({
        method: 'post',
        url: url,
        data: data
      }).then(ResultHandler.successedFuc, ResultHandler.failedFuc);
    };

    return service;
  }

}());
