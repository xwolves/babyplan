(function() {
    "use strict";
    angular.module('vipBuyCtrl', [])
        .controller('vipBuyCtrl', function($scope, $state, Constants, StateService,vipBuyService,AuthService,MessageToaster,Session) {
            'ngInject';
            var vm = this;
            vm.activated = false;
            vm.isSelected=-1;
            $scope.$on('$ionicView.afterEnter', activate);

            function activate() {
                vm.activated = true;
                vm.version = Constants.buildID;
                vm.getMenu();
            }

            vm.gotoBuy = function(){
                var where = vm.menu[vm.isSelected];
                Session.setData('temp',JSON.stringify(where));
                StateService.go('buy',{index:where.businessid});
            };

            vm.back = function(){
                StateService.back();
            };

            vm.getMenu = function(){
                vipBuyService.getMenu().then(function(data) {
                    if (data.errno == 0) {
                        console.log(data.data);
                        vm.menu = data.data;
                    }
                });
            };
        });
}());
