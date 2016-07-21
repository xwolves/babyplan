(function() {
    "use strict";
    angular.module('registerCtrl', [])
        .controller('registerCtrl', function($scope, Constants) {
            'ngInject';
            var vm = this;
            vm.activated = false;
            console.log("tabs come");
            $scope.$on('$ionicView.afterEnter', activate);

            function activate() {
                vm.activated = true;
                vm.version = Constants.buildID;
            }
        });
}());
