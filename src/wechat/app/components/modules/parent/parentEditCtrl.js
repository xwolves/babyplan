(function() {
    "use strict";
    angular.module('parentEditCtrl', [])
        .controller('parentEditCtrl', function ($scope, Constants, AuthService, parentService, StateService, MessageToaster) {
            'ngInject';
            var vm = this;
            vm.activated = false;
            vm.parentInfo = {
                //name: "刘德华",
                //nickName: "流的花",
                //sex: 1,
                //mobile: '1342222235'
            };

            //页面激活时处理逻辑
            $scope.$on('$ionicView.afterEnter', activate);
            function activate() {
                vm.activated = true;
                vm.version = Constants.buildID;
                init();
            }

            //初始化逻辑
            function init() {
                var pId = AuthService.getLoginID();
                var queryParentPromise = parentService.queryParent(pId).then(function (res) {
                    vm.parentInfo = res.data || {}
                }, function (err) {
                    MessageToaster.error("检索异常!");
                });
            }

            //保存家长信息
            vm.save = function () {
                if (!vm.parentInfo.name) {
                    MessageToaster.error("请填写用户名!");
                    return;
                }

                parentService.updateParent(vm.parentInfo).then(function (res) {
                    vm.back();
                    MessageToaster.error("更新成功!");
                }, function (err) {
                    MessageToaster.error("更新失败!");
                })
            };

            //返回到上一页面
            vm.back = function () {
                StateService.back();
            };
        });
}());
