(function() {
  'use strict';

  angular.module('organizerService', [])
    .factory('organizerService', organizerService);

  function organizerService($q, $http,Constants,ResultHandler) {
      'ngInject';
      var service = {
        queryOrganizer:queryOrganizer,
        queryDepositInfo:queryDepositInfo,
        updateOrganizer:updateOrganizer
      };


      //GET /api/v1/account/query/deposit/{deposit_accnt_id}
      //return
      //{
      //  "errno":0,
      //  "error":"",
      //  "data":{
      //    "uid":10000001,
      //     …………
      //  }
      //}
      function queryOrganizer(id) {
        var url = Constants.serverUrl + 'account/query/deposit/'+id;
        return $http.get(url).then(ResultHandler.successedFuc, ResultHandler.failedFuc);
      };


      //post /api/v1/account/deposit/{deposit_accnt_id}/update
      //  {
      //    "orgname": "机构名称",
      //    "contactphone": "13812345678",
      //    "password":"abcd",
      //    "weixinno":"微信号",
      //    "address":"托管机构地址",
      //    "contactname":"托管机构联系人（管理者）",
      //    "remark":"托管机构信息描述"
      //  };
      //return
      //{
      //  "errno":0,
      //    "error":"",
      //    "data":{
      //      "uid":11000001
      //    }
      //}
      function updateOrganizer(id,data) {
          var url = Constants.serverUrl + 'account/deposit/'+id+'/update';
          return $http({
            method: 'post',
            url: url,
            data: data
          }).then(function (response) {
            return response.data;
          }, function (error) {
            return $q.reject(error);
          });
      };

      function queryDepositInfo(id) {
          //http://172.18.1.166/api/v1/depositInfo/fetch/:depositid
          var url = Constants.serverUrl + 'depositInfo/fetch/'+id;
          return $http.get(url).then(ResultHandler.successedFuc, ResultHandler.failedFuc);
      };

      return service;


  }

}());
