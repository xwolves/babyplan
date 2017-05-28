(function() {
    "use strict";
    angular.module('childrenEditCtrl', [])
        .controller('childrenEditCtrl', function($scope, $stateParams,$filter, Constants, StateService,childrenSettingService,AuthService,Session,MessageToaster) {
            'ngInject';
            var vm = this;
            vm.activated = false;

            vm.query = function(id){
                console.log("child id = "+id);
                vm.child=Session.getData('temp');
                childrenSettingService.queryChild(id).then(function(data) {
                    if (data.errno == 0) {
                        console.log(data.data);

                        //日期格式字符串转日期
                        data.data.Birthday =data.data.Birthday && new Date(data.data.Birthday);
                        vm.child = data.data;
                    }
                });

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
                else {
                    vm.child = {
                        "Name": "",
                        "Sex": "",
                        "Remark": "",
                        "Birthday": "",
                        "Guardian1": "",
                        "Guardianphone1": "",
                        "Guardianworkplace1": "",
                        "Guardian2": "",
                        "Guardianphone2": "",
                        "Guardianworkplace2": "",
                        "HomeAddr": "",
                        "AllergyRemark": "",
                        "Allergy": "",
                        "FavoriteFood": "",
                        "Grade": "",
                        "SchoolName": "",
                        "ClassTeacherPhone": "",
                        "Course": "",
                        "OpenTime": "",
                        "DepositCardID": "",
                        "DepositType": "",
                        "Benefit": ""
                    };
                }
            }

            vm.back=function(){
                StateService.back();
            };

            vm.save=function(valid,dirty){
                //console.log("valid = "+valid+" dirty = "+dirty);
                if (valid && dirty) {

                    //日期转为日期格式字符串
                    vm.child.Birthday = vm.child.Birthday && $filter('date')(vm.child.Birthday, "yyyy-MM-dd hh:mm");

                    //save
                    if (vm.type == '1') {
                        //create
                        childrenSettingService.registerChild(vm.child, AuthService.getLoginID()).then(function (data) {
                            if (data.errno == 0) {
                                //var userId = data.data.uid;
                                //wxlogin(vm.user.wechat);
                                StateService.back();
                            }
                        });
                    } else {
                        //update
                        childrenSettingService.updateChild(vm.child).then(function (data) {
                            console.log(data);
                            if (data.errno == 0) {
                                StateService.back();
                            }
                        });
                    }
                }else{
                    if(!valid){
                        MessageToaster.info("内容不全，无法更新");
                    }else if(!dirty) {
                        MessageToaster.info("无内容修改，无需更新");
                    }
                }
            };


        });
}());
