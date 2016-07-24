(function() {
  "use strict";
  angular.module('ExportExcelCtrl', [])
  .controller('ExportExcelCtrl', function ($scope,$state,AuthService,WebService,toaster,$window) {
          $scope.today = function () {
              var dt = new Date();
              $scope.dtStart = dt;
              $scope.dtEnd = dt;
          };

          $scope.today();
          $scope.minDate = "2016-01-01";
          $scope.maxDate = "2030-12-31";
          $scope.format = 'yyyy-MM-dd';

          // Disable weekend selection
          $scope.disabled = function (date, mode) {
              return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
          };

          $scope.open = function (index,$event) {
              $event.preventDefault();
              $event.stopPropagation();
              if(index==1) {
                  $scope.opened1 = true;
              }else if(index==2){
                  $scope.opened2 = true;
              }
          };

          $scope.dateOptions = {
              formatYear: 'yy',
              startingDay: 1
          };

          $scope.confirm = function () {
              //checkData
              var start,end;
              console.log($scope.dtStart);
              console.log($scope.dtEnd);
              if (typeof($scope.dtStart) == "undefined") {
                  toaster.pop('warning', "提示", "起始日期输入不正确");
                  return;
              }
              if (typeof($scope.dtEnd) == "undefined") {
                  toaster.pop('warning', "提示", "截止日期输入不正确");
                  return;
              }

              if($scope.dtStart>$scope.dtEnd){
                  toaster.pop('warning', "提示", "日期顺序不对，起始日期比截止日期大");
                  return;
              }
              start=$scope.dtStart.Format("yyyyMMdd");
              end=$scope.dtEnd.Format("yyyyMMdd");
              console.log(start+" - "+end);
              WebService.getExportExcel(start,end).then(function(data){
                  console.log(data);
                  $window.location.href=data;
              },function(reason){
                  toaster.pop('error', "导出出错", reason);
              });
          };

          $scope.cancel = function () {
              $state.go(AuthService.getBasePath());
          };

          Date.prototype.Format = function(fmt) {
              var o = {
                  "M+": this.getMonth() + 1, //月份
                  "d+": this.getDate(), //日
                  "h+": this.getHours(), //小时
                  "m+": this.getMinutes(), //分
                  "s+": this.getSeconds(), //秒
                  "q+": Math.floor((this.getMonth() + 3) / 3), //季度
                  "S": this.getMilliseconds() //毫秒
              };
              if (/(y+)/.test(fmt))
                  fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
              for (var k in o)
                  if (new RegExp("(" + k + ")").test(fmt))
                      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
              return fmt;
          };
  });
}());
