(function() {
    "use strict";
    angular.module('parentCtrl', [])
        .controller('parentCtrl', function($scope, Constants, StateService, parentService, AuthService) {
            'ngInject';
            var vm = this;
            vm.activated = false;
            $scope.$on('$ionicView.afterEnter', activate);

            function activate() {
                vm.activated = true;
                vm.version = Constants.buildID;
                vm.getTeacher();
                vm.getChildren();
            }

            vm.back = function(){
                StateService.back();
            };

            vm.getTeacher = function(){
                parentService.queryParent(AuthService.getLoginID()).then(function(data) {
                    if (data.errno == 0) {
                        console.log(data.data);
                        vm.parent = data.data;
                    }
                });
            };

            vm.getChildren = function(){
                parentService.queryChildren(AuthService.getLoginID()).then(function(data) {
                    if (data.errno == 0) {
                        console.log(data.data);
                        vm.children = data.data;
                    }
                });
            };

        });
}());
