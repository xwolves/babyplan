(function () {
    "use strict";
    angular.module('resetPswCtrl', [])
        .controller('resetPswCtrl', function (Constants, AuthService, MessageToaster, LoginService, $timeout, $scope, Session, $stateParams, StateService, $ionicModal, Role, $http, parentService) {
            'ngInject';

            var vm = this;
            $scope.$on('$ionicView.beforeEnter', validate);
            function validate() {
              vm.id="";
            }

            vm.back = function () {
                StateService.back();
            }

            vm.reset = function () {
              if(vm.id!=""){
                parentService.resetPsw(vm.id).then(function(data) {
                    console.log(data);
                    if(data.errno==0){
                        StateService.back();
                        MessageToaster.info("请登录到你的邮箱查询你的新密码");
                    }else{
                        if(data.errno==10009){
                          MessageToaster.error("电子邮件没法发出");
                        }else if(data.errno==10010){
                          MessageToaster.error("帐号未设置电子邮箱，无法重置密码");
                        }else if(data.errno==10002){
                          MessageToaster.error("无此帐号");
                        }else{
                          MessageToaster.error(data.error);
                        }
                    }
                });
              }else{
                MessageToaster.error("帐号和密码不能为空");
              }
            }
        });
}());
