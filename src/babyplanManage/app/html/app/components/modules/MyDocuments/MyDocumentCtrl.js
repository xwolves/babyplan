(function() {
  "use strict";
  angular.module('MyDocumentCtrl', [])
  .controller('MyDocumentCtrl', function($scope,WebService,NgTableParams,AuthService,XHDialog,toaster) {
      var ry=AuthService.getUser();
      $scope.isMore=false;
      $scope.document = [];

      $scope.focus=function(){
          //angular.element('#filterText').focus();
          $('#filterText').focus();
      };

      $scope.query=function(){
          $scope.isLoading = true;
          WebService.queryThreeMonthPersonDocument(ry.gh).then(function(data) {
              $scope.document=data;
              $scope.isLoading = false;
              $scope.tableParams = new NgTableParams({ page:1,count:10,sorting: { fwrq: "desc" } }, { filterDelay:0,data:  $scope.document});
          });
      };

      $scope.moreQuery=function(){
          toaster.pop('info', "温馨提示", "正在加载努力更多数据，请稍候");
          $scope.isLoading = true;
          WebService.queryPersonDocument(ry.gh).then(function(data) {
              $scope.document=data;
              $scope.isLoading = false;
              $scope.isMore=true;
              $scope.tableParams = new NgTableParams({ page:1,count:10,sorting: { fwrq: "desc" } }, { filterDelay:0,data:  $scope.document});
          });
      };

      $scope.search = function(){
          WebService.queryLikeDocument($scope.simpleFilter).then(function(data) {
              $scope.queryDocument=data;
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

      $scope.focus();
      $scope.query();

  });
  }());
