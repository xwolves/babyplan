(function() {
    "use strict";
    angular.module('WXLoginCtrl', [])
        .controller('WXLoginCtrl', function(Constants, AuthService, MessageToaster, LoginService, $timeout, $scope, Session, $stateParams, StateService, $ionicModal, Role) {
            'ngInject';

            var vm = this;
            vm.isDev = Constants.ENVIRONMENT == 'dev' ? true : false;
            $scope.$on('$ionicView.beforeEnter', validate);

            function validate() {
                var user = $stateParams.user;
                var token = $stateParams.token;
                var role = $stateParams.role;
                if (user && token) {
                    //login successed
                    Session.create(user, token, role);
                    StateService.clearAllAndGo(AuthService.getNextPath());
                } else if (user && role==Role.unknown) {
                    //有用户信息,但角色为未知,需要注册绑定
                    StateService.clearAllAndGo('register');
                } else {
                    //login failed
                    vm.info = "未登录，需要微信授权...";
                    vm.showLoginModal = showLoginModal;
                    vm.login = login;
                }
            }
            //WeuiModalLoading
            function login(user) {
                //WeuiModalLoading.show();
                //test
                Session.create('1', '123', '2');
                StateService.go(AuthService.getNextPath());
                //test

                LoginService.login(user.userId, user.password).then(function(response) {
                    if (vm.modal)
                        vm.closeDetailsModal();
                    MessageToaster.success(response.message);

                    Session.create(response.content.userId, response.content.token,response.content.role);
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
        });
}());
