(function() {
    "use strict";
    angular.module('childrenEditCtrl', [])
        .controller('childrenEditCtrl', function($scope, $stateParams, Constants, StateService,childrenSettingService,AuthService,Session) {
            'ngInject';
            var vm = this;
            vm.activated = false;

            vm.query = function(id){
                console.log("child id = "+id);
                vm.child=Session.temp;
            };

            $scope.$on('$ionicView.afterEnter', activate);

            function activate() {
                console.log($stateParams);
                vm.cid = $stateParams.cid;
                //0:query 1:create 2:update
                vm.type = $stateParams.type;
                if(vm.type=='0')vm.isEditing = false;
                else vm.isEditing = true;

                vm.activated = true;
                vm.version = Constants.buildID;

                if(vm.type!='1')vm.query(vm.cid);
                else vm.child = {name:'',sex:'',remark:'',relationship:''};
            }

            vm.back=function(){
                StateService.back();
            };

            vm.save=function(){
                //save
                if(vm.type=='1'){
                    //create
                    childrenSettingService.registerChildren(vm.child,AuthService.getLoginID()).then(function(data) {
                        if (data.errno == 0) {
                            //var userId = data.data.uid;
                            //wxlogin(vm.user.wechat);
                            StateService.back();
                        }
                    });

                }else{
                    //update
                    StateService.back();
                }

            };


        });
}());
