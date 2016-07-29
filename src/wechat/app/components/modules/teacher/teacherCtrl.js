(function() {
    "use strict";
    angular.module('teacherCtrl', [])
        .controller('teacherCtrl', function($scope,Constants,StateService,$ionicListDelegate,$ionicPopup) {
            'ngInject';
            var vm = this;
            vm.activated = false;
            $scope.$on('$ionicView.afterEnter', activate);

            function activate() {
                vm.activated = true;
                vm.version = Constants.buildID;
                vm.items = [{name:'girl B',gendar:'2',sid:'700001'},{name:'boy A',gendar:'1',sid:'222222'}];
            }

            vm.back=function(){
                StateService.back();
            };

            vm.goTo=function(id){
                //查看老师信息
                $ionicListDelegate.closeOptionButtons();
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
                        console.log('confirm to del this teacher '+item.sid);
                        //delete(id);
                    } else {
                        console.log('cancel delete');
                    }
                });
            };
        });
}());
