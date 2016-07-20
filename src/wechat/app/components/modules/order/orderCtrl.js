(function() {
    "use strict";
    angular.module('orderCtrl', [])
        .controller('orderCtrl', function($scope, Constants) {
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
