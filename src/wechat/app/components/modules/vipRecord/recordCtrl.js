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
                var temp=Session.getData('temp');
                if(temp.OrderID == id)
                    vm.item=temp;

            };

            vm.back = function(){
                StateService.back();
                Session.rmData('temp');
            };


        });
}());
