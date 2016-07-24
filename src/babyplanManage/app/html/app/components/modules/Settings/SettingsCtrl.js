(function() {
  "use strict";
  angular.module('SettingsCtrl', [])
    .controller('SettingsCtrl', function ($scope,$state,WebService,XHDialog,AuthService,Constants,toaster,$filter) {
          $scope.simpleFilter="";
          $scope.predicate = 'mc';
          $scope.reverse = true;
          $scope.limit = 15;
          $scope.startIndex = 0;
          $scope.currentPage=1;
          $scope.order = function(predicate) {
              $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
              $scope.predicate = predicate;
          };
          $scope.pageChanged = function() {
              console.log('Page changed to: ' + $scope.currentPage);
              $scope.startIndex=($scope.currentPage-1)*$scope.limit;
              console.log('Page start index : ' + $scope.startIndex);
          };
          $scope.changePages = function(){
              var filter=$filter('filter');
              var data = filter($scope.users,$scope.simpleFilter);
              $scope.totalItems=data.length;
          };

          $scope.query= function () {
              WebService.queryAllUser().then(function(data){
                  if(data.status==0){
                      $scope.users=data.content;
                      $scope.totalItems=$scope.users.length;
                  }
              });
          };

          $scope.detail = function(index) {
              var user=$scope.users[index];
              if(user.js==Constants.USER_ROLES.admin && AuthService.getUserRole()!=Constants.USER_ROLES.admin ){
                    toaster.pop('warning', "提示", "无法编辑管理员");
              }else{
                XHDialog.changeRole(user, function () {
                    $scope.query();
                }, function () {
                    console.log("user details cancel back");
                });
              }
          };

          $scope.cancel = function () {
              $state.go(AuthService.getBasePath());
          };

          $scope.query();

      });
}());
