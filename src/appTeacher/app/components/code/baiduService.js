(function() {
  'use strict';

/**
 * 机构搜索本地服务
 */
angular.module('BaiduService',[])
  .service('BaiduService', function ($q, $http, Constants) {

      /**
       * 转换原始路径为缩略图路径
       * @param {*} imgUrl
       */
      function _convertThumbUrl(imgUrl){
        if(!imgUrl) return;
          return imgUrl.replace(/.(jpg|png|gif)/,'_400x200.$1');
      }

    /**
     * 根据经纬度获取附近机构列表
     * @param {*} longitude
     * @param {*} latitude
     */
    function _getNearbyDeposits(longitude, latitude) {
        var defer = $q.defer(),
       // apiUrl = Constants.serverUrl+ 'nearbyDepositList/113.271/23.135';
         apiUrl = Constants.serverUrl + 'nearbyDepositList/'+longitude+'/'+latitude;

        $http.get(apiUrl).success(function (data, status, headers, congfig) {
          defer.resolve(data.data);
        }).error(function (err) {
          defer.reject(err);
        });
        return defer.promise;
      }

      /**
       * 获取机构详细信息
       * @param {*} depositId
       */
      function _getDepositInfo(depositId) {
        var defer = $q.defer(),
          apiUrl = Constants.serverUrl + 'depositInfo/' + depositId;

        $http.get(apiUrl).success(function (data, status, headers, congfig) {
          defer.resolve(data.data);
        }).error(function (err) {
          defer.reject(err);
        });

        return defer.promise;
      }

      /**
       * 获取机构评论列表
       * @param {*} depositId
       */
      function _getDepositComments (depositId) {
        var defer = $q.defer(),
          apiUrl = Constants.serverUrl + 'comments/deposit?depositid=' + depositId;

        $http.get(apiUrl).success(function (data, status, headers, congfig) {
          defer.resolve(data.data);
        }).error(function (err) {
          defer.reject(err);
        });

        return defer.promise;
      }

      /**
       * 获取机构详情并带有评论信息
       * @param {*} depositId
       */
      function _getDepositInfoWithComments (depositId) {
        var defer = $q.defer();

        var getDepositDeferred = _getDepositInfo(depositId);
        var getDepositCommentsDeferred = _getDepositComments(depositId);

        $q.all([getDepositDeferred, getDepositCommentsDeferred]).then(function (results) {
            var depositInfo = results[0],
              commentsData = results[1];

            depositInfo.Score = commentsData.scores || 0;
            depositInfo.Comments = [];

            //转换所有图片为数组，以用于轮播图片源
            depositInfo.Images = [];
            depositInfo.FrontDeskLink && depositInfo.Images.push(_convertThumbUrl(depositInfo.FrontDeskLink));
            depositInfo.PublicZoneLink && depositInfo.Images.push(_convertThumbUrl(depositInfo.PublicZoneLink));
            depositInfo.KitchenLink && depositInfo.Images.push(_convertThumbUrl(depositInfo.KitchenLink));
            depositInfo.DiningRoomLink && depositInfo.Images.push(_convertThumbUrl(depositInfo.DiningRoomLink));
            depositInfo.RestRoomLink1 && depositInfo.Images.push(_convertThumbUrl(depositInfo.RestRoomLink1));
            depositInfo.RestRoomLink2 && depositInfo.Images.push(_convertThumbUrl(depositInfo.RestRoomLink2));
            depositInfo.ClassRoomLink1 && depositInfo.Images.push(_convertThumbUrl(depositInfo.ClassRoomLink1));
            depositInfo.ClassRoomLink2 && depositInfo.Images.push(_convertThumbUrl(depositInfo.ClassRoomLink2));

            for (var j = 0; j < commentsData.comments.length; j++) {
                depositInfo.Comments.push(commentsData.comments[j]);
            }

            defer.resolve(depositInfo);
        }, function (err) {
            defer.reject(err);
        });

        return defer.promise;
      }

      return {
          getNearbyDeposits: _getNearbyDeposits,
          getDepositInfo: _getDepositInfo,
          getDepositComments: _getDepositComments,
          getDepositInfoWithComments: _getDepositInfoWithComments
      };
  });

}());
