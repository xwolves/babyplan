(function() {
  'use strict';

  angular.module('teacherService', [])
    .factory('teacherService', teacherService);

  function teacherService( $q, $http, Constants, ResultHandler) {
    'ngInject';
    var service = {
      createTeacher:createTeacher,
      updateTeacher:updateTeacher,
      queryTeacher:queryTeacher,
      queryTeacherDeposit:queryTeacherDeposit
    };


    //POST /api/v1/account/teacher/{$teacher_accnt_id}/update //老师账号信息更新，完善
    //Request Body: { "name":"小强", "sex":1, "mobile":"13300001111", "teachage":5, "age":29, "photolink":"照片url", "password":"123456" }
    //Response Body: { "errno":0, "error":"", "data":{ "uid":30000001 } }
    function updateTeacher(teacher, teacherId) {
      var data = {};
      if(teacher.name!=null)data.name=teacher.name;
      if(teacher.sex!=null)data.sex=teacher.sex;
      if(teacher.mobile!=null)data.mobile=teacher.mobile;
      if(teacher.teachage!=null)data.teachage=teacher.teachage;
      if(teacher.age!=null)data.age=teacher.age;
      if(teacher.url!=null)data.photolink=teacher.url;
      if(teacher.password!=null)data.password=teacher.password;
      if(teacher.remark!=null)data.remark=teacher.remark;

      var url = Constants.serverUrl + "account/teacher/"+teacherId+"/update";
      return $http({
        method: 'post',
        url: url,
        data: data
      }).then(ResultHandler.successedFuc, ResultHandler.failedFuc);
    }

    //POST /api/v1/deposit/{$deposit_accnt_id}/addteacher
    //Request Body: { "mobile":"13300001111" }
    //Response Body: { "errno":0, "error":"", "data":{ "teacheruid":30000001, "passwd":"123456" } }
    function createTeacher(teacher, orgId) {
      var data = {
        "name":teacher.name,
        "sex":teacher.sex,
        "mobile":teacher.mobile,
        "teachage":teacher.teachage,
        "age":teacher.age
      };
      var url = Constants.serverUrl + "deposit/"+orgId+"/addteacher";
      return $http({
        method: 'post',
        url: url,
        data: data
      }).then(ResultHandler.successedFuc, ResultHandler.failedFuc);
    };

    //GET /api/v1/account/query/depositTeacher/{deposit_accnt_id}
    //return
    //{
    //  "errno":0,
    //  "error":"",
    //  "data":[
    //    {
    //      "uid":10000001,
    //      "name":"赵大萌",
    //      "sex":1,
    //      "mobile":"15032145678",
    //      "teachage":10,
    //      "age":32,
    //      "photolink":"xxxxx"
    //      "remark":"xxxx"
    //    },
    //    ……
    //  ]
    //}
    function queryTeacher(id) {
      var url = Constants.serverUrl + 'account/query/depositTeacher/'+id;
      return $http.get(url).then(ResultHandler.successedFuc, ResultHandler.failedFuc);
    };


    function queryTeacherDeposit(id) {
      var url = Constants.serverUrl + 'deposit/teacher/'+id;
      return $http.get(url).then(ResultHandler.successedFuc, ResultHandler.failedFuc);
    };

    return service;


  }

}());
