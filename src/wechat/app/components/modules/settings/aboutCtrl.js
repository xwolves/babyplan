(function() {
    "use strict";
    angular.module('aboutCtrl', [])
        .controller('aboutCtrl', function($scope, Constants, Session,StateService, MessageToaster, parentService, AuthService ) {
            'ngInject';
            var vm = this;
            vm.activated = false;
            $scope.$on('$ionicView.afterEnter', activate);

            function activate() {
                vm.activated = true;

                cordova.getAppVersion.getVersionNumber(function (version) {
                    vm.version = version;
                });
              
                vm.name = Constants.appTitle;
                vm.company = Constants.company;
            }

            vm.goTo = function(addr){
                console.log('go to path : '+addr);
                StateService.go(addr);
            };

            vm.back=function(){
                StateService.back();
            };


        });
}());
