(function() {
    "use strict";
    angular.module('childrenDetailCtrl', [])
        .controller('childrenDetailCtrl', function($scope, $stateParams, Constants, StateService,depositChildrenService) {
            'ngInject';
            var vm = this;
            vm.activated = false;

            vm.query = function(id){
                console.log("child id = "+id);
                depositChildrenService.queryChildren(id).then(function(data) {
                    if (data.errno == 0) {
                        console.log(data.data);
                        vm.child = data.data;
                    }
                });
            };

            $scope.$on('$ionicView.afterEnter', activate);

            function activate() {
                console.log($stateParams);
                vm.cid = $stateParams.cid;
                vm.activated = true;
                vm.version = Constants.buildID;
                vm.query(vm.cid);
            }

            vm.back=function(){
                StateService.back();
            };

        });
}());
