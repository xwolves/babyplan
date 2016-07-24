(function() {
  "use strict";
  angular.module('constant', [])
  .constant("Constants",{
      'LoginStatePath':'login',
      //'LoginStatePath':'document',
      'PortalStatePath':'document',
      'NormalStatePath':'myDocument',
      'AUTH_EVENTS':{
          loginSuccess: 'auth-login-success',
          loginFailed: 'auth-login-failed',
          logoutSuccess: 'auth-logout-success',
          sessionTimeout: 'auth-session-timeout',
          notAuthenticated: 'auth-not-authenticated',
          notAuthorized: 'auth-not-authorized'
      },
      'USER_ROLES':{
          all: '*',
          unknown:'-1',
          receiver: '1',
          normal:'2',
          admin:'0'
      },
      "ErrorMessage":{
          ACCESS_FAIL: '通讯异常，请稍后再试！',
          TOKEN_INVALID: '连接超时，请重新登录！'
      }
  });
}());
