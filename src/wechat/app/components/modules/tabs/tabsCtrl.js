(function() {
  "use strict";
  angular.module('tabsCtrl', [])
    .controller('tabsCtrl', function($scope,tabsService,StateService) {
      'ngInject';
      var vm = this;
      vm.activated = false;
      console.log("in tabs ctrl");
      vm.who=3;

      //vm.slideBoxImgs = homeService.getSlideBoxImgs();
      //vm.homeOptions = homeService.getHomeOptions();
      vm.goState = StateService.go;
      $scope.$on('$ionicView.afterEnter', activate);
      function activate() {
        vm.activated = true;
      }
      function goState(state){
        StateService.go(state);
      }
    });
}());
