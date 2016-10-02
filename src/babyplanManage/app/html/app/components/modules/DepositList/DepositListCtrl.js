(function() {
	"use strict";
	angular
			.module('DepositListCtrl', [])
			.controller(
					'DepositListCtrl',
					function($scope, AuthService, NgTableParams, $state,
							$stateParams, XHDialog, WebService, toaster) {
					  $scope.sortType     = 'AccountID'; // set the default sort type
					  $scope.sortReverse  = false;  // set the default sort order
					  $scope.filter="";
						
					  $scope.order="AccountID desc";
						
						$scope.paginationConf = {
							currentPage : 1,
							totalItems : 8000,
							itemsPerPage : 10,
							pagesLength : 10,
							perPageOptions : [ 10, 20, 30, 40, 50 ],
							onChange : function() {
								$scope.query();
							}
						};

						$scope.document = [];

						$scope.focus = function() {
							// angular.element('#filterText').focus();
							// $('#filterText').focus();
						};

						$scope.query = function($stateParams) {
							$scope.isLoading = true;
							WebService
									.querydepositinfo(
											$scope.paginationConf.currentPage,
											$scope.paginationConf.itemsPerPage,$scope.order,$scope.filter)
									.then(
											function(data) {
												$scope.document = data.content;
												$scope.isLoading = false;
												$scope.paginationConf.totalItems = data.totalElements;
											});
						};

						$scope.addDepost = function() {
							$state.go("portal.registerDePosit");
						};

						$scope.focus();
						$scope.query($stateParams);

						$scope.$on('$stateChangeSuccess', function(event,
								toState, toParams, fromState, fromParams) {

						});

						$scope.editdeposit = function(indexid) {
							$state.go("portal.registerDePosit", {
								"accountID" : indexid
							});
						};

						$scope.teacherdeposit = function(indexid) {
							$state.go("portal.teacherList", {
								"accountID" : indexid
							});
						};

						$scope.childrendeposit = function(indexid) {
							$state.go("portal.childrenList", {
								"accountID" : indexid
							});
						};
						
						$scope.queryselect = function()
						{
							$scope.filter="( AccountID like '%"+$scope.simpleFilter +"%' "+" or OrgName like '%"+$scope.simpleFilter +"%' "
							+" or Address like '%"+$scope.simpleFilter +"%' "+" or MarkID like '%"+$scope.simpleFilter +"%' "+
							" or ContactName like '%"+$scope.simpleFilter +"%' "+" or ContactPhone like '%"+$scope.simpleFilter +"%' ) ";
							
							
							console.log($scope.filter);
							$scope.query();
						}

						$scope.datachage = function(newValue, oldValue) {
								// 防止初始化两次请求问题
								if (oldValue != newValue) {
									if($scope.sortReverse==false)
									{
										$scope.order=$scope.sortType+" desc"
									}
									else
									{
										$scope.order=$scope.sortType+" asc"
									}
									//scope.conf.onChange();
								}
								$scope.query();
						
						};

						$scope.$watch(function() {

							var newValue = $scope.sortType+ ' ' +$scope.sortReverse+ ' ';
							return newValue;

						}, $scope.datachage);

					});
}());
