(function() {
    "use strict";
    angular.module('vipRecordCtrl', [])
        .controller('vipRecordCtrl', function($scope, $state, Constants, StateService,vipBuyService,AuthService,MessageToaster,Session) {
            'ngInject';
            var vm = this;
            vm.activated = false;

            $scope.$on('$ionicView.afterEnter', activate);

            function activate() {
                vm.activated = true;
                vm.version = Constants.buildID;
                vm.getRecords();
            }

            vm.back=function(){
                StateService.back();
            };

            vm.goTo=function(id,item){
                Session.temp=item;
                StateService.go('record',{index:id});
            };

            vm.getRecords = function () {
                vipBuyService.getOrders(AuthService.getLoginID()).then(function(data) {
                    if (data.errno == 0) {
                        console.log(data.data);
                        vm.records = data.data;
                    }
                });
            };
        });
}());
