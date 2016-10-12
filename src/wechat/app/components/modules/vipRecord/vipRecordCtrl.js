(function() {
    "use strict";
    angular.module('vipRecordCtrl', [])
        .controller('vipRecordCtrl', function($scope, $state, Constants, StateService,exitService,AuthService,MessageToaster,Session) {
            'ngInject';
            var vm = this;
            vm.activated = false;

            $scope.$on('$ionicView.afterEnter', activate);

            function activate() {
                vm.activated = true;
                vm.version = Constants.buildID;
                vm.records=[{name:'骗你的数据',time:'2016-09-09 19:59:59'}];
            }

            vm.back=function(){
                StateService.back();
            };
        });
}());
