(function() {
    "use strict";
    angular.module('vipBuyCtrl', [])
        .controller('vipBuyCtrl', function($scope, $state, Constants, StateService,exitService,AuthService,MessageToaster,Session) {
            'ngInject';
            var vm = this;
            vm.activated = false;
            vm.isSelected=false;
            $scope.$on('$ionicView.afterEnter', activate);

            function activate() {
                vm.activated = true;
                vm.version = Constants.buildID;
            }

            vm.pay=function(){

            };

            vm.back=function(){
                StateService.back();
            };
        });
}());
