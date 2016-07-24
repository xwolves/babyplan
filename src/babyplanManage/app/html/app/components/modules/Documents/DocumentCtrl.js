(function() {
  "use strict";
  angular.module('DocumentCtrl', [])
  .controller('DocumentCtrl', function($scope,AuthService,NgTableParams,XHDialog,WebService,toaster) {
      var ry=AuthService.getUser();
      $scope.document = [];
      $scope.isMore=false;

      $scope.focus=function(){
          //angular.element('#filterText').focus();
          $('#filterText').focus();
      };

      $scope.query=function(tableState) {
          $scope.isLoading = true;
          WebService.queryThreeMonthDocument().then(function(data) {
              $scope.document=data;
              $scope.isLoading = false;
              $scope.tableParams = new NgTableParams({ page:1,count:10,sorting: { fwrq: "desc" } }, { filterDelay:0,data:  $scope.document});
          });
      };

      $scope.open = function() {
          XHDialog.createDocument(ry, function () {
              $scope.query();
              $scope.focus();
          }, function () {
              $scope.focus();
          });
      };

      $scope.checkDocument = function(docNo){
          XHDialog.checkDocument(docNo,function(){
              $scope.query();
              $scope.focus();
          },function(){
              $scope.focus();
          })
      };

      $scope.sign = function(bh) {
          XHDialog.signDocument(bh,ry);
      };

      $scope.more=function(){
          toaster.pop('info', "温馨提示", "正在加载努力更多数据，请稍候");
          WebService.queryDocument().then(function(data) {
              $scope.document=data;
              $scope.isMore=true;
              $scope.tableParams = new NgTableParams({ page:1,count:10,sorting: { fwrq: "desc" } }, { filterDelay:0,data:  $scope.document});
          });
      };
      $scope.focus();
      $scope.query();

      $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
          //console.log("toState "+JSON.stringify(toState));
          //console.log("toParams "+JSON.stringify(toParams));
          //console.log("TutorStudentCtrl fromState "+JSON.stringify(fromState));
          //console.log("fromParams "+JSON.stringify(fromParams));
          console.log("return to portal");
      });
      $scope.$on("isAdmin", function(event, args){
        //获取到用户信息后再查询，前面那个有可能拿不到工号去查
          $scope.query();
      });
      //it looks like 1.0.0-alpha.1 build didn't include the state events!
      //We've deprecated the $stateChange* events in favor of the $transitions lifecycle hooks. We do provide them as an addon file, however, which is missing in the release.
      //need include $transitions
      //$transitions.onStart({}, function() {console.log("$transitions onStart");});
      //$transitions.onSuccess({}, function() {console.log("$transitions onSuccess");});
  });
  }());
