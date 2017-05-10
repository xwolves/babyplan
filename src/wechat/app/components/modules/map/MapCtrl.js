(function() {
    "use strict";
    angular.module('MapCtrl', [])
        .controller('MapCtrl', function($scope, $state, $stateParams,Constants, StateService, $ionicModal, $window,BaiduService) {
            'ngInject';
            var vm = this;
            vm.activated = false;
            $scope.$on('$ionicView.afterEnter', activate);
            $scope.mapOpts = {
                apiKey: 'IGp7UfrinXNxV6IwrQTC0PWoDCQlf0TR',
                //center: {longitude:113.271,latitude:23.1353},
                keywords: ['托管'],
                zoom: 16,
                onMapLoadFailded: function () {
                    //ionicToast.show('地图加载失败!', 'middle', false, 3000)
                    console.log('地图加载失败');
                }
            };
            vm.type = $stateParams.type;
            console.log("vm.type = "+vm.type);
            if(vm.type==1)$scope.mapOpts.mode = 2;

            function activate() {
                vm.activated = true;
                vm.version = Constants.buildID;
            }

            vm.goTo = function(addr){
                console.log(addr);
                StateService.go(addr);
            };

        });
}());
