(function() {
    "use strict";
    angular.module('videoCtrl', [])
        .controller('videoCtrl', function($scope, Session, StateService, Constants) {
            'ngInject';

            var vm = this;
            vm.activated = false;

            $scope.$on('$ionicView.afterEnter', activate);
            function activate() {
                vm.activated = true;
                vm.version = Constants.buildID;
                vm.video=JSON.parse(Session.getData('video'));

                console.log(vm.video);
            }

            vm.back = function(){
                StateService.back();
            };
        });
}());
