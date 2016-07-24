(function () {
    "use strict";
    angular.module('datePickerModalCtrl', [])
        .controller('datePickerModalCtrl', function ($scope, $modalInstance, toaster) {
            $scope.today = function () {
                var dt = new Date();
                $scope.dtStart = dt;
                $scope.dtEnd = dt;
            };
            $scope.today();

            $scope.clear = function () {
                $scope.dt = null;
            };

            // Disable weekend selection
            $scope.disabled = function (date, mode) {
                return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
            };

            $scope.toggleMin = function () {
                $scope.minDate = $scope.minDate ? null : new Date();
            };
            $scope.toggleMin();

            $scope.open = function ($event) {
                $event.preventDefault();
                $event.stopPropagation();

                $scope.opened = true;
            };

            $scope.dateOptions = {
                formatYear: 'yy',
                startingDay: 1
            };

            $scope.format = 'yyyy/MM/dd';

            $scope.save = function () {
                console.log("save");
                $modalInstance.close({start:$scope.dtStart,end:$scope.dtEnd});
            };

            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
        });

}());
