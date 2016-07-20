(function() {
  "use strict";
  angular.module('tabsCtrl', [])
    .controller('tabsCtrl', function($scope,tabsService,StateService,AuthService) {
      'ngInject';
      var vm = this;
      vm.activated = false;

      vm.who=AuthService.getUserRole();
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
