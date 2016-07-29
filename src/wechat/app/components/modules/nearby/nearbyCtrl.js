(function() {
    "use strict";
    angular.module('nearbyCtrl', [])
        .controller('nearbyCtrl', function($scope, Constants) {
            'ngInject';
            var vm = this;
            vm.activated = false;

            vm.setBaiduMap=function(){
                var map = new BMap.Map("allmap");    // 创建Map实例
                map.centerAndZoom(new BMap.Point(114.2, 22.5), 11);  // 初始化地图,设置中心点坐标和地图级别
                map.addControl(new BMap.MapTypeControl());   //添加地图类型控件
                map.setCurrentCity("深圳");          // 设置地图显示的城市 此项是必须设置的
                map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
            };

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


            function activate() {
                vm.activated = true;
                vm.version = Constants.buildID;
                //vm.setBaiduMap();
            }
        });
}());
