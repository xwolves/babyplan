(function() {
    "use strict";
    angular.module('exitCtrl', [])
        .controller('exitCtrl', function($scope, $state, Constants, StateService,exitService,AuthService,MessageToaster,Session) {
            'ngInject';
            var vm = this;
            vm.activated = false;
            vm.text='确定要退出本微信用户绑定的业务';//'正在退出...';
            $scope.$on('$ionicView.afterEnter', activate);

            function activate() {
                vm.activated = true;
                vm.version = Constants.buildID;
            }

            vm.exit=function(){
                vm.text='正在退出...';
                exitService.exit(AuthService.getLoginID()).then(function(data) {
                    if (data.errno == 0) {
                        console.log(data.data);
                        vm.text='退出';
                        //需清楚缓存
                        Session.destroy();
                        StateService.clearAllAndGo("register");
                        //StateService.clearAllAndGo(AuthService.getNextPath());
                    }else{
                        console.log(data.error);
                        vm.text='未能退出';
                        MessageToaster.error('退出失败');
                    }
                },function(error){
                    console.log(error);
                    vm.text='退出失败';
                });
            };

            vm.back=function(){
                StateService.back();
            };
        });
}());
