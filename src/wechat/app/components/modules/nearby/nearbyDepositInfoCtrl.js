(function() {
    "use strict";
    angular.module('nearbyDepositInfoCtrl', [])
        .controller('nearbyDepositInfoCtrl', function($scope, Constants,nearbyService,CacheData,$stateParams,StateService,organizerService,commentService) {
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
                vm.getMoreInfo(vm.cid);
                vm.getComment(vm.cid);
            }

            vm.back=function(){
                StateService.back();
            };

            vm.getMoreInfo=function(id){
                organizerService.queryDepositInfo(id).then(function(data) {
                    if (data.errno == 0) {
                        console.log(data.data);
                        vm.more = data.data;
                    }else{
                        console.log('error,find nearby deposit fail');
                        console.log(data);
                    }
                });
            };

            vm.getComment=function(id){
                commentService.queryDepositComment(id).then(function(data) {
                    if (data.errno == 0) {
                        console.log(data.data);
                        vm.comments = data.data;
                    }else{
                        console.log('error,get comment fail');
                        console.log(data);
                    }
                });
            };
        });
}());
