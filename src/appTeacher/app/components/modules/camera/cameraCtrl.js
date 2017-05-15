(function() {
    "use strict";
    angular.module('cameraCtrl', [])
        .controller('cameraCtrl', function($scope, Constants, StateService, Session, childrenSteamService, AuthService) {
            'ngInject';

            var vm = this;
            vm.activated = false;
            $scope.$on('$ionicView.afterEnter', activate);
            function activate() {
                vm.activated = true;
                vm.version = Constants.buildID;
                vm.getCamera();
            }

            vm.getCamera = function(){
                childrenSteamService.getCamera(AuthService.getLoginID()).then(function(data) {
                    console.log(data.data);
                    vm.cameras=data.data;
                });
            };

            vm.back=function(){
                StateService.back();
            };

            vm.watchVideo = function(video,name){
              video.deposit_name=name;
              Session.setData('video',JSON.stringify(video));
              StateService.go('video');
            };
        });
}());
