
(function() {
  "use strict";
  angular.module('TopNavButtonCtrl', [])
    .controller('TopNavButtonCtrl',function($scope,$state,AuthService,$window,Env,Session) {
        $scope.title=Env.AppName;
        //{name:"退出",url:"./logout.html"}

        $scope.hide=AuthService.showNav;
        $scope.btnHide=AuthService.isAdmin;
        $scope.logout=function(){
            console.log("logout");
            AuthService.logout();
            $window.location.href="http://weblogin.sustc.edu.cn/cas/logout"+"?service="+encodeURIComponent("http://zssys.sustc.edu.cn:8080/documentSignProcess/html/logout.html");
        };
        $scope.navbtns=[
            {name:"用户",url:"#/user",show:true},
            {name:"设置",url:"#/settings",show:false},
            {name:"退出",url:"#/logout",show:true}
        ];
        $scope.$watch('hide', function(newValue, oldValue) {
            console.log("hide value change : "+newValue+ '===' +oldValue);
        });
        $scope.$watch('btnHide', function(newValue, oldValue) {
            console.log("Session.userRole value change : "+newValue+ '===' +oldValue);

        });
        $scope.$on("hideNav", function(event, args){
            $scope.hide=args.hideNav;
            console.log("GET nav hide = "+args);
        });
        $scope.$on("isAdmin", function(event, args){
            $scope.btnHide=args.isAdmin;
            console.log("GET btnHide = "+args);
        });
    });
}());
