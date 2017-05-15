(function() {
    "use strict";
    angular.module('organizerInfoCtrl', [])
        .controller('organizerInfoCtrl', function($scope,Constants,StateService,organizerService,AuthService) {
            'ngInject';
            var vm = this;
            vm.activated = false;
            $scope.$on('$ionicView.afterEnter', activate);

            function activate() {
                vm.activated = true;
                vm.version = Constants.buildID;
                //vm.organizer = {name:'abc 托管',contactName:"sam",contactPhone:"15986632761"};
                vm.getOrganizer();
            }

            vm.back=function(){
                StateService.back();
            };

            vm.edit=function(id){
                //编辑机构信息
                StateService.go('organizerEdit');
            };

            vm.getOrganizer = function(){
                organizerService.queryOrganizer(AuthService.getLoginID()).then(function(data) {
                    if (data.errno == 0) {
                        console.log(data.data);
                        vm.organizer = data.data;
                    }
                });
            };
        });
}());
