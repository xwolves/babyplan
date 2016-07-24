(function() {
  "use strict";
  angular.module('UserCtrl', [])
  .controller('UserCtrl', function ($scope,$state,$location,WebService,AuthService,toaster) {
      $scope.gh = AuthService.getUser().gh;

      //查询用户信息
      WebService.queryUser($scope.gh).then(function(data){
        if(data.status==0){
            $scope.mc=data.content.mc;
            $scope.bm=data.content.bm;
            $scope.sjhm=data.content.sjhm;
            $scope.dzyx=data.content.dzyx;
        }
      });

      $scope.save=function(){
          if($scope.sjhm==""){
            toaster.pop('warning', "提示", "手机号码不能为空");
            return;
          }
          if($scope.mc==""){
            toaster.pop('warning', "提示", "姓名不能为空");
            return;
          }
          if($scope.bm==""){
            toaster.pop('warning', "提示", "部门不能为空");
            return;
          }

          WebService.saveUser($scope.gh, $scope.mc, $scope.bm, $scope.sjhm,$scope.dzyx).then(function(data){
              AuthService.setUser(data.mc,data.bm,data.sjhm,data.dzyx);
              toaster.pop('success', "任务完成", "保存个人信息成功");
          },function(error){
              toaster.pop('error', "保存个人信息失败", error);
          });
      };
      $scope.cancel = function () {
          $state.go(AuthService.getBasePath());
      };
  });
}());
