(function() {
    "use strict";
    angular.module('estimateDepositCtrl', [])
        .controller('estimateDepositCtrl', function($scope, Constants, StateService, BaiduService, AuthService, childrenSteamService, MessageToaster, $ionicModal) {
            'ngInject';
            var vm = this;
            vm.activated = false;

            $scope.$on('$ionicView.afterEnter', activate);
            function activate() {
                vm.activated = true;
                vm.version = Constants.buildID;
                vm.list=[];
                vm.getChildrenDeposit();
            };

            vm.getChildrenDeposit = function(){
              childrenSteamService.getChildrenDeposit(AuthService.getLoginID()).then(function(data) {
                  if (data.errno == 0) {
                      console.log(data.data);
                      var de=data.data;
                      for(var i=0;i<de.length;i++){
                        console.log(de[i]);
                        if(de[i].DepositID!=null){
                          BaiduService.getDepositInfoWithComments(de[i].DepositID).then(function (depositInfo) {
                              console.log(depositInfo);
                              depositInfo.show=false;
                              vm.list.push(depositInfo);
                          }, function (err) {
                              //ionicToast.show('获取机构详情信息失败!', 'middle', false, 3000);
                              //MessageToaster.error("获取机构详情信息失败!");
                          })
                        }
                      }
                  }
              });
            };

            vm.back=function(){
                StateService.back();
            };

            vm.gotoEdit=function(did){
              StateService.go('depositComment', {id: did,type:1});
            };
        });
}());
