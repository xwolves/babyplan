(function() {
    "use strict";
    angular.module('depositListctrl', [])
        .controller('depositListctrl', function($scope,Constants,StateService,$ionicListDelegate,$ionicPopup,AuthService,parentService,vipBuyService) {
            'ngInject';
            var vm = this;
            vm.activated = false;
            $scope.$on('$ionicView.afterEnter', activate);

            function activate() {
                vm.activated = true;
                vm.version = Constants.buildID;
                vm.getRecords();
            };

            vm.getDeposits = function(){
                parentService.queryChildren(AuthService.getLoginID()).then(function(data) {
                    if (data.errno == 0) {
                        console.log(data.data);
                        vm.deposits = [];
                        var array=[];
                        //获取deposits，取出唯一
                        data.data.forEach(function(item){
                            var obj={};
                            obj.depositid=item.depositid;
                            obj.orgname=item.orgname;
                            //console.log(array);
                            // console.log(item.depositid);
                            if(!array.includes(item.depositid)&& item.depositid ){
                                array[array.length]=item.depositid;
                                vm.deposits[vm.deposits.length]=obj;
                            }
                            //获取机构信息，获取权限是否能查看编辑
                        });
                    }
                });
            };

            vm.getRecords = function () {
                vipBuyService.getOrders(AuthService.getLoginID()).then(function(data) {
                    var isDO=false;
                    if (data.errno == 0) {
                        console.log(data.data);
                        data.data.forEach(function(item){
                            if(item.PayStatus==1){
                                if(!isDO) {
                                    vm.getDeposits();
                                    isDO = true;
                                }
                            }

                        });
                        return false;
                    }
                });
            };

            vm.back=function(){
                StateService.back();
            };

            vm.goToDepositComment=function(did){
                StateService.go('depositComment', {id: did});
            };

        });
}());
