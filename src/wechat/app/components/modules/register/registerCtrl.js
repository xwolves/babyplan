(function() {
    "use strict";
    angular.module('registerCtrl', [])
        .controller('registerCtrl', function($scope, Constants,StateService,Session,AuthService,registerService) {
            'ngInject';
            var vm = this;
            vm.activated = false;
            console.log("tabs come");
            vm.user={ gendar:'1', name:'', mobile:'', password:'', pswConfrim:''};
            vm.error=null;
            $scope.$on('$ionicView.afterEnter', activate);

            function activate() {
                vm.activated = true;
                vm.version = Constants.buildID;
                vm.roleType = '2';
            };

            $scope.$watch('vm.user.name', function(newValue, oldValue) {
                if(vm.user.name!=undefined) {
                    if (vm.user.name.length < 1) {
                        vm.error = '姓名不能为空';
                    } else {
                        vm.error = null;
                    }
                }else{
                    vm.error = '姓名必须填写';
                }
            });
            $scope.$watch('vm.user.mobile', function(newValue, oldValue) {
                if(vm.user.mobile!=undefined) {
                    if (vm.user.mobile.length != 11) {
                        vm.error = '手机长度必须为11位';
                    } else {
                        vm.error = null;
                    }
                }else{
                    vm.error = '手机号码必须填写';
                }
            });
            $scope.$watch('vm.user.password', function(newValue, oldValue) {
                if(vm.user.password!=undefined) {
                    if (vm.user.password.length < 8) {
                        vm.error = '密码长度必须不小于8位';
                    } else {
                        vm.error = null;
                    }
                }else{
                    vm.error = '密码必须填写';
                }
            });
            $scope.$watch('vm.user.pswConfirm', function(newValue, oldValue) {
                if(vm.user.pswConfirm!=undefined) {
                    if (vm.user.password != '' && vm.user.password.length >= 8  && vm.user.pswConfirm != vm.user.password) {
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
                    if(vm.user.password.length >= 8 && vm.user.pswConfirm.length >= 8
                        && vm.user.name.length > 0 && vm.user.mobile.length == 11
                        && vm.user.password == vm.user.pswConfirm) return true;
                    else vm.error = '数据未填完哦!';
                }
            };

            vm.register = function(){
                console.log(vm.roleType);
                //检测输入数值是否正确
                if(!vm.check())return;
                //先注册
                if(vm.roleType=='2'){
                    registerService.registerParent(vm.user).then(function(data) {
                        if (data.errno == 0) {
                            //var userId = data.data.uid;
                        }
                    });
                }else if(vm.roleType=='3'){
                    registerService.registerTeacher(vm.user).then(function(data) {
                        if (data.errno == 0) {
                            //var userId = data.data.uid;
                        }
                    });
                };
                //注册成功后,使用账户去获取获取token,完成登录
                //Session.userId="70000103";
                //Session.token='111';
                //Session.userRole='2';
                var userId="70000103";
                var token='111';
                var userRole='2';
                AuthService.setSession(userId, token, userRole);

                StateService.clearAllAndGo(AuthService.getNextPath());
                //if(vm.roleType=='1') {
                //    StateService.go('organizerEdit');
                //}else if(vm.roleType=='2'){
                //    StateService.go('parentEdit');
                //}else if(vm.roleType=='3'){
                //    StateService.go('teacherEdit');
                //}
            };
        });
}());
