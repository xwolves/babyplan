(function() {
    "use strict";
    angular.module('childrenAddCtrl', [])
        .controller('childrenAddCtrl', function($scope, $stateParams, Constants, StateService, childrenSettingService, AuthService) {
            'ngInject';
            var vm = this;
            vm.activated = false;
            vm.page = 1;
            vm.child = {
                "name": "",
                "sex": "1",
                "remark": "",
                "birthday": "",
                "relationship": "",
                "guardian1": "",
                "guardianPhone1": "",
                "guardianWorkplace1": "",
                "guardian2": "",
                "guardianPhone2": "",
                "guardianWorkplace2": "",
                "homeAddr": "",
                "allergyRemark": "",
                "allergy": "0",
                "favoriteFood": "",
                "grade": "",
                "schoolName": "",
                "classTeacherPhone": ""
            };//{sex:'1'};
            $scope.$on('$ionicView.afterEnter', activate);

            function activate() {
                //console.log($stateParams);
                //vm.cid = $stateParams.cid;
                ////0:query 1:create 2:update
                //vm.type = $stateParams.type;
                //if(vm.type=='0')vm.isEditing = false;
                //else vm.isEditing = true;

                vm.activated = true;
                vm.version = Constants.buildID;

            }

            vm.back=function(){
                StateService.back();
            };

            vm.next=function(){
                if(vm.page==5){
                    //save data
                    //alert('尚未开放');
                    console.log(vm.child.birthday);
                    var date=new Date();
                    console.log(vm.child.birthday.getTime());

                    childrenSettingService.registerChild(vm.child, AuthService.getLoginID()).then(function (data) {
                        console.log(data);
                        if (data.errno == 0) {
                            //var userId = data.data.uid;
                            //wxlogin(vm.user.wechat);
                            StateService.back();
                        }
                    });
                }else{
                    vm.page++;
                }
            };

            vm.prev=function(){
                if(vm.page==1){
                    // it is the first,no prev
                }else{
                    vm.page--;
                }
            };
        });
}());
