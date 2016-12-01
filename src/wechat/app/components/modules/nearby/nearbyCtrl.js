(function() {
    "use strict";
    angular.module('nearbyCtrl', [])
        .controller('nearbyCtrl', function($scope, Constants,nearbyService,MessageToaster,StateService,Session,CacheData) {
            'ngInject';

            var vm = this;
            vm.activated = false;
            vm.map = null;
            vm.point = null;
            vm.city = 'shenzhen';
            vm.show=false;
            vm.distance = 5000;
            vm.changeName = '列表';
            $scope.temp={mine:null,baidu:null};
            vm.list=[];

            var watch = $scope.$watchGroup(['temp.mine','temp.baidu'],function(newValue, oldValue, scope){
                console.log(newValue);
                //console.log(oldValue);
                if(newValue[0]!=null && newValue[1]!=null){
                    console.log('ok ,do it');
                    //确认距离，锁定在10000
                    for(var i=0;i<newValue[0].length;i++){
                        if(newValue[0][i].Dist < vm.distance*2){
                            vm.list.push(newValue[0][i]);
                            var marker = new BMap.Marker(new BMap.Point(newValue[0][i].Longitude,newValue[0][i].Latitude));  // 创建标注
                            var number = vm.list.length;
                            var label=new BMap.Label(''+number);
                            var margin=4;
                            if(number>9)margin=0;
                            label.setStyle({
                                "color":"white",
                                "background":"none",
                                "fontSize":"14px",
                                "margin-left":margin+"px",
                                "border":"0"});
                            marker.setLabel(label);
                            var content=vm.getOrgContent(newValue[0][i]);
                            marker.setTitle(newValue[0][i].OrgName);
                            vm.map.addOverlay(marker);
                            vm.addClickHandler(content,marker);
                        }
                    }

                    console.log(vm.list);
                    //检查百度是否有我们的数据一样的信息
                    //将百度数据转成我们的
                    for(var i=0;i<newValue[1].length;i++){
                            var tmp={
                                AccountID: i,
                                Address: newValue[1][i].address,
                                Dist: vm.map.getDistance(vm.point,newValue[1][i].point).toFixed(0),
                                FrontDeskLink: "./img/place.png",
                                Latitude: newValue[1][i].point.lat,
                                Longitude:newValue[1][i].point.lng,
                                OrgName: newValue[1][i].title
                            };
                            vm.list.push(tmp);
                        var marker = new BMap.Marker(newValue[1][i].point);  // 创建标注
                        var number = vm.list.length;
                        var label=new BMap.Label(''+number);
                        var margin=4;
                        var content=vm.getOrgContent(tmp);
                        if(number>9)margin=0;
                        label.setStyle({
                            "color":"white",
                            "background":"none",
                            "fontSize":"14px",
                            "margin-left":margin+"px",
                            "border":"0"});
                        marker.setLabel(label);
                        marker.setTitle(newValue[1][i].title);
                        vm.map.addOverlay(marker);              // 将标注添加到地图中
                        vm.addClickHandler(content,marker);
                    }
                    console.log(vm.list);
                    //清空tmp
                    $scope.temp={mine:null,baidu:null};
                    //vm.show=true;
                    //显示在列表，

                    //显示在图片
                }else if(newValue[0]!=null){
                    console.log('get babyplan data');
                }else if(newValue[1]!=null){
                    console.log('get baidu map data');
                }
            });

            vm.addClickHandler=function(content,marker){
                marker.addEventListener("click",function(e){
                        vm.openInfo(content,e)}
                );
            };

            vm.openInfo=function(content,e){
                var p = e.target;
                var point = new BMap.Point(p.getPosition().lng, p.getPosition().lat);
                var infoWindow = new BMap.InfoWindow(content,{enableCloseOnClick:true});  // 创建信息窗口对象
                vm.map.openInfoWindow(infoWindow,point); //开启信息窗口
            };

            vm.getOrgContent = function(org){
                var sContent =
                    "<h4 style='margin:0 0 5px 0;padding:0.2em 0'>"+org.OrgName+"</h4>" +
                    "<img style='margin:4px' id='imgDemo' src='"+org.FrontDeskLink+"' width='139' height='104' title='"+org.OrgName+"'/>" +
                    "<p style='margin:0;line-height:1.5;font-size:13px;text-indent:2em'>"+org.Address+"</p>" ;
                if(org.AccountID.length==8){
                    sContent+="<a class='button' href='#nearbyDepositInfo?id="+org.AccountID+"' target='_self' >更多信息</a>";
                }
                return sContent;
            };

            vm.search=function(){
                vm.list=[];
                vm.searchOurInfo();
                vm.searchNearBy(vm.inputData);
            };

            vm.change=function(){
                vm.show=!vm.show;
                if(vm.show){
                    vm.changeName = '地图';
                }else {
                    vm.changeName = '列表';
                }
            };

            vm.searchOurInfo=function(){
                if(vm.point != null) {
                    nearbyService.findNearbyDeposit(vm.point.lng, vm.point.lat).then(function (data) {
                        if (data.errno == 0) {
                            console.log(data.data);
                            //是否要删除圆形范围内
                            $scope.temp.mine = data.data;
                        } else {
                            console.log('error,find nearby deposit fail');
                            console.log(data);
                        }
                    });
                }else{
                    MessageToaster.error("定位不成功");
                }
            };

            //renderOptions: {map: vm.map, panel: "r-result"},
            vm.searchNearBy=function(data){
                var myPoint=null;
                if(data!=null) {
                    var myGeo = new BMap.Geocoder();
                    // 将地址解析结果显示在地图上,并调整地图视野
                    console.log(data);
                    myGeo.getPoint(data, function (point) {
                        if (point) {
                            console.log("change address point");
                            console.log(point);
                            myPoint=point;
                            vm.map.clearOverlays();
                            vm.map.centerAndZoom(point, 15);
                            vm.map.addOverlay(new BMap.Marker(point));
                            vm.map.panTo(point);

                            var local = new BMap.LocalSearch(vm.map, {
                                renderOptions:{},
                                onSearchComplete: vm.onSearchComplete
                            });
                            local.searchNearby('托管',myPoint, vm.distance);
                        } else {
                            alert("您选择地址没有解析到结果!");
                        }
                    }, vm.city);
                }else{
                    myPoint=vm.point;
                }
                var local = new BMap.LocalSearch(vm.map, {
                    renderOptions:{},
                    onSearchComplete: vm.onSearchComplete
                    });
                local.searchNearby('托管',myPoint, vm.distance);
                //local.search("托管");
            };

            vm.onSearchComplete=function(results){
                console.log(results);
                $scope.temp.baidu = results.wr;
            };

            vm.setMapControl=function(map){
                // 添加定位控件
                var geolocationControl = new BMap.GeolocationControl();
                geolocationControl.addEventListener("locationSuccess", function(e){
                    // 定位成功事件
                    var address = '';
                    address += e.addressComponent.province;
                    address += e.addressComponent.city;
                    address += e.addressComponent.district;
                    address += e.addressComponent.street;
                    address += e.addressComponent.streetNumber;
                    alert("当前定位地址为：" + address);

                });
                geolocationControl.addEventListener("locationError",function(e){
                    // 定位失败事件
                    alert(e.message);
                });
                map.addControl(geolocationControl);

                //添加地图类型控件
                map.addControl(new BMap.MapTypeControl());
            };

            vm.setBaiduMap=function(){
                vm.map = new BMap.Map("allmap");    // 创建Map实例
                vm.setMapControl(vm.map);
                //get position
                var geolocation = new BMap.Geolocation();
                geolocation.getCurrentPosition(function(r){
                    if(this.getStatus() == BMAP_STATUS_SUCCESS){
                        vm.city = r.address.city;
                        vm.map.setCurrentCity(vm.city);
                        vm.point = r.point;
                        vm.map.centerAndZoom(vm.point , 15);  // 初始化地图,设置中心点坐标和地图级别
                        var myIcon = new BMap.Icon("http://api.map.baidu.com/img/markers.png", new BMap.Size(23, 25), {
                            offset: new BMap.Size(10, 25), // 指定定位位置
                            imageOffset: new BMap.Size(0, 0 - 10 * 25) // 设置图片偏移
                        });
                        var mk = new BMap.Marker(r.point,{icon:myIcon});
                        vm.map.addOverlay(mk);
                        vm.map.panTo(r.point);
                    } else {
                        alert('failed'+this.getStatus());
                    }
                },{enableHighAccuracy: true})
            };

            vm.goto=function(item){
                if(item.AccountID.length!=8){
                    MessageToaster.error("暂不提供此信息");
                }else {
                    CacheData.putObject(item.AccountID, item);
                    StateService.go('nearbyDepositInfo', {id: item.AccountID});
                }
            };

            $scope.$on('$ionicView.afterEnter', activate);

            function activate() {
                vm.activated = true;
                vm.version = Constants.buildID;
                vm.setBaiduMap();
            }
        });


}());
