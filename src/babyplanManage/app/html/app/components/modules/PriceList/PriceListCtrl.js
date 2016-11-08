(function() {
	"use strict";
	angular.module('PriceListCtrl', []).controller(
			'PriceListCtrl',
			function($scope, AuthService, NgTableParams, $state, $stateParams,
					XHDialog, WebService, toaster) {

				$scope.sortType = 'CreateTime'; // set the default sort type
				$scope.sortReverse = false; // set the default sort order
				$scope.filter = "";
				$scope.order = "CreateTime desc";
				$scope.simpleFilter="";
				$scope.ALLfilter = "";
				$scope.depfilter = "";
				
				console.log("TEST"+$stateParams.accountID);
				if ($stateParams.accountID != null) {
					$scope.depfilter = "DepositID=" + $stateParams.accountID
							+ " and ";
				}
				$scope.paginationConf = {
					currentPage : 1,
					totalItems : 0,
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

					var temp = $scope.depfilter + $scope.filter;

					$scope.ALLfilter = temp.substring(0, temp.length - 4);
					$scope.isLoading = true;
					
					WebService.queryPriceList(
							$scope.paginationConf.currentPage,
							$scope.paginationConf.itemsPerPage, $scope.order,
							$scope.ALLfilter).then(function(data) {
						$scope.document = data.content;
						$scope.isLoading = false;
						$scope.paginationConf.totalItems = data.totalElements;
					});
				};

				$scope.fingerRecord = function(event) {

					console.log(event);
				}

				$scope.depositdetial = function(event) {

					console.log(event);
				}

				$scope.pricedetial = function(event) {

					XHDialog.priceDetail(event, function() {
						console.log(event);
						$scope.query();
						$scope.focus();
					}, function() {
						$scope.focus();
					});
				}

				$scope.focus();
				$scope.query($stateParams);

				$scope.$on('$stateChangeSuccess', function(event, toState,
						toParams, fromState, fromParams) {

				});
				
				
				$scope.queryselect = function()
				{
					$scope.filter="( BusinessID like '%"+$scope.simpleFilter +"%' "+" or BusinessName like '%"+$scope.simpleFilter +"%' "
					+" or BusinessDesc like '%"+$scope.simpleFilter +"%' "+" or Price like '%"+$scope.simpleFilter +"%' "
					+" or Provide like '%"+$scope.simpleFilter +"%' "+" or Reason like '%"+$scope.simpleFilter +"%' "+
					" or NumOfDays like '%"+$scope.simpleFilter +"%') " +" and ";
					
					console.log($scope.filter);
					$scope.query();
				}

				$scope.datachage = function(newValue, oldValue) {
					// 防止初始化两次请求问题
					if (oldValue != newValue) {
						if ($scope.sortReverse == false) {
							$scope.order = $scope.sortType + " desc"
						} else {
							$scope.order = $scope.sortType + " asc"
						}
						// scope.conf.onChange();
					}
					$scope.query();

				};

				$scope.$watch(function() {

					var newValue = $scope.sortType + ' ' + $scope.sortReverse
							+ ' ';
					return newValue;

				}, $scope.datachage);

			});

}());
