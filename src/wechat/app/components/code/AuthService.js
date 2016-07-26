(function() {
  "use strict";
  angular.module('AuthService', []).factory('AuthService', function(Session,Path,Role) {
    'ngInject';

    var authService = {
      getLoginID: getLoginID,
      getLoginToken: getLoginToken,
      getUserRole: getUserRole,
      getNextPath: getNextPath,
      setSession:setSession
    };

    function getLoginID() {
      return Session.userId;
    };

    function getLoginToken() {
      return Session.token;
    };

    function getUserRole() {
      return Session.userRole;
    };

    function setSession(id,token,role){
      Session.create(token,id,role);
    };

    function getNextPath() {
      if(Session.userRole==Role.Organizer){
        return Path.OrganizerRolePath;
      }else if(Session.userRole==Role.Parent){
        return Path.ParentRolePath;
      }else if(Session.userRole==Role.Teacher){
        return Path.TeacherRolePath;
      }
    };

    return authService;
  });

}());
