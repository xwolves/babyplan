(function() {
  'use strict';

  angular.module('childrenSettingService', [])
    .factory('childrenSettingService', childrenSettingService);

  function childrenSettingService( $q, $http, Constants, ResultHandler) {
    'ngInject';
    var service = {
      queryChild:queryChild,
      updateChild:updateChild,
      registerChild:registerChild
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
    // "name", "sex", "fingerfeature", "remark", "grade", "birthday", "homeaddr", "allergy", "allergyremark","favoritefood",
    //"guardian1","guardianphone1","guardianworkplace1", "guardian2", "guardianphone2", "guardianworkplace2", "schoolname", "classteacherphone",
    //    "course","opentime", "depositcardid", "deposittype", "benefit
    function registerChild(child,parentId) {
      var time=child.birthday.toISOString().slice(0, 19).replace('T', ' ');
      var data = {
        "p_uid":parentId,
        "name": child.name,
        "sex": child.sex,
        "relationship": child.relationship,
        "remark": child.remark,
        "birthday":time,
        "guardian1":child.guardian1,
        "guardianphone1":child.guardianPhone1,
        "guardianworkplace1":child.guardianWorkplace1,
        "guardian2":child.guardian2,
        "guardianphone2":child.guardianPhone2,
        "guardianworkplace2":child.guardianWorkplace2,
        "homeaddr":child.homeAddr,
        "allergyremark":child.allergyRemark,
        "allergy":child.allergy,
        "favoritefood":child.favoriteFood,
        "grade":child.grade,
        "schoolname":child.schoolName,
        "classteacherphone":child.classTeacherPhone
      };
      console.log(JSON.stringify(data));
      var url = Constants.serverUrl + 'account/register/children';
      return $http({
        method: 'post',
        url: url,
        data: data
      }).then(ResultHandler.successedFuc, ResultHandler.failedFuc);
    };

    //http://172.18.1.166/api/v1/account/children/update/40000015     POST 更新孩子信息
    function updateChild(child) {
      var data = {
        "name": child.Name,
        "sex": child.Sex,
        "remark": child.Remark!=null?child.Remark:"",
        "birthday":child.Birthday!=null?child.Birthday:"",
        "guardian1":child.Guardian1!=null?child.Guardian1:"",
        "guardianphone1":child.GuardianPhone1!=null?child.GuardianPhone1:"",
        "guardianworkplace1":child.GuardianWorkplace1!=null?child.GuardianWorkplace1:"",
        "guardian2":child.Guardian2!=null?child.Guardian2:"",
        "guardianphone2":child.GuardianPhone2!=null?child.GuardianPhone2:"",
        "guardianworkplace2":child.GuardianWorkplace2!=null?child.GuardianWorkplace2:"",
        "homeaddr":child.HomeAddr!=null?child.HomeAddr:"",
        "allergyremark":child.AllergyRemark!=null?child.AllergyRemark:"",
        "allergy":child.Allergy!=null?child.Allergy:"0",
        "favoritefood":child.FavoriteFood!=null?child.FavoriteFood:"",
        "grade":child.Grade!=null?child.Grade:"0",
        "schoolname":child.SchoolName!=null?child.SchoolName:"",
        "classteacherphone":child.ClassTeacherPhone!=null?child.ClassTeacherPhone:"",
        "course":child.Course!=null?child.Course:"",
        "opentime":child.OpenTime!=null?child.OpenTime:"",
        "depositcardid":child.DepositCardID!=null?child.DepositCardID:"",
        "deposittype":child.DepositType!=null?child.DepositType:"0",
        "benefit":child.Benefit!=null?child.Benefit:"0"
      };
      console.log(JSON.stringify(data));
      var url = Constants.serverUrl + 'account/children/update/'+child.AccountID;
      return $http({
        method: 'post',
        url: url,
        data: data
      }).then(ResultHandler.successedFuc, ResultHandler.failedFuc);
    };

    //http://172.18.1.166/api/v1/account/children/query/40000015    GET 获取孩子信息
    function queryChild(childId) {
      var url = Constants.serverUrl + 'account/children/query/'+childId;
      return $http.get(url).then(ResultHandler.successedFuc, ResultHandler.failedFuc);
    };

    return service;


  }

}());
