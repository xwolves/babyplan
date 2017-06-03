(function() {
    "use strict";
    angular.module('changePswCtrl', [])
        .controller('changePswCtrl', function($scope, Constants, Session,StateService, MessageToaster, parentService, AuthService ) {
            'ngInject';
            var vm = this;
            vm.activated = false;
            $scope.$on('$ionicView.afterEnter', activate);

            function activate() {
                vm.activated = true;
                vm.version = Constants.buildID;
            }

            vm.goTo = function(addr){
                console.log('go to path : '+addr);
                StateService.go(addr);
            };

            vm.back=function(){
                StateService.back();
            };

            $scope.$watch('vm.originPsw', function(newValue, oldValue) {
              if(vm.originPsw!=undefined) {
                  if (vm.originPsw.length < 6) {
                      vm.error = '密码长度必须不小于6位';
                  } else {
                      vm.error = null;
                  }
              }else{
                  vm.error = '密码必须填写';
              }
            });
            $scope.$watch('vm.password', function(newValue, oldValue) {
                if(vm.password!=undefined) {
                    if (vm.password.length < 6) {
                        vm.error = '密码长度必须不小于6位';
                    } else {
                        vm.error = null;
                    }
                }else{
                    vm.error = '密码必须填写';
                }
            });
            $scope.$watch('vm.pswConfirm', function(newValue, oldValue) {
                if(vm.pswConfirm!=undefined) {
                    if (vm.password != '' && vm.password.length >= 6  && vm.pswConfirm != vm.password) {
                        vm.error = '密码不一致';
                    } else {
                        vm.error = null;
                    }
                }else{
                    vm.error = '';
                }
            });

            vm.check = function(){
                if(vm.error!=null){
                    vm.error = '数据未完善哦!';
                    return false;
                }
                else {
                    if(vm.password.length >= 6 && vm.pswConfirm.length >= 6 && vm.originPsw.length >= 6 && vm.password == vm.pswConfirm){
                        vm.error = '';
                        return true;
                    }
                    else vm.error = '数据未填完哦!';
                }
            };

            vm.changePsw = function() {
                if(!vm.check())return;
                var json={
                  uid:AuthService.getLoginID(),
                  password:vm.pswConfirm
                };
                parentService.updateParent(json).then(function (res) {
                    //vm.back();
                    Session.destroy();
                    StateService.clearAllAndGo("login");
                    MessageToaster.info("密码修改成功!");
                }, function (err) {
                    MessageToaster.error("密码修改失败!");
                })
            };

        });
}());
