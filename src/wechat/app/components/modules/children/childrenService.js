(function() {
  'use strict';

  angular.module('childrenService', [])
    .factory('childrenService', childrenService);

  function childrenService( $q, $http,Constants,ResultHandler) {
    'ngInject';
    var service = {
      getMsg:getMsg,
      getChildrenMsg:getChildrenMsg,
      getChildren:getChildren,
      getChildSignIn:getChildSignIn,
      getChildrenSignIn:getChildrenSignIn,
      getWechatInfo:getWechatInfo
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


    /*
     GET /api/v1/children/information/{$childuid}
     return
     {
     "errno":0,
     "error":"",
     "data":{
     "childuid":41000001,
     "childname":"xxx",
     "childavatarlink":"http://xxxxxxx.jpg",
     "timeline":[
     {
     "timestamp":1468051200,
     "actiontype":0,
     "actionname":"signin",
     "actiondata":{}
     },
     {
     "timestamp":146805200,
     "actiontype":1,
     "actionname":"dining",
     "actiondata":{
     "imgs":["http://xxxxxxxxxx1.jpg", "http://xxxxxxxxx2.jpg",...],
     "desc":"孩子们愉快的享受着美味"
     }
     },
     ]
     "signin":1468051200,
     "name":"yyy",
     "avatarlink":"http://yyyyyyyyyyy.jpg",
     }
     ]
     }
     */
    function getMsg(childId) {
        var url = Constants.serverUrl + 'parent/children/information/'+childId;
        return $http.get(url).then(ResultHandler.successedFuc, ResultHandler.failedFuc);
    };

    /*
     GET /api/v1/parent/childrenlist/{$parentuid}
     return
     {
     "errno":0,
     "error":"",
     "data":[
     {
     "uid":41000001,
     "name":"xxx",
     "avatarlink":"http://xxxxxxx.jpg",
     },
     {
     "uid":41000002,
     "name":"yyy",
     "avatarlink":"http://yyyyyyyyyyy.jpg",
     }
     ]
     }
     */
    function getChildren(parentId) {
        var url = Constants.serverUrl + 'parent/childrenList/'+parentId;
        return $http.get(url).then(ResultHandler.successedFuc, ResultHandler.failedFuc);
    };

    function getChildSignIn(childId) {
        var url = Constants.serverUrl + 'parent/children/signin/'+childId;
        return $http.get(url).then(ResultHandler.successedFuc, ResultHandler.failedFuc);
    };

    function getChildrenMsg(parentId) {
        var url = Constants.serverUrl + 'parent/children/allInformation/'+parentId;
        return $http.get(url).then(ResultHandler.successedFuc, ResultHandler.failedFuc);
    };

    function getChildrenSignIn(parentId) {
        var url = Constants.serverUrl + 'parent/children/allSignin/'+parentId;
        return $http.get(url).then(ResultHandler.successedFuc, ResultHandler.failedFuc);
    };

    function getWechatInfo(wid) {
        var url = Constants.serverUrl + 'wechat/'+wid;
        return $http.get(url).then(ResultHandler.successedFuc, ResultHandler.failedFuc);
    };

    return service;


  }


}());
