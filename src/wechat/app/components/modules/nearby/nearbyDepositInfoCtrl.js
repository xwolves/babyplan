(function() {
    "use strict";
    angular.module('nearbyDepositInfoCtrl', [])
        .controller('nearbyDepositInfoCtrl', function($scope, Constants,nearbyService,CacheData,$stateParams,StateService,organizerService,depositCommentService,parentService,AuthService) {
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
                vm.getParentChildren();
            }

            vm.back=function(){
                StateService.back();
            };

            vm.gotoDepositComment=function(){
                if(vm.access) {
                    StateService.go('depositComment', {id: vm.cid});
                }else{
                    console.log('not allow');
                }
            };

            vm.getParentChildren=function() {
                parentService.queryChildren(AuthService.getLoginID()).then(function(data) {
                    if (data.errno == 0) {
                        console.log(data.data);
                        vm.deposits = data.data;
                        for(var i=0;i<vm.deposits.length;i++){
                            if( vm.cid == vm.deposits[i].depositid){
                                vm.access=true;
                                break;
                            }
                        }

                    }else{
                        console.log(data);
                    }
                });
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
                depositCommentService.getTotalDepositScore(id).then(function(data) {
                    if (data.errno == 0) {
                        console.log(data.data);
                        vm.scores = data.data.scores;
                    }else{
                        console.log(data);
                        if(data.errno==10003){
                            vm.scores=0;
                        }else{
                            console.log('error,get comment fail');
                        }
                    }
                });
            };
        });
}());
