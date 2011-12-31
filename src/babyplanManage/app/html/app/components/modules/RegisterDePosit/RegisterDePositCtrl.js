(function() {
	"use strict";
	angular.module('RegisterDePositCtrl', []).controller(
			'RegisterDePositCtrl',
			function($scope, WebService, toaster, $http, $state, $stateParams,AuthService) {

				$scope.init = function($scope,$stateParams) {
					
					if ($stateParams.accountID == null) {
						//$scope.isnew = false;
						$scope.isnew = true;
					}
					else{
						$scope.isnew = true;
						WebService
						.queryDepostbyid($stateParams.accountID)
						.then(
								function(data) {
									$scope.content = data;
								});
						console.log($scope.content);
					}

					var map = new BMap.Map("allmap"); // 创建Map实例
					map.centerAndZoom(new BMap.Point(116.404, 39.915), 11); // 初始化地图,设置中心点坐标和地图级别
					map.addControl(new BMap.MapTypeControl()); // 添加地图类型控件
					map.setCurrentCity("北京"); // 设置地图显示的城市 此项是必须设置的
					map.enableScrollWheelZoom(true); // 开启鼠标滚轮缩放
					
					var marker = BMap.Point(116.404, 39.915);
				
				    map.addOverlay(marker);//标记
				      	//创建右键菜单
					function showInfo(e){
				        map.clearOverlays();//(marker);
						var point   = new BMap.Point(e.point.lng, e.point.lat);
						marker = new BMap.Marker(point);//标记
				        map.addOverlay(marker);//显示到地图
						var temp=(e.point.lng+','+e.point.lat);
						//$scope.$broadcast('test11',(e.point.lng+','+e.point.lat));
						$scope.markId=temp;
						$scope.$apply();//强制刷新
				        
					}
				  					
					map.addEventListener("click", showInfo);
					
					function G(id) {
						return document.getElementById(id);
					}
					
					var ac = new BMap.Autocomplete(    //建立一个自动完成的对象
							{"input" : "suggestId"
							,"location" : map
						});

						ac.addEventListener("onhighlight", function(e) {  //鼠标放在下拉列表上的事件
						var str = "";
							var _value = e.fromitem.value;
							var value = "";
							if (e.fromitem.index > -1) {
								value = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
							}    
							str = "FromItem<br />index = " + e.fromitem.index + "<br />value = " + value;
							
							value = "";
							if (e.toitem.index > -1) {
								_value = e.toitem.value;
								value = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
							}    
							str += "<br />ToItem<br />index = " + e.toitem.index + "<br />value = " + value;
							G("searchResultPanel").innerHTML = str;
						});

						var myValue;
						ac.addEventListener("onconfirm", function(e) {    //鼠标点击下拉列表后的事件
						var _value = e.item.value;
							myValue = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
							G("searchResultPanel").innerHTML ="onconfirm<br />index = " + e.item.index + "<br />myValue = " + myValue;
							
							setPlace();
						});

						function setPlace(){
							map.clearOverlays();    //清除地图上所有覆盖物
							function myFun(){
								var pp = local.getResults().getPoi(0).point;    //获取第一个智能搜索的结果
								map.centerAndZoom(pp, 18);
								map.addOverlay(new BMap.Marker(pp));    //添加标注
								var temp=(e.point.lng+','+e.point.lat);
								//$scope.$broadcast('test11',(e.point.lng+','+e.point.lat));
								$scope.markId=temp;
								$scope.$apply();//强制刷新
							}
							var local = new BMap.LocalSearch(map, { //智能搜索
							  onSearchComplete: myFun
							});
							local.search(myValue);
						}
						
				};
				
				$scope.licenseType = '';

				$scope.licenseTypedata = [ {
					id : 1,
					licenseName : '民非执照',
				}, {
					id : 2,
					licenseName : '工商执照',
				}, {
					id : 3,
					licenseName : '个体式无工商注册',
				} ];

				$scope.placeContractType = '';
				$scope.placeContractTypedata = [ {
					id : 1,
					placeContractName : '民非执照',
				}, {
					id : 2,
					placeContractName : '房屋租赁合同',
				}, {
					id : 3,
					placeContractName : '无任何合同类场地',
				} ];
				// 查询用户信息
				// WebService.queryUser(fwr.gh).then(function(data){
				// $scope.fwrymc=data.mc;
				// $scope.fwrybm=data.bm;
				// $scope.fwrysj=data.sjhm;
				// });
				$scope.check = function() {
					if ($scope.fwmc == "") {
						toaster.pop('warning', "提示", "交文名称不能为空");
						return false;
					}
					if ($scope.fwrysj == "") {
						toaster.pop('warning', "提示", "手机号码不能为空");
						return false;
					}
					if ($scope.fwrysj != null && $scope.fwrysj.length != 11) {
						toaster.pop('warning', "提示", "手机号码输入不正确");
						return false;
					}
					if ($scope.fwrymc == "") {
						toaster.pop('warning', "提示", "姓名不能为空");
						return false;
					}
					if ($scope.fwrybm == "") {
						toaster.pop('warning', "提示", "部门不能为空");
						return false;
					}
					return true;
				};
				$scope.init($scope,$stateParams);

				$scope.create = function() {
					if (!$scope.check()) {
						return;
					}
					WebService.registerDePosit($scope.content.accountId,$scope.orgName, $scope.address, $scope.contactName, $scope.contactPhone,
							$scope.licenseType, $scope.placeContractType, $scope.frontDeskLink, $scope.publicZoneLink,
							$scope.kitchenLink, $scope.diningRoomLink, $scope.restRoomLink1, $scope.restRoomLink2,
							$scope.classRoomLink1, $scope.classRoomLink2, $scope.otherRoomLink1, $scope.otherRoomLink2,
							$scope.iD2Number, $scope.iD2PhotoLink, $scope.remark, 
							$scope.password).then(function(data) {
						console.log(data);
						if (data.status == 0) {
							// $uibModalInstance.close(data.message);
							$state.go(AuthService.getBasePath());
						} else {
							toaster.pop('error', "创建失败", data.message);
						}
					}, function(reason) {
						toaster.pop('error', "创建失败", reason);
					});
				};

				$scope.cancel = function() {
					$state.go("portal.depositList");
				};

				// 上传
				$scope.uploadImg = '';
				// 提交
				$scope.submit = function() {
					$scope.upload($scope.myFile);
				};

				$scope.upload = function(file) {
					var fd = new FormData();
					fd.append('filename', $scope.myFile);
					debugger;
					$http({
						method : 'POST',
						url : "http://116.7.234.129/upload",
						data : fd,
						headers : {
							'Content-Type' : undefined
						},
						transformRequest : angular.identity
					}).success(function(response) {
						// 上传成功的操作
						alert("uplaod success");
					});

				};
				// $scope.upload = function (file) {
				// WebService.postfile(file).then(function(data){
				// console.log(data);
				// if(data.status==0) {
				// debugger;
				// //toaster.pop('error', "创建失败", data.);
				//                 
				// }else{
				// toaster.pop('error', "创建失败", data.message);
				// }
				// },function(reason){
				// toaster.pop('error', "创建失败", reason);
				// });
				//    	  
				// };

			});
}());
