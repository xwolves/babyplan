(function () {
    "use strict";
    angular.module('parentCtrl', [])
        .controller('parentCtrl', function ($scope, $q, Constants, MessageToaster, AuthService, StateService, parentService) {
            'ngInject';
            var vm = this;
            vm.activated = false;
            vm.shouldShowDelete = false;
            vm.shouldShowReorder = false;
            vm.listCanSwipe = true

            vm.parentInfo = {
                //name: "���»�",
                //nickName: "���Ļ�",
                //sex: 1,
                //mobile: '1342222235',
                //childrens: [
                //    {
                //        name: '����',
                //        sex:1
                //    },
                //    {
                //        name: '����',
                //        sex: 1
                //    }
                //]
            };



            $scope.$on('$ionicView.afterEnter', activate);

            function activate() {
                vm.activated = true;
                vm.version = Constants.buildID;
                init();
            };

            function init() {
                var pId = AuthService.getLoginID();
                var queryParentPromise = parentService.queryParent(pId);
                var queryChildrensPromise = parentService.queryChildren(pId);

                $q.all([queryParentPromise, queryChildrensPromise]).then(function (results) {
                    vm.parentInfo = results[0].data || {},
                   vm.parentInfo.childrens = results[1].data || [];
                }, function (err) {
                    MessageToaster.error("�����쳣!");
                });
            }

            vm.goTo = function (addr) {
                console.log('go to path : ' + addr);
                StateService.go(addr);
            };

            vm.back = function () {
                StateService.back();
            };


        });
}());
