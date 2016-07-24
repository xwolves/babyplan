(function() {
  "use strict";
  angular.module('CreateDocModalCtrl', [])
  .controller('CreateDocModalCtrl', function ($scope, WebService, $modalInstance,$state,toaster, fwr) {
      console.log(fwr);
      $scope.fwrymc=fwr.mc;
      $scope.fwrybm=fwr.bm;
      $scope.fwrysj=fwr.sjhm;
      //WebService.countOneDayOfficialDocument().then(function(data){
      //    if(data.status==0) {
      //        console.log(data.content);
      //        var count=parseInt(data.content)+1;
      //        var next="";
      //        if(count>999){
      //            next=""+count;
      //        }else if(count>99){
      //            next="0"+count;
      //        }else if(count>9){
      //            next="00"+count;
      //        }else{
      //            next="000"+count;
      //        }
      //        var now=new Date();
      //        var month=now.getMonth()>9?((now.getMonth()+1)+""):("0"+(now.getMonth()+1));
      //        var date=now.getDate()>9?(now.getDate()+""):("0"+now.getDate());
      //        $scope.fwbh="FW"+now.getFullYear()+month+date+"-"+next;
      //    }else{
      //        alert(data.message);
      //    }
      //});
      var now=new Date();
      var month=now.getMonth()>9?((now.getMonth()+1)+""):("0"+(now.getMonth()+1));
      var date=now.getDate()>9?(now.getDate()+""):("0"+now.getDate());
      $scope.fwbh="FW"+now.getFullYear()+month+date+"-XXXXX";

      $scope.check = function(){
          if($scope.fwmc == ""){
              toaster.pop('warning', "提示", "交文名称不能为空");
              return false;
          }
          if($scope.fwrysj==""){
              toaster.pop('warning', "提示", "手机号码不能为空");
              return false;
          }
          if($scope.fwrysj != null && $scope.fwrysj.length != 11){
              toaster.pop('warning', "提示", "手机号码输入不正确");
              return false;
          }
          if($scope.fwrymc==""){
              toaster.pop('warning', "提示", "姓名不能为空");
              return false;
          }
          if($scope.fwrybm==""){
              toaster.pop('warning', "提示", "部门不能为空");
              return false;
          }
        return true;
      };

      $scope.create = function () {
          if(!$scope.check()){return;}
          WebService.createDocument($scope.fwbh, $scope.fwmc, $scope.fwms, $scope.fwrymc, $scope.fwrybm,$scope.fwrysj).then(function(data){
              if(data.status==0) {
                  $modalInstance.close(data.message);
              }else{
                  toaster.pop('error', "创建失败", data.message);
              }
          },function(reason){
              //console.log(reason);
              toaster.pop('error', "创建失败", reason);
          });
      };
      $scope.createAndPrint = function () {
          if(!$scope.check()){return;}
          WebService.createDocument($scope.fwbh, $scope.fwmc, $scope.fwms, $scope.fwrymc, $scope.fwrybm,$scope.fwrysj).then(function(data){
              console.log(data);
              if(data.status==0) {
                  var obj=data.content;
                  $modalInstance.close(data.message);
                  $state.go("printDoc",{fwbh:obj.fwbh});
              }else{
                  toaster.pop('error', "创建失败", data.message);
              }
          },function(reason){
              toaster.pop('error', "创建失败", reason);
          });
      };
      $scope.cancel = function () {
          $modalInstance.dismiss('cancel');
      };
  });

}());
