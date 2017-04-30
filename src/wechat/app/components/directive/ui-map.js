(function() {
'use strict';

var app = angular.module('BaiduMapDirective', []);

  app.directive('uiMap', function ($parse, $q, $window, $timeout, $ionicModal, $ionicSlideBoxDelegate, MessageToaster, BaiduService) {
    'ngInject';
      /**
       * 加载百度地图
       * @param {object}  $q angular $q
       * @param {string} apiKey 百度apiKey
       * @param {string} version 版本号
       */
      function loadMap(apiKey) {

          // 判断是否执行过加载过程
          if (window.loadBaiduPromise) {
              return window.loadBaiduPromise;
          }

          var deferred = $q.defer(),
            resolve = function () {
                deferred.resolve(window.BMap ? window.BMap : false);
            },
            callbackName = 'loadBaiduMaps_' + (new Date().getTime()),
            params = {
                'ak': apiKey
            };

          if (window.BMap) {
              resolve();
          } else {
              angular.extend(params, {
                  'v': '2.0',
                  'callback': callbackName
              });

              // 百度地图加载成功后回调用方法
              window[callbackName] = function () {
                  // 标识异步任务完成
                  resolve();

                  // 成功后删除全局回调方法
                  $timeout(function () {
                      try {
                          delete window[callbackName];
                      } catch (e) { }
                  }, 20);
              }

              // 加载百度地图脚本
              var head = document.getElementsByTagName('HEAD').item(0);
              var bdscript = document.createElement('script');
              bdscript.type = 'text/javascript';
              bdscript.src = 'http://api.map.baidu.com/api?v=' + params.v + '&ak=' + params.ak + '&callback=' + params.callback;
              head.appendChild(bdscript);
          }
          window.loadBaiduPromise = deferred.promise;

          // 返回异步任务对象
          return window.loadBaiduPromise;
      }

      /**
       * 绑定地图事件，以便地图上触发的事件都转换为地图元素触发的对应事件
       * @param {*} scope  范围
       * @param {*} eventsStr 事件
       * @param {*} baiduObject 百度地图对象
       * @param {*} element 元素
       * @param {*} prefix 地图事件前缀
       */
      function bindMapEvents(scope, baiduObject) {
          var events = scope.$eval(attrs.mapEvent);
          angular.forEach(events, function (uiEvent, eventName) {
              var fn = $parse(uiEvent);

              baiduObject.addEventListener(eventName, function (event) {
                  var params = Array.prototype.slice.call(arguments);
                  params = params.splice(1);
                  fn(scope, {
                      $event: evt,
                      $params: params
                  });
                  if (!scope.$$phase) {
                      scope.$apply();
                  }
              })
          })
      }

      /**
       * 在指定容器中构建渲染百度地图组件
       * @param {*} container
       * @param {*} options
       */
      function buildMap(container, options) {
          if (!options.apiKey) {
              throw new Error('请设置apiKey!');
          }

          var map = new window.BMap.Map(container, {
              enableMapClick: true
          });

          if (options.enableScrollWheelZoom) {
              map.enableScrollWheelZoom();
          }

          return map;
      }

      /**
       * 根据位置做标记
       * @param {*} map
       * @param {*} point
       * @param {*} clickCallback
       * @param {*} poInfo
       */
      function addMapMarker(map, point, clickCallback, poInfo) {
          var mk = new BMap.Marker(point);
          map.addOverlay(mk);
          mk.babyPoi = poInfo;

          if (clickCallback) {
              mk.addEventListener('click', clickCallback);
          }

          return mk;
      }

      /**
       * 添加地图导航控件
       * @param {*} map
       * @param {*} anchor
       */
      function addMapNavigation(map, anchor) {
          var navigation = new window.BMap.NavigationControl({
              anchor: anchor
          });
          map.addControl(navigation);
      }

      /**
       * 获取当前位置
       * @param {*} map
       * @param {*} options
       */
      function getCurrentPosition(map, options) {
          var deferred = $q.defer();

          if (!!options.center) {
              var point = new BMap.Point(options.center.longitude, options.center.latitude); // 定义一个中心点坐标
              deferred.resolve(point);
          } else {
              if (typeof baidumap_location !== 'undefined') {
                  // 获取GPS当前位置
                  baidumap_location.getCurrentPosition(function (result) {
                      var point = new BMap.Point(result.lontitude, result.latitude);
                      deferred.resolve(point);
                  }, function (error) {
                      deferred.reject(error);
                  });
              } else {
                  deferred.reject();
              }
          }
          return deferred.promise;
      }

      /**
       * 添加搜索框自动完成功能
       * @param {*} map
       * @param {*} scope
       */
      function addMapAutoComplete(map, scope) {
          function onConfirm(e) {
              var selectedVal = e.item.value;
              var keywrod = selectedVal.province + selectedVal.city + selectedVal.district + selectedVal.street + selectedVal.business;
              baiDuLocalSearchAndMark(map, keywrod).then(function (results) {
                  scope.baiDuSearchResults = results;
              }, function (err) {
                  //ionicToast.show('检索异常!', 'middle', false, 3000);
                  MessageToaster.error("检索异常!");
              });
          }
          var ac = new BMap.Autocomplete({
              'input': 'mech-map-searchbox',
              'location': map
          });
          ac.addEventListener('onconfirm', onConfirm);

          var ac1 = new BMap.Autocomplete({
              'input': 'mech-list-searchbox',
              'location': map
          });
          ac1.addEventListener('onconfirm', onConfirm);
      }

      /**
       * 根据关键字在百度搜索位置信息
       * @param {*} map
       * @param {*} keyword
       */
      function baiDuLocalSearch(map, keyword) {
          var deferred = $q.defer();

          function onSearchComplete(results) {
              try {
                  var pois = [];
                  if (!angular.isArray(results)) {
                      results = [results];
                  }
                  for (var j = 0; j < results.length; j++) {
                      var result = results[j];
                      for (let i = 0; i < result.ur.length; i++) {
                          var poi = result.getPoi(i),
                            tempPoi = {
                                AccountID: 0,
                                OrgName: poi.title,
                                Address: poi.address,
                                Tel: poi.phoneNumber,
                                Latitude: poi.point.lat,
                                Longitude: poi.point.lng
                            };

                          if (!!map.scope.currentPosition) {
                              tempPoi["Dist"] = map.getDistance(poi.point, map.scope.currentPosition).toFixed(2);
                          }
                          pois.push(tempPoi);
                      }
                  }

                  deferred.resolve(pois);
              } catch (err) {
                  deferred.reject(err);
              }
          }
          var local = new BMap.LocalSearch(map, {
              onSearchComplete: onSearchComplete,
              pageCapacity: 10
          });
          local.search(keyword);
          return deferred.promise;
      }

      /**
       * 根据关键字搜索百度数据并打标记
       * @param {*} map
       * @param {*} keyword
       */
      function baiDuLocalSearchAndMark(map, keyword) {
          var deferred = $q.defer();

          baiDuLocalSearch(map, keyword).then(function (results) {
              map.clearOverlays();
              var point;
              for (var i = 0; i < results.length; i++) {
                  point = new BMap.Point(results[i].Longitude, results[i].Latitude);
                  addMapMarker(map, point, openInfoWindow, results[i]);
              }
              point && map.panTo(point);

              deferred.resolve(results);
          }, function (err) {
              deferred.reject(err);
          });

          return deferred.promise;
      }

      /**
       * 根据位置搜索本地系统维护的后台数据
       * @param {*} point
       */
      function babyPlanLocalSearch(point) {
          return BaiduService.getNearbyDeposits(point.longitude, point.latitude);
      }

      /**
       * 打开当前位置标记的详情页面
       * @param {*} e
       */
      function openInfoWindow(e) {
          var p = e.target,
            map = e.target.map;

          if (!p.babyPoi) {
              return;
          }

          if (p.babyPoi.AccountID > 0) {
              map.scope.openDepositInfoForm(p.babyPoi);
          } else {
              var opts = {
                  width: 250, // 信息窗口宽度
                  height: 80, // 信息窗口高度
                  title: p.babyPoi.OrgName,
                  enableMessage: true // 设置允许信息窗发送短息
              },
                content = p.babyPoi.Address;
              var point = new BMap.Point(p.babyPoi.Longitude, p.babyPoi.Latitude);
              var infoWindow = new BMap.InfoWindow(content, opts);
              map.openInfoWindow(infoWindow, point);
          }
      }


      return {
          restrict: 'EA',
          scope: {
              mapOptions: '='
          },
          templateUrl: 'ui-map.html',
          replace: true,
          link: function (scope, elm, attrs) {
              var opts = angular.extend({}, scope.mapOptions);

              var MAP_MODES = scope.MAP_MODES = {
                  MAP_SHOW: 0,
                  MAP_SEARCH: 1,
                  LIST_SHOW: 2,
                  LIST_SEARCH: 3
              };
              scope.currMode = MAP_MODES.MAP_SHOW;
              scope.baiDuSearchResults = [];
              scope.babyPlanSearchResults = [];
              scope.keyword1 = '';
              scope.keyword2 = '';
              scope.depositInfo = {};
              // scope.depositInfo = {
              //   OrgName: '南科大',
              //   Address: '学苑大道1088号',
              //   FrontDeskLink1: 'http://120.76.226.47/group1/M00/00/03/Ci5ek1jxwpWAD29ZAC84O4JhWyE096.jpg',
              //   LicenseType: null,
              //   ContactPhone: '1311111111',
              //   Score: 50,
              //   Remark: '宝宝的托管机构，宝宝的安全托管机构',
              //   Images: ['http://120.76.226.47/group1/M00/00/03/Ci5ek1jxwpWAD29ZAC84O4JhWyE096.jpg', null],
              //   Comments: [{comment: '对于缩略图视图，您可以在文件夹上放一个图片来提醒您它的内容。',create_date: '2017-4-23 12:00:00',creator: 'X*'}, {comment: '机构不错',create_date: '2017-4-21 12:00:00',creator: 'X*'}]
              // }

              /**
               * 拨打电话
               */
              scope.dial = function (tel) {
                  $window.location.href = 'tel:' + tel;
              };

              /**
               * 定位
               */
              scope.location = function (poi) {
                  // 切换到地图模式
                  scope.currMode = MAP_MODES.MAP_SHOW;

                  // 清除所有标记，并添加当前位置标记
                  scope.map.clearOverlays();
                  var point = new BMap.Point(poi.Longitude, poi.Latitude);
                  addMapMarker(scope.map, point, openInfoWindow, poi);

                  $timeout(function () {
                      scope.map.panTo(point);
                  }, 20);
              };

              /**
               * 定位到当前位置
               */
              scope.locationCurrent = function () {
                  $timeout(function () {
                      addMapMarker(scope.map, scope.currentPosition, openInfoWindow, null);
                      scope.currentPosition && scope.map.panTo(scope.currentPosition);
                  }, 20);
              };

              /**
               * 定位标记所有位置
               */
              scope.locationAll = function () {
                  // 切换到地图模式
                  scope.currMode = MAP_MODES.MAP_SHOW;

                  // 清除所有标记，并添加当前位置标记
                  scope.map.clearOverlays();

                  var poi, point;
                  for (var i = 0; i < scope.baiDuSearchResults.length; i++) {
                      poi = scope.baiDuSearchResults[i];
                      point = new BMap.Point(poi.Longitude, poi.Latitude);
                      addMapMarker(scope.map, point, openInfoWindow, poi);
                  }

                  for (var i = 0; i < scope.babyPlanSearchResults.length; i++) {
                      poi = scope.babyPlanSearchResults[i];
                      point = new BMap.Point(poi.Longitude, poi.Latitude);
                      addMapMarker(scope.map, point, openInfoWindow, poi);
                  }

                  $timeout(function () {
                      try {
                          point && scope.map.panTo(point);
                      } catch (e) { }
                  }, 20);
              };

              /**
               * 关闭详情页面
               */
              scope.closeDepositInfoForm = function () {
                  scope.modal.hide();
              };

              /**
               * 打开详情页面
               */
              scope.openDepositInfoForm = function (deposit) {
                  if (!deposit || deposit.AccountID == 0) return;

                  // 根据ID获取机构详情和评论信息
                  BaiduService.getDepositInfoWithComments(deposit.AccountID).then(function (depositInfo) {
                      scope.depositInfo = depositInfo;

                      // 判断详情页面是否已经加载，如果已经加载过直接打开，否则加载并打开页面
                      if (!scope.modal) {
                          $ionicModal.fromTemplateUrl('ui-map-info.html', {
                              scope: scope,
                              animation: 'slide-in-up'
                          }).then(function (modal) {
                              scope.modal = modal;
                              scope.modal.show();
                          });
                      } else {
                          scope.modal.show();
                      }
                  }, function (err) {
                      //ionicToast.show('获取机构详情信息失败!', 'middle', false, 3000);
                      MessageToaster.error("获取机构详情信息失败!");
                  })
              };

              /**
               * 回退到地图模式
               */
              scope.backToMapView = function () {
                  scope.currMode = MAP_MODES.MAP_SHOW;
              };

              /**
               * 切换模式
               */
              scope.switchMode = function (mode) {
                  //
                  if (scope.currMode === mode) return;

                  // 如果切换的目标模式为空，根据当前模式修正为正确目标模式
                  if (!mode) {
                      switch (scope.currMode) {
                          case MAP_MODES.MAP_SEARCH:
                              mode = MAP_MODES.MAP_SHOW;
                              break;
                          case MAP_MODES.MAP_SHOW:
                              mode = MAP_MODES.LIST_SHOW;
                              break;

                          case MAP_MODES.LIST_SEARCH:
                              mode = MAP_MODES.LIST_SHOW;
                              break;
                          case MAP_MODES.LIST_SHOW:
                              mode = MAP_MODES.MAP_SHOW;
                              break;
                      }
                  }

                  // 切换关键字
                  // if (scope.currMode <= MAP_MODES.MAP_SEARCH && mode > MAP_MODES.MAP_SEARCH) {
                  //   scope.keyword2 = scope.keyword1
                  // } else if (scope.currMode > MAP_MODES.MAP_SEARCH && mode <= MAP_MODES.MAP_SEARCH) {
                  //   scope.keyword1 = scope.keyword2
                  // }
                  //

                  // 根据当前模式不同触发不同的行为
                  switch (scope.currMode) {
                      case MAP_MODES.MAP_SEARCH:
                          // if (!scope.keyword1) {
                          //  // ionicToast.show('请录入搜索关键字!', 'middle', false, 3000)
                          //   return
                          // }
                          !!scope.keyword1 && baiDuLocalSearchAndMark(scope.map, scope.keyword1).then(function (results) {
                              scope.baiDuSearchResults = results;
                          }, function (err) {
                              //ionicToast.show('百度本地搜索失败!', 'middle', false, 3000);
                              MessageToaster.error("百度本地搜索失败!");
                          });
                          break;
                      case MAP_MODES.LIST_SEARCH:
                          // if (!scope.keyword2) {
                          //   ionicToast.show('请录入搜索关键字!', 'middle', false, 3000)
                          //   return
                          // }
                          !!scope.keyword2 && baiDuLocalSearchAndMark(scope.map, scope.keyword2).then(function (results) {
                              scope.baiDuSearchResults = results;
                          }, function (err) {
                              //ionicToast.show('百度本地搜索失败!', 'middle', false, 3000);
                              MessageToaster.error("百度本地搜索失败!");
                          });
                          break;
                      case MAP_MODES.LIST_SHOW:
                          mode === MAP_MODES.MAP_SHOW && scope.locationAll();
                          break;
                  }

                  scope.currMode = mode;
              };

              /**
               * 地图组件销毁时处理逻辑
               */
              scope.$on('$destroy', function () {
                  scope.modal && scope.modal.remove();
              });

              var onLoadMapSuccessed = function () {

                  try{

                      // 创建百度地图
                      var map = scope.map = buildMap(document.getElementById('map'), opts);
                      map.scope = scope;

                      // 添加导航栏
                      addMapNavigation(map, BMAP_ANCHOR_BOTTOM_RIGHT);

                      // 添加地图搜索框自动完成功能
                      addMapAutoComplete(map, scope);

                      // 设置地图可视区中心位置
                      getCurrentPosition(map, opts).then(function (p) {
                          // 记录当前位置并标记
                          scope.currentPosition = p;

                          var marker = addMapMarker(map, p, openInfoWindow, null);
                          // 设置为中心
                          map.centerAndZoom(p, 16);

                          // 根据关键字检索百度相关位置数据和根据当前位置检索后台维护附近数据
                          var bpSearchDeferred = babyPlanLocalSearch(p);
                          var bdSearchDeferred = baiDuLocalSearch(map, opts.keywords);
                          $q.all([bpSearchDeferred, bdSearchDeferred]).then(function (results) {

                              // 缓存结果
                              scope.baiDuSearchResults = results[1];
                              scope.babyPlanSearchResults = results[0];

                              // 对满足条件的位置进行标记，
                              var point;
                              for (var j = 0; j < results.length; j++) {
                                  var result = results[j];
                                  for (var i = 0; i < result.length; i++) {
                                      point = new BMap.Point(result[i].Longitude, result[i].Latitude);
                                      addMapMarker(map, point, openInfoWindow, result[i]);
                                  }
                              }

                              // 把最后一个位置移动到地图中心
                              // point && map.panTo(point)
                          }, function (err) {
                              //ionicToast.show('获取位置信息失败!', 'middle', false, 3000);
                              MessageToaster.error("获取位置信息失败!");
                          })
                      })
                  } catch (err) {
                      alert("error" + err.message);
                  }

                  // 通知地图加载完成
                  elm.triggerHandler('map-loaded', {
                      bmap: map
                  });
              };

              // 加载地图失败处理逻辑
              var onLoadMapFailed = function () {
                  opts.onMapLoadFailded();
              };

              // 加载地图
              loadMap(opts.apiKey).then(onLoadMapSuccessed, onLoadMapFailed);
          }
      }
  });
}());
