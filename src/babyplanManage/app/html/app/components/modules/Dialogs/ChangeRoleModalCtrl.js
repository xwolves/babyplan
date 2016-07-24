(function() {
  "use strict";
  angular.module('ChangeRoleModalCtrl', [])
    .controller('ChangeRoleModalCtrl', function ($scope,$modalInstance,WebService,toaster,user) {
        $scope.selected=user.js;
        $scope.mc=user.mc;
        $scope.bm=user.bm;
        //$scope.sjhm=user.sjhm;
        //$scope.dzyx=user.dzyx;

        $scope.save = function () {
            console.log("save");
            user.js=$scope.selected;
            WebService.saveUserRole(user,$scope.selected).then(function(data){
                toaster.pop('success', "任务完成", "保存个人信息成功");
            },function(error){
                toaster.pop('error', "保存个人信息失败", error);
            });
            $modalInstance.close(user.bh);
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    });

  }());
