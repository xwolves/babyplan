(function() {
    "use strict";
    angular.module('organizerEditCtrl', [])
        .controller('organizerEditCtrl', function($scope, $stateParams, Constants, StateService) {
            'ngInject';
            var vm = this;
            vm.activated = false;

            vm.query = function(){
                vm.item = {name:'abc'};
            };

            $scope.$on('$ionicView.afterEnter', activate);

            function activate() {
                vm.activated = true;
                vm.version = Constants.buildID;

                vm.query();
            }

            vm.back=function(){
                StateService.back();
            };

            vm.save=function(){
                //save
                StateService.back();
            };


        });
}());
