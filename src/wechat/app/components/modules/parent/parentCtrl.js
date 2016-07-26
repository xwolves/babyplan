(function() {
    "use strict";
    angular.module('parentCtrl', [])
        .controller('parentCtrl', function($scope, Constants, StateService) {
            'ngInject';
            var vm = this;
            vm.activated = false;
            $scope.$on('$ionicView.afterEnter', activate);

            function activate() {
                vm.activated = true;
                vm.version = Constants.buildID;
            }

            vm.back=function(){
                StateService.back();
            }
        });
}());
