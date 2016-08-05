(function() {
  "use strict";
  angular.module('ParentDetailModalCtrl', [])
    .controller('ParentDetailModalCtrl', function ($scope,$modalInstance,$filter,WebService,toaster,user) {
    	
    	 console.log(user);
    	 
    	 
        $scope.ParentID=user.ParentID;
        $scope.PName=user.PName;
        $scope.PSex=user.PSex;
        
        $scope.PMobile=user.PMobile;
        $scope.PWeiXinNo=user.PWeiXinNo;
        
        $scope.RelationShip=user.RelationShip;      
        $scope.aPNick=user.aPNick;
        
        $scope.PRemark=user.PRemark;
        
        
        $scope.PCreateTime= $filter("date")(user.PCreateTime, "yyyy-MM-ddThh:mm"); //new Date('2015-12-12');//$filter('date')(user.CreateTime, "dd/MM/yyyy");//user.CreateTime;
       
        $scope.PModifyTime= $filter("date")(user.PModifyTime, "yyyy-MM-ddThh:mm"); 
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
