(function() {
    "use strict";
    angular.module('organizerInfoCtrl', [])
        .controller('organizerInfoCtrl', function($scope,Constants,StateService) {
            'ngInject';
            var vm = this;
            vm.activated = false;
            $scope.$on('$ionicView.afterEnter', activate);

            function activate() {
                vm.activated = true;
                vm.version = Constants.buildID;
                vm.organizer = {name:'abc 托管',contactName:"sam",contactPhone:"15986632761"};
            }

            vm.back=function(){
                StateService.back();
            };

            vm.edit=function(id){
                //编辑机构信息
                StateService.go('organizerEdit');
            };

        });
}());
