(function() {
    "use strict";
    angular.module('RatingStarsDirective', [])
        .directive('ratingStars', function() {
            return {
                restrict: 'E',
                templateUrl: 'RatingStars/RatingStars.html',
                controller: RatingStarsCtrl,
                controllerAs: 'vm',
                bindToController: true,
                scope: {
                    rating: '='
                }
            };
        });

    function RatingStarsCtrl($scope) {
        var vm = this;
        vm.ratingClassArray = [];
        for (var i = 0; i < vm.rating; i++) {
            vm.ratingClassArray.push('rating-star-active');
        }
        for (var i = vm.rating; i < 5; i++) {
            vm.ratingClassArray.push('rating-star-normal');
        }
        // console.log(vm.ratingClassArray);
    }
}());
