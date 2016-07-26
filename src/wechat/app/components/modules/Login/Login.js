(function() {
    "use strict";
    angular.module('LoginModule', [
        'WXLoginCtrl',
        'LoginRouter',
        'LoginService'
    ]).run(function($rootScope, Session, StateService) {
        $rootScope.$on('$stateChangeStart', function(event, next) {
          if (next.url.indexOf('login')>0 ) {
              console.log("login");
          }else if(next.url.indexOf('register')>0){
              //未绑定用户者,进入注册绑定页面
              console.log("register");
          }else{
            if (Session.userId && Session.token) {
                //login successed
            } else {
                console.log("user not login");
                event.preventDefault();
                StateService.clearAllAndGo('wxlogin');
            }
          }
        });
    });

}());
