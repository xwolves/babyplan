(function() {
    "use strict";
    angular.module('parentInfoCtrl', [])
        .controller('parentInfoCtrl', function($scope, Constants, StateService) {
            'ngInject';
            var vm = this;
            vm.activated = false;
            $scope.$on('$ionicView.afterEnter', activate);

            function activate() {
                vm.activated = true;
                vm.version = Constants.buildID;
            };

            vm.goTo = function(addr){
                console.log('go to path : '+addr);
                StateService.go(addr);
            };

        });
}());
