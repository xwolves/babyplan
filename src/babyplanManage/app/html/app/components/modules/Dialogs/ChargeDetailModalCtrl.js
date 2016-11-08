(function() {
	"use strict";
	angular
			.module('ChargeDetailModalCtrl', [])
			.controller(
					'ChargeDetailModalCtrl',
					function($scope, $modalInstance, $filter, WebService,
							toaster, user) {


						$scope.user = user;
						$scope.pricelist = {};
						$scope.isnew=false;
						$scope.filter="";
						$scope.mobile="";
						//alert(user);
						if(user.ParentID)
						{

							$scope.isnew=false;
					        $scope.PayTime= $filter("date")(user.PayTime, "yyyy-MM-ddThh:mm"); //new Date('2015-12-12');//$filter('date')(user.CreateTime, "dd/MM/yyyy");//user.CreateTime;
							
						}
						else
						{
							$scope.isnew=true;
							$scope.filter="Status=1";//
							$scope.user.PayType = 2;
							$scope.PayTime= $filter("date")(new Date(), "yyyy-MM-ddThh:mm");
						}
						
						
						//user.PayTime
						//CutOffTime
  
					    $scope.CutOffTime= $filter("date")(user.CutOffTime, "yyyy-MM-ddThh:mm"); 

						$scope.payStatusList = [ {
							id : 0,
							name : '未支付',
						}, {
							id : 1,
							name : '已支付',
						} ];
						// 0：未支付，1：已支付
						// 支付方式，0：微信支付，1：支付宝支付，2：其它
						$scope.orderTypeList = [ {
							id : 1,
							name : '正式订单',
						}, {
							id : 2,
							name : '测试订单',
						} ];

						// 订单类型， 1：正式订单，2：测试订单
						$scope.payTypeList = [ {
							id : 0,
							name : '微信支付',
						}, {
							id : 1,
							name : '支付宝支付',
						}, {
							id : 2,
							name : '其它',
						} ];
						// 支付方式，0：微信支付，1：支付宝支付，2：其它

						// $scope.querypricelist($scope);
						
						$scope.selectbymobile = function() {
							WebService
							.findPidByPhone(
									$scope.mobile)
							.then(
									function(data) {
										user.ParentID=data;
										//debugger;

									},
									function(reason) {
										toaster.pop('error',
												"请求失败", reason.data.content);
									});
						}

						$scope.save = function() {
							if(!user.ParentID)
							{
								toaster.pop('error', "保存失败", "家长账号不能为空！");
								return;
							}
							$scope.user.PayTime= new Date($scope.PayTime).getTime();
							console.log($scope.user.PayTime);////
							//$scope.user.CutOffTime=$scope.user.CreateTime;//new Date($scope.CutOffTime).getTime();
							
							$modalInstance.close($scope.user);
						};

						$scope.bussisesschang = function() {
							// $scope.pricelist.
							// console.log( $scope.user.BusinessID);
							if ($scope.user.BusinessID) {
								WebService
										.querySetingByBusinessId(
												$scope.user.BusinessID)
										.then(
												function(data) {
													console.log(data);
													$scope.user.Amount = data.price;
													$scope.user.NumOfDays = data.numOfDays;
													$scope.user.Status = data.status;

												},
												function(reason) {
													toaster.pop('error',
															"请求失败", reason);
												});
							}

						}

						$scope.querypricelist = function($scope) {
							// here user to chage
							WebService.queryPriceList(1, 10000,
									"CreateTime desc", $scope.filter).then(function(data) {
								$scope.pricelist = data.content;

							}, function(reason) {
								toaster.pop('error', "请求失败", reason);
							});

						};
						$scope.querypricelist($scope);

						$scope.cancel = function() {
							$modalInstance.dismiss('cancel');
						};
					});

}());
