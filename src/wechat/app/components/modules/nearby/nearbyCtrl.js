(function() {
    "use strict";
    angular.module('nearbyCtrl', [])
        .controller('nearbyCtrl', function($scope, Constants) {
            'ngInject';
            var vm = this;
            vm.activated = false;
            $scope.$on('$ionicView.afterEnter', activate);

            function activate() {
                vm.activated = true;
                vm.version = Constants.buildID;
            }
        });
}());
