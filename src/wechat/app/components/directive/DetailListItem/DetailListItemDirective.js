(function() {
    "use strict";
    angular.module('DetailListItemDirective', [])
        .directive('detailListItem', function() {
            return {
                restrict: 'E',
                templateUrl: 'DetailListItem/DetailListItem.html',
                controller: DetailListItemCtrl,
                controllerAs: 'vm',
                bindToController: true,
                scope: {
                    title: '=',
                    value: '='
                }
            };
        });

    function DetailListItemCtrl($scope) {
        var vm = this;
    }
}());
