(function() {
    "use strict";
    angular.module('vipTipsCtrl', [])
        .controller('vipTipsCtrl', function($scope, $state, Constants, StateService) {
            'ngInject';
            var vm = this;
            vm.activated = false;
            $scope.$on('$ionicView.afterEnter', activate);
            vm.expend1=false;
            function activate() {
                vm.activated = true;
                vm.version = Constants.buildID;
            }

            vm.back=function(){
                StateService.back();
            };

            vm.test=function(){
                console.log('test');
            }
        });
}());
