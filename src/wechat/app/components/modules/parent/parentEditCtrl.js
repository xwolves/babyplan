(function() {
    "use strict";
    angular.module('parentEditCtrl', [])
        .controller('parentEditCtrl', function ($scope, Constants, AuthService, parentService, StateService) {
            'ngInject';
            var vm = this;
            vm.activated = false;
            vm.parentInfo = {
                name: "刘德华",
                nickName: "流的花",
                sex: 1,
                mobile: '1342222235'
            };
            $scope.$on('$ionicView.afterEnter', activate);

            function activate() {
                vm.activated = true;
                vm.version = Constants.buildID;
                vm.getChildren();
            }


            vm.getChildren = function(){
                parentService.queryChildren(AuthService.getLoginID()).then(function(data) {
                    if (data.errno == 0) {
                        console.log(data.data);
                        vm.children = data.data;
                    }
                });
            };


            vm.back = function () {
                StateService.back();
            };
        });
}());
