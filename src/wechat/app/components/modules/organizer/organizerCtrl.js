(function() {
    "use strict";
    angular.module('organizerCtrl', [])
        .controller('organizerCtrl', function($scope, Constants, StateService) {
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
        });
}());
