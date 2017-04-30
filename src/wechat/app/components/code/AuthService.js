(function() {
  "use strict";
  angular.module('AuthService', []).factory('AuthService', function(Session,Path,Role) {
    'ngInject';

    var authService = {
      getLoginID: getLoginID,
      getLoginToken: getLoginToken,
      getUserRole: getUserRole,
      getNextPath: getNextPath,
      getWechatId:getWechatId,
      setSession: setSession
    };

    function getLoginID() {
      return Session.getData('userId');
    };

    function getLoginToken() {
      return Session.getData('token');
    };

    function getUserRole() {
      return Session.getData('userRole');
    };
    function getWechatId(){
      return Session.getData('wechat');
    }

    function setSession(id,token,eshop,role,wechat){
      Session.create(token,eshop,id,role,wechat);
    };

    function getNextPath() {
      if(Session.getData('userRole')==Role.Organizer){
        return Path.OrganizerRolePath;
      }else if(Session.getData('userRole')==Role.Parent){
        return Path.ParentRolePath;
      }else if(Session.getData('userRole')==Role.Teacher){
        return Path.TeacherRolePath;
      }else if(Session.getData('userRole')==Role.visitor){
        return Path.VisitorRolePath;
      }
    };

    return authService;
  });

}());
