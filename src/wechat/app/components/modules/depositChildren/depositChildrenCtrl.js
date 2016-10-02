(function() {
    "use strict";
    angular.module('depositChildrenCtrl', [])
        .controller('depositChildrenCtrl', function($scope,Constants,StateService,depositChildrenService,AuthService,MessageToaster) {
            'ngInject';
            var vm = this;
            vm.activated = false;
            $scope.$on('$ionicView.afterEnter', activate);

            function activate() {
                vm.activated = true;
                vm.version = Constants.buildID;
                vm.queryChildren();
            }

            vm.back=function(){
                StateService.back();
            };

            vm.goTo=function(id,item){
                //查看孩子的更多家长信息列表
                StateService.go('teacherEdit',{cid:id,type:0});
            };

            vm.queryChildren = function(){
                depositChildrenService.queryDepositChildren(AuthService.getLoginID()).then(function(data) {
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
