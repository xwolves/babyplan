(function() {
  "use strict";
  angular.module('LoginCtrl', [])
  .controller('LoginCtrl', function ($scope,WebService,$stateParams,$state,$window,Env,toaster) {

      $scope.login = function () {
          WebService.login($scope.user, $scope.password).then(function (data) {
              if(data.status==0) {
            	  toaster.pop('success', "登录成功", data.message);
                  //$uibModalInstance.close(data.message);
                  $state.go("portal");
              }else{
                  toaster.pop('error', "登录失败", data.message);
              }
          },function(reason){
              toaster.pop('error', "登录失败", reason);
          });
      };
      //$scope.login();
  });
}());
