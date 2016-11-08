(function() {
    "use strict";
    angular.module('recordCtrl', [])
        .controller('recordCtrl', function($scope, $state, $stateParams, Constants, StateService, vipBuyService, AuthService, MessageToaster, Session) {
            'ngInject';
            var vm = this;

            vm.activated = false;


            $scope.$on('$ionicView.afterEnter', activate);

            function activate() {
                console.log($stateParams);
                vm.index = $stateParams.index;

                vm.activated = true;
                vm.version = Constants.buildID;
                vm.query(vm.index);
            }

            vm.query = function(id){
                console.log(" index = "+id);
                if(Session.temp.OrderID == id)
                    vm.item=Session.temp;

            };

            vm.back = function(){
                StateService.back();
                Session.temp = null;
            };


        });
}());
