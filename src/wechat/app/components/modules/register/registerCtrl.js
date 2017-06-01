(function () {
    "use strict";
    angular.module('registerCtrl', [])
        .controller('registerCtrl', function ($scope, Constants, StateService, Session, AuthService, registerService, LoginService, eshopService, $stateParams, MessageToaster) {
            'ngInject';
            var vm = this;
            vm.activated = false;
            vm.count = 0;
            vm.isLock = false;
            vm.org = { mobile: '', password: '' };
            //微信uid的初始化
            vm.user = { gendar: '1', name: '', mobile: '', password: '', pswConfirm: '', wechat: AuthService.getWechatId(), email: '' };
            vm.error = null;
            vm.isParent = false;
            $scope.$on('$ionicView.afterEnter', activate);

            function activate() {
                vm.activated = true;
                vm.version = Constants.buildID;
                vm.type = $stateParams.type;
                //console.log("user type = "+vm.type);
                //if(vm.type==2) {
                //    vm.roleType = '2';
                //    vm.isParent = true;
                //}else{
                //    vm.roleType = '3';
                //    vm.isParent = false;
                //}

                vm.roleType = '2';
                vm.isParent = true;

            };

            $scope.$watch('vm.user.name', function (newValue, oldValue) {
                if (vm.user.name != undefined) {
                    if (vm.user.name.length < 1) {
                        vm.error = '姓名不能为空';
                    } else {
                        vm.error = null;
                    }
                } else {
                    vm.error = '姓名必须填写';
                }
            });
            $scope.$watch('vm.user.mobile', function (newValue, oldValue) {
                if (vm.user.mobile != undefined) {
                    if (vm.user.mobile.length != 11) {
                        vm.error = '手机长度必须为11位';
                    } else {
                        vm.error = null;
                    }
                } else {
                    vm.error = '手机号码必须填写';
                }
            });
            $scope.$watch('vm.user.email', function (newValue, oldValue) {
                if (vm.user.email != undefined) {
                    if (vm.user.email.search(/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/) != -1) {
                        vm.error = null;
                    } else {
                        vm.error = '电子邮箱格式不对';
                    }
                } else {
                    vm.error = '电子邮箱必须填写，用于找回密码';
                }
            });
            $scope.$watch('vm.user.password', function (newValue, oldValue) {
                if (vm.user.password != undefined) {
                    if (vm.user.password.length < 6) {
                        vm.error = '密码长度必须不小于6位';
                    } else {
                        vm.error = null;
                    }
                } else {
                    vm.error = '密码必须填写';
                }
            });
            $scope.$watch('vm.user.pswConfirm', function (newValue, oldValue) {
                if (vm.user.pswConfirm != undefined) {
                    if (vm.user.password != '' && vm.user.password.length >= 6 && vm.user.pswConfirm != vm.user.password) {
                        vm.error = '密码不一致';
                    } else {
                        vm.error = null;
                    }
                } else {
                    vm.error = '';
                }
            });

            vm.check = function () {
                if (vm.error != null) {
                    vm.error = '数据未完善哦!';
                    return false;
                }
                else {
                    if (vm.user.password.length >= 6 && vm.user.pswConfirm.length >= 6
                        && vm.user.name.length > 0 && vm.user.mobile.length == 11
                        && vm.user.email.length > 0 && vm.user.email.length > 3
                        && vm.user.password == vm.user.pswConfirm) return true;
                    else vm.error = '数据未填完哦!';
                }
            };


            function login(userid, pwd) {
                LoginService.login(userid, pwd).then(function (response) {
                    console.log(response);
                    if (response.errno == 0) {

                        //登录ESHOP
                        eshopService.signin(userid, pwd).then(function (data) {
                            AuthService.setSession(response.data.uid, response.data.token, data, response.data.type);
                            StateService.clearAllAndGo(AuthService.getNextPath());
                        }, function (ex) {
                            MessageToaster.error(ex);
                        })
                    } else {
                        MessageToaster.error(response.error);
                    }
                },
               function (error) {
                   MessageToaster.error(error);
               }).finally(function () {
                   //WeuiModalLoading.hide();
               });
            };


            vm.register = function () {
                //检测输入数值是否正确
                if (!vm.check()) return;
                //先注册
                vm.user.weixinno = '';
                vm.user.wechat = '';

                registerService.registerParent(vm.user).then(function (data) {
                    console.log(data);
                    if (data.errno == 0) {
                        LoginService.login(vm.user.mobile, vm.user.password).then(function (response) {
                            if (response.errno == 0) {
                                AuthService.setSession(response.data.uid, response.data.token, data.data.eshop, response.data.type);
                                StateService.clearAllAndGo(AuthService.getNextPath());
                            } else {
                                MessageToaster.error(response.error);
                            }
                        },function (error) {
                              MessageToaster.error(error);
                          });

                    } else {
                        //vm.error = data.error;
                        if (data.errno == 10008) {
                            MessageToaster.error("手机号码已注册过");
                        } else {
                            MessageToaster.error("注册不成功");
                        }
                    }
                });

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
