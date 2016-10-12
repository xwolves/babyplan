(function() {
    "use strict";
    angular.module('teacherSettingCtrl', [])
        .controller('teacherSettingCtrl', function($scope, $state, Constants, StateService) {
            'ngInject';
            var vm = this;
            vm.activated = false;
            $scope.$on('$ionicView.afterEnter', activate);

            function activate() {
                vm.activated = true;
                vm.version = Constants.buildID;
            }

            vm.goTo = function(addr){
                console.log(addr);
                StateService.go(addr);
            };

        });
}());
