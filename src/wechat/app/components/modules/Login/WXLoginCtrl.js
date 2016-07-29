(function() {
    "use strict";
    angular.module('WXLoginCtrl', [])
        .controller('WXLoginCtrl', function(Constants, AuthService, MessageToaster, LoginService, $timeout, $scope, Session, $stateParams, StateService, $ionicModal, Role) {
            'ngInject';

            var vm = this;
            vm.wxlogin = wxlogin;
            vm.isDev = Constants.ENVIRONMENT == 'dev' ? true : false;
            $scope.$on('$ionicView.beforeEnter', validate);

            function validate() {
                vm.user = $stateParams.user;
               // vm.user = "weichat";//test
                MessageToaster.info('user = '+vm.user);
                if (vm.user) {
                    //login failed
                    MessageToaster.info('logining....');
                    vm.info = "正在登录，请稍后...";
                    vm.showLoginModal = showLoginModal;
                    //vm.roleList = [{type:1,user:'1111'}];//test
                    vm.showChooseModal = showChooseModal;
                    vm.login = login;
                    vm.select = selectChoose;
                    vm.wxlogin(vm.user);
                }
            }

            function wxlogin(userid,type) {
                MessageToaster.info('准备登录');
                LoginService.wxLogin(userid,type).then(function(response) {
                    if(response.errno==0) {
                        var result = response.data;
                        //alert(result instanceof Array);
                        //alert(result.length);
                        //if(typeof(result.uid) == "undefined" ){
                        if (result instanceof Array && result.length > 1) {
                            //modal select type
                            vm.roleList=result;
                            MessageToaster.info("have select "+result.length);
                            vm.showChooseModal();
                        }else{
                            //alert(JSON.stringify(result));
                            var u=result[0];
                            if (u.uid != null && u.token != null && u.type != null) {
                                AuthService.setSession(u.uid, u.token, u.type);
                                StateService.clearAllAndGo(AuthService.getNextPath());
                            }
                        }
                    }else{
                        if(response.errno==12004){
                            //no data found
                            AuthService.setSession(userid, "", Role.unknown);

                            StateService.clearAllAndGo("register");
                        }
                        MessageToaster.error(response.error);
                    }
                });
            };

            //WeuiModalLoading
            function login(user) {
                //WeuiModalLoading.show();
                //test
                AuthService.setSession('1', '123', '1');
                StateService.go(AuthService.getNextPath());
                //test

                LoginService.login(user.userId, user.password).then(function(response) {
                    if (vm.modal)
                        vm.closeDetailsModal();
                    MessageToaster.success(response.message);
                    AuthService.setSession(response.data.uid, response.data.token,response.data.type);
                    StateService.clearAllAndGo(AuthService.getNextPath());
                }).finally(function() {
                    //WeuiModalLoading.hide();
                });
            }

            function showLoginModal() {
                $ionicModal.fromTemplateUrl('Login/LoginModal.html', {
                    scope: $scope,
                    animation: 'slide-in-up'
                }).then(function(modal) {
                    vm.modal = modal;
                    vm.modal.show();
                });

                vm.closeDetailsModal = function() {
                    vm.modal.remove();
                };
                $scope.$on('$ionicView.leave', function() {
                    vm.modal.remove();
                });
            }

            function showChooseModal() {
                $ionicModal.fromTemplateUrl('Login/ChooseModal.html', {
                    scope: $scope,
                    animation: 'slide-in-up'
                }).then(function(modal) {
                    vm.cmodal = modal;
                    vm.cmodal.show();
                });

                vm.closeChooseModal = function() {
                    vm.cmodal.remove();
                };
                $scope.$on('$ionicView.leave', function() {
                    vm.cmodal.remove();
                });
            }

            function selectChoose(){
                if(vm.choose!=null){
                    //know user choose then login agin with type
                    wxlogin(vm.user, vm.choose);
                }
            }
        });
}());
