(function() {
    "use strict";
    angular.module('messageCtrl', [])
        .controller('messageCtrl', function($scope, Constants, messageService, AuthService, StateService,Session) {
            'ngInject';
            var vm = this;
            vm.activated = false;
            $scope.$on('$ionicView.afterEnter', activate);

            function activate() {
                vm.activated = true;
                vm.version = Constants.buildID;
                messageService.getMsg(AuthService.getLoginID()).then(function(data) {
                    console.log(data);
                    vm.msg=data.data;
                });
            }

            vm.goPhoto=function(msgIndex,index){
                Session.temp=vm.msg[msgIndex];
                StateService.go("photo",{index:index});
            };

            vm.new=function(id){
                //创建信息
                StateService.go('newMessage');
            };

        });
}());
