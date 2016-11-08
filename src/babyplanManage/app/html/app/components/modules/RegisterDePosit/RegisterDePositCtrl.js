(function() {
	"use strict";
	angular
			.module('RegisterDePositCtrl', [])
			.directive('ngFiles', [ '$parse', function($parse) {
				function fn_link(scope, element, attrs) {
					var onChange = $parse(attrs.ngFiles);
					element.on('change', function(event) {
						onChange(scope, {
							$files : event.target.files
						});
					});
				}
				;

				return {
					link : fn_link
				}
			} ])
			.controller(
					'RegisterDePositCtrl',
					function($scope, WebService, toaster, $http, $state,
							$stateParams, $timeout, AuthService) {
						var photolist={};
						$scope.drawPoint = function() {
							$timeout(function() {
								if ($scope.templongitude !== null
										&& $scope.templatitude) {
									$scope.map.clearOverlays();// (marker);

									$scope.map.centerAndZoom(new BMap.Point(
											$scope.templongitude,
											$scope.templatitude), 18); // 初始化地图,设置中心点坐标和地图级别
									console.log($scope.templongitude + ""
											+ $scope.templatitude);
									var point = new BMap.Point(
											$scope.templongitude,
											$scope.templatitude);
									var marker = new BMap.Marker(point);// 标记
									$scope.map.addOverlay(marker);// 显示到地图
								} else {
									$scope.map.centerAndZoom(new BMap.Point(
											114.066112,22.548515), 18); // 初始化地图,设置中心点坐标和地图级别
								}

							}, 300);

						};

						$scope.init = function($scope, $stateParams) {
							$scope.content={};
							
							$scope.photolist=photolist;
							$scope.showbaidu = false;
							$scope.templongitude;
							$scope.templatitude;
							$scope.map = new BMap.Map("allmap"); // 创建Map实例

							// map.centerAndZoom(new
							// BMap.Point($scope.content.longitude,
							// $scope.content.latitude), 11); //
							// 初始化地图,设置中心点坐标和地图级别
							// $scope.map.addControl(new BMap.MapTypeControl());
							// // 添加地图类型控件
							$scope.map.enableScrollWheelZoom(true); // 开启鼠标滚轮缩放
							// var marker = BMap.Point(116.404, 39.915);
							var marker;

							if ($stateParams.accountID == null) {
								// $scope.isnew = false;
								$scope.title="新增托管机构";
								
								$scope.isnew= true;

							} else {
								$scope.isnew= false;
								$scope.title="编辑托管机构";
								WebService
										.queryDepostbyid($stateParams.accountID)
										.then(
												function(data) {
													console.log(data);

													$scope.content = data;
													$scope.templongitude = $scope.content.longitude;
													$scope.templatitude = $scope.content.latitude;

												});
								
								
								WebService
								.queryPhotoListByDepId($stateParams.accountID)
								.then(
										function(data) {
											var obj={};
											
											//121：执照l类型；211：场地合同类型
//											for(var i=0;i<data.length;i++)
//											{
//												if(data[i].photoType==121)
//												{
//													photolist.zzlxzp=data[i].photoLink;
//													obj.src1=photolist.zzlxzp;
//												}
//												else if(data[i].photoType==211)		
//												{
//													photolist.htlxzp=data[i].photoLink;
//													obj.src2=photolist.zzlxzp;
//												}
//											}
											//var array=[obj];
											//if(data)
											$scope.listpng = data;
											//$scope.listpng[0]=obj;

											//if(data)
											//$scope.photolist = data;
											
										});
								
								
							}

							// 创建右键菜单
							function showInfo(e) {
								$scope.map.clearOverlays();// (marker);
								var point = new BMap.Point(e.point.lng,
										e.point.lat);
								marker = new BMap.Marker(point);// 标记
								$scope.map.addOverlay(marker);// 显示到地图
								var temp = (e.point.lng + ',' + e.point.lat);
								// $scope.$broadcast('test11',(e.point.lng+','+e.point.lat));
								$scope.tempmarkId = temp;
								$scope.templongitude = e.point.lng;
								$scope.templatitude = e.point.lat;


								console.log(e.point.lng + "sss" + e.point.lat);
								// $scope.$apply();//强制刷新

							}

							$scope.map.addEventListener("click", showInfo);

							function G(id) {
								return document.getElementById(id);
							}

							var ac = new BMap.Autocomplete( // 建立一个自动完成的对象
							{
								"input" : "suggestId",
								"location" : $scope.map
							});

							ac.addEventListener("onhighlight", function(e) { // 鼠标放在下拉列表上的事件
								var str = "";
								var _value = e.fromitem.value;
								var value = "";
								if (e.fromitem.index > -1) {
									value = _value.province + _value.city
											+ _value.district + _value.street
											+ _value.business;
								}
								str = "FromItem<br />index = "
										+ e.fromitem.index + "<br />value = "
										+ value;

								value = "";
								if (e.toitem.index > -1) {
									_value = e.toitem.value;
									value = _value.province + _value.city
											+ _value.district + _value.street
											+ _value.business;
								}
								str += "<br />ToItem<br />index = "
										+ e.toitem.index + "<br />value = "
										+ value;
								G("searchResultPanel").innerHTML = str;
							});

							var myValue;
							ac
									.addEventListener(
											"onconfirm",
											function(e) { // 鼠标点击下拉列表后的事件
												var _value = e.item.value;
												myValue = _value.province
														+ _value.city
														+ _value.district
														+ _value.street
														+ _value.business;
												G("searchResultPanel").innerHTML = "onconfirm<br />index = "
														+ e.item.index
														+ "<br />myValue = "
														+ myValue;

												setPlace();
											});

							function setPlace() {
								$scope.map.clearOverlays(); // 清除地图上所有覆盖物
								function myFun() {
									var pp = local.getResults().getPoi(0).point; // 获取第一个智能搜索的结果
									$scope.map.centerAndZoom(pp, 18);
									$scope.map.addOverlay(new BMap.Marker(pp)); // 添加标注

									var temp = (pp.lng + ',' + pp.lat);
									alert(pp.lng + "," + pp.lat)
									// $scope.$broadcast('test11',(e.point.lng+','+e.point.lat));
									$scope.tempmarkId = temp;
									$scope.templongitude = pp.lng;
									$scope.templatitude = pp.lat;
								}
								var local = new BMap.LocalSearch($scope.map, { // 智能搜索
									onSearchComplete : myFun
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
							licenseName : '个体无注册',
						} ];

						$scope.placeContractType = '';
						$scope.placeContractTypedata = [ {
							id : 1,
							placeContractName : '房管所备案的房屋证或租赁证',
						}, {
							id : 2,
							placeContractName : '房屋租赁合同',
						}, {
							id : 3,
							placeContractName : '无任何合同类场地',
						} ];
						
						$scope.picType="";
						$scope.picTypedata = [ {
							id : 111,
							name : '消防验收合格证',
						}, {
							id : 112,
							name : '卫生许可证',
						}, {
							id : 121,
							name : '工商执照',
						} , {
							id : 211,
							name : '房管所备案的房屋证或租赁证',
						} , {
							id : 212,
							name : '场地租赁合同（已备案）',
						} , {
							id : 221,
							name : '房屋租赁合同',
						} ];
						
						
						
						// 111：消防验收合格证；112：卫生许可证；121：工商执照；211：房管所备案的房屋证或租赁证；212：场地租赁合同（已备案）；221：房屋租赁合同；
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
							if ($scope.fwrysj != null
									&& $scope.fwrysj.length != 11) {
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
						$scope.init($scope, $stateParams);

						$scope.savePoint = function() {
							$scope.content.markId = $scope.tempmarkId;
							$scope.content.longitude = $scope.templongitude;
							$scope.content.latitude = $scope.templatitude;
							$scope.showbaidu = false;
						};

						$scope.back = function() {
							if( $scope.content.markId)
							{
								$scope.tempmarkId = $scope.content.markId;
								$scope.templongitude = $scope.content.longitude;
								$scope.templatitude = $scope.content.latitude;
							}

							$scope.showbaidu = false;
						};

						$scope.create = function() {
							// if (!$scope.check()) {
							// return;
							// }
							WebService.registerDePosit(
									$scope.content.accountId,
									$scope.content.orgName,
									$scope.content.address,
									$scope.content.markId,
									$scope.content.contactName,
									$scope.content.contactPhone,
									$scope.content.licenseType,
									$scope.content.placeContractType,
									$scope.content.frontDeskLink,
									$scope.content.publicZoneLink,
									$scope.content.kitchenLink,
									$scope.content.diningRoomLink,
									$scope.content.restRoomLink1,
									$scope.content.restRoomLink2,
									$scope.content.classRoomLink1,
									$scope.content.classRoomLink2,
									$scope.content.otherRoomLink1,
									$scope.content.otherRoomLink2,
									$scope.iD2Number, $scope.iD2PhotoLink,
									$scope.remark, $scope.content.password,
									$scope.content.longitude,
									$scope.content.latitude).then(
									function(data) {
										console.log($scope.content.markId);
										if (data.status == 0) {
											// $uibModalInstance.close(data.message);
											$state.go("portal.depositList");
											toaster.pop('success', "保存成功");
										} else {
											toaster.pop('error', "创建失败",
													data.message);
										}
									}, function(reason) {
										toaster.pop('error', "创建失败", reason);
									});
						};

						$scope.showBaidu = function() {
							$scope.showbaidu = true;
							// $scope.$apply();//强制刷新
							$scope.drawPoint();
						};

						$scope.cancel = function() {
							$state.go("portal.depositList");
						};

						
						$scope.getTheFiles = function($files,tagname) {

							angular.forEach($files, function(value, key) {
								var formdata = new FormData();

								formdata.append("file", value);								
								formdata.append("updatefield", tagname);
								formdata.append("id", $stateParams.accountID);
								//console.log("pictype"+$scope.picType);
								formdata.append("picType", $scope.picType);
								if(tagname=='depositphotos')
								{
									if($scope.picType=="")
									{
									
										alert("请先选择上传类型");
										return;
									}
									
								}
								
								$scope.submit(formdata);
							});
							
							
							
						};

						// 上传
						$scope.uploadImg = '';
						// 提交
						$scope.deletephoto=function(photoid)
						{
							
							WebService
							.detelePhoto(photoid)
							.then(
									function(data) {
										toaster.pop('success', "删除成功！");
										//更新							    
										WebService
										.queryPhotoListByDepId($stateParams.accountID)
										.then(
												function(data) {
													$scope.listpng = data;
												});
										//$scope.listpng = data;
									});
						};
						$scope.submit = function(formdata) {
							var request = {
								method : 'POST',
								//url : "http://127.0.0.1:8080/manager/api/v1/uploadExt",
								url : "../babyapi/api/v1/uploadExt",
								data : formdata,
								headers : {
									'Content-Type' : undefined
								},
								transformRequest : angular.identity
							};
							


							// SEND THE FILES.
							$http(request).success(function(d) {
								//更新							    
								WebService
								.queryPhotoListByDepId($stateParams.accountID)
								.then(
										function(data) {
											$scope.listpng = data;
										});

								WebService
								.queryDepostbyid($stateParams.accountID)
								.then(
										function(data) {
											$scope.content.frontDeskLink =  data.frontDeskLink;
											$scope.content.publicZoneLink =  data.publicZoneLink;
											$scope.content.kitchenLink =  data.kitchenLink;
											$scope.content.diningRoomLink =  data.diningRoomLink;
											
											$scope.content.restRoomLink1 =  data.restRoomLink1;
											$scope.content.restRoomLink2 =  data.restRoomLink2;
											$scope.content.classRoomLink1 =  data.classRoomLink1;
											$scope.content.classRoomLink2 =  data.classRoomLink2;
											
											$scope.content.otherRoomLink1 =  data.otherRoomLink1;
											$scope.content.otherRoomLink2 =  data.otherRoomLink2;											
											$scope.content.iD2PhotoLink =  data.iD2PhotoLink;
											
											$scope.templongitude = $scope.content.longitude;
											$scope.templatitude = $scope.content.latitude;

										});
								
							}).error(function(d) {
								//alert(d);
							});
							
	
						}
						// $scope.upload = function(file) {
						// var fd = new FormData();
						// fd.append('file', $scope.myFile);
						// console.log($scope.myFile);
						// 
						// $http({
						// method : 'POST',
						// url : "http://127.0.0.1:8080/babyplan/api/v1/upload",
						// data:{
						// "file" : fd
						// },
						// "name":"test.jpg",
						// }).success(function(response) {
						// // 上传成功的操作
						// alert("uplaod success");
						// });
						//
						// };

					});
}());
