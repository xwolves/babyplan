(function() {
  "use strict";
  angular.module('StatisticsCtrl', [])
  .controller('StatisticsCtrl', function ($scope,WebService) {
      $scope.chartConfig_column={title: {text: ''},credits:{enabled:false}};
      $scope.data={
          monthOk:0,
          monthNo:0,
          monthAll:0,
          yearOk:0,
          yearNo:0,
          total:0,
          hideTips:false
      };

      $scope.query=function(){
          var date=new Date();
          WebService.getStatisticsDocs(date.getFullYear()).then(function(data) {
            console.log(data);
            $scope.data.yearOk=data.statusFinish;
            $scope.data.yearNo=data.statusUndo;
            $scope.data.yearAll=data.total;
            $scope.data.monthOk=data.monthFinish[date.getMonth()];
            $scope.data.monthNo=data.monthUndo[date.getMonth()];
            $scope.data.monthAll=$scope.data.monthOk+$scope.data.monthNo;

            $scope.chartConfig_column={
              options: {
                  chart: {
                    type: 'column',
                  },
                  plotOptions: {
                      column: {
                          stacking: 'normal',
                          dataLabels: {
                              enabled: true,
                              color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
                              style: {
                                  textShadow: '0 0 3px black'
                              }
                          }
                      }
                  },
                  credits: {
                      enabled: false
                  },
                  exporting: {
                      buttons: {
                          contextButton: {
                              menuItems: [
                                  {
                                      textKey: 'downloadPNG',
                                      onclick: function () {
                                          this.exportChart();
                                      }
                                  }, {
                                      textKey: 'downloadJPEG',
                                      onclick: function () {
                                          this.exportChart({
                                              type: 'image/jpeg'
                                          });
                                      }
                                  }, {
                                      textKey: 'downloadPDF',
                                      onclick: function () {
                                          this.exportChart({
                                              type: 'application/pdf'
                                          });
                                      }
                                  }
                              ]
                          }
                      }
                  },
                  tooltip: {
                      formatter: function () {
                          return '<b>' + this.x + '</b><br/>' +
                              this.series.name + ': ' + this.y + '<br/>' +
                              '总交文数: ' + this.point.stackTotal;
                      }
                  }
              },
              title: {
                text: '每月交文数据柱状图'
              },
              xAxis: {
                categories: ['一月', '二月', '三月', '四月', '五月','六月', '七月', '八月', '九月', '十月','十一月', '十二月']
              },
              yAxis: {
                min: 0,
                title: {
                  text: '交文数量'
                },
                stackLabels: {
                  enabled: true,
                  style: {
                    fontWeight: 'bold',
                    color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
                  }
                }
              },
              legend: {
                align: 'right',
                x: -30,
                verticalAlign: 'top',
                y: 25,
                floating: true,
                backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white',
                borderColor: '#CCC',
                borderWidth: 1,
                shadow: false
              },
              series: [{
                name: '办结交文',
                data: data.monthFinish
              }, {
                name: '未办结交文',
                data: data.monthUndo
              }]
            };
            $scope.data.hideTips=true;
          });
      };

      $scope.query();
  });
}());
