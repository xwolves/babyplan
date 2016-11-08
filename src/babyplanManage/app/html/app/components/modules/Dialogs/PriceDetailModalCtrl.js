(function() {
  "use strict";
  angular.module('PriceDetailModalCtrl', [])
    .controller('PriceDetailModalCtrl', function ($scope,$modalInstance,$filter,WebService,toaster,user) {
    	var tempCreateTime;
        $scope.user=user;
//
//        if(user&&user.CreateTime)
//        {
//        	tempCreateTime = user.CreateTime;
//            $scope.user.CreateTime= $filter("date")(user.CreateTime, "yyyy-MM-dd hh:mm"); //new Date('2015-12-12');//$filter('date')(user.CreateTime, "dd/MM/yyyy");//user.CreateTime;
//        }
        
		$scope.statuslist = [ {
			id : 0,
			name : '套餐无效',
		}, {
			id : 1,
			name : '套餐生效中',
		} , {
			id : 2,
			name : '套餐过期',
		}, {
			id : 3,
			name : '套餐取消',
		}];

        $scope.save = function () {       
//        	$scope.user.CreateTime=tempCreateTime;
            $modalInstance.close($scope.user);
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    });

  }());
