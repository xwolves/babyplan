(function() {
    "use strict";
    angular.module('teacherDepositChildrenCtrl', [])
        .controller('teacherDepositChildrenCtrl', function($scope,Constants,StateService,depositChildrenService,AuthService,MessageToaster,teacherService) {
            'ngInject';
            var vm = this;
            vm.activated = false;
            $scope.$on('$ionicView.afterEnter', activate);

            function activate() {
                vm.activated = true;
                vm.version = Constants.buildID;
                teacherService.queryTeacherDeposit(AuthService.getLoginID()).then(function(data) {
                    if (data.errno == 0) {
                        console.log(data.data);
                        if(data.data!=null&&data.data.length>0) {
                            vm.teacher = data.data[0];
                            vm.queryChildren(vm.teacher.depositid);
                        }
                    } else {
                        MessageToaster.error("查不到任何数据 " + data.error);
                    }
                });

            }

            vm.back=function(){
                StateService.back();
            };

            vm.goTo=function(id,item){
                //查看孩子的更多家长信息列表
                StateService.go('teacherEdit',{cid:id,type:0});
            };

            vm.queryChildren = function(id){
                depositChildrenService.queryDepositChildren(id).then(function(data) {
                    if (data.errno == 0) {
                        console.log(data.data);
                        vm.children = data.data;
                    }else{
                        MessageToaster.error("查不到任何数据 "+response.error);
                    }
                });
            };
        });
}());
