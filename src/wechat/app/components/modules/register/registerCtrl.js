(function() {
    "use strict";
    angular.module('registerCtrl', [])
        .controller('registerCtrl', function($scope, Constants,StateService,Session,AuthService,registerService,LoginService,$stateParams) {
            'ngInject';
            var vm = this;
            vm.activated = false;
            vm.count=0;
            vm.isLock=false;
            vm.org={mobile:'', password:''};
            //微信uid的初始化
            vm.user={ gendar:'1', name:'', mobile:'', password:'', pswConfirm:'', wechat:AuthService.getWechatId()};
            vm.error=null;
            vm.isParent=false;
            $scope.$on('$ionicView.afterEnter', activate);

            function activate() {
                vm.activated = true;
                vm.version = Constants.buildID;
                vm.type = $stateParams.type;
                console.log("user type = "+vm.type);
                if(vm.type==2) {
                    vm.roleType = '2';
                    vm.isParent = true;
                }else{
                    vm.roleType = '3';
                    vm.isParent = false;
                }
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
                    if (vm.user.password.length < 6) {
                        vm.error = '密码长度必须不小于6位';
                    } else {
                        vm.error = null;
                    }
                }else{
                    vm.error = '密码必须填写';
                }
            });
            $scope.$watch('vm.user.pswConfirm', function(newValue, oldValue) {
                if(vm.user.pswConfirm!=undefined) {
                    if (vm.user.password != '' && vm.user.password.length >= 6  && vm.user.pswConfirm != vm.user.password) {
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
                    if(vm.user.password.length >= 6 && vm.user.pswConfirm.length >= 6
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
                console.log(userid+"..."+type);
                LoginService.wxLogin(userid,type).then(function (response) {
                    console.log(response);
                    if (response.errno == 0) {
                        var result = response.data;
                        //if(typeof(result.uid) == "undefined" ){
                        if (result instanceof Array && result.length > 1) {
                            //modal select type
                            vm.roleList = result;
                            //alert(JSON.stringify(result));
                            //MessageToaster.info("undefine have select  " + result.length);
                            //vm.showChooseModal();

                        } else {
                            console.log(result[0]);
                            if (result[0].uid != null && result[0].token != null && result[0].type != null) {
                                console.log("goto next");
                                AuthService.setSession(result[0].uid, result[0].token, result[0].type, userid);
                                StateService.clearAllAndGo(AuthService.getNextPath());
                            }
                        }
                        console.log(result);

                    } else {
                        if (response.errno == 12004) {
                            //no data found
                            console.log("找不到任何信息");
                        }
                        //MessageToaster.error(response.error);
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
                var wechatId=vm.user.wechat;
                //alert(AuthService.getLoginID());
                if(vm.roleType=='3'){
                    registerService.bindTeacher(vm.org,wechatId).then(function(data) {
                        if (data.errno == 0) {
                            var userId = data.data.uid;
                            console.log("bind teacher uid = "+userId);
                            //if(userId!=null){
                            //    wxlogin(userId,vm.roleType);
                            //}
                            wxlogin(wechatId,vm.roleType);
                        }else{
                            console.log("bindTeacher get error");
                        }
                    });
                }else if(vm.roleType=='1'){
                    registerService.bindOrganizer(vm.org,wechatId).then(function(data) {
                        if (data.errno == 0) {
                            var userId = data.data.uid;
                            console.log("bind teacher uid = "+userId);
                            //if(userId!=null){
                            //    wxlogin(userId,vm.roleType);
                            //}
                            wxlogin(wechatId,vm.roleType);
                        }
                    });
                }
                vm.error="密码或手机号码有误,请重试";

            };

            vm.register = function(){
                //检测输入数值是否正确
                if(!vm.check())return;
                //先注册
                if(vm.roleType=='2'){
                    registerService.registerParent(vm.user).then(function(data) {
                        console.log(data);
                        if (data.errno == 0) {
                            wxlogin(vm.user.wechat,vm.roleType);
                        }else{
                            if(data.errno==10000){
                                vm.error = "请确认微信是否已经绑定过";
                            }else vm.error = data.error;
                        }
                    });
                }else if(vm.roleType=='3'){
                    registerService.registerTeacher(vm.user).then(function(data) {
                        if (data.errno == 0) {
                            wxlogin(vm.user.wechat,vm.roleType);
                        }else{
                            if(data.errno==10000){
                                vm.error = "请确认微信是否已经绑定过";
                            }else vm.error = data.error;
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
