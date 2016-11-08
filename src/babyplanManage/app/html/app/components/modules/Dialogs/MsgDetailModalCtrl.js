(function() {
  "use strict";
  angular.module('MsgDetailModalCtrl', [])
    .controller('MsgDetailModalCtrl', function ($scope,$modalInstance,$filter,WebService,toaster,user) { 	
    	console.log(user);

        $scope.PublisherID=user.PublisherID;
        $scope.Name=user.Name;
        $scope.DepositID=user.DepositID;
        $scope.OrgName=user.OrgName;
        
        $scope.Longitude=user.Longitude;
        $scope.Latitude=user.Latitude;
        $scope.ClickCount=user.ClickCount;
        $scope.InfoType=user.InfoType;
        
        
        $scope.Description=user.Description;
        $scope.PhotoLink1=user.PhotoLink1;
        $scope.PhotoLink2=user.PhotoLink2;
        $scope.PhotoLink3=user.PhotoLink3;
        
        $scope.PhotoLink4=user.PhotoLink4;
        $scope.PhotoLink5=user.PhotoLink5;
        $scope.PhotoLink6=user.PhotoLink6;
        $scope.Status=user.Status;
        
        $scope.StarCount=user.StarCount;
        
        $scope.CreateTime= $filter("date")(user.CreateTime, "yyyy-MM-ddThh:mm"); //new Date('2015-12-12');//$filter('date')(user.CreateTime, "dd/MM/yyyy");//user.CreateTime;
       
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
