(function() {
  "use strict";
  angular.module('MySignCtrl', [])
  .controller('MySignCtrl', function($scope,WebService,AuthService,XHDialog,$filter,toaster) {
      var ry=AuthService.getUser();
      $scope.predicate = 'rq';
      $scope.reverse = true;
      $scope.limit = 10;
      $scope.startIndex = 0;
      $scope.currentPage=1;
      $scope.order = function(predicate) {
          $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
          $scope.predicate = predicate;
      };

      $scope.querySignDocument = [];

      $scope.focus=function(){
          //angular.element('#filterText').focus();
          $('#filterText').focus();
      };

      $scope.moreQuery=function(){
          toaster.pop('info', "温馨提示", "正在加载努力更多数据，请稍候");
          $scope.isLoading = true;
          WebService.queryTeacherSignProcess(ry.gh).then(function(data) {
              $scope.querySignDocument=data;
              $scope.totalItems=$scope.querySignDocument.length;
              //for (var i = 0; i < $scope.querySignDocument.length; i++) {
              //    WebService.querySingleDocument($scope.querySignDocument[i].fwbh,i).then(function (sdata) {
              //        //console.log(data);
              //        if(sdata.status==0) {
              //            $scope.querySignDocument[sdata.index].fwmc=sdata.content.fwmc;
              //            $scope.querySignDocument[sdata.index].fwrymc=sdata.content.fwrymc;
              //            $scope.querySignDocument[sdata.index].fwrybm=sdata.content.fwrybm;
              //            $scope.querySignDocument[sdata.index].fwrq=sdata.content.fwrq;
              //            $scope.querySignDocument[sdata.index].fwzt=sdata.content.fwzt;
              //        }else{
              //            //toaster.pop('error', "查询失败", data.message);
              //            console.log(sdata.message+' with '+$scope.querySignDocument[sdata.index].FWBH);
              //        }
              //    });
              //}
              $scope.isMore=true;
              $scope.isLoading = false;
          });
      };

      $scope.query=function(){
          $scope.isLoading = true;
          WebService.queryThreeMonthTeacherSignProcess(ry.gh).then(function(data) {
              $scope.querySignDocument=data;
              $scope.totalItems=$scope.querySignDocument.length;
              $scope.isLoading = false;
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

      $scope.pageChanged = function() {
          console.log('Page changed to: ' + $scope.currentPage);
          $scope.startIndex=($scope.currentPage-1)*$scope.limit;
          console.log('Page start index : ' + $scope.startIndex);
      };

      $scope.changePages = function(){
          var filter=$filter('filter');
          var data = filter($scope.querySignDocument,$scope.simpleFilter);
          $scope.totalItems=data.length;
      };

      $scope.focus();
      $scope.query();
  });
  }());
