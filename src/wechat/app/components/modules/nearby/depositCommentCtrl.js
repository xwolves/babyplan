(function() {
    "use strict";
    angular.module('depositCommentCtrl', [])
        .controller('depositCommentCtrl', function($scope, Constants,$stateParams,StateService,AuthService,depositCommentService,MessageToaster) {
            'ngInject';
            var vm = this;
            vm.activated = false;
            vm.item = {
                "scores":{
                    "kitchen":0,
                    "food":0,
                    "roadsafety":0,
                    "edufiresafety":0,
                    "teacherresp":0
                },
                "commenttext":""
            };
            $scope.$on('$ionicView.afterEnter', activate);

            function activate() {
                console.log($stateParams);
                vm.cid = $stateParams.id;
                //vm.cid='10000002';//test
                console.log("deposit id = "+vm.cid);
                vm.activated = true;
                vm.version = Constants.buildID;
                vm.getComment(AuthService.getLoginID(),vm.cid);
                //vm.getCommentScores(vm.cid);//test
            }

            vm.back=function(){
                StateService.back();
            };

            vm.cancel=function(){
                vm.isEditing=false;
                //data return
                vm.item=angular.copy(vm.itembackup);
                vm.itembackup=null;
            };

            vm.edit=function(){
                vm.isEditing=true;;
                vm.itembackup=angular.copy(vm.item);
            };

            vm.save=function(){
                //check data
                vm.item.depositid=vm.cid;
                vm.item.parentid=AuthService.getLoginID();
                depositCommentService.saveDepositComment(vm.item).then(function(data) {
                    console.log(data);
                    if (data.errno == 0) {
                        //vm.item = data.data;
                        vm.isEditing=false;
                        vm.itembackup=null;
                        MessageToaster.error("更新成功");
                        vm.getComment(AuthService.getLoginID(),vm.cid);
                    }else{
                        console.log('error,get comment fail');
                        console.log(data);
                    }
                });

            };

            vm.getComment=function(pid,did){
                depositCommentService.getDepositComment(pid,did).then(function(data) {
                    if (data.errno == 0) {
                        console.log(data.data);
                        vm.item = data.data;
                    }else{
                        console.log(data);
                        if(data.errno==10003){
                            vm.edit();
                        }else{
                            console.log('error,get comment fail');
                        }
                    }
                });
            };

            vm.getCommentScores=function(id){
                depositCommentService.getTotalDepositScore(id).then(function(data) {
                        console.log(data);
                });
            };
        });
}());
