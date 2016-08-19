(function() {
    "use strict";
    angular.module('registerCtrl', [])
        .controller('registerCtrl', function($scope, Constants,StateService,Session,AuthService,registerService,LoginService) {
            'ngInject';
            var vm = this;
            vm.activated = false;
            console.log("tabs come");
            vm.count=0;
            vm.isLock=false;
            vm.org={mobile:'', password:''};
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

            vm.simpleCheck = function(){
                if(vm.org.password.length >= 6 && (vm.org.account.length == 11 || vm.org.account.length == 8 )){
                    vm.error = "";
                    return true;
                } else vm.error = '数据未填完哦!';
            };

            function wxlogin(userid,type) {
                LoginService.wxLogin(userid,type).then(function (response) {
                    if (response.errno == 0) {
                        var result = response.data;
                        if(typeof(result.uid) == "undefined" ){
                        //if (result instanceof Array && result.length > 1) {
                            //modal select type
                            vm.roleList = result;
                            //alert(JSON.stringify(result));
                            MessageToaster.info("have select " + result.length);
                            vm.showChooseModal();
                        } else {
                            if (result.uid != null && result.token != null && result.type != null) {
                                AuthService.setSession(result.uid, result.token, result.type);
                                StateService.clearAllAndGo(AuthService.getNextPath());
                            }
                        }
                    } else {
                        if (response.errno == 12004) {
                            //no data found
                            AuthService.setSession(userid, "", Role.unknown);
                            StateService.clearAllAndGo("register");
                        }
                        MessageToaster.error(response.error);
                    }
                });
            };

            vm.bind = function(){
                //检测输入数值是否正确
                if(!vm.simpleCheck())return;
                //再绑定
                vm.count++;
                if(vm.count>3){
                    vm.isLock=true;
                    vm.error="尝试过多,请稍后再试!";
                    return;
                }
                //alert(AuthService.getLoginID());
                if(vm.roleType=='3'){
                    registerService.bindTeacher(vm.org,AuthService.getLoginID()).then(function(data) {
                        if (data.errno == 0) {
                            var userId = data.data.uid;
                            if(userId!=null){
                                wxlogin(userId);
                            }
                        }
                    });
                }else if(vm.roleType=='1'){
                    registerService.bindOrganizer(vm.org,AuthService.getLoginID()).then(function(data) {
                        if (data.errno == 0) {
                            var userId = data.data.uid;
                            if(userId!=null){
                                wxlogin(userId);
                            }
                        }
                    });
                }
                vm.error="密码或手机号码有误,请重试";

            };

            vm.register = function(){
                console.log(vm.roleType);
                //检测输入数值是否正确
                if(!vm.check())return;
                //先注册
                vm.user.wechat=AuthService.getLoginID();
                if(vm.roleType=='2'){
                    registerService.registerParent(vm.user).then(function(data) {
                        if (data.errno == 0) {
                            //var userId = data.data.uid;
                            wxlogin(vm.user.wechat);
                        }
                    });
                }else if(vm.roleType=='3'){
                    registerService.registerTeacher(vm.user).then(function(data) {
                        if (data.errno == 0) {
                            //var userId = data.data.uid;
                            wxlogin(vm.user.wechat);
                        }
                    });
                };
                //注册成功后,使用账户去获取获取token,完成登录
                //Session.userId="70000103";
                //Session.token='111';
                //Session.userRole='2';
                //var userId="70000103";
                //var token='111';
                //var userRole='2';
                //AuthService.setSession(userId, token, userRole);

                //StateService.clearAllAndGo(AuthService.getNextPath());
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
