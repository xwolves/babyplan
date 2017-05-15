(function() {
    "use strict";
    angular.module('organizerCtrl', [])
        .controller('organizerCtrl', function($scope, Constants, StateService,organizerService,AuthService) {
            'ngInject';
            var vm = this;
            vm.activated = false;
            $scope.$on('$ionicView.afterEnter', activate);

            function activate() {
                vm.activated = true;
                vm.version = Constants.buildID;
            }

            vm.goTo = function(addr){
                StateService.go(addr);
            };

            vm.getOrganizer = function(){
                organizerService.queryOrganizer(AuthService.getLoginID()).then(function(data) {
                    if (data.errno == 0) {
                        vm.organizer = data.data;
                    }
                });
            };

            vm.getChildren = function(){
                organizerService.queryTeacher(AuthService.getLoginID()).then(function(data) {
                    if (data.errno == 0) {
                        vm.teacher = data.data;
                    }
                });
            };
        });
}());
