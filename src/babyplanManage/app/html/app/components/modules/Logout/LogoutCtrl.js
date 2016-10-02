(function() {
  "use strict";
  angular.module('LogoutCtrl', [])
    .controller('LogoutCtrl', function ($scope,$state,$window,AuthService,WebService,Env) {
        $scope.logout=function(){
            console.log("logout");
            WebService.logout();
            $state.go("login");
           // AuthService.logout(Env.casLogout+Env.login+"/");
            //$window.location.href="http://weblogin.sustc.edu.cn/cas/logout"+"?service="+encodeURIComponent("http://zssys.sustc.edu.cn:8080/documentSignProcess/html/logout.html");
        };
        $scope.login=function(){
        	  $state.go("portal");
           // $window.location.href=Env.casLogin+Env.login;
        };
        $scope.logout();

    });
}());
