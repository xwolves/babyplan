(function() {
    "use strict";
    angular.module('nearbyDepositInfoCtrl', [])
        .controller('nearbyDepositInfoCtrl', function($scope, Constants,nearbyService,CacheData,$stateParams,StateService) {
            'ngInject';
            var vm = this;
            vm.activated = false;

            $scope.$on('$ionicView.afterEnter', activate);

            function activate() {
                console.log($stateParams);
                vm.cid = $stateParams.id;
                console.log("id = "+vm.cid);
                vm.activated = true;
                vm.version = Constants.buildID;
                vm.item =CacheData.getObject(vm.cid);
                console.log(vm.item);
            }

            vm.back=function(){
                StateService.back();
            };
        });
}());
