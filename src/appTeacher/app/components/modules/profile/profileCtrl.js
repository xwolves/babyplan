(function() {
    "use strict";
    angular.module('profileCtrl', [])
        .controller('profileCtrl', function($scope, $state, Constants, StateService, parentService, AuthService) {
            'ngInject';
            var vm = this;
            vm.activated = false;
            $scope.$on('$ionicView.afterEnter', activate);

            function activate() {
                vm.activated = true;
                vm.version = Constants.buildID;
                vm.getParent();
                vm.getChildren();
            };

            vm.getParent = function(){
              parentService.queryParent(AuthService.getLoginID()).then(function(data) {
                  if (data.errno == 0) {
                      console.log(data.data);
                      vm.parent = data.data;
                  }
              });
            };

            vm.getChildren = function(){
                parentService.queryChildren(AuthService.getLoginID()).then(function(data) {
                    if (data.errno == 0) {
                        console.log(data.data);
                        vm.children = data.data;
                        var children="";
                        for(var i=0;i<vm.children.length;i++){
                          if(children=="")
                            children+=vm.children[i].name
                          else {
                            children+=","+vm.children[i].name
                          }
                        }
                        vm.childrenName=children;
                    }
                });
            };

            vm.goTo = function(addr,params){
                console.log('go to path : '+addr);
                if(params)console.log(params);
                StateService.go(addr,params);
            };

        });
}());
