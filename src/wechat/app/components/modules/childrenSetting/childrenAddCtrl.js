(function() {
    "use strict";
    angular.module('childrenAddCtrl', [])
        .controller('childrenAddCtrl', function($scope, $stateParams, Constants, StateService) {
            'ngInject';
            var vm = this;
            vm.activated = false;
            vm.page = 1;
            vm.child = {sex:'1'};
            $scope.$on('$ionicView.afterEnter', activate);

            function activate() {
                //console.log($stateParams);
                //vm.cid = $stateParams.cid;
                ////0:query 1:create 2:update
                //vm.type = $stateParams.type;
                //if(vm.type=='0')vm.isEditing = false;
                //else vm.isEditing = true;

                vm.activated = true;
                vm.version = Constants.buildID;

            }

            vm.back=function(){
                StateService.back();
            };

            vm.next=function(){
                if(vm.page==5){
                    //save data
                }else{
                    vm.page++;
                }
            };

            vm.prev=function(){
                if(vm.page==1){
                    // it is the first,no prev
                }else{
                    vm.page--;
                }
            };
        });
}());
