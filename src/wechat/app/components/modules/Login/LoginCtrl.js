(function () {
    "use strict";
    angular.module('LoginCtrl', [])
        .controller('LoginCtrl', function (Constants, AuthService, MessageToaster, LoginService, $timeout, $scope, Session, $stateParams, StateService, $ionicModal, Role, $http, eshopService) {
            'ngInject';

            var vm = this;
            vm.isDev = Constants.ENVIRONMENT == 'dev' ? true : false;
            vm.type = '2';
            $scope.$on('$ionicView.beforeEnter', validate);
            vm.user = { userId: 18603070911, password: "82267049" }
            function validate() {
                if (Session.getData('userId') && Session.getData('token') && Session.getData('userId') != '-1') {
                    //AuthService.setSession(response.data.uid, response.data.token, response.data.eshop, response.data.type);
                    $http.defaults.headers.common.token = Session.getData('token');
                    StateService.clearAllAndGo(AuthService.getNextPath());
                } else {
                    console.log("normal login");
                }
            }

            //WeuiModalLoading
            vm.login = function (user) {
                //test
                //AuthService.setSession('1', '123', '1');
                //StateService.go(AuthService.getNextPath());
                //test
                if (user) {
                    LoginService.login(user.userId, user.password).then(function (response) {
                        console.log(response);
                        if (response.errno == 0) {
                            //MessageToaster.success(response.message);
                            //AuthService.setSession(response.data.uid, response.data.token, response.data.eshop, response.data.type);
                            //StateService.clearAllAndGo(AuthService.getNextPath());

                            //登录ESHOP
                            eshopService.signin(user.userId, user.password).then(function (data) {
                                AuthService.setSession(response.data.uid, response.data.token, data, response.data.type);
                                StateService.clearAllAndGo(AuthService.getNextPath());
                            }, function (ex) {
                                MessageToaster.error(ex.error);
                            });
                        } else {
                            MessageToaster.error(response.error);
                        }
                    },
                    function (error) {
                        MessageToaster.error(error);
                    }).finally(function () {
                        //WeuiModalLoading.hide();
                    });
                } else {
                    MessageToaster.error("请输入正确账号密码");
                }
            }

            vm.visit = function () {
                AuthService.setSession('-1', '-1', '-1', '-1');
                StateService.clearAllAndGo(AuthService.getNextPath());
            }

            vm.register = function () {
                StateService.clearAllAndGo("register", { type: vm.type });
            }


        });
}());
