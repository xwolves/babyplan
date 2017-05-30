(function() {
    "use strict";
    angular.module('settingsCtrl', [])
        .controller('settingsCtrl', function($scope, Constants, StateService, $ionicPopup, MessageToaster) {
            'ngInject';
            var vm = this;
            vm.activated = false;
            $scope.$on('$ionicView.afterEnter', activate);

            function activate() {
                vm.activated = true;
                vm.version = Constants.buildID;
            }

            vm.goTo = function(addr){
                console.log('go to path : '+addr);
                StateService.go(addr);
            };

            vm.askClearCache = function() {
              var confirmPopup = $ionicPopup.confirm({
                  title: '确定要清除缓存？',
                  buttons: [
                      {text: '取消', type: 'button-positive'},
                      {text: '确定', type: 'button-assertive',onTap: function(e) { return true}}
                  ]
              });
              confirmPopup.then(function(result) {
                  if(result) {
                      console.log('confirm to clear cache');
                      console.log(result);
                      //delete(id);
                      window.CacheClear(function(data){
                        console.log(data);
                        MessageToaster.info('清除缓存成功'+JSON.stringify(data));
                      }, function(errordata){
                        console.log(errordata);
                        MessageToaster.error('清除缓存失败'+JSON.stringify(errordata));
                      });
                  } else {
                      console.log('cancel delete');
                  }
              });
            };

            vm.back=function(){
                StateService.back();
            };

            vm.changePsw=function(){
                StateService.go('changePsw');
            };
        });
}());
