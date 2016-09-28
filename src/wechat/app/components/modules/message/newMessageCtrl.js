(function() {
    "use strict";
    angular.module('newMessageCtrl', [])
        .controller('newMessageCtrl', function($scope, Constants, messageService, AuthService, StateService, teacherService, MessageToaster) {
            'ngInject';
            var vm = this;
            vm.activated = false;
            $scope.$on('$ionicView.afterEnter', activate);
            vm.id=AuthService.getLoginID();
            vm.dailyType='3';
            vm.desc="";
            vm.imgPosition=0;
            vm.imgCal=0;
            vm.imgs=[];
            vm.imgshow=[];
            function activate() {
                vm.activated = true;
                vm.version = Constants.buildID;
                teacherService.queryTeacherDeposit(vm.id).then(function(data) {
                    console.log(data);
                    if(data!=null && data.data !=null && data.data.length>0)vm.deposit=data.data[0];
                });
            }

            vm.save=function(which){
                if(vm.imgs.length>0){
                    var data=vm.imgs[which];
                    if(data!=null)messageService.postPhoto(data).then(function(e) {
                        console.log(e);
                        console.log(e.data.fileurl);
                        vm.imgs[vm.imgCal]=e.data.fileurl;
                        vm.imgCal++;
                        if(vm.imgCal==vm.imgs.length){
                            console.log(vm.imgs);
                            vm.saveData();
                        }else {
                            vm.save(vm.imgCal);
                        }
                    });
                }else{
                    vm.saveData();
                }
            };

            //infotype:信息类型（1：就餐；2：培训；3：活动；4：作业）
            vm.saveData=function(){
                var data={
                    "depositid": Number(vm.deposit.depositid),
                    "publisherid": Number(vm.id),
                    "infotype":Number(vm.dailyType),
                    "latitude":"",
                    "longitude":"",
                    "description":vm.desc,
                    "imgs":vm.imgs
                };
                messageService.newMsg(data).then(function(data) {
                    console.log(data);
                    if(data.errno==0){
                        StateService.back();
                    }else{
                        MessageToaster.error(data.error);
                    }
                });
            };

            vm.back=function(){
                StateService.back();
            };

            $scope.fileSelect=function(event){
                //console.log(event);
                var files = event.target.files;
                $scope.fileName=files[0].name;
                var fileReader = new FileReader();
                console.log(files);
                vm.imgs[vm.imgPosition] = files[0];
                console.log(files[0]);
                //vm.imgPosition++;
                $scope.$apply();
                fileReader.readAsDataURL(files[0]);
                fileReader.onload = function(e) {
                    //console.log(e);
                    vm.imgshow[vm.imgPosition] = this.result;
                    //console.log(this.result);
                    vm.imgPosition++;
                    $scope.$apply();
                };
            }
        });
}());
