(function() {
    "use strict";
    angular.module('childrenSettingCtrl', [])
        .controller('childrenSettingCtrl', function($scope,Constants,StateService,$ionicListDelegate,$ionicPopup) {
            'ngInject';
            var vm = this;
            vm.activated = false;
            $scope.$on('$ionicView.afterEnter', activate);

            function activate() {
                vm.activated = true;
                vm.version = Constants.buildID;
                vm.children = [{name:'girl B',gendar:'2',sid:'700001'},{name:'boy A',gendar:'1',sid:'222222'}];
            }

            vm.back=function(){
                StateService.back();
            };

            vm.goTo=function(id){
                //查看孩子信息
                $ionicListDelegate.closeOptionButtons();
                StateService.go('childrenEdit',{cid:id,type:0});
            };

            vm.newChild=function(){
                //创建新的孩子信息
                $ionicListDelegate.closeOptionButtons();
                StateService.go('childrenEdit',{type:1});
            };

            vm.editChild=function(id){
                //编辑孩子信息
                $ionicListDelegate.closeOptionButtons();
                StateService.go('childrenEdit',{cid:id,type:2});
            };

            vm.delChild=function(child){
                //删除孩子信息
                $ionicListDelegate.closeOptionButtons();

                var confirmPopup = $ionicPopup.confirm({
                    title: '确定要删除此孩子:'+child.name,
                    buttons: [
                        {text: '取消', type: 'button-positive'},
                        {text: '确定', type: 'button-assertive',onTap: function(e) { return true}}
                    ]
                });
                confirmPopup.then(function(result) {
                    if(result) {
                        console.log('confirm to del this child '+child.sid);
                        //delete(id);
                    } else {
                        console.log('cancel delete');
                    }
                });
            };
        });
}());
