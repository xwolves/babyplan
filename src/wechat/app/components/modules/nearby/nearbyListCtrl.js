(function() {
    "use strict";
    angular.module('nearbyListCtrl', [])
        .controller('nearbyListCtrl', function($scope, Constants,nearbyService,StateService,CacheData) {
            'ngInject';
            var vm = this;
            vm.activated = false;
            vm.isMapMode=true;

            $scope.$on('$ionicView.afterEnter', activate);

            $scope.offlineOpts = {
                retryInterval: 10000,
                txt: 'Offline Mode'
            };
            var longitude = 114.2;
            var latitude = 22.5;
            $scope.mapOptions = {
                center: {
                    longitude: longitude,
                    latitude: latitude
                },
                zoom: 11,
                city: 'ShenZhen',
                markers: [{
                    longitude: longitude,
                    latitude: latitude,
                    icon: 'img/mappiont.png',
                    width: 49,
                    height: 60,
                    title: 'Where',
                    content: '这是哪里'
                }]
            };

            $scope.loadMap = function(map) {
                console.log(map);//gets called while map instance created
            };

            vm.loadData=function(longitude,latitude){
                nearbyService.findNearbyDeposit(longitude,latitude).then(function(data) {
                    if (data.errno == 0) {
                        console.log(data.data);
                        vm.list = data.data;
                    }else{
                        console.log('error,find nearby deposit fail');
                        console.log(data);
                    }
                });
            };

            vm.goto=function(item){
                CacheData.putObject(item.AccountID,item);
                StateService.go('nearbyDepositInfo',{id:item.AccountID});
            };

            function activate() {
                vm.activated = true;
                vm.version = Constants.buildID;
                vm.loadData(longitude,latitude);
            }
        });
}());
