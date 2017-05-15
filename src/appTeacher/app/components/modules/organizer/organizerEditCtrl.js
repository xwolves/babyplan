(function() {
    "use strict";
    angular.module('organizerEditCtrl', [])
        .controller('organizerEditCtrl', function($scope, $stateParams, Constants, MessageToaster, AuthService, StateService, organizerService) {
            'ngInject';
            var vm = this;
            vm.activated = false;

            $scope.$on('$ionicView.afterEnter', activate);

            function activate() {
                vm.activated = true;
                vm.version = Constants.buildID;

                vm.getOrganizer();
            }

            vm.back=function(){
                StateService.back();
            };

            vm.save=function(){
                var data={
                    contactphone: vm.organizer.ContactPhone,
                    address:vm.organizer.Address,
                    contactname:vm.organizer.ContactName,
                    remark:"备注描述"
                };
                if(angular.isUndefined(vm.organizer.Address)||vm.organizer.Address==null||vm.organizer.Address.length==0){
                    MessageToaster.error("机构地址不正确");
                    return ;
                }
                if(angular.isUndefined(vm.organizer.ContactName)||vm.organizer.ContactName==null||vm.organizer.ContactName.length==0){
                    MessageToaster.error("联系人不正确");
                    return ;
                }
                if(angular.isUndefined(vm.organizer.ContactPhone)||vm.organizer.ContactPhone==null||vm.organizer.ContactPhone.length==0
                    ||vm.organizer.ContactPhone.length!=11){
                    MessageToaster.error("联系人电话不正确");
                    return ;
                }
                organizerService.updateOrganizer(AuthService.getLoginID(),data).then(function(response) {
                    console.log(response);
                    if(response.errno==0)
                        MessageToaster.success("更新成功");
                    else
                        MessageToaster.error("更新失败");
                    return ;
                }).finally(function() {
                    StateService.back();
                });

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
