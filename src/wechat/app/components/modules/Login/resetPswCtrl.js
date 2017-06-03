(function () {
    "use strict";
    angular.module('resetPswCtrl', [])
        .controller('resetPswCtrl', function (Constants, AuthService, MessageToaster, LoginService, $timeout, $scope, Session, $stateParams, StateService, $ionicModal, Role, $http, parentService) {
            'ngInject';

            var vm = this;
            $scope.$on('$ionicView.beforeEnter', validate);
            function validate() {
                vm.mobile = "";
            }

            vm.back = function () {
                StateService.back();
            }

            vm.reset = function () {
                if (vm.mobile != "") {
                parentService.resetPsw(vm.mobile).then(function(data) {
                    console.log(data);
                    if(data.errno==0){
                        StateService.back();
                        MessageToaster.info("请登录到你的邮箱查询你的新密码！");
                    }else{
                        if(data.errno==10009){
                            MessageToaster.error("该账号邮箱格式错误，请联系管理员！");
                        }else if(data.errno==10010){
                          MessageToaster.error("帐号未设置电子邮箱，无法重置密码！");
                        }else if(data.errno==10002){
                          MessageToaster.error("手机号未绑定任何账号！");
                        }else{
                          MessageToaster.error(data.error);
                        }
                    }
                });
              }else{
                MessageToaster.error("必须填写正确的手机号");
              }
            }
        });
}());
