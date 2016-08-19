(function() {
    "use strict";
    angular.module('teacherEditCtrl', [])
        .controller('teacherEditCtrl', function($scope, $stateParams, Constants, StateService, teacherService, AuthService, CacheData) {
            'ngInject';
            var vm = this;
            vm.activated = false;

            vm.query = function(id){
                vm.item =CacheData.getObject(vm.cid);
                //vm.item = {name:'girl B',gendar:'2',sid:id,remark:'abcdefg'};
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
            }

            vm.back=function(){
                StateService.back();
            };

            vm.save=function(){
                    console.log(vm.item);
                console.log();
                    //create
                    teacherService.createTeacher(vm.item,AuthService.getLoginID()).then(function(data) {
                        if (data.errno == 0) {
                            //var userId = data.data.uid;
                            //wxlogin(vm.user.wechat);
                            StateService.back();
                        }
                    });
                //}else{
                //    StateService.back();
                //}
            };


        });
}());
