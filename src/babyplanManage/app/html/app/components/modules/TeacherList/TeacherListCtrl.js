(function() {
	"use strict";
	angular.module('TeacherListCtrl', []).controller(
			'TeacherListCtrl',
			function($scope, AuthService, NgTableParams, $state, $stateParams,
					XHDialog, WebService, toaster) {

				$scope.sortType = 'AccountID'; // set the default sort type
				$scope.sortReverse = false; // set the default sort order
				$scope.filter = "";
				$scope.order = "AccountID desc";

				$scope.ALLfilter = "";
				$scope.depfilter = "";
				$scope.filerintpul = "";
				if ($stateParams.accountID != null) {
					$scope.depfilter = "DepositID=" + $stateParams.accountID
							+ " and ";
				}

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
					var temp = $scope.depfilter + $scope.filter;

					$scope.ALLfilter = temp.substring(0, temp.length - 4);
					console.log($scope.ALLfilter);
					WebService.queryTeacherExt(
							$scope.paginationConf.currentPage,
							$scope.paginationConf.itemsPerPage, $scope.order,
							$scope.ALLfilter).then(function(data) {
						$scope.document = data.content;
						console.log(data.content);
						$scope.isLoading = false;
						$scope.paginationConf.totalItems = data.totalElements;
						console.log(data.totalElements);
					});
				};

				$scope.teacherdetail = function(event) {

					XHDialog.teacherDetail(event, function() {
						$scope.query();
						$scope.focus();
					}, function() {
						$scope.focus();
					});
					// console.log(event);
				}

				$scope.depositdetial = function(event) {

					console.log(event);
				}

				$scope.parentdetial = function(event) {

					console.log(event);
				}

				$scope.focus();
				$scope.query($stateParams);

				$scope.$on('$stateChangeSuccess', function(event, toState,
						toParams, fromState, fromParams) {

				});
				
				
				$scope.queryselect = function()
				{
					$scope.filter="( AccountID like '%"+$scope.simpleFilter +"%' "+" or Name like '%"+$scope.simpleFilter +"%' "
					+" or Age like '%"+$scope.simpleFilter +"%' "+" or TeachAge like '%"+$scope.simpleFilter +"%' "+
					" or Mobile like '%"+$scope.simpleFilter +"%') "+
					" or OrgName like '%"+$scope.simpleFilter +"%') " +" and ";
					
				
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
