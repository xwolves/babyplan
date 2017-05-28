(function() {
    "use strict";
    angular.module('teacherCtrl', [])
        .controller('teacherCtrl', function($scope,Constants,StateService,$ionicListDelegate,$ionicPopup,teacherService,AuthService,CacheData,MessageToaster) {
            'ngInject';
            var vm = this;
            vm.activated = false;
            $scope.$on('$ionicView.afterEnter', activate);

            function activate() {
                vm.activated = true;
                vm.version = Constants.buildID;
                vm.getOrganizerTeachers();
            }

            vm.back=function(){
                StateService.back();
            };

            vm.goTo=function(id,item){
                //查看老师信息
                $ionicListDelegate.closeOptionButtons();
                CacheData.putObject(id,item);
                StateService.go('teacherEdit',{cid:id,type:0});
            };

            vm.new=function(){
                //创建新的老师信息
                $ionicListDelegate.closeOptionButtons();
                StateService.go('teacherEdit',{type:1});
            };

            vm.edit=function(id){
                //编辑老师信息
                $ionicListDelegate.closeOptionButtons();
                StateService.go('teacherEdit',{cid:id,type:2});
            };

            vm.delete=function(id){
              teacherService.deleteTeacher(id).then(function(data) {
                  console.log(data);
                  if (data.errno == 0) {
                      vm.getOrganizerTeachers();
                      MessageToaster.info("删除成功");
                  }else{
                      MessageToaster.error("查不到任何数据 "+response.error);
                  }
              });
            };

            vm.del=function(item){
                //删除老师信息
                $ionicListDelegate.closeOptionButtons();

                var confirmPopup = $ionicPopup.confirm({
                    title: '确定要删除此老师:'+item.name,
                    buttons: [
                        {text: '取消', type: 'button-positive'},
                        {text: '确定', type: 'button-assertive',onTap: function(e) { return true}}
                    ]
                });
                confirmPopup.then(function(result) {
                    if(result) {
                        console.log('confirm to del this teacher '+item.uid);
                        //delete(id);
                        vm.delete(item.uid);
                    } else {
                        console.log('cancel delete');
                    }
                });
            };

            vm.getOrganizerTeachers = function(){
                teacherService.queryTeacher(AuthService.getLoginID()).then(function(data) {
                    if (data.errno == 0) {
                        console.log(data.data);
                        vm.teachers = data.data;
                    }
                });
            };
        });
}());
