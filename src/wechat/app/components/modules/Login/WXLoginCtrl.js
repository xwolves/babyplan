(function() {
    "use strict";
    angular.module('WXLoginCtrl', [])
        .controller('WXLoginCtrl', function(AppServices, Constants, WeuiModalLoading, MessageToaster, LoginService, $timeout, $scope, Session, $stateParams, StateService, $ionicModal) {
            'ngInject';
            var vm = this;
            vm.isDev = Constants.ENVIRONMENT == 'dev' ? true : false;
            $scope.$on('$ionicView.beforeEnter', validate);
            AppServices.updateWxTitle('托管系统');

            function validate() {
                var user = $stateParams.user;
                var token = $stateParams.token;

                if (user && token) {
                    //login successed
                    Session.create(user, token);
                    StateService.clearAllAndGo('tabs');
                } else {
                    //login failed
                    vm.info = "未登录，需要微信授权..."
                    vm.showLoginModal = showLoginModal;
                    vm.login = login;
                }
            }

            function login(user) {
                WeuiModalLoading.show();
                LoginService.login(user.userId, user.password).then(function(response) {
                    if (vm.modal)
                        vm.closeDetailsModal();
                    MessageToaster.success(response.message);
                    Session.create(response.content.xsxh, response.content.token);
                    StateService.clearAllAndGo('tabs');
                }).finally(function() {
                    WeuiModalLoading.hide();
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
