(function() {
    "use strict";
    angular.module('parentEditCtrl', [])
        .controller('parentEditCtrl', function($scope, Constants) {
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
