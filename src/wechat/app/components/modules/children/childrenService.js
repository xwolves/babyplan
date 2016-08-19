(function() {
  'use strict';

  angular.module('childrenService', [])
    .factory('childrenService', childrenService);

  function childrenService( $q, $http) {
    'ngInject';
    var service = {
      getMsg:getMsg
    };

    //字段名	类型	备注
    //InfoID 	int64 	信息编号，自增即可
    //PublisherID 	int64 	发布老师的账号
    //DepositID 	int64 	托管机构账号
    //Longitude 	float 	信息发布的位置经度
    //Latitude 	float 	信息发布的位置纬度
    //ClickCount 	int64 	总浏览次数
    //InfoType 	int32 	信息类型（1：就餐；2：培训；3：活动；4：作业）
    //Description 	varchar2 	老师的描述，不超出1000字
    //PhotoLink1 	varchar2 	照片/视频1的信息
    //PhotoLink2 	varchar2 	照片/视频2的信息
    //PhotoLink3 	varchar2 	照片/视频3的信息
    //PhotoLink4 	varchar2 	照片/视频4的信息
    //PhotoLink5 	varchar2 	照片/视频5的信息
    //PhotoLink6 	varchar2 	照片/视频6的信息
    //Status	int	1:正常发布，2:撤回,
    //CreateTime 	datetime 	创建时间
    function getMsg() {
      return [{
        InfoType:1,
        Description:'这首歌写的是你!',
        PhotoLink1:'',
        PhotoLink2:'',
        Status:'1',
        CreateTime:'2016-08-06'
      }];
    };

    return service;


  }

}());
