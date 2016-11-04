(function() {
  'use strict';

  angular.module('vipBuyService', [])
    .factory('vipBuyService', myService);

  function myService($http,Constants,ResultHandler) {
    'ngInject';

    var service = {
      getMenu:getMenu,
      getOrders:getOrders,
      checkOrder:checkOrder,
      createOrder:createOrder,
      updateOrder:updatePayedOrder
    };

    function getMenu(){
      var url = Constants.serverUrl + 'charge/fetch/menuList';
      return $http.get(url).then(ResultHandler.successedFuc, ResultHandler.failedFuc);
    };

    function getOrders(parentId) {
      var url = Constants.serverUrl + 'charge/order/fetch/'+parentId;
      return $http.get(url).then(ResultHandler.successedFuc, ResultHandler.failedFuc);
    };

    function checkOrder(orderId){
      var url = Constants.serverUrl + 'wechatPay/order/'+orderId;
      return $http.get(url).then(ResultHandler.successedFuc, ResultHandler.failedFuc);
    };

    function createOrder(parentId,wxId,goodsId){
      var data = {
        goodsId:goodsId,
        userId:parentId,
        wxId:wxId
      };
      var url = Constants.serverUrl + 'wechatPay/order';
      return $http({
        method: 'post',
        url: url,
        data: data
      }).then(ResultHandler.successedFuc, ResultHandler.failedFuc);
    };

    function updatePayedOrder(parentId,orderId,payTime){
      var data = {
        "paystatus":1,
        "paytime":payTime,
        "orderid":orderId
      };
      var url = Constants.serverUrl + 'charge/order/update/'+parentId;
      return $http({
        method: 'post',
        url: url,
        data: data
      }).then(ResultHandler.successedFuc, ResultHandler.failedFuc);
    };

    return service;
  }

}());
