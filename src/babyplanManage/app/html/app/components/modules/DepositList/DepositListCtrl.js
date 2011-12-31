(function() {
	"use strict";
	angular
			.module('DepositListCtrl', [])
			.controller(
					'DepositListCtrl',
					function($scope, AuthService, NgTableParams, $state,$stateParams,
							XHDialog, WebService, toaster) {

						$scope.paginationConf = {
							currentPage : 1,
							totalItems : 8000,
							itemsPerPage : 15,
							pagesLength : 15,
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
											$scope.paginationConf.itemsPerPage)
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

							console.log("return to portal");
						});
						
					    $scope.editdeposit = function(indexid){
					    		$state.go("portal.registerDePosit",{"accountID":indexid});
					      };

					});
}());
