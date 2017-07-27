(function() {
    "use strict";
    angular.module('WxLoginModule', [
        'WxLoginCtrl',
        'WxLoginRouter',
        'WxLoginService'
    ]).run(function($rootScope, Session, StateService,$location,tools) {
        $rootScope.$on('$stateChangeStart', function(event, next) {
          console.log("stateChangeStart");
          console.log(next);

          if (next.url.indexOf('wxlogin')>0 ) {
              console.log("wxlogin");
              //alert($location.absUrl());
              var url = $location.absUrl();
              //获取ticket参数，因为angualr的路径不规范，会出现http://10.20.68.73:8080/casOauth/?ticket=ST-16-HzIjcAlxbKvlyJQAX2XI-cas01.sustc.edu.cn#/login，无法用公共方法获取
              var start = url.indexOf('user=') + 5;
              var end = url.indexOf('&type=');
              if(!start<=5 && end <= 0){
                StateService.clearAllAndGo('login');
              }else{
                //如果是http://10.20.68.73:8080/casOauth?ticket=ST-16-HzIjcAlxbKvlyJQAX2XI-cas01.sustc.edu.cn这种情况
                //或者是是http://10.20.68.73:8080/casOauth/#/login?ticket=ST-16-HzIjcAlxbKvlyJQAX2XI-cas01.sustc.edu.cn这种情况
                if (end == -1 || end < start) end = url.length;
                console.log("wxlogin 1" + start + " - " + end);
                var myUser = url.toString().substring(start, end);
                console.log("get user = " + myUser);

                var start = url.indexOf('&type=') + 6;
                var end = url.indexOf('#/wxlogin');
                if (end == -1 || end < start) end = url.length;
                console.log("wxlogin 2" + start + " - " + end);
                var myType = url.toString().substring(start, end);
                console.log("get type = " + myType);
                StateService.clearAllAndGo('wxlogin',{user:myUser,type:myType});
              }
          }else if(next.url.indexOf('login')>0){
              console.log("login");
          }else if(next.url.indexOf('register')>0){
              //未绑定用户者,进入注册绑定页面
              console.log("register");
          }else if(next.url.indexOf('resetPsw')>0){
              console.log("resetPsw");
          }else{
            if (Session.getData('userId') && Session.getData('token')) {
                //login successed
                if(Session.getData('userId')==-1){
                  console.log('游客浏览');
                }else{
                  Session.checkToken().then(function (response) {
                      console.log(response);
                      if(response.errno==0){
                        //token exist
                        //StateService.clearAllAndGo(AuthService.getNextPath());
                      }else {
                          console.log("token not exist,need login again");
                          StateService.clearAllAndGo('login');
                      }
                  },
                  function (error) {
                      console.log("get error in checkToken api,so goto login page");
                      StateService.clearAllAndGo('login');
                  });
              }
            } else {
                console.log("user not login with ");
                event.preventDefault();
                if (tools.getAgent() != 'wx')
                    StateService.clearAllAndGo('login');
                else
                    StateService.clearAllAndGo('wxlogin');
            }
          }
        });

    });

}());
