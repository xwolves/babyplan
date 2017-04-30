(function() {
    "use strict";
    angular.module('eshopEntryCtrl', [])
        .controller('eshopEntryCtrl', function($scope, $sce, Constants, $location, StateService) {
            'ngInject';
            window.location.href='./eshop/index.html';
            
            var vm = this;
            vm.activated = false;
            $scope.$on('$ionicView.afterEnter', activate);
            function activate() {
                vm.activated = true;
                vm.version = Constants.buildID;
                //vm.src = $sce.trustAsResourceUrl('./eshop/index.html');//iframe redirect
                //$location.path("myEShop/index.html");
                //$location.replace();
            }
        });
}());
