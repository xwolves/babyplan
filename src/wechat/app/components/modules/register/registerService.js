(function() {
  'use strict';

  angular.module('registerService', [])
    .factory('registerService', registerService);

  function registerService($http, Constants, ResultHandler) {
    'ngInject';
    var service = {
      registerTeacher:registerTeacher,
      registerParent:registerParent,
      bindTeacher:bindTeacher,
      bindOrganizer:bindOrganizer
    };

    //POST URL: /api/v1/account/register/parent
    //{
    //  "weixinno": "xxxxxx",
    //    "name": "李寻欢",
    //    "sex":1,
    //    "mobile": "13812345678",
    //    "nick":"小李飞刀",
    //    "password":"abcd"
    //}
    //return
    //{
    //  "errno":0,
    //    "error":"",
    //    "data":{
    //       "uid":21000001
    //    }
    //}
    function registerParent(user) {
      console.log(user);
      var data = {
        "weixinno": user.wechat,
        "name": user.name,
        "sex": user.gendar,
        "mobile": user.mobile,
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
    //{
    //  "name":"小强",
    //    "sex":1,
    //    "mobile":"value",
    //    "weixinno":"laoshi",
    //    "teachage":5,
    //    "age":29,
    //    "photolink":"照片url",
    //    "password":"123456"
    //}
    //return
    //{
    //  "errno":0,
    //    "error":"",
    //    "data":{
    //       "uid":30000001
    //    }
    //}
    function registerTeacher(user) {
      var data = {
        "weixinno": user.wechat,
        "name": user.name,
        "sex": user.gendar,
        "mobile": user.mobile,
        "password" : user.password
      };
      var url = Constants.serverUrl + 'account/register/teacher';
      return $http({
        method: 'post',
        url: url,
        data: data
      }).then(ResultHandler.successedFuc, ResultHandler.failedFuc);
    };

    function bindTeacher(user,wechatId) {
      var data = {
        "weixinno": wechatId,
        "account": user.account,
        "password" : user.password
      };
      var url = Constants.serverUrl + 'account/teacher/bind';
      return $http({
        method: 'post',
        url: url,
        data: data
      }).then(ResultHandler.successedFuc, ResultHandler.failedFuc);
    };

    function bindOrganizer(org,wechatId) {
      var data = {
        "weixinno": wechatId,
        "account": org.account,
        "password" : org.password
      };
      var url = Constants.serverUrl + 'account/deposit/bind';
      return $http({
        method: 'post',
        url: url,
        data: data
      }).then(ResultHandler.successedFuc, ResultHandler.failedFuc);
    };


    return service;
  }

}());
