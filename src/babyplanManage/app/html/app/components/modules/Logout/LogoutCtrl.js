(function() {
  "use strict";
  angular.module('LogoutCtrl', [])
    .controller('LogoutCtrl', function ($scope,$window,AuthService,Env) {
        $scope.logout=function(){
            console.log("logout");
            AuthService.logout(Env.casLogout+Env.login+"/");
            //$window.location.href="http://weblogin.sustc.edu.cn/cas/logout"+"?service="+encodeURIComponent("http://zssys.sustc.edu.cn:8080/documentSignProcess/html/logout.html");
        };
        $scope.login=function(){
            $window.location.href=Env.casLogin+Env.login;
        };
        $scope.logout();

    });
}());
