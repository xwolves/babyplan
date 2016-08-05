(function() {
  "use strict";
  angular.module('TeacherDetailModalCtrl', [])
    .controller('TeacherDetailModalCtrl', function ($scope,$modalInstance,$filter,WebService,toaster,user) {
    	
    	 console.log(user);
    	 
    	 
        $scope.AccountID=user.AccountID;
        $scope.Name=user.Name;
        $scope.Sex=user.Sex;
        
        $scope.Mobile=user.Mobile;
        $scope.WeiXinNo=user.WeiXinNo;
        $scope.TeachAge=user.TeachAge;
        
        $scope.Age=user.Age;
        $scope.PhotoLink=user.PhotoLink;
        $scope.Remark=user.Remark;
        
        
        $scope.CreateTime= $filter("date")(user.CreateTime, "yyyy-MM-ddThh:mm"); //new Date('2015-12-12');//$filter('date')(user.CreateTime, "dd/MM/yyyy");//user.CreateTime;
       
        $scope.ModifyTime= $filter("date")(user.ModifyTime, "yyyy-MM-ddThh:mm"); 
       // console.log($scope.CreateTime);
       // $scope.ModifyTime=user.ModifyTime;
        //$scope.sjhm=user.sjhm;
        //$scope.dzyx=user.dzyx;

        $scope.save = function () {
//            console.log("save");
//            user.js=$scope.selected;
//            WebService.saveUserRole(user,$scope.selected).then(function(data){
//                toaster.pop('success', "任务完成", "保存个人信息成功");
//            },function(error){
//                toaster.pop('error', "保存个人信息失败", error);
//            });
        	
        	  console.log($scope.CreateTime);
            $modalInstance.close(user.bh);
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    });

  }());
