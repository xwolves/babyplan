(function() {
    "use strict";
    angular.module('xhStarter', [
        'vendor',
        'config',
        'code',
        'directive',
        'tools',
        'modules'
    ])

    .run(function($ionicPlatform) {
        $ionicPlatform.ready(function() {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                cordova.plugins.Keyboard.disableScroll(true);

            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }
        });
    })

    .config(function($ionicConfigProvider, $urlRouterProvider, $stateProvider, $httpProvider, $sceDelegateProvider) {
            console.log("start app");

            if (!ionic.Platform.isIOS()) {
                $ionicConfigProvider.scrolling.jsScrolling(false);
            }
            $sceDelegateProvider.resourceUrlWhitelist(['**']);
            $httpProvider.interceptors.push([
                '$injector',
                function($injector) {
                    return $injector.get('AuthInterceptor');
                }
            ]);
            $ionicConfigProvider.platform.ios.tabs.style('standard');
            $ionicConfigProvider.platform.ios.tabs.position('bottom');
            $ionicConfigProvider.platform.android.tabs.style('standard');
            $ionicConfigProvider.platform.android.tabs.position('bottom');

            $ionicConfigProvider.platform.ios.navBar.alignTitle('center');
            $ionicConfigProvider.platform.android.navBar.alignTitle('center');

            $ionicConfigProvider.platform.ios.backButton.previousTitleText('').icon('ion-ios-arrow-thin-left');
            $ionicConfigProvider.platform.android.backButton.previousTitleText('').icon('ion-android-arrow-back');

            $ionicConfigProvider.platform.ios.views.transition('ios');
            $ionicConfigProvider.platform.android.views.transition('android');

            // $ionicConfigProvider.platform.android.tabs.position('bottom');
            // $ionicConfigProvider.views.transition('none');
            // $ionicConfigProvider.backButton.text('返回').icon('ion-ios-arrow-left');
            // $ionicConfigProvider.tabs.style("standard");
            // $ionicConfigProvider.navBar.alignTitle('center');
        })
        .factory('AuthInterceptor', function($rootScope, $q, AUTH_EVENTS) {
            return {
                responseError: function(response) {
                    $rootScope.$broadcast({
                        401: AUTH_EVENTS.notAuthenticated,
                        403: AUTH_EVENTS.notAuthorized,
                        419: AUTH_EVENTS.sessionTimeout,
                        440: AUTH_EVENTS.sessionTimeout
                    }[response.status], response);
                    return $q.reject(response);
                }
            };
        });
}());

(function() {
    "use strict";
    angular.module('vendor', [
            'ionic',
            'templates',
            'ngStorage',
            'toaster',
            'ui.rCalendar.tpls',
            'ngCordova',
            'ngAnimate',
            'ionic-ratings'
        ]);
}());

(function() {
  "use strict";
  angular.module('AuthService', []).factory('AuthService', function(Session,Path,Role) {
    'ngInject';

    var authService = {
      getLoginID: getLoginID,
      getLoginToken: getLoginToken,
      getUserRole: getUserRole,
      getNextPath: getNextPath,
      getWechatId:getWechatId,
      setSession: setSession
    };

    function getLoginID() {
      return Session.getData('userId');
    };

    function getLoginToken() {
      return Session.getData('token');
    };

    function getUserRole() {
      return Session.getData('userRole');
    };
    function getWechatId(){
      return Session.getData('wechat');
    }

    function setSession(id,token,eshop,role,wechat){
      Session.create(token,eshop,id,role,wechat);
    };

    function getNextPath() {
      if(Session.getData('userRole')==Role.Organizer){
        return Path.OrganizerRolePath;
      }else if(Session.getData('userRole')==Role.Parent){
        return Path.ParentRolePath;
      }else if(Session.getData('userRole')==Role.Teacher){
        return Path.TeacherRolePath;
      }else if(Session.getData('userRole')==Role.visitor){
        return Path.VisitorRolePath;
      }
    };

    return authService;
  });

}());

(function() {
  'use strict';

/**
 * 机构搜索本地服务
 */
angular.module('BaiduService',[])
  .service('BaiduService', function ($q, $http, Constants) {

      /**
       * 转换原始路径为缩略图路径
       * @param {*} imgUrl
       */
      function _convertThumbUrl(imgUrl){
        if(!imgUrl) return;
          return imgUrl.replace(/.(jpg|png|gif)/,'_400x200.$1');
      }

    /**
     * 根据经纬度获取附近机构列表
     * @param {*} longitude
     * @param {*} latitude
     */
    function _getNearbyDeposits(longitude, latitude) {
        var defer = $q.defer(),
       // apiUrl = Constants.serverUrl+ 'nearbyDepositList/113.271/23.135';
         apiUrl = Constants.serverUrl + 'nearbyDepositList/'+longitude+'/'+latitude;

        $http.get(apiUrl).success(function (data, status, headers, congfig) {
          defer.resolve(data.data);
        }).error(function (err) {
          defer.reject(err);
        });
        return defer.promise;
      }

      /**
       * 获取机构详细信息
       * @param {*} depositId
       */
      function _getDepositInfo(depositId) {
        var defer = $q.defer(),
          apiUrl = Constants.serverUrl + 'depositInfo/' + depositId;

        $http.get(apiUrl).success(function (data, status, headers, congfig) {
          defer.resolve(data.data);
        }).error(function (err) {
          defer.reject(err);
        });

        return defer.promise;
      }

      /**
       * 获取机构评论列表
       * @param {*} depositId
       */
      function _getDepositComments (depositId) {
        var defer = $q.defer(),
          apiUrl = Constants.serverUrl + 'comments/deposit?depositid=' + depositId;

        $http.get(apiUrl).success(function (data, status, headers, congfig) {
          defer.resolve(data.data);
        }).error(function (err) {
          defer.reject(err);
        });

        return defer.promise;
      }

      /**
       * 获取机构详情并带有评论信息
       * @param {*} depositId
       */
      function _getDepositInfoWithComments (depositId) {
        var defer = $q.defer();

        var getDepositDeferred = _getDepositInfo(depositId);
        var getDepositCommentsDeferred = _getDepositComments(depositId);

        $q.all([getDepositDeferred, getDepositCommentsDeferred]).then(function (results) {
            var depositInfo = results[0],
              commentsData = results[1];

            depositInfo.Score = commentsData.scores || 0;
            depositInfo.Comments = [];

            //转换所有图片为数组，以用于轮播图片源
            depositInfo.Images = [];
            depositInfo.FrontDeskLink && depositInfo.Images.push(_convertThumbUrl(depositInfo.FrontDeskLink));
            depositInfo.PublicZoneLink && depositInfo.Images.push(_convertThumbUrl(depositInfo.PublicZoneLink));
            depositInfo.KitchenLink && depositInfo.Images.push(_convertThumbUrl(depositInfo.KitchenLink));
            depositInfo.DiningRoomLink && depositInfo.Images.push(_convertThumbUrl(depositInfo.DiningRoomLink));
            depositInfo.RestRoomLink1 && depositInfo.Images.push(_convertThumbUrl(depositInfo.RestRoomLink1));
            depositInfo.RestRoomLink2 && depositInfo.Images.push(_convertThumbUrl(depositInfo.RestRoomLink2));
            depositInfo.ClassRoomLink1 && depositInfo.Images.push(_convertThumbUrl(depositInfo.ClassRoomLink1));
            depositInfo.ClassRoomLink2 && depositInfo.Images.push(_convertThumbUrl(depositInfo.ClassRoomLink2));

            for (var j = 0; j < commentsData.comments.length; j++) {
                depositInfo.Comments.push(commentsData.comments[j]);
            }

            defer.resolve(depositInfo);
        }, function (err) {
            defer.reject(err);
        });

        return defer.promise;
      }

      return {
          getNearbyDeposits: _getNearbyDeposits,
          getDepositInfo: _getDepositInfo,
          getDepositComments: _getDepositComments,
          getDepositInfoWithComments: _getDepositInfoWithComments
      };
  });

}());

(function() {
    "use strict";
    angular.module('CacheData', []).service('CacheData', function($window) {
        'ngInject';

        var cacheData = {
            put: put,
            get: get,
            putObject: putObject,
            getObject: getObject,
            remove: remove,
            clearAll: clearAll
        };
        function put(key, value) {
            $window.localStorage[key] = value;
        };

        function get(key, defaultValue) {
            return $window.localStorage[key] || defaultValue;
        };

        function putObject(key, value) {
            $window.localStorage[key] = JSON.stringify(value);
        };

        function getObject(key) {
            return JSON.parse($window.localStorage[key] || '{}');
        };

        function remove(key) {
            $window.localStorage.removeItem(key);
        };

        function clearAll() {
            $window.localStorage.clear();
        };
        return cacheData;
    });

}());

(function() {
  "use strict";
  angular.module('code', [
    'Session',
    'StateService',
    'CacheData',
    'AuthService',
    'LoadingAlert',
    'ResultHandler',
    'MessageToaster',
    'CustomFilter',
    'BaiduService'
  ]);

}());

(function() {
'use strict';

var app = angular.module('CustomFilter', []);
app.filter('gendarChange', function () {
    return function (input) {
        if (input == "1")return "男";
        else if (input == "2")return "女";
        else return "";
    };
});

app.filter('JSchange', function () {
    return function (input) {
        if (input == "1")return "托管机构";
        else if (input == "3")return "老师";
        else if (input == "2")return "家长";
        else return "游客";
    };
});

app.filter('PayStatus', function () {
    return function (input) {
        if (input == "1")return "已付款";
        else if (input == "0")return "未付款";
        else return "未知";
    };
});

app.filter('PayType', function () {
    return function (input) {
        if (input == "1")return "支付宝支付";
        else if (input == "0")return "微信支付";
        else if (input == "2")return "其它";
        else return "未知";
    };
});

app.filter('relationshipChange', function () {
    return function (input) {
        if (input == "1")return "父亲";
        else if (input == "2")return "母亲";
        else if (input == "3")return "爷爷";
        else if (input == "4")return "奶奶";
        else return "其它";
    };
});

app.filter('dateChange', function () {
    return function (input) {
        var d = new Date(input.replace(/-/g,   "/"));
        var now = new Date();
        var time=now.getTime()- d.getTime();
        if(time>24*60*60*1000){
            return d.Format('MM月dd日');
        }else if(time>60*60*1000){
            //return d.Format('hh')+"小时前";
            var hour=parseInt(time/(60*60*1000));
            return hour+"小时前";
        }else{
            //return d.Format('mm')+"分钟前";
            var min=parseInt(time/(60*1000));
            return min+"分钟前";
        }
    };
});

app.filter('ImageMin', function () {
    return function (input) {
        if(input!=null){
            var fileExtension = input.substring(input.lastIndexOf('.') + 1);
            var fileName = input.substring(0,input.lastIndexOf('.'));
            if(fileExtension.toLowerCase()=='jpg' ||fileExtension.toLowerCase() =='png' || fileExtension.toLowerCase()=='gif'){
                return fileName+"_64x64"+"."+fileExtension;
            }return input;
        }else{
            return '';
        }

    };
});

app.filter('changeSize', function () {
    return function (input,params) {
        if(input!=null){
            var fileExtension = input.substring(input.lastIndexOf('.') + 1);
            var fileName = input.substring(0,input.lastIndexOf('.'));
            if(fileExtension.toLowerCase()=='jpg' ||fileExtension.toLowerCase() =='png' || fileExtension.toLowerCase()=='gif'){
                return fileName+"_"+params+"."+fileExtension;
            }return input;
        }else{
            return '';
        }

    };
});

app.filter('statusChange', function () {
    return function (input,rule) {
        //var rule=[{dm:"0",mc:"未办结"},{dm:"1",mc:"已办结"}];
        if(rule!=null&&rule.length>0) {
            for (var i = 0; i < rule.length; i++) {
                if(rule[i].dm==input)return rule[i].mc;
            }
        }else{
            return input;
        }
    };
});

 app.filter('formatDist', function () {
      return function (dist) {
          dist = dist || 0
          if (dist > 0) {
              return (dist / 1000).toFixed(2) + '千米';
          } else {
              return '';
          }
      };
  });

  app.filter('formatTime', function () {
     return function (time) {
         var now = new Date();
         time = new Date(time) || now;

         var timeSpan = now.getTime() - time.getTime(),
               days = Math.floor(timeSpan / (24 * 3600 * 1000)),
               months = Math.floor(days / (30)),
               years = Math.floor(days / (365)),
               leave1 = timeSpan % (24 * 3600 * 1000),
               hours = Math.floor(leave1 / (3600 * 1000)),
                leave2 = leave1 % (3600 * 1000),
                minutes = Math.floor(leave2 / (60 * 1000));

         if (years > 0) return years + '年前';
         if (months > 0) return months + '月前';
         if (days > 0) return days + '天前';
         if (hours > 0) return hours + '小时前';
         if (minutes > 0) return minutes + '分钟前';
         return '';
     };
   });
}());

(function() {
    "use strict";
    angular.module('LoadingAlert', []).service('LoadingAlert', function($document, $rootScope) {
        'ngInject';
        var activeNavView;
        return {
            show: show,
            hide: hide
        };

        function init() {
            var body = angular.element($document[0].body);
            var ionViewArr = body.find('ion-view');
            for (var i = 0; i < ionViewArr.length; i++) {
                if (angular.element(ionViewArr[i]).attr('nav-view') == 'active') {
                    activeNavView = angular.element(ionViewArr[i]);
                    activeNavView.append("<loading><div class=\"loading-alert-container\"><div class=\"loading-body\"><div class=\"loading-text\">加载中...<div><div></div></loading>");
                }
            }
        }

        function show() {
            init();
        }

        function hide() {
            angular.element(activeNavView.find('loading')[0]).remove();
        }

    });

}());

(function() {
    "use strict";
    angular.module('MessageToaster', []).service('MessageToaster', function(SuccessMessage, ErrorMessage, Constants, toaster) {
        'ngInject';

        var messageToaster = {
            accessFail: accessFail,
            info: info,
            error: error,
            success: success
        };

        function accessFail() {
            toaster.pop('error', Constants.appTitle, ErrorMessage.ACCESS_FAIL);
        }

        function info(content) {
            toaster.pop('info', Constants.appTitle, content);
        }

        function error(content, title) {
            return toaster.pop('error', title || Constants.appTitle, content || ErrorMessage.ACCESS_FAIL);
        }

        function success(content, title) {
            toaster.success('success', title || Constants.appTitle, content || SuccessMessage.OPERATION_SUCESS);
        }


        return messageToaster;
    });

}());
(function() {
    "use strict";
    angular.module('ResultHandler', []).service('ResultHandler', function($q) {
        'ngInject';

        var handler = {
            successedFuc: successedFuc,
            failedFuc: failedFuc
        };

        function successedFuc(response) {
            //console.log("successedFuc");
            //console.log(response);
            return response.data;
            //if (response.data.errno == 0){
            //    return response.data;
            //} else {
            //    return $q.reject(response.data.error);
            //}
        }

        function failedFuc(error) {
            //console.log("failedFuc");
            //console.log(error);
            return $q.reject(error);
        }

        return handler;
    });

}());
(function() {
    "use strict";
    angular.module('Session', []).service('Session', function($http,$window) {
        'ngInject';

        var session = {
            create: create,
            destroy: destroy,
            updateRoles: updateRoles,
            setData:setData,
            getData:getData,
            rmData:rmData,
            checkTimeout:checkTimeout
        };

        function create(token, eshop, userId, roles, wechat) {
            $window.localStorage.setItem("token", token);
            $window.localStorage.setItem("time", new Date().getTime());
            $window.localStorage.setItem("eshop_auth", JSON.stringify(eshop));
            $window.localStorage.setItem("userId", userId);
            $window.localStorage.setItem("userRole", roles);
            $window.localStorage.setItem("wechat", wechat);

            if(token!=null){
                //$http.defaults.headers.common.Authorization = "Bearer-"+token;
                $http.defaults.headers.common.token = token;
            }

            //    $httpProvider.defaults.headers.common["Authorization"] = "Bearer-"+token;
            console.log(session);
        }

        function destroy() {
            $window.localStorage.removeItem("eshop_auth");
            $window.localStorage.removeItem("token");
            $window.localStorage.removeItem("userId");
            $window.localStorage.removeItem("userRole");
            $window.localStorage.removeItem("wechat");
        }

        function checkTimeout() {
            var time=$window.localStorage.getItem('time')
            if(time!=null){
              var past=parseInt(time);
              var sub=new Date().getTime()-past;
              console.log('sub = '+sub);
              //session 有效期 1 小时
              return sub > (3600*1000);
            }else{
              return false;
            }
        };

        function updateRoles(roles) {
            $window.localStorage.setItem("userRole", roles);
        };

        function setData(name,data) {
            $window.localStorage.setItem(name, data);
        }

        function getData(name) {
            return $window.localStorage.getItem(name);
        }

        function rmData(name) {
            $window.localStorage.removeItem(name);
        }

        return session;
    });

}());

(function() {
  'use strict';

  angular.module('StateService', [])
    .factory('StateService', StateService);

  StateService.$inject = ['$ionicViewSwitcher', '$state', '$ionicHistory', '$timeout'];

  function StateService($ionicViewSwitcher, $state, $ionicHistory, $timeout,AuthService) {
    return {
      go: go,
      back: back,
      goToHome: goToHome,
      goToRoot: goToRoot,
      backToState: backToState,
      clearCacheByHistoryId: clearCacheByHistoryId,
      clearAllAndGo: clearAllAndGo,
      clearPreviousStateCache: clearPreviousStateCache
    };

    function go(state, params) {
      $ionicViewSwitcher.nextDirection('forward');
      $state.go(state, params);
    }

    function back() {
      //var currentStateId = [$ionicHistory.currentView().stateId];
      //$ionicViewSwitcher.nextDirection('back');
      //$timeout(clearPreviousStateCache(currentStateId), 700);
      $ionicHistory.goBack();

    }

    function clearPreviousStateCache(stateIds) {
      return function() {
        $ionicHistory.clearCache(stateIds);
      };
    }

    function goToHome() {
      $ionicHistory.nextViewOptions({
        disableBack: true,
        historyRoot: true,
        disableAnimate: true
      });
      $ionicHistory.clearHistory();
      $ionicHistory.clearCache()
        .then(function() {
          $state.go(AuthService.getNextPath());
        });
    }

    function clearAllAndGo(state, params) {
      $ionicHistory.nextViewOptions({
        disableBack: true,
        historyRoot: true,
        disableAnimate: true
      });
      $ionicHistory.clearHistory();
      $ionicHistory.clearCache()
        .then(function() {
          $state.go(state, params);
        });
    }

    function goToRoot(state) {
      $ionicHistory.nextViewOptions({
        disableBack: true,
        historyRoot: true,
        disableAnimate: true
      });
      $state.go(state);
      clearCacheByHistoryId($ionicHistory.currentHistoryId());
    }

    function clearCacheByHistoryId(historyId) {
      var states = [];
      var history = $ionicHistory.viewHistory().histories[historyId];
      for (var i = history.stack.length - 1; i >= 0; i--) {
        states.push(history.stack[i].stateId);
      }
      $ionicHistory.clearCache(states);
    }

    function backToState(state) {
      var historyId = $ionicHistory.currentHistoryId();
      var history = $ionicHistory.viewHistory().histories[historyId];
      for (var i = history.stack.length - 1; i >= 0; i--) {
        if (history.stack[i].stateId == state) {
          $ionicHistory.goBack(i - history.stack.length + 1);
          break;
        }
      }
    }

  }

}());

(function() {
  "use strict";
  angular.module('config', [
    'environmentConfig',
    'constant',
    'httpRelConfig'
  ]);

}());

(function() {
    "use strict";
    angular.module('constant', [])
        .constant('Path',{
            'ParentRolePath':'tabs.childrenSteam',
            'OrganizerRolePath':'tabs.organizer',
            'TeacherRolePath':'tabs.message',
            'VisitorRolePath':'tabs.nearby'
        })
        .constant('Role',{
            'visitor':'-1',
            'Organizer':'1',
            'Parent':'2',
            'Teacher':'3',
            'Children':'4',
            'ThirdParty':'5',
            'Consultant':'6'
        })
        .constant('Weixin', {
        })
        .constant('AUTH_EVENTS', {
            loginSuccess: 'auth-login-success',
            loginFailed: 'auth-login-failed',
            logoutSuccess: 'auth-logout-success',
            sessionTimeout: 'auth-session-timeout',
            notAuthenticated: 'auth-not-authenticated',
            notAuthorized: 'auth-not-authorized'
        })
        .constant('ErrorMessage', {
            ACCESS_FAIL: '通讯异常，请稍后再试！',
            TOKEN_INVALID: '连接超时，请重新登录！'
        })
        .constant('SuccessMessage', {
            SUBMIT_SUCESS: '提交成功',
            OPERATION_SUCESS:'操作完成'
        });
}());

(function() {
    "use strict";
    angular.module('environmentConfig', [])
        .constant('Constants', {
            'appTitle':'宝托安',
            'serverUrl': 'http://wx.zxing-tech.cn/api/v1/',
            'eshopApiUrl': 'http://api.mall.zxing-tech.cn/v2/',
            'dfsUrl': 'http://wx.zxing-tech.cn/',
            'buildID': '20170512v1',
            'ENVIRONMENT':'release'
        });
}());
//'serverUrl': 'http://120.76.226.47/api/v2/',
//    'dfsUrl': 'http://120.76.226.47/',
//http://localhost:8090/
//http://wx.zxing-tech.cn

(function() {
    "use strict";
    angular.module('httpDevConfig', [])
        .config(function($httpProvider) {
            $httpProvider.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
            $httpProvider.defaults.headers.put["Content-Type"] = "application/x-www-form-urlencoded";
        });
}());

(function() {
    "use strict";
    angular.module('httpRelConfig', [])
    .config(function($httpProvider) {
        $httpProvider.defaults.cache = false;
        if (!$httpProvider.defaults.headers.get) {
           $httpProvider.defaults.headers.get = {};
        }
        // disable IE ajax request caching
        $httpProvider.defaults.headers.get['If-Modified-Since'] = '0';

        // Disable IE ajax request caching
        $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
        $httpProvider.defaults.headers.get['Pragma'] = 'no-cache';
    });
}());

(function() {
    "use strict";
    angular.module('directive', [
      'BaiduMapDirective'
    ]);

}());

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
          return BaiduService.getNearbyDeposits(point.lng, point.lat);
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
              if(opts.mode){
                scope.currMode = opts.mode;
              }else{
                scope.currMode = MAP_MODES.MAP_SHOW;
              }
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
(function() {
    "use strict";
    angular.module('modules', [
        'LoginModule',
        'WxLoginModule',
        'childrenSteamModule',
        'registerModule',
        'tabsModule',
        'profileModule',
        'organizerModule',
        'messageModule',
        'teacherModule',
        'teacherSettingModule',
        'depositChildrenModule',
        'commentModule',
        'exitModule',
        'photoModule',
        'helpModule',
        'cameraModule',
        'settingsModule'
    ]);

}());

(function() {
  "use strict";
  angular.module('tools', []).service('tools', tools);
    function tools() {
        'ngInject';

        var tools = {
            getAgent: getAgent
        };

        function getAgent() {
           var browser = {
               versions: function () {
                   var u = navigator.userAgent,
                       app = navigator.appVersion;
                   return { //移动终端浏览器版本信息
                       trident: u.indexOf('Trident') > -1, //IE内核
                       presto: u.indexOf('Presto') > -1, //opera内核
                       webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
                       gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
                       mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
                       ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
                       android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或uc浏览器
                       iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
                       iPad: u.indexOf('iPad') > -1, //是否iPad
                       webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
                   };
               }(),
               language: (navigator.browserLanguage || navigator.language).toLowerCase()
           };
           if (browser.versions.mobile) {
               var ua = navigator.userAgent.toLowerCase(); //获取判断用的对象
               if (ua.match(/MicroMessenger/i) == "micromessenger") {
                   return 'wx';
               } else if (ua.match(/QQ/i) == "qq") {
                   return 'qq';
               } else
                   return 'mobile';
           } else {
               return 'pc';
           }
       }

      return tools;
    };

}());

(function() {
  "use strict";
  angular.module('cameraModule', [
    'cameraRouter',
    'cameraCtrl'
  ]);

}());

(function() {
    "use strict";
    angular.module('cameraCtrl', [])
        .controller('cameraCtrl', function($scope, Constants, StateService, Session, childrenSteamService, AuthService) {
            'ngInject';

            var vm = this;
            vm.activated = false;
            $scope.$on('$ionicView.afterEnter', activate);
            function activate() {
                vm.activated = true;
                vm.version = Constants.buildID;
                vm.getCamera();
            }

            vm.getCamera = function(){
                childrenSteamService.getCamera(AuthService.getLoginID()).then(function(data) {
                    console.log(data.data);
                    vm.cameras=data.data;
                });
            };

            vm.back=function(){
                StateService.back();
            };

            vm.watchVideo = function(video,name){
              video.deposit_name=name;
              Session.setData('video',JSON.stringify(video));
              StateService.go('video');
            };
        });
}());

(function() {
  'use strict';

  angular.module('cameraRouter', [])
    .config(myRouter);


  function myRouter($stateProvider, $urlRouterProvider) {
    'ngInject';
    $stateProvider
      .state('camera', {
        url: "/camera",
        templateUrl: 'camera/camera.html',
        controller: 'cameraCtrl',
        controllerAs: 'vm'
      });
  }
}());

(function() {
  "use strict";
  angular.module('childrenSteamModule', [
    'childrenSteamCtrl',
    'childrenSteamRouter',
    'childrenSteamService',
    'videoCtrl'
  ]);

}());

(function() {
    "use strict";
    angular.module('childrenSteamCtrl', [])
        .controller('childrenSteamCtrl', function($scope,$ionicPopup,$sce,Constants,childrenService,childrenSteamService,AuthService,Session, StateService,$ionicModal, $ionicSlideBoxDelegate) {
            'ngInject';
            console.log("childrenSteamCtrl");
            var vm = this;
            vm.activated = false;
            vm.parent={};
            vm.deposits = [];
            vm.unPaid=false,
            vm.fingerprintLogs=[];
            vm.messages=[];
            vm.cameras=[];
            vm.myComment;
            vm.simpleFilter='';
            vm.offset=[0,0,0];
            vm.limit=30;
            vm.canLoadMore=[true,true,true];
            $scope.$on('$ionicView.afterEnter', activate);

            function activate() {
                vm.activated = true;
                vm.version = Constants.buildID;
                vm.user = AuthService.getLoginID();
                //从微信获取家长的基本信息
                //vm.getWechatInfo(AuthService.getWechatId());
                //vm.parent.wechat={
                //    "nickname": "Band",
                //    "sex": 1,
                //    "language": "zh_CN",
                //    "city": "广州",
                //    "province": "广东",
                //    "country": "中国",
                //    "headimgurl":  "http://wx.qlogo.cn/mmopen/g3MonUZtNHkdmzicIlibx6iaFqAc56vxLSUfpb6n5WKSYVY0ChQKkiaJSgQ1dZuTOgvLLrhJbERQQ4eMsv84eavHiaiceqxibJxCfHe/0"
                //};
                //vm.getChildrenInfo(AuthService.getLoginID(),vm.offset,vm.limit);
                //vm.getChildren();
                vm.getChildrenDeposit();
                var steam=Session.getData('steam');

                if(steam===null){
                  steam=1;
                  console.log('steam = '+steam);
                }
                vm.changeSteam(steam);
            };

            vm.changeSteam = function(index){
              Session.setData('steam',index);
              if(index===0){
                vm.showCamera=true;
                vm.showFingerPrint=false;
                vm.showNotificatin=false;
                if(vm.cameras.length===0)vm.getCamera();
              }else if(index===1){
                vm.showCamera=false;
                vm.showFingerPrint=true;
                vm.showNotificatin=false;
                console.log('fingerprintLogs = '+vm.fingerprintLogs);
                if(vm.fingerprintLogs.length===0)vm.getFingerPrint(0,vm.limit);
              }else if(index===2){
                vm.showCamera=false;
                vm.showFingerPrint=false;
                vm.showNotificatin=true;
                if(vm.messages.length===0)vm.getMessage(0,vm.limit);
              }
            };

            vm.watchVideo = function(video,name){
              video.deposit_name=name;
              Session.setData('video',JSON.stringify(video));
              StateService.go('video');
            };

            vm.getChildrenDeposit = function(){
              childrenSteamService.getChildrenDeposit(AuthService.getLoginID()).then(function(data) {
                  if (data.errno == 0) {
                      console.log(data.data);
                      vm.deposits = data.data;

                      vm.getCamera();
                  } else if (data.errno === 16005) {
                      vm.unPaid = true;
                  }
              });
            };

            vm.getCamera = function(){
              //获取摄像头信息
              for(var i=0;i<vm.deposits.length;i++){
                var id=vm.deposits[i].DepositID;
                //get camera
                if(id!=null){
                  //console.log('http://v.zxing-tech.cn/?v='+id);
                  //vm.cameraSrc = $sce.trustAsResourceUrl('http://v.zxing-tech.cn/?v='+id);
                  childrenSteamService.getCamera(id).then(function(data) {
                      vm.cameras[vm.cameras.length]=data.data;
                  });
                }
              }
            };

            vm.getFingerPrint = function(offset,limit){
              console.log("getFingerPrint");
              childrenSteamService.getAllChildrenSignIn(AuthService.getLoginID(),offset,limit).then(function(data) {
                  if (data.errno == 0) {
                      console.log(data.data);
                      if(vm.fingerprintLogs.length == 0)
                          vm.fingerprintLogs=data.data;
                      else
                          vm.fingerprintLogs=vm.fingerprintLogs.concat(data.data);
                      console.log(vm.fingerprintLogs);
                      vm.offset[1]+=data.data.length;
                      if(data.data.length < vm.limit){
                          console.log("it is the last data");
                          vm.canLoadMore[1] = false;
                      }else{
                          vm.canLoadMore[1] = true;
                      }
                      $scope.$broadcast('scroll.refreshComplete');
                      $scope.$broadcast('scroll.infiniteScrollComplete');
                  }else{
                      console.log(data);
                  }
              });
            };

            vm.getMessage = function(offset,limit){
              console.log("getMessage");
              childrenSteamService.getAllChildrenMsg(AuthService.getLoginID(),offset,limit).then(function(data) {
                  if (data.errno == 0) {
                      console.log(data.data);
                      var start=0;
                      if(vm.messages.length == 0)
                          vm.messages=data.data;
                      else{
                          start=vm.messages.length;
                          vm.messages=vm.messages.concat(data.data);
                        }
                      console.log(vm.messages);
                      //update comment
                      for(var i=0;i<data.data.length;i++){
                        //vm.messages[start+i]
                        childrenSteamService.getDailyComment(vm.messages[start+i].InfoID,start+i).then(function(sdata) {
                            if (data.errno == 0) {
                                console.log("getDailyComment: ");
                                console.log(sdata.data);
                                var index=sdata.data.index;
                                vm.messages[index].comments = sdata.data.comments;
                                vm.messages[index].likes = sdata.data.likes;
                            }
                        });
                      }
                      vm.offset[2]+=data.data.length;
                      if(data.data.length < vm.limit){
                          console.log("it is the last data");
                          vm.canLoadMore[2] = false;
                      }else{
                          vm.canLoadMore[2] = true;
                      }
                      $scope.$broadcast('scroll.refreshComplete');
                      $scope.$broadcast('scroll.infiniteScrollComplete');
                  }else{
                      console.log(data);
                  }
              });
            };

            vm.doRefresh = function (type, offset) {

                if(vm.showCamera){
                  vm.getCamera();
                }else if(vm.showFingerPrint){
                  vm.getFingerPrint(offset,vm.limit);
                }else if(vm.showNotificatin){
                  vm.getMessage(offset,vm.limit);
                }
            };

            vm.getChildrenInfo = function(pId,offset,limit){
                childrenService.getChildrenAllInfo(pId,offset,limit).then(function(data) {
                    if (data.errno == 0) {
                        console.log("getChildrenAllInfo: ");
                        console.log(data.data);
                        if(vm.messages.length == 0)
                            vm.messages=data.data;
                        else
                            vm.messages=vm.messages.concat(data.data);
                        console.log(vm.messages);
                        vm.offset+=data.data.length;
                        if(data.data.length < vm.limit){
                            console.log("it is the last data");
                            vm.canLoadMore = false;
                        }else{
                            vm.canLoadMore = true;
                        }
                        $scope.$broadcast('scroll.refreshComplete');
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                    }else{
                        console.log(data);
                    }
                });
            };

            vm.getWechatInfo = function(wId){
                console.log("wechat id : "+wId);
                childrenService.getWechatInfo(wId).then(function(data) {
                    if (data.errno == 0) {
                        console.log("wechat info: ");
                        console.log(data.data);
                        vm.parent.wechat = data.data;
                    }
                });
            };

            vm.getImg = function(type){
                if(type == 1){
                    return {name:"就餐",src:"img/dinner.png"};
                }else if(type == 2){
                    return {name:"培训",src:"img/traning.png"};
                }else if(type == 3){
                    return {name:"活动",src:"img/play.png"};
                }else if(type == 4){
                    return {name:"作业",src:"img/homework.png"};
                }else if(type == 5){
                    return {name:"接入",src:"img/login.png"};
                }else if(type == 6){
                    return {name:"送到",src:"img/logout.png"};
                }else{
                    return {name:"未知信息类型",src:"img/unknown.png"};
                }
            };

            vm.goPhoto=function(msgIndex,index){
                Session.setData('temp',vm.msg[msgIndex]);
                StateService.go("photo",{index:index});
            };

            vm.star = function(){
                console.log("add star");
            };

            vm.getDailyComments = function(infoid,index){
              console.log("getDailyComments index = "+index);
              childrenSteamService.getDailyComment(infoid,index).then(function(sdata) {
                  if (sdata.errno == 0) {
                      console.log("getDailyComment: ");
                      console.log(sdata.data);
                      var sindex=sdata.data.index;
                      vm.messages[sindex].comments = sdata.data.comments;
                      vm.messages[sindex].likes = sdata.data.likes;
                  }
              });
            };

            vm.like = function(info,index){
              //如果已经like，去like
              //没有like，加like
              console.log(info+" and index="+index);
              var needAdd = true;
              for (var i=0;i<info.likes.length;i++){
                if(info.likes[i].CommentBy==vm.user){
                  //remove
                  needAdd=false;
                  childrenSteamService.delDailyComment(info.likes[i].CommentID).then(function(data) {
                      console.log('rmComment likes');
                      console.log(data);
                      vm.getDailyComments(info.InfoID,index);
                      return;
                  });
                }
              }
              //add
              if(needAdd){
                var comment = {infoid:info.InfoID,commentby:vm.user,commentdata:null};
                childrenSteamService.createDailyComment(comment).then(function(data) {
                    console.log('addComment likes');
                    console.log(data);
                    vm.getDailyComments(info.InfoID,index);
                    return;
                });
              }
            };

            vm.comment = function(info,index){
                console.log(info+" and index="+index);
                vm.showPopup(info,index);
            };

            vm.rmComment = function(comment,index){
              childrenSteamService.delDailyComment(comment.CommentID).then(function(data) {
                  console.log('rmComment');
                  console.log(data);
                  vm.getDailyComments(comment.InfoID,index);
              });
            };

            vm.showPopup = function(info,index) {
                var myPopup = $ionicPopup.show({
                  template: '<input type="edittext" ng-model="vm.myComment">',
                  title: '请输入评论内容',
                  scope: $scope,
                  buttons: [
                    { text: '取消' },
                    {
                      text: '<b>提交</b>',
                      type: 'button-positive',
                      onTap: function(e) {
                        if (!vm.myComment) {
                          e.preventDefault();
                        } else {
                          return vm.myComment;
                        }
                      }
                    }
                  ]
                  });

                  myPopup.then(function(res) {
                    console.log('Tapped!', res);
                    //add comment
                    if(res.length>0){
                      var comment = {infoid:info.InfoID,commentby:vm.user,commentdata:res};
                      childrenSteamService.createDailyComment(comment).then(function(data) {
                          console.log('addComment comments');
                          console.log(data);
                          vm.myComment = null;
                          vm.getDailyComments(info.InfoID,index);
                          return;
                      });
                    }
                  });
            };

            vm.getChildren = function(){
                childrenService.getChildren(AuthService.getLoginID()).then(function(data) {
                    var title="";
                    if (data.errno == 0) {
                        console.log(data.data);
                        vm.childs = data.data;
                        for(var i=0;i<vm.childs.length;i++){
                            if(i==vm.childs.length-1)
                                title+=(vm.childs[i].name+"的家长");
                            else
                                title+=(vm.childs[i].name+",");
                            //vm.getMsg(vm.childs[i].uid);
                            //vm.getChildSignIn(vm.childs[i].uid,vm.childs[i].name);
                        }
                        vm.parent.title=title;
                    }
                    //vm.fingerprintLogs.sort(function(a,b){return a.log-b.log});
                });
            };

            vm.change = function(){
                if(vm.simpleFilterSelect==='-1'){
                    vm.simpleFilter="";
                }else if(vm.simpleFilterSelect==='0'){
                    vm.simpleFilter={datatype:'2'};
                }else if(vm.simpleFilterSelect==='1'){
                    vm.simpleFilter={datatype:'1',InfoType:'1'};
                }else if(vm.simpleFilterSelect==='2'){
                    vm.simpleFilter={datatype:'1',InfoType:'2'};
                }else if(vm.simpleFilterSelect==='3'){
                    vm.simpleFilter={datatype:'1',InfoType:'3'};
                }else if(vm.simpleFilterSelect==='4'){
                    vm.simpleFilter={datatype:'1',InfoType:'4'};
                }else if(vm.simpleFilterSelect==='5'){
                    vm.simpleFilter={datatype:'1',InfoType:'5'};
                }else if(vm.simpleFilterSelect==='6'){
                    vm.simpleFilter={datatype:'1',InfoType:'6'};
                }
            };

            vm.getImages=function(msg){
                vm.imgCount=0;
                if(msg.PhotoLink1!=null && msg.PhotoLink1!=""){
                    var data={src:msg.PhotoLink1,msg:''};
                    vm.images[vm.imgCount]=data;
                    vm.imgCount++;
                }
                if(msg.PhotoLink2!=null && msg.PhotoLink2!=""){
                    var data={src:msg.PhotoLink2,msg:''};
                    vm.images[vm.imgCount]=data;
                    vm.imgCount++;
                }
                if(msg.PhotoLink3!=null && msg.PhotoLink3!=""){
                    var data={src:msg.PhotoLink3,msg:''};
                    vm.images[vm.imgCount]=data;
                    vm.imgCount++;
                }
                if(msg.PhotoLink4!=null && msg.PhotoLink4!=""){
                    var data={src:msg.PhotoLink4,msg:''};
                    vm.images[vm.imgCount]=data;
                    vm.imgCount++;
                }
                if(msg.PhotoLink5!=null && msg.PhotoLink5!=""){
                    var data={src:msg.PhotoLink5,msg:''};
                    vm.images[vm.imgCount]=data;
                    vm.imgCount++;
                }
                if(msg.PhotoLink6!=null && msg.PhotoLink6!=""){
                    var data={src:msg.PhotoLink6,msg:''};
                    vm.images[vm.imgCount]=data;
                    vm.imgCount++;
                }
                console.log(vm.images);
            };

            $ionicModal.fromTemplateUrl('message/image-modal.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function(modal) {
                $scope.modal = modal;
            });

            $scope.openModal = function() {
                $ionicSlideBoxDelegate.slide(0);
                $scope.modal.show();
            };

            $scope.closeModal = function() {
                $scope.modal.hide();
            };

            // Cleanup the modal when we're done with it!
            $scope.$on('$destroy', function() {
                $scope.modal.remove();
            });
            // Execute action on hide modal
            $scope.$on('modal.hide', function() {
                // Execute action
            });
            // Execute action on remove modal
            $scope.$on('modal.removed', function() {
                // Execute action
            });
            $scope.$on('modal.shown', function() {
                console.log('Modal is shown!');
            });

            // Call this functions if you need to manually control the slides
            $scope.next = function() {
                $ionicSlideBoxDelegate.next();
            };

            $scope.previous = function() {
                $ionicSlideBoxDelegate.previous();
            };

            $scope.goToSlide = function(index,msg) {
                vm.images=[];
                vm.getImages(msg);
                $scope.modal.show();
                $ionicSlideBoxDelegate.slide(index);
            };

            // Called each time the slide changes
            $scope.slideChanged = function(index) {
                $scope.slideIndex = index;
            };

        });
}());

(function() {
  'use strict';

  angular.module('childrenSteamRouter', [])
    .config(myRouter);


  function myRouter($stateProvider, $urlRouterProvider) {
    'ngInject';
    $stateProvider
      .state('tabs.childrenSteam', {
        url: "/childrenSteam",
          views: {
            'tab-childrenSteam': {
              templateUrl: 'childrenSteam/childrenSteam.html',
              controller: 'childrenSteamCtrl',
              controllerAs: 'vm'
            }
          }
      })
      .state('video', {
        url: "/video",
        templateUrl: 'childrenSteam/video.html',
        controller: 'videoCtrl',
        controllerAs: 'vm'
      });
  }
}());

(function() {
  'use strict';

  angular.module('childrenSteamService', [])
    .factory('childrenSteamService', childrenSteamService);

  function childrenSteamService( $q, $http,Constants,ResultHandler) {
    'ngInject';
    var service = {
      getMsg:getMsg,
      getChildrenMsg:getChildrenMsg,
      getChildren:getChildren,
      getChildSignIn:getChildSignIn,
      getChildrenSignIn:getChildrenSignIn,
      getWechatInfo:getWechatInfo,
      getChildrenAllInfo:getChildrenAllInfo,
      getAllChildrenSignIn:getAllChildrenSignIn,
      getAllChildrenMsg:getAllChildrenMsg,
      getChildrenDeposit:getChildrenDeposit,
      getDailyComment:getDailyComment,
      createDailyComment:createDailyComment,
      delDailyComment:delDailyComment,
      getCamera:getCamera
    };

    //字段名	类型	备注
    //InfoID 	int64 	信息编号，自增即可
    //PublisherID 	int64 	发布老师的账号
    //DepositID 	int64 	托管机构账号
    //Longitude 	float 	信息发布的位置经度
    //Latitude 	float 	信息发布的位置纬度
    //ClickCount 	int64 	总浏览次数
    //InfoType 	int32 	信息类型（1：就餐；2：培训；3：活动；4：作业）
    //Description 	varchar2 	老师的描述，不超出1000字
    //PhotoLink1 	varchar2 	照片/视频1的信息
    //PhotoLink2 	varchar2 	照片/视频2的信息
    //PhotoLink3 	varchar2 	照片/视频3的信息
    //PhotoLink4 	varchar2 	照片/视频4的信息
    //PhotoLink5 	varchar2 	照片/视频5的信息
    //PhotoLink6 	varchar2 	照片/视频6的信息
    //Status	int	1:正常发布，2:撤回,
    //CreateTime 	datetime 	创建时间


    /*
     GET /api/v1/children/information/{$childuid}
     return
     {
     "errno":0,
     "error":"",
     "data":{
     "childuid":41000001,
     "childname":"xxx",
     "childavatarlink":"http://xxxxxxx.jpg",
     "timeline":[
     {
     "timestamp":1468051200,
     "actiontype":0,
     "actionname":"signin",
     "actiondata":{}
     },
     {
     "timestamp":146805200,
     "actiontype":1,
     "actionname":"dining",
     "actiondata":{
     "imgs":["http://xxxxxxxxxx1.jpg", "http://xxxxxxxxx2.jpg",...],
     "desc":"孩子们愉快的享受着美味"
     }
     },
     ]
     "signin":1468051200,
     "name":"yyy",
     "avatarlink":"http://yyyyyyyyyyy.jpg",
     }
     ]
     }
     */
    function getMsg(childId) {
        var url = Constants.serverUrl + 'parent/children/information/'+childId;
        return $http.get(url).then(ResultHandler.successedFuc, ResultHandler.failedFuc);
    };

    /*
     GET /api/v1/parent/childrenlist/{$parentuid}
     return
     {
     "errno":0,
     "error":"",
     "data":[
     {
     "uid":41000001,
     "name":"xxx",
     "avatarlink":"http://xxxxxxx.jpg",
     },
     {
     "uid":41000002,
     "name":"yyy",
     "avatarlink":"http://yyyyyyyyyyy.jpg",
     }
     ]
     }
     */
    function getChildren(parentId) {
        var url = Constants.serverUrl + 'parent/childrenList/'+parentId;
        return $http.get(url).then(ResultHandler.successedFuc, ResultHandler.failedFuc);
    };

    function getChildSignIn(childId) {
        var url = Constants.serverUrl + 'parent/children/signin/'+childId;
        return $http.get(url).then(ResultHandler.successedFuc, ResultHandler.failedFuc);
    };

    function getChildrenMsg(parentId) {
        var url = Constants.serverUrl + 'parent/children/allInformation/'+parentId;
        return $http.get(url).then(ResultHandler.successedFuc, ResultHandler.failedFuc);
    };

    function getChildrenSignIn(parentId) {
        var url = Constants.serverUrl + 'parent/children/allSignin/'+parentId;
        return $http.get(url).then(ResultHandler.successedFuc, ResultHandler.failedFuc);
    };

    function getAllChildrenSignIn(parentId,offset,count) {
        var url = Constants.serverUrl + 'parent/children/fp/'+parentId+'?offset='+offset+'&limitcount='+count;
        return $http.get(url).then(ResultHandler.successedFuc, ResultHandler.failedFuc);
    };

    function getAllChildrenMsg(parentId,offset,count){
        var url = Constants.serverUrl + 'parent/children/msg/'+parentId+'?offset='+offset+'&limitcount='+count;
        return $http.get(url).then(ResultHandler.successedFuc, ResultHandler.failedFuc);
    };

    function getChildrenAllInfo(parentId,offset,count){
        var url = Constants.serverUrl + 'parent/childrenInformation/fetch/'+parentId+'?offset='+offset+'&limitcount='+count;
        return $http.get(url).then(ResultHandler.successedFuc, ResultHandler.failedFuc);
    };

    function getWechatInfo(wid) {
        var url = Constants.serverUrl + 'wechat/'+wid;
        return $http.get(url).then(ResultHandler.successedFuc, ResultHandler.failedFuc);
    };

    function getChildrenDeposit(pid) {
        var url = Constants.serverUrl + 'parent/children/deposit/'+pid;
        return $http.get(url).then(ResultHandler.successedFuc, ResultHandler.failedFuc);
    };

    function getDailyComment(infoId,index) {
        var url = Constants.serverUrl + 'dailyComment/'+infoId+'?index='+index;
        return $http.get(url).then(ResultHandler.successedFuc, ResultHandler.failedFuc);
    };

    function createDailyComment(data) {
        var url = Constants.serverUrl + 'dailyComment';
        return $http({
            method: 'post',
            url: url,
            data: data
        }).then(ResultHandler.successedFuc, ResultHandler.failedFuc);
    };

    function delDailyComment(id) {
        var url = Constants.serverUrl + 'dailyComment/'+id;
        return $http.delete(url).then(ResultHandler.successedFuc, ResultHandler.failedFuc);
    };

    function getCamera(did){
      //var url =  Constants.serverUrl +"cgi-bin/video.pl?did="+did;
      var url =  Constants.serverUrl +"camera/"+did;
      return $http.get(url).then(ResultHandler.successedFuc, ResultHandler.failedFuc);
    };

    return service;


  }


}());

(function() {
    "use strict";
    angular.module('videoCtrl', [])
        .controller('videoCtrl', function($scope, Session, StateService, Constants) {
            'ngInject';

            var vm = this;
            vm.activated = false;

            $scope.$on('$ionicView.afterEnter', activate);
            function activate() {
                vm.activated = true;
                vm.version = Constants.buildID;
                vm.video=JSON.parse(Session.getData('video'));

                console.log(vm.video);
            }

            vm.back = function(){
                StateService.back();
            };
        });
}());

(function() {
  "use strict";
  angular.module('commentModule', [
    'commentService'
  ]);

}());

(function() {
  'use strict';

  angular.module('commentService', [])
    .factory('commentService', commentService);

  function commentService($q, $http, Constants, ResultHandler) {
    'ngInject';
    var service = {
        queryDepositComment:queryDepositComment
    };

    //http://172.18.1.166/api/v1/comment/deposit/fetch/:depositid
    function queryDepositComment(id) {
        var url = Constants.serverUrl + 'comment/deposit/fetch/'+id;
        return $http.get(url).then(ResultHandler.successedFuc, ResultHandler.failedFuc);
    };

    return service;
  }

}());

(function() {
    "use strict";
    angular.module('childrenDetailCtrl', [])
        .controller('childrenDetailCtrl', function($scope, $stateParams, Constants, StateService,depositChildrenService) {
            'ngInject';
            var vm = this;
            vm.activated = false;

            vm.query = function(id){
                console.log("child id = "+id);
                depositChildrenService.queryChildren(id).then(function(data) {
                    if (data.errno == 0) {
                        console.log(data.data);
                        vm.child = data.data;
                    }
                });
            };

            $scope.$on('$ionicView.afterEnter', activate);

            function activate() {
                console.log($stateParams);
                vm.cid = $stateParams.cid;
                vm.activated = true;
                vm.version = Constants.buildID;
                vm.query(vm.cid);
            }

            vm.back=function(){
                StateService.back();
            };

        });
}());

(function() {
  "use strict";
  angular.module('depositChildrenModule', [
    'depositChildrenCtrl',
    'childrenDetailCtrl',
    'teacherDepositChildrenCtrl',
    'depositChildrenRouter',
    'depositChildrenService'
  ]);

}());

(function() {
    "use strict";
    angular.module('depositChildrenCtrl', [])
        .controller('depositChildrenCtrl', function($scope,Constants,StateService,depositChildrenService,AuthService,MessageToaster) {
            'ngInject';
            var vm = this;
            vm.activated = false;
            $scope.$on('$ionicView.afterEnter', activate);

            function activate() {
                vm.activated = true;
                vm.version = Constants.buildID;
                vm.queryChildren();
            }

            vm.back=function(){
                StateService.back();
            };

            vm.goTo=function(item){
                //查看孩子的更多家长信息列表
                StateService.go('childrenDetail',{cid:item.ChildrenID});
            };

            vm.queryChildren = function(){
                depositChildrenService.queryDepositChildren(AuthService.getLoginID()).then(function(data) {
                    if (data.errno == 0) {
                        console.log(data.data);
                        vm.children = data.data;
                    }else{
                        MessageToaster.error("查不到任何数据 "+response.error);
                    }
                });
            };
        });
}());

(function() {
  'use strict';

  angular.module('depositChildrenRouter', [])
    .config(myRouter);


  function myRouter($stateProvider, $urlRouterProvider) {
    'ngInject';
    $stateProvider
      .state('tabs.depositChildren', {
        url: "/depositChildren",
        views: {
          'tab-depositChildren': {
            templateUrl: 'depositChildren/depositChildren.html',
            controller: 'teacherDepositChildrenCtrl',
            controllerAs: 'vm'
          }
        }
      })
      .state('depositChildren', {
        url: "/depositChildren",
        templateUrl: 'depositChildren/depositChildren.html',
        controller: 'depositChildrenCtrl',
        controllerAs: 'vm'
      })
      .state('childrenDetail', {
        url: "/childrenDetail?:cid",
        params: {
          cid : null
        },
        templateUrl: 'depositChildren/childrenDetail.html',
        controller: 'childrenDetailCtrl',
        controllerAs: 'vm'
      })
    ;
  }
}());

(function() {
  'use strict';

  angular.module('depositChildrenService', [])
    .factory('depositChildrenService', depositChildrenService);

  function depositChildrenService( $q, $http, Constants, ResultHandler) {
    'ngInject';
    var service = {
      queryDepositChildren:queryDepositChildren,
      queryChildren:queryChildren
    };

    //'/deposit/children/:depositid',
    function queryDepositChildren(id) {
      var url = Constants.serverUrl + 'deposit/children/'+id;
      return $http.get(url).then(ResultHandler.successedFuc, ResultHandler.failedFuc);
    };

    function queryChildren(id){
      var url = Constants.serverUrl + 'account/children/query/'+id;
      return $http.get(url).then(ResultHandler.successedFuc, ResultHandler.failedFuc);
    }

    return service;


  }

}());

(function() {
    "use strict";
    angular.module('teacherDepositChildrenCtrl', [])
        .controller('teacherDepositChildrenCtrl', function($scope,Constants,StateService,depositChildrenService,AuthService,MessageToaster,teacherService) {
            'ngInject';
            var vm = this;
            vm.activated = false;
            $scope.$on('$ionicView.afterEnter', activate);

            function activate() {
                vm.activated = true;
                vm.version = Constants.buildID;
                teacherService.queryTeacherDeposit(AuthService.getLoginID()).then(function(data) {
                    if (data.errno == 0) {
                        console.log(data.data);
                        if(data.data!=null&&data.data.length>0) {
                            vm.teacher = data.data[0];
                            vm.queryChildren(vm.teacher.depositid);
                        }
                    } else {
                        MessageToaster.error("查不到任何数据 " + data.error);
                    }
                });

            }

            vm.back=function(){
                StateService.back();
            };

            vm.goTo=function(id,item){
                //查看孩子的更多家长信息列表
                StateService.go('teacherEdit',{cid:id,type:0});
            };

            vm.queryChildren = function(id){
                depositChildrenService.queryDepositChildren(id).then(function(data) {
                    if (data.errno == 0) {
                        console.log(data.data);
                        vm.children = data.data;
                    }else{
                        MessageToaster.error("查不到任何数据 "+response.error);
                    }
                });
            };
        });
}());

(function() {
  "use strict";
  angular.module('exitModule', [
    'exitCtrl',
    'exitRouter',
    'exitService'
  ]);

}());

(function() {
    "use strict";
    angular.module('exitCtrl', [])
        .controller('exitCtrl', function($scope, $state, Constants, StateService,exitService,AuthService,MessageToaster,Session) {
            'ngInject';
            var vm = this;
            vm.activated = false;
            vm.text='确定要退出';//'正在退出...';
            $scope.$on('$ionicView.afterEnter', activate);

            function activate() {
                vm.activated = true;
                vm.version = Constants.buildID;
            }

            vm.exit=function(){
                vm.text='正在退出...';
                if(AuthService.getLoginID().substring(0,1)=='2'){
                  Session.destroy();
                  StateService.clearAllAndGo("login");
                }else{
                  exitService.exit(AuthService.getLoginID()).then(function(data) {
                      if (data.errno == 0) {
                          console.log(data.data);
                          vm.text='退出';
                          //需清楚缓存
                          Session.destroy();
                          //StateService.clearAllAndGo("register");
                          StateService.clearAllAndGo("login")
                          //StateService.clearAllAndGo(AuthService.getNextPath());
                      }else{
                          console.log(data.error);
                          vm.text='未能退出';
                          MessageToaster.error('退出失败');
                      }
                  },function(error){
                      console.log(error);
                      vm.text='退出失败';
                  });
               }
            };

            vm.back=function(){
                StateService.back();
            };
        });
}());

(function() {
  'use strict';

  angular.module('exitRouter', [])
    .config(myRouter);


  function myRouter($stateProvider, $urlRouterProvider) {
    'ngInject';
    $stateProvider
        .state('exit', {
          url: "/exit",
          templateUrl: 'exit/exit.html',
          controller: 'exitCtrl',
          controllerAs: 'vm'
        })
  }
}());

(function() {
  'use strict';

  angular.module('exitService', [])
    .factory('exitService', eService);

  function eService( $q, $http,Constants,ResultHandler) {
    'ngInject';
    var service = {
      exit:exit
    };

    function exit(id) {
        var url;
        if(id.substring(0,1)=='3'){
          url = Constants.serverUrl + 'exitTeacher/'+id;
        }else if(id.substring(0,1)=='1'){
          url = Constants.serverUrl + 'exitDeposit/'+id;
        }else{
          return $q.reject('不支持此业务');
        }
        return $http.get(url).then(ResultHandler.successedFuc, ResultHandler.failedFuc);
    };

    return service;


  }

}());

(function() {
  "use strict";
  angular.module('helpModule', [
    'helpCtrl',
    'helpDocCtrl',
    'helpRouter'
  ]);

}());

(function() {
    "use strict";
    angular.module('helpCtrl', [])
        .controller('helpCtrl', function($scope, Constants, StateService) {
            'ngInject';
            var vm = this;
            vm.activated = false;
            $scope.$on('$ionicView.afterEnter', activate);

            function activate() {
                vm.activated = true;
                vm.version = Constants.buildID;
            }

            vm.goTo = function(addr){
                console.log('go to path : '+addr);
                StateService.go(addr);
            };

            vm.back=function(){
                StateService.back();
            };
        });
}());

(function() {
    "use strict";
    angular.module('helpDocCtrl', [])
        .controller('helpDocCtrl', function($scope, Constants, StateService) {
            'ngInject';
            var vm = this;
            vm.activated = false;
            $scope.$on('$ionicView.afterEnter', activate);

            function activate() {
                vm.activated = true;
                vm.version = Constants.buildID;
            }

            vm.goTo = function(addr){
                console.log('go to path : '+addr);
                StateService.go(addr);
            };

            vm.back=function(){
                StateService.back();
            };
        });
}());

(function() {
  'use strict';

  angular.module('helpRouter', [])
    .config(myRouter);


  function myRouter($stateProvider, $urlRouterProvider) {
    'ngInject';
    $stateProvider
        .state('help', {
          url: "/help",
          templateUrl: 'help/help.html',
          controller: 'helpCtrl',
          controllerAs: 'vm'
        })
        .state('helpDoc', {
          url: "/helpDoc",
          templateUrl: 'help/helpDoc.html',
          controller: 'helpDocCtrl',
          controllerAs: 'vm'
        })
  }
}());

(function() {
    "use strict";
    angular.module('LoginModule', [
        'LoginCtrl',
        'LoginRouter',
        'LoginService'
    ])
}());

(function() {
    "use strict";
    angular.module('LoginCtrl', [])
        .controller('LoginCtrl', function(Constants, AuthService, MessageToaster, LoginService, $timeout, $scope, Session, $stateParams, StateService, $ionicModal, Role,$http) {
            'ngInject';

            var vm = this;
            vm.isDev = Constants.ENVIRONMENT == 'dev' ? true : false;
            vm.type = '3';
            $scope.$on('$ionicView.beforeEnter', validate);
            //vm.user={userId:18603070911,password:"82267049",roleType:"3"}
            //vm.user={userId:10000001, password:"111111111", roleType:"1"}
            function validate() {
                if (Session.getData('userId') && Session.getData('token') && Session.getData('userId')!='-1' &&  !Session.checkTimeout()) {
                    //AuthService.setSession(response.data.uid, response.data.token, response.data.eshop, response.data.type);
                    $http.defaults.headers.common.token = Session.getData('token');
                    StateService.clearAllAndGo(AuthService.getNextPath());
                }else{
                    console.log("normal login");
                }
            }

            //WeuiModalLoading
            vm.login=function(user){
                //test
                //AuthService.setSession('1', '123', '1');
                //StateService.go(AuthService.getNextPath());
                //test
                if(user){
                  LoginService.login(user.userId, user.password,user.roleType).then(function(response) {
                      console.log(response);
                      if(response.errno==0){
                        //MessageToaster.success(response.message);
                        AuthService.setSession(response.data.uid, response.data.token, response.data.eshop, response.data.type);
                        StateService.clearAllAndGo(AuthService.getNextPath());
                      }else{
                        //MessageToaster.error(response.error);
                        MessageToaster.error("账号或密码错误");
                      }
                  },
                  function(error) {
                    //MessageToaster.error(error);
                    MessageToaster.error("用户不存在或其他问题");
                  }).finally(function() {
                      //WeuiModalLoading.hide();
                  });
                }else{
                    MessageToaster.error("请输入正确账号密码");
                }
            }

            vm.visit = function() {
              AuthService.setSession( '-1', '-1', '-1', '-1' );
              StateService.clearAllAndGo(AuthService.getNextPath());
            }

            vm.register=function(){
              StateService.clearAllAndGo("register",{type:vm.type});
            }


        });
}());

(function() {
  'use strict';

  angular.module('LoginRouter', [])
    .config(LoginRouter);


  function LoginRouter($stateProvider,$urlRouterProvider) {
    'ngInject';
    $stateProvider
    .state('login', {
      url: "/login",
      templateUrl: 'Login/login.html',
      controller: 'LoginCtrl',
      controllerAs: 'vm'
    });
  }
}());

(function() {
    'use strict';

    angular.module('LoginService', [])
        .factory('LoginService', LoginService);

    function LoginService($q, $http, ResultHandler, Constants) {
        'ngInject';
        var service = {
            login: login,
            logout: logout
        };

        function logout() {

        }

        function login(userId, password, type) {
          if(!type)type=3;
            var data = {
                username: userId,
                password: password,
                type: type
            };
            var url = Constants.serverUrl + 'teacherLogin';
            console.log(url);
            return $http({
                method: 'post',
                url: url,
                data: data
            }).then(ResultHandler.successedFuc, ResultHandler.failedFuc);
        }

        return service;


    }

}());

(function() {
  "use strict";
  angular.module('messageModule', [
    'messageCtrl',
    'newMessageCtrl',
    'messageRouter',
    'messageService'
  ]);

}());

(function() {
    "use strict";
    angular.module('messageCtrl', [])
        .controller('messageCtrl', function($scope, Constants, messageService,childrenSteamService, teacherService,AuthService, StateService,Session,$ionicModal, $ionicSlideBoxDelegate) {
            'ngInject';
            var vm = this;
            vm.activated = false;

            vm.offset=0;
            vm.limit=30;
            vm.canLoadMore=true;
            $scope.$on('$ionicView.afterEnter', activate);

            function activate() {
                vm.activated = true;
                vm.version = Constants.buildID;
                vm.messages=[];
                vm.getDepositInfo();
            }

            vm.getDepositInfo = function() {
                teacherService.queryTeacherDeposit(AuthService.getLoginID()).then(function(data) {
                  console.log(data);
                  if (data.errno == 0) {
                      vm.deposit=data.data[0];
                      Session.setData('latitude',vm.deposit.latitude);
                      Session.setData('longitude',vm.deposit.longitude);
                      vm.getMsg(vm.deposit.depositid,0,vm.limit);
                  };
                });
            };

            vm.getMsg = function(depositid,offset,limit){
                messageService.getMsg(depositid,offset,limit).then(function(data) {
                  console.log(data);
                  //vm.msg=data.data;
                  if (data.errno == 0) {
                      console.log(data.data);
                      var start=0;
                      if(vm.messages.length == 0)
                          vm.messages=data.data;
                      else{
                          start=vm.messages.length;
                          vm.messages=vm.messages.concat(data.data);
                        }
                      console.log(vm.messages);
                      //update comment
                      for(var i=0;i<data.data.length;i++){
                        //vm.messages[start+i]
                        childrenSteamService.getDailyComment(vm.messages[start+i].InfoID,start+i).then(function(sdata) {
                            if (data.errno == 0) {
                                console.log("getDailyComment: ");
                                console.log(sdata.data);
                                var index=sdata.data.index;
                                vm.messages[index].comments = sdata.data.comments;
                                vm.messages[index].likes = sdata.data.likes;
                            }
                        });
                      }
                      vm.offset+=data.data.length;
                      if(data.data.length < vm.limit){
                          console.log("it is the last data");
                          vm.canLoadMore = false;
                      }else{
                          vm.canLoadMore= true;
                      }
                      $scope.$broadcast('scroll.refreshComplete');
                      $scope.$broadcast('scroll.infiniteScrollComplete');
                    }else{
                      console.log(data);
                    }
                });
            };

            vm.doRefresh = function(offset){
                vm.getMsg(vm.deposit.depositid,offset,vm.limit);
            };


            vm.goPhoto=function(msgIndex,index){
                Session.setData('temp',vm.msg[msgIndex]);
                StateService.go("photo",{index:index});
            };

            vm.new=function(id){
                //创建信息
                StateService.go('newMessage');
            };

            vm.getImg = function(type){
                if(type == 1){
                    return {name:"就餐",src:"img/dinner.png"};
                }else if(type == 2){
                    return {name:"培训",src:"img/traning.png"};
                }else if(type == 3){
                    return {name:"活动",src:"img/play.png"};
                }else if(type == 4){
                    return {name:"作业",src:"img/homework.png"};
                }else if(type == 5){
                    return {name:"接入",src:"img/login.png"};
                }else if(type == 6){
                    return {name:"送到",src:"img/logout.png"};
                }else{
                    return {name:"未知信息类型",src:"img/unknown.png"};
                }
            };

            vm.getImages=function(msg){
                vm.imgCount=0;
                if(msg.PhotoLink1!=null && msg.PhotoLink1!=""){
                    var data={src:msg.PhotoLink1,msg:''};
                    vm.images[vm.imgCount]=data;
                    vm.imgCount++;
                }
                if(msg.PhotoLink2!=null && msg.PhotoLink2!=""){
                    var data={src:msg.PhotoLink2,msg:''};
                    vm.images[vm.imgCount]=data;
                    vm.imgCount++;
                }
                if(msg.PhotoLink3!=null && msg.PhotoLink3!=""){
                    var data={src:msg.PhotoLink3,msg:''};
                    vm.images[vm.imgCount]=data;
                    vm.imgCount++;
                }
                if(msg.PhotoLink4!=null && msg.PhotoLink4!=""){
                    var data={src:msg.PhotoLink4,msg:''};
                    vm.images[vm.imgCount]=data;
                    vm.imgCount++;
                }
                if(msg.PhotoLink5!=null && msg.PhotoLink5!=""){
                    var data={src:msg.PhotoLink5,msg:''};
                    vm.images[vm.imgCount]=data;
                    vm.imgCount++;
                }
                if(msg.PhotoLink6!=null && msg.PhotoLink6!=""){
                    var data={src:msg.PhotoLink6,msg:''};
                    vm.images[vm.imgCount]=data;
                    vm.imgCount++;
                }
                console.log(vm.images);
            };

            $ionicModal.fromTemplateUrl('message/image-modal.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function(modal) {
                $scope.modal = modal;
            });

            $scope.openModal = function() {
                $ionicSlideBoxDelegate.slide(0);
                $scope.modal.show();
            };

            $scope.closeModal = function() {
                $scope.modal.hide();
            };

            // Cleanup the modal when we're done with it!
            $scope.$on('$destroy', function() {
                $scope.modal.remove();
            });
            // Execute action on hide modal
            $scope.$on('modal.hide', function() {
                // Execute action
            });
            // Execute action on remove modal
            $scope.$on('modal.removed', function() {
                // Execute action
            });
            $scope.$on('modal.shown', function() {
                console.log('Modal is shown!');
            });

            // Call this functions if you need to manually control the slides
            $scope.next = function() {
                $ionicSlideBoxDelegate.next();
            };

            $scope.previous = function() {
                $ionicSlideBoxDelegate.previous();
            };

            $scope.goToSlide = function(index,msg) {
                vm.images=[];
                vm.getImages(msg);
                $scope.modal.show();
                $ionicSlideBoxDelegate.slide(index);
            };

            // Called each time the slide changes
            $scope.slideChanged = function(index) {
                $scope.slideIndex = index;
            };

        });
}());

(function() {
  'use strict';

  angular.module('messageRouter', [])
    .config(myRouter);

  function myRouter($stateProvider, $urlRouterProvider) {
    'ngInject';
    $stateProvider
      .state('tabs.message', {
        url: "/message",
          views: {
            'tab-message': {
              templateUrl: 'message/message.html',
              controller: 'messageCtrl',
              controllerAs: 'vm'
            }
          }
      })
      .state('newMessage', {
          url: "/newMessage",
          templateUrl: 'message/newMessage.html',
          controller: 'newMessageCtrl',
          controllerAs: 'vm'
      });
  }
}());

(function() {
  'use strict';

  angular.module('messageService', [])
    .factory('messageService', messageService);

  function messageService($http,Constants,ResultHandler) {
    'ngInject';
    var service = {
      getMsg:getMsg,
      newMsg:newMsg,
      postPhoto:postPhoto
    };

    function getMsg(depositid,offset,limit) {
      var url = Constants.serverUrl + 'deposit/allInformation/'+depositid+'?offset='+offset+'&limitcount='+limit;
      return $http.get(url).then(ResultHandler.successedFuc, ResultHandler.failedFuc);
    };

    function newMsg(data) {
      var url = Constants.serverUrl + 'deposit/publish';
      return $http({
        method: 'post',
        url: url,
        data: data
      }).then(ResultHandler.successedFuc, ResultHandler.failedFuc);
    };

    //function postPhoto(data){
    //  var url = Constants.serverUrl + 'upload?filename=photo'+new Date().getTime()+'.jpg';
    //  return $http({
    //    method: 'put',
    //    url: url,
    //    data: data
    //  }).then(ResultHandler.successedFuc, ResultHandler.failedFuc);
    //};
    //"Content-Type": "multipart/form-data"
   // Content-Type	multipart/form-data; boundary=----WebKitFormBoundaryVCKz6Byvi4TF2rpa
    function postPhoto(data){
      var fd = new FormData();
      fd.append('file', data);
      var url = Constants.dfsUrl + 'upload';
      console.log(fd);
      return $http({
        method: 'post',
        url: url,
        data: fd,
        headers:{
          'Content-Type':undefined
        },
        transformRequest: angular.identity
      }).then(ResultHandler.successedFuc, ResultHandler.failedFuc);
    };

    function putPhoto(url,name){
      var mydata = {
        "fileurl":url,
        "filename":name
      };
      var url = Constants.dfsUrl + 'upload';
      return $http({
        method: 'put',
        url: url,
        data: mydata
      }).then(ResultHandler.successedFuc, ResultHandler.failedFuc);
    };

    return service;


  }

}());

(function() {
    "use strict";
    angular.module('newMessageCtrl', [])
        .controller('newMessageCtrl', function($scope, Constants, messageService, AuthService, StateService, teacherService, MessageToaster, Session, $cordovaCamera, $cordovaImagePicker,$ionicActionSheet,$cordovaFileTransfer) {
            'ngInject';
            var vm = this;
            vm.activated = false;
            $scope.$on('$ionicView.afterEnter', activate);
            vm.id=AuthService.getLoginID();
            vm.dailyType='3';
            vm.desc="";
            vm.imgPosition=0;
            vm.imgCal=0;
            vm.imgs=[];
            vm.imgshow=[];

            vm.isClicked=false;
            vm.btnText='提交';

            function activate() {
                vm.activated = true;
                vm.version = Constants.buildID;
                vm.lat=Session.getData('latitude');
                vm.long=Session.getData('longitude');
                teacherService.queryTeacherDeposit(vm.id).then(function(data) {
                    console.log(data);
                    if(data!=null && data.data !=null && data.data.length>0)vm.deposit=data.data[0];
                    else MessageToaster.error('找不到老师的机构信息');
                });
            }

            vm.save=function(which){
                if (vm.imgs.length > 0) {
                    vm.isClicked = true;
                    vm.btnText='正在提交';
                    MessageToaster.info('上传信息中，请稍等...');
                    var data = vm.imgs[which];
                    if (data != null)messageService.postPhoto(data).then(function (e) {
                        console.log(e);
                        console.log(e.data.fileurl);
                        vm.imgs[vm.imgCal] = e.data.fileurl;
                        vm.imgCal++;
                        if (vm.imgCal == vm.imgs.length) {
                            console.log(vm.imgs);
                            vm.saveData();
                        } else {
                            vm.save(vm.imgCal);
                        }
                    });
                } else {
                    vm.saveData();
                }
            };

            //infotype:信息类型（1：就餐；2：培训；3：活动；4：作业）
            vm.saveData=function(){
                var json={
                    "depositid": Number(vm.deposit.depositid),
                    "publisherid": Number(vm.id),
                    "infotype": Number(vm.dailyType),
                    "latitude": vm.lat,
                    "longitude": vm.long,
                    "description": vm.desc,
                    "imgs": vm.imgs
                };
                //alert(JSON.stringify(json));
                messageService.newMsg(json).then(function(data) {
                    //alert(JSON.stringify(data));
                    vm.isClicked=false;
                    vm.btnText='提交';
                    if(data.errno==0){
                        Session.setData('refresh',1);
                        StateService.back();
                    }else{
                        MessageToaster.error(data.error);
                    }
                });
            };

            vm.back=function(){
                StateService.back();
            };

            $scope.fileSelect=function(event){
                console.log(event);
                var files = event.target.files;
                $scope.fileName=files[0].name;
                var fileReader = new FileReader();
                console.log(files);
                vm.imgs[vm.imgPosition] = files[0];
                console.log(files[0]);
                //vm.imgPosition++;
                $scope.$apply();
                fileReader.readAsDataURL(files[0]);
                fileReader.onload = function(e) {
                    console.log(e);
                    vm.imgshow[vm.imgPosition] = this.result;
                    console.log(this.result);
                    vm.imgPosition++;
                    $scope.$apply();
                };
            }

            vm.selectImageChooseMethod = function(prop){
              var hideSheet = $ionicActionSheet.show({
                  buttons: [{
                    text: '拍照上传'
                  }, {
                    text: '从相册中选择'
                  }],
                  cancelText: '取 消',
                  cancel: function() {
                    // add cancel code..
                  },
                  buttonClicked: function(index) {
                    // 相册文件选择上传
                    if (index == 1) {
                      vm.readalbum(prop);
                    } else if (index == 0) {
                      // 拍照上传
                      vm.taskPicture(prop);
                    }
                    return true;
                  }
                });
            };

            // 读用户相册
          	vm.readalbum = function(prop) {
          		if (!window.imagePicker) {
          			alert('目前您的环境不支持相册上传。')
          			return;
          		}

          		var options = {
          			maximumImagesCount: 1,
          			width: 800,
          			height: 800,
          			quality: 80
          		};

          		$cordovaImagePicker.getPictures(options).then(function(results) {
                for(var i=0;i<results.length;i++){
              			var uri = results[i];
              			var	name = uri;
              			if (name.indexOf('/')) {
              				var num = name.lastIndexOf('/');
              				name = name.substring(num + 1);
              			}
                    vm.imgshow[vm.imgshow.length]=uri;
              			//$scope.uploadimage(uri, prop);
                }
          		}, function(error) {
          			alert(error);
          		});
          	};

          	// 拍照
          	vm.taskPicture = function(prop) {
          		if (!navigator.camera) {
          			alert('请在真机环境中使用拍照上传。');
          			return;
          		}

          		var options = {
          			quality: 75,
          			targetWidth: 800,
          			targetHeight: 800,
          			saveToPhotoAlbum: false
          		};
          		$cordovaCamera.getPicture(options).then(function(imageURI) {
          			//$scope.uploadimage(imageURI);
          			var name = imageURI;
          			if (name.indexOf('/')) {
          				var i = name.lastIndexOf('/');
          				name = name.substring(i + 1);
          			}
                //alert(imageURI);
          		  //$scope.uploadimage(imageURI, prop);
                vm.imgshow[vm.imgshow.length]=imageURI;
          		}, function(err) {
          			alert("照相机：" + err);
          		});

          	}

          	// 上传到又拍云
          	vm.uploadimage = function(uri) {
              var options ={};
          		$cordovaFileTransfer.upload("http://wx.zxing-tech.cn/upload", uri, options,true).then(function(data) {
          			// 设置图片新地址
          			//alert(data.response);
          			var resp = JSON.parse(data.response);
          			var link = resp.data.fileurl;
          			$scope.image = link;
                vm.imgs[vm.imgCal] = link;
                vm.imgCal++;
                if (vm.imgCal == vm.imgshow.length) {
                    console.log(vm.imgshow);
                    //alert('start saveData');
                    vm.saveData();
                } else {
                    vm.save2(vm.imgCal);
                }
          		}, function(error) {
          			alert(JSON.stringify(error));
                MessageToaster.info('上传照片失败');
          		}, function (progress) {
                  // constant progress updates
              });
          	}

            vm.save2=function(which){
                if (vm.imgshow.length > 0) {
                    vm.isClicked = true;
                    vm.btnText='正在提交';
                    MessageToaster.info('上传信息中，请稍等...');
                    var data = vm.imgshow[which];
                    if (data != null)vm.uploadimage(data);
                } else {
                    vm.saveData();
                }
            };

        });
}());

(function() {
  "use strict";
  angular.module('organizerModule', [
    'organizerCtrl',
    'organizerInfoCtrl',
    'organizerEditCtrl',
    'organizerRouter',
    'organizerService'
  ]);

}());

(function() {
    "use strict";
    angular.module('organizerCtrl', [])
        .controller('organizerCtrl', function($scope, Constants, StateService,organizerService,AuthService) {
            'ngInject';
            var vm = this;
            vm.activated = false;
            $scope.$on('$ionicView.afterEnter', activate);

            function activate() {
                vm.activated = true;
                vm.version = Constants.buildID;
            }

            vm.goTo = function(addr){
                StateService.go(addr);
            };

            vm.getOrganizer = function(){
                organizerService.queryOrganizer(AuthService.getLoginID()).then(function(data) {
                    if (data.errno == 0) {
                        vm.organizer = data.data;
                    }
                });
            };

            vm.getChildren = function(){
                organizerService.queryTeacher(AuthService.getLoginID()).then(function(data) {
                    if (data.errno == 0) {
                        vm.teacher = data.data;
                    }
                });
            };
        });
}());

(function() {
    "use strict";
    angular.module('organizerEditCtrl', [])
        .controller('organizerEditCtrl', function($scope, $stateParams, Constants, MessageToaster, AuthService, StateService, organizerService) {
            'ngInject';
            var vm = this;
            vm.activated = false;

            $scope.$on('$ionicView.afterEnter', activate);

            function activate() {
                vm.activated = true;
                vm.version = Constants.buildID;

                vm.getOrganizer();
            }

            vm.back=function(){
                StateService.back();
            };

            vm.save=function(){
                var data={
                    contactphone: vm.organizer.ContactPhone,
                    address:vm.organizer.Address,
                    contactname:vm.organizer.ContactName,
                    remark:"备注描述"
                };
                if(angular.isUndefined(vm.organizer.Address)||vm.organizer.Address==null||vm.organizer.Address.length==0){
                    MessageToaster.error("机构地址不正确");
                    return ;
                }
                if(angular.isUndefined(vm.organizer.ContactName)||vm.organizer.ContactName==null||vm.organizer.ContactName.length==0){
                    MessageToaster.error("联系人不正确");
                    return ;
                }
                if(angular.isUndefined(vm.organizer.ContactPhone)||vm.organizer.ContactPhone==null||vm.organizer.ContactPhone.length==0
                    ||vm.organizer.ContactPhone.length!=11){
                    MessageToaster.error("联系人电话不正确");
                    return ;
                }
                organizerService.updateOrganizer(AuthService.getLoginID(),data).then(function(response) {
                    console.log(response);
                    if(response.errno==0)
                        MessageToaster.success("更新成功");
                    else
                        MessageToaster.error("更新失败");
                    return ;
                }).finally(function() {
                    StateService.back();
                });

            };

            vm.getOrganizer = function(){
                organizerService.queryOrganizer(AuthService.getLoginID()).then(function(data) {
                    if (data.errno == 0) {
                        console.log(data.data);
                        vm.organizer = data.data;
                    }
                });
            };


        });
}());

(function() {
    "use strict";
    angular.module('organizerInfoCtrl', [])
        .controller('organizerInfoCtrl', function($scope,Constants,StateService,organizerService,AuthService) {
            'ngInject';
            var vm = this;
            vm.activated = false;
            $scope.$on('$ionicView.afterEnter', activate);

            function activate() {
                vm.activated = true;
                vm.version = Constants.buildID;
                //vm.organizer = {name:'abc 托管',contactName:"sam",contactPhone:"15986632761"};
                vm.getOrganizer();
            }

            vm.back=function(){
                StateService.back();
            };

            vm.edit=function(id){
                //编辑机构信息
                StateService.go('organizerEdit');
            };

            vm.getOrganizer = function(){
                organizerService.queryOrganizer(AuthService.getLoginID()).then(function(data) {
                    if (data.errno == 0) {
                        console.log(data.data);
                        vm.organizer = data.data;
                    }
                });
            };
        });
}());

(function() {
  'use strict';

  angular.module('organizerRouter', [])
    .config(myRouter);


  function myRouter($stateProvider, $urlRouterProvider) {
    'ngInject';
    $stateProvider
      .state('tabs.organizer', {
        url: "/organizer",
          views: {
            'tab-orgnize': {
              templateUrl: 'organizer/organizer.html',
              controller: 'organizerCtrl',
              controllerAs: 'vm'
            }
          }
      })
      .state('organizerInfo', {
        url: "/organizerInfo",
        templateUrl: 'organizer/organizerInfo.html',
        controller: 'organizerInfoCtrl',
        controllerAs: 'vm'
      })
      .state('organizerEdit', {
        url: "/organizerEdit",
        templateUrl: 'organizer/organizerEdit.html',
        controller: 'organizerEditCtrl',
        controllerAs: 'vm'
      })
    ;
  }
}());

(function() {
  'use strict';

  angular.module('organizerService', [])
    .factory('organizerService', organizerService);

  function organizerService($q, $http,Constants,ResultHandler) {
      'ngInject';
      var service = {
        queryOrganizer:queryOrganizer,
        queryDepositInfo:queryDepositInfo,
        updateOrganizer:updateOrganizer
      };


      //GET /api/v1/account/query/deposit/{deposit_accnt_id}
      //return
      //{
      //  "errno":0,
      //  "error":"",
      //  "data":{
      //    "uid":10000001,
      //     …………
      //  }
      //}
      function queryOrganizer(id) {
        var url = Constants.serverUrl + 'account/query/deposit/'+id;
        return $http.get(url).then(ResultHandler.successedFuc, ResultHandler.failedFuc);
      };


      //post /api/v1/account/deposit/{deposit_accnt_id}/update
      //  {
      //    "orgname": "机构名称",
      //    "contactphone": "13812345678",
      //    "password":"abcd",
      //    "weixinno":"微信号",
      //    "address":"托管机构地址",
      //    "contactname":"托管机构联系人（管理者）",
      //    "remark":"托管机构信息描述"
      //  };
      //return
      //{
      //  "errno":0,
      //    "error":"",
      //    "data":{
      //      "uid":11000001
      //    }
      //}
      function updateOrganizer(id,data) {
          var url = Constants.serverUrl + 'account/deposit/'+id+'/update';
          return $http({
            method: 'post',
            url: url,
            data: data
          }).then(function (response) {
            return response.data;
          }, function (error) {
            return $q.reject(error);
          });
      };

      function queryDepositInfo(id) {
          //http://172.18.1.166/api/v1/depositInfo/fetch/:depositid
          var url = Constants.serverUrl + 'depositInfo/fetch/'+id;
          return $http.get(url).then(ResultHandler.successedFuc, ResultHandler.failedFuc);
      };

      return service;


  }

}());

(function() {
  "use strict";
  angular.module('profileModule', [
    'profileCtrl',
    'profileRouter',
    'profileService'
  ]);

}());

(function() {
    "use strict";
    angular.module('profileCtrl', [])
        .controller('profileCtrl', function($scope, $state, Constants, StateService, parentService, AuthService) {
            'ngInject';
            var vm = this;
            vm.activated = false;
            $scope.$on('$ionicView.afterEnter', activate);

            function activate() {
                vm.activated = true;
                vm.version = Constants.buildID;
                vm.getParent();
                vm.getChildren();
            };

            vm.getParent = function(){
              parentService.queryParent(AuthService.getLoginID()).then(function(data) {
                  if (data.errno == 0) {
                      console.log(data.data);
                      vm.parent = data.data;
                  }
              });
            };

            vm.getChildren = function(){
                parentService.queryChildren(AuthService.getLoginID()).then(function(data) {
                    if (data.errno == 0) {
                        console.log(data.data);
                        vm.children = data.data;
                        var children="";
                        for(var i=0;i<vm.children.length;i++){
                          if(children=="")
                            children+=vm.children[i].name
                          else {
                            children+=","+vm.children[i].name
                          }
                        }
                        vm.childrenName=children;
                    }
                });
            };

            vm.goTo = function(addr,params){
                console.log('go to path : '+addr);
                if(params)console.log(params);
                StateService.go(addr,params);
            };

        });
}());

(function() {
  'use strict';

  angular.module('profileRouter', [])
    .config(myRouter);


  function myRouter($stateProvider, $urlRouterProvider) {
    'ngInject';
    $stateProvider
      .state('tabs.profile', {
        url: "/profile",
          views: {
            'tab-profile': {
              templateUrl: 'profile/profile.html',
              controller: 'profileCtrl',
              controllerAs: 'vm'
            }
          }
      });
  }
}());

(function() {
  'use strict';

  angular.module('profileService', [])
    .factory('profileService', profileService);

  function profileService( $q, $http) {
    'ngInject';
    var service = {
    };
    return service;


  }

}());

(function() {
  "use strict";
  angular.module('photoModule', [
    'photoCtrl',
    'photoRouter'
  ]);

}());

(function() {
    "use strict";
    angular.module('photoCtrl', [])
        .controller('photoCtrl', function($scope, Constants,$stateParams,Session,StateService,$ionicSlideBoxDelegate,$timeout) {
            'ngInject';
            var vm = this;
            vm.activated = false;
            $scope.$on('$ionicView.afterEnter', activate);

            function activate() {
                vm.activated = true;
                vm.version = Constants.buildID;
                vm.msg=Session.getData('temp');
                vm.images=[];
                vm.imgCount=0;
                if(vm.msg.photolink1!=null && vm.msg.photolink1!=""){
                    vm.images[vm.imgCount]=vm.msg.photolink1;
                    vm.imgCount++;
                }
                if(vm.msg.photolink2!=null && vm.msg.photolink2!=""){
                    vm.images[vm.imgCount]=vm.msg.photolink2;
                    vm.imgCount++;
                }
                if(vm.msg.photolink3!=null && vm.msg.photolink3!=""){
                    vm.images[vm.imgCount]=vm.msg.photolink3;
                    vm.imgCount++;
                }
                if(vm.msg.photolink4!=null && vm.msg.photolink4!=""){
                    vm.images[vm.imgCount]=vm.msg.photolink4;
                    vm.imgCount++;
                }
                if(vm.msg.photolink5!=null && vm.msg.photolink5!=""){
                    vm.images[vm.imgCount]=vm.msg.photolink5;
                    vm.imgCount++;
                }
                if(vm.msg.photolink6!=null && vm.msg.photolink6!=""){
                    vm.images[vm.imgCount]=vm.msg.photolink6;
                    vm.imgCount++;
                }
                console.log(vm.images);
                vm.index=$stateParams.index;
                console.log(vm.index);
                //vm.image=vm.images[vm.index];
                $timeout(function(){
                    $scope.slider.slideTo(vm.index);
                    $scope.slider.updateLoop();
                    //$ionicSlideBoxDelegate.enableSlide(true);
                    //$ionicSlideBoxDelegate.slide(vm.index);
                    //console.log($ionicSlideBoxDelegate.currentIndex()+" - "+$ionicSlideBoxDelegate.slidesCount());
                }, 300);

            }
            vm.back=function(){
                StateService.back();
            };

            $scope.options = {
                loop: false
            }

            $scope.$on("$ionicSlides.sliderInitialized", function(event, data){
                // data.slider is the instance of Swiper
                console.log(data);
                $scope.slider = data.slider;
            });

            $scope.$on("$ionicSlides.slideChangeStart", function(event, data){
                console.log('Slide change is beginning');
                //console.log(event);
                //console.log(data);
            });

            $scope.$on("$ionicSlides.slideChangeEnd", function(event, data){
                // note: the indexes are 0-based
                //console.log(event);
                console.log($scope.slider.activeIndex+" - "+$scope.slider.previousIndex);
                //$scope.activeIndex = data.activeIndex;
                //$scope.previousIndex = data.previousIndex;
                //console.log('Slide from '+data.previousIndex +' to '+data.activeIndex);
            });
        });
}());

(function() {
  'use strict';

  angular.module('photoRouter', [])
    .config(myRouter);


  function myRouter($stateProvider, $urlRouterProvider) {
    'ngInject';
    $stateProvider
        .state('photo', {
          url: "/photo?:index",
          params:{
            index:0
          },
          templateUrl: 'photo/photo.html',
          controller: 'photoCtrl',
          controllerAs: 'vm'
        })
      ;
  }
}());

(function() {
  "use strict";
  angular.module('registerModule', [
    'registerCtrl',
    'registerRouter',
    'registerService'
  ]);

}());

(function() {
    "use strict";
    angular.module('registerCtrl', [])
        .controller('registerCtrl', function($scope, Constants,StateService,Session,AuthService,registerService,LoginService,$stateParams) {
            'ngInject';
            var vm = this;
            vm.activated = false;
            vm.count=0;
            vm.isLock=false;
            vm.org={mobile:'', password:''};
            //微信uid的初始化
            vm.user={ gendar:'1', name:'', mobile:'', password:'', pswConfirm:'', wechat:AuthService.getWechatId()};
            vm.error=null;
            vm.isParent=false;
            $scope.$on('$ionicView.afterEnter', activate);

            function activate() {
                vm.activated = true;
                vm.version = Constants.buildID;
                vm.type = $stateParams.type;
                console.log("user type = "+vm.type);
                if(vm.type==2) {
                    vm.roleType = '2';
                    vm.isParent = true;
                }else{
                    vm.roleType = '3';
                    vm.isParent = false;
                }
            };

            $scope.$watch('vm.user.name', function(newValue, oldValue) {
                if(vm.user.name!=undefined) {
                    if (vm.user.name.length < 1) {
                        vm.error = '姓名不能为空';
                    } else {
                        vm.error = null;
                    }
                }else{
                    vm.error = '姓名必须填写';
                }
            });
            $scope.$watch('vm.user.mobile', function(newValue, oldValue) {
                if(vm.user.mobile!=undefined) {
                    if (vm.user.mobile.length != 11) {
                        vm.error = '手机长度必须为11位';
                    } else {
                        vm.error = null;
                    }
                }else{
                    vm.error = '手机号码必须填写';
                }
            });
            $scope.$watch('vm.user.password', function(newValue, oldValue) {
                if(vm.user.password!=undefined) {
                    if (vm.user.password.length < 6) {
                        vm.error = '密码长度必须不小于6位';
                    } else {
                        vm.error = null;
                    }
                }else{
                    vm.error = '密码必须填写';
                }
            });
            $scope.$watch('vm.user.pswConfirm', function(newValue, oldValue) {
                if(vm.user.pswConfirm!=undefined) {
                    if (vm.user.password != '' && vm.user.password.length >= 6  && vm.user.pswConfirm != vm.user.password) {
                        vm.error = '密码不一致';
                    } else {
                        vm.error = null;
                    }
                }else{
                    vm.error = '';
                }
            });

            vm.check = function(){
                if(vm.error!=null){
                    vm.error = '数据未完善哦!';
                    return false;
                }
                else {
                    if(vm.user.password.length >= 6 && vm.user.pswConfirm.length >= 6
                        && vm.user.name.length > 0 && vm.user.mobile.length == 11
                        && vm.user.password == vm.user.pswConfirm) return true;
                    else vm.error = '数据未填完哦!';
                }
            };

            vm.simpleCheck = function(){
                if(vm.org.password.length >= 6 && (vm.org.account.length == 11 || vm.org.account.length == 8 )){
                    vm.error = "";
                    return true;
                } else vm.error = '数据未填完哦!';
            };

            function wxlogin(userid,type) {
                console.log(userid+"..."+type);
                LoginService.wxLogin(userid,type).then(function (response) {
                    console.log(response);
                    if (response.errno == 0) {
                        var result = response.data;
                        //if(typeof(result.uid) == "undefined" ){
                        if (result instanceof Array && result.length > 1) {
                            //modal select type
                            vm.roleList = result;
                            //alert(JSON.stringify(result));
                            //MessageToaster.info("undefine have select  " + result.length);
                            //vm.showChooseModal();

                        } else {
                            console.log(result[0]);
                            if (result[0].uid != null && result[0].token != null && result[0].type != null) {
                                console.log("goto next");
                                AuthService.setSession(result[0].uid, result[0].token, result[0].eshop, result[0].type, userid);
                                StateService.clearAllAndGo(AuthService.getNextPath());
                            }
                        }
                        console.log(result);

                    } else {
                        if (response.errno == 12004) {
                            //no data found
                            console.log("找不到任何信息");
                        }
                        //MessageToaster.error(response.error);
                    }
                });
            };

            vm.bind = function(){
                //检测输入数值是否正确
                if(!vm.simpleCheck())return;
                //再绑定
                vm.count++;
                if(vm.count>3){
                    vm.isLock=true;
                    vm.error="尝试过多,请稍后再试!";
                    return;
                }
                var wechatId=vm.user.wechat;
                //alert(AuthService.getLoginID());
                if(vm.roleType=='3'){
                    registerService.bindTeacher(vm.org,wechatId).then(function(data) {
                        if (data.errno == 0) {
                            var userId = data.data.uid;
                            console.log("bind teacher uid = "+userId);
                            //if(userId!=null){
                            //    wxlogin(userId,vm.roleType);
                            //}
                            wxlogin(wechatId,vm.roleType);
                        }else{
                            console.log("bindTeacher get error");
                        }
                    });
                }else if(vm.roleType=='1'){
                    registerService.bindOrganizer(vm.org,wechatId).then(function(data) {
                        if (data.errno == 0) {
                            var userId = data.data.uid;
                            console.log("bind teacher uid = "+userId);
                            //if(userId!=null){
                            //    wxlogin(userId,vm.roleType);
                            //}
                            wxlogin(wechatId,vm.roleType);
                        }
                    });
                }
                vm.error="密码或手机号码有误,请重试";

            };

            vm.register = function(){
                //检测输入数值是否正确
                if(!vm.check())return;
                //先注册
                if(vm.roleType=='2'){
                    registerService.registerParent(vm.user).then(function(data) {
                        console.log(data);
                        if (data.errno == 0) {
                            wxlogin(vm.user.wechat,vm.roleType);
                        }else{
                            if(data.errno==10000){
                                vm.error = "请确认微信是否已经绑定过";
                            }else vm.error = data.error;
                        }
                    });
                }else if(vm.roleType=='3'){
                    registerService.registerTeacher(vm.user).then(function(data) {
                        if (data.errno == 0) {
                            wxlogin(vm.user.wechat,vm.roleType);
                        }else{
                            if(data.errno==10000){
                                vm.error = "请确认微信是否已经绑定过";
                            }else vm.error = data.error;
                        }
                    });
                };
                //注册成功后,使用账户去获取获取token,完成登录
                //Session.userId="70000103";
                //Session.token='111';
                //Session.userRole='2';
                //var userId="70000103";
                //var token='111';
                //var userRole='2';
                //AuthService.setSession(userId, token, userRole);

                //StateService.clearAllAndGo(AuthService.getNextPath());
                //if(vm.roleType=='1') {
                //    StateService.go('organizerEdit');
                //}else if(vm.roleType=='2'){
                //    StateService.go('parentEdit');
                //}else if(vm.roleType=='3'){
                //    StateService.go('teacherEdit');
                //}
            };
        });
}());

(function() {
  'use strict';

  angular.module('registerRouter', [])
    .config(myRouter);


  function myRouter($stateProvider, $urlRouterProvider) {
    'ngInject';
    $stateProvider
      .state('register', {
        url: "/register?type",
        params:{
          type:1
        },
        templateUrl: 'register/register.html',
        controller: 'registerCtrl',
        controllerAs: 'vm'
      });
  }
}());

(function() {
  'use strict';

  angular.module('registerService', [])
    .factory('registerService', registerService);

  function registerService($http, Constants, ResultHandler) {
    'ngInject';
    var service = {
      registerTeacher:registerTeacher,
      registerParent:registerParent,
      bindTeacher:bindTeacher,
      bindOrganizer:bindOrganizer
    };

    //POST URL: /api/v1/account/register/parent
    //{
    //  "weixinno": "xxxxxx",
    //    "name": "李寻欢",
    //    "sex":1,
    //    "mobile": "13812345678",
    //    "nick":"小李飞刀",
    //    "password":"abcd"
    //}
    //return
    //{
    //  "errno":0,
    //    "error":"",
    //    "data":{
    //       "uid":21000001
    //    }
    //}
    function registerParent(user) {
      console.log(user);
      var data = {
        "weixinno": user.wechat,
        "name": user.name,
        "sex": user.gendar,
        "mobile": user.mobile,
        "password" : user.password
      };
      var url = Constants.serverUrl + 'account/register/parent';
      return $http({
        method: 'post',
        url: url,
        data: data
      }).then(ResultHandler.successedFuc, ResultHandler.failedFuc);
    };

    //POST URL: /api/v1/account/register/teacher
    //{
    //  "name":"小强",
    //    "sex":1,
    //    "mobile":"value",
    //    "weixinno":"laoshi",
    //    "teachage":5,
    //    "age":29,
    //    "photolink":"照片url",
    //    "password":"123456"
    //}
    //return
    //{
    //  "errno":0,
    //    "error":"",
    //    "data":{
    //       "uid":30000001
    //    }
    //}
    function registerTeacher(user) {
      var data = {
        "weixinno": user.wechat,
        "name": user.name,
        "sex": user.gendar,
        "mobile": user.mobile,
        "password" : user.password
      };
      var url = Constants.serverUrl + 'account/register/teacher';
      return $http({
        method: 'post',
        url: url,
        data: data
      }).then(ResultHandler.successedFuc, ResultHandler.failedFuc);
    };

    function bindTeacher(user,wechatId) {
      var data = {
        "weixinno": wechatId,
        "account": user.account,
        "password" : user.password
      };
      var url = Constants.serverUrl + 'account/teacher/bind';
      return $http({
        method: 'post',
        url: url,
        data: data
      }).then(ResultHandler.successedFuc, ResultHandler.failedFuc);
    };

    function bindOrganizer(org,wechatId) {
      var data = {
        "weixinno": wechatId,
        "account": org.account,
        "password" : org.password
      };
      var url = Constants.serverUrl + 'account/deposit/bind';
      return $http({
        method: 'post',
        url: url,
        data: data
      }).then(ResultHandler.successedFuc, ResultHandler.failedFuc);
    };


    return service;
  }

}());

(function() {
  "use strict";
  angular.module('settingsModule', [
    'settingsCtrl',
    'settingsRouter'
  ]);

}());

(function() {
    "use strict";
    angular.module('settingsCtrl', [])
        .controller('settingsCtrl', function($scope, Constants, StateService, $ionicPopup, MessageToaster) {
            'ngInject';
            var vm = this;
            vm.activated = false;
            $scope.$on('$ionicView.afterEnter', activate);

            function activate() {
                vm.activated = true;
                vm.version = Constants.buildID;
            }

            vm.goTo = function(addr){
                console.log('go to path : '+addr);
                StateService.go(addr);
            };

            vm.askClearCache = function() {
              var confirmPopup = $ionicPopup.confirm({
                  title: '确定要清除缓存？',
                  buttons: [
                      {text: '取消', type: 'button-positive'},
                      {text: '确定', type: 'button-assertive',onTap: function(e) { return true}}
                  ]
              });
              confirmPopup.then(function(result) {
                  if(result) {
                      console.log('confirm to clear cache');
                      console.log(result);
                      //delete(id);
                      window.CacheClear(function(data){
                        console.log(data);
                        MessageToaster.info('清除缓存成功'+JSON.stringify(data));
                      }, function(errordata){
                        console.log(errordata);
                        MessageToaster.error('清除缓存失败'+JSON.stringify(errordata));
                      });
                  } else {
                      console.log('cancel delete');
                  }
              });
            };

            vm.back=function(){
                StateService.back();
            };
        });
}());

(function() {
  'use strict';

  angular.module('settingsRouter', [])
    .config(myRouter);


  function myRouter($stateProvider, $urlRouterProvider) {
    'ngInject';
    $stateProvider
        .state('tabs.settings', {
          url: "/settings",
            views: {
              'tab-profile': {
                templateUrl: 'settings/settings.html',
                controller: 'settingsCtrl',
                controllerAs: 'vm'
              }
            }
        });
  }
}());

(function() {
  "use strict";
  angular.module('tabsModule', [
    'tabsCtrl',
    'tabsRouter',
    'tabsService'
  ]);

}());

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

(function() {
  'use strict';

  angular.module('tabsRouter', [])
    .config(myRouter);


  function myRouter($stateProvider, $urlRouterProvider) {
    'ngInject';
    $stateProvider
      .state('tabs', {
        url: '/tabs',
        abstract: true,
        templateUrl: 'tabs/tabs.html',
        controller: 'tabsCtrl',
        controllerAs: 'vm'
      })
  }

}());

(function() {
    'use strict';

    angular.module('tabsService', [])
        .factory('tabsService', tabsService);

    function tabsService($q, $http) {
        'ngInject';
        var service = {

        };

        return service;


    }

}());

(function() {
  "use strict";
  angular.module('teacherModule', [
    'teacherCtrl',
    'teacherEditCtrl',
    'teacherRouter',
    'teacherService'
  ]);

}());

(function() {
    "use strict";
    angular.module('teacherCtrl', [])
        .controller('teacherCtrl', function($scope,Constants,StateService,$ionicListDelegate,$ionicPopup,teacherService,AuthService,CacheData,MessageToaster) {
            'ngInject';
            var vm = this;
            vm.activated = false;
            $scope.$on('$ionicView.afterEnter', activate);

            function activate() {
                vm.activated = true;
                vm.version = Constants.buildID;
                vm.getOrganizerTeachers();
            }

            vm.back=function(){
                StateService.back();
            };

            vm.goTo=function(id,item){
                //查看老师信息
                $ionicListDelegate.closeOptionButtons();
                CacheData.putObject(id,item);
                StateService.go('teacherEdit',{cid:id,type:0});
            };

            vm.new=function(){
                //创建新的老师信息
                $ionicListDelegate.closeOptionButtons();
                StateService.go('teacherEdit',{type:1});
            };

            vm.edit=function(id){
                //编辑老师信息
                $ionicListDelegate.closeOptionButtons();
                StateService.go('teacherEdit',{cid:id,type:2});
            };

            vm.delete=function(id){
              teacherService.deleteTeacher(id).then(function(data) {
                  console.log(data);
                  if (data.errno == 0) {
                      vm.getOrganizerTeachers();
                      MessageToaster.info("删除成功");
                  }else{
                      MessageToaster.error("查不到任何数据 "+response.error);
                  }
              });
            };

            vm.del=function(item){
                //删除老师信息
                $ionicListDelegate.closeOptionButtons();

                var confirmPopup = $ionicPopup.confirm({
                    title: '确定要删除此老师:'+item.name,
                    buttons: [
                        {text: '取消', type: 'button-positive'},
                        {text: '确定', type: 'button-assertive',onTap: function(e) { return true}}
                    ]
                });
                confirmPopup.then(function(result) {
                    if(result) {
                        console.log('confirm to del this teacher '+item.uid);
                        //delete(id);
                        vm.delete(item.uid);
                    } else {
                        console.log('cancel delete');
                    }
                });
            };

            vm.getOrganizerTeachers = function(){
                teacherService.queryTeacher(AuthService.getLoginID()).then(function(data) {
                    if (data.errno == 0) {
                        console.log(data.data);
                        vm.teachers = data.data;
                    }
                });
            };
        });
}());

(function() {
    "use strict";
    angular.module('teacherEditCtrl', [])
        .controller('teacherEditCtrl', function($scope, $stateParams, Constants, StateService, teacherService, AuthService, CacheData,MessageToaster) {
            'ngInject';
            var vm = this;
            vm.activated = false;

            vm.query = function(id){
                vm.item =CacheData.getObject(vm.cid);
                console.log(vm.item);
                //vm.item = {name:'girl B',gendar:'2',sid:id,remark:'abcdefg'};
            };

            $scope.$on('$ionicView.afterEnter', activate);

            function activate() {
                console.log($stateParams);
                vm.cid = $stateParams.cid;
                //0:query 1:create 2:update
                vm.type = $stateParams.type;

                if(vm.type=='0')vm.isEditing = false;
                else vm.isEditing = true;

                vm.activated = true;
                vm.version = Constants.buildID;

                if(vm.type!='1')vm.query(vm.cid);
            }

            vm.back=function(){
                StateService.back();
            };

            vm.save=function(){
                console.log(vm.item);
                if(vm.type=='2'){
                  //update
                  teacherService.updateTeacher(vm.item,vm.item.uid).then(function(data) {
                    if (data.errno == 0) {
                        //var userId = data.data.uid;
                        //wxlogin(vm.user.wechat);
                        StateService.back();
                    }else{
                        //MessageToaster.error(data.error);
                        MessageToaster.error('无法更新');
                    }
                  },function(data){
                      MessageToaster.error(data);
                  });
                }else{
                  //create
                  teacherService.createTeacher(vm.item,AuthService.getLoginID()).then(function(data) {
                    if (data.errno == 0) {
                        //var userId = data.data.uid;
                        //wxlogin(vm.user.wechat);
                        StateService.back();
                    }else{
                        //MessageToaster.error(data.error);
                        MessageToaster.error('无法添加，请确认手机号码是否已经使用过');
                    }
                  },function(data){
                      MessageToaster.error(data);
                  });
              }
            };


        });
}());

(function() {
  'use strict';

  angular.module('teacherRouter', [])
    .config(myRouter);


  function myRouter($stateProvider, $urlRouterProvider) {
    'ngInject';
    $stateProvider
      .state('teacher', {
        url: "/teacher",
        templateUrl: 'teacher/teacher.html',
        controller: 'teacherCtrl',
        controllerAs: 'vm'
      })
      .state('teacherEdit', {
        url: "/teacherEdit?:cid&:type",
        params: {
          cid : null,
          type : '0'
        },
        templateUrl: 'teacher/teacherEdit.html',
        controller: 'teacherEditCtrl',
        controllerAs: 'vm'
      })
    ;
  }
}());

(function() {
  'use strict';

  angular.module('teacherService', [])
    .factory('teacherService', teacherService);

  function teacherService( $q, $http, Constants, ResultHandler) {
    'ngInject';
    var service = {
      createTeacher:createTeacher,
      updateTeacher:updateTeacher,
      deleteTeacher:deleteTeacher,
      queryTeacher:queryTeacher,
      queryTeacherDeposit:queryTeacherDeposit
    };


    //POST /api/v1/account/teacher/{$teacher_accnt_id}/update //老师账号信息更新，完善
    //Request Body: { "name":"小强", "sex":1, "mobile":"13300001111", "teachage":5, "age":29, "photolink":"照片url", "password":"123456" }
    //Response Body: { "errno":0, "error":"", "data":{ "uid":30000001 } }
    function updateTeacher(teacher, teacherId) {
      var data = {};
      if(teacher.name!=null)data.name=teacher.name;
      if(teacher.sex!=null)data.sex=teacher.sex;
      if(teacher.mobile!=null)data.mobile=teacher.mobile;
      if(teacher.teachage!=null)data.teachage=teacher.teachage;
      if(teacher.age!=null)data.age=teacher.age;
      if(teacher.url!=null)data.photolink=teacher.url;
      if(teacher.password!=null)data.password=teacher.password;
      if(teacher.remark!=null)data.remark=teacher.remark;

      var url = Constants.serverUrl + "account/teacher/"+teacherId+"/update";
      return $http({
        method: 'post',
        url: url,
        data: data
      }).then(ResultHandler.successedFuc, ResultHandler.failedFuc);
    }

    //POST /api/v1/deposit/{$deposit_accnt_id}/addteacher
    //Request Body: { "mobile":"13300001111" }
    //Response Body: { "errno":0, "error":"", "data":{ "teacheruid":30000001, "passwd":"123456" } }
    function createTeacher(teacher, orgId) {
      var data = {
        "name":teacher.name,
        "sex":teacher.sex,
        "mobile":teacher.mobile,
        "teachage":teacher.teachage,
        "age":teacher.age
      };
      var url = Constants.serverUrl + "deposit/"+orgId+"/addteacher";
      return $http({
        method: 'post',
        url: url,
        data: data
      }).then(ResultHandler.successedFuc, ResultHandler.failedFuc);
    };

    //GET /api/v1/account/query/depositTeacher/{deposit_accnt_id}
    //return
    //{
    //  "errno":0,
    //  "error":"",
    //  "data":[
    //    {
    //      "uid":10000001,
    //      "name":"赵大萌",
    //      "sex":1,
    //      "mobile":"15032145678",
    //      "teachage":10,
    //      "age":32,
    //      "photolink":"xxxxx"
    //      "remark":"xxxx"
    //    },
    //    ……
    //  ]
    //}
    function queryTeacher(id) {
      var url = Constants.serverUrl + 'account/query/depositTeacher/'+id;
      return $http.get(url).then(ResultHandler.successedFuc, ResultHandler.failedFuc);
    };

    function deleteTeacher(id) {
      var url = Constants.serverUrl + 'account/delTeacher/'+id;
      return $http.get(url).then(ResultHandler.successedFuc, ResultHandler.failedFuc);
      // return $http({
      //   method: 'post',
      //   url: url,
      //   data: {}
      // }).then(ResultHandler.successedFuc, ResultHandler.failedFuc);
    };

    function queryTeacherDeposit(id) {
      var url = Constants.serverUrl + 'deposit/teacher/'+id;
      return $http.get(url).then(ResultHandler.successedFuc, ResultHandler.failedFuc);
    };

    return service;


  }

}());

(function() {
  "use strict";
  angular.module('teacherSettingModule', [
    'teacherSettingCtrl',
    'teacherSettingRouter',
    'teacherSettingService'
  ]);

}());

(function() {
    "use strict";
    angular.module('teacherSettingCtrl', [])
        .controller('teacherSettingCtrl', function($scope, $state, Constants, StateService) {
            'ngInject';
            var vm = this;
            vm.activated = false;
            $scope.$on('$ionicView.afterEnter', activate);

            function activate() {
                vm.activated = true;
                vm.version = Constants.buildID;
            }

            vm.goTo = function(addr){
                console.log(addr);
                StateService.go(addr);
            };

        });
}());

(function() {
  'use strict';

  angular.module('teacherSettingRouter', [])
    .config(myRouter);


  function myRouter($stateProvider, $urlRouterProvider) {
    'ngInject';
    $stateProvider
      .state('tabs.teacherSetting', {
        url: "/teacherSetting",
          views: {
            'tab-teacherSetting': {
              templateUrl: 'teacherSetting/teacherSetting.html',
              controller: 'teacherSettingCtrl',
              controllerAs: 'vm'
            }
          }
      });
  }
}());

(function() {
  'use strict';

  angular.module('teacherSettingService', [])
    .factory('teacherSettingService', myService);

  function myService( $q, $http) {
    'ngInject';
    var service = {
    };
    return service;


  }

}());

(function() {
    "use strict";
    angular.module('WxLoginModule', [
        'WxLoginCtrl',
        'WxLoginRouter',
        'WxLoginService'
    ]).run(function($rootScope, Session, StateService,$location,tools) {
        $rootScope.$on('$stateChangeStart', function(event, next) {
          console.log("stateChangeStart");
          console.log(next);
          if(Session.checkTimeout()){
              console.log('Session timeout');
              StateService.clearAllAndGo('login');
          }
          if (next.url.indexOf('wxlogin')>0 ) {
              console.log("wxlogin");
              //alert($location.absUrl());
              var url = $location.absUrl();
              //获取ticket参数，因为angualr的路径不规范，会出现http://10.20.68.73:8080/casOauth/?ticket=ST-16-HzIjcAlxbKvlyJQAX2XI-cas01.sustc.edu.cn#/login，无法用公共方法获取
              var start = url.indexOf('user=') + 5;
              var end = url.indexOf('&type=');
              if(!start<=5 && end <= 0){
                StateService.clearAllAndGo('login');
              }else{
                //如果是http://10.20.68.73:8080/casOauth?ticket=ST-16-HzIjcAlxbKvlyJQAX2XI-cas01.sustc.edu.cn这种情况
                //或者是是http://10.20.68.73:8080/casOauth/#/login?ticket=ST-16-HzIjcAlxbKvlyJQAX2XI-cas01.sustc.edu.cn这种情况
                if (end == -1 || end < start) end = url.length;
                console.log("wxlogin 1" + start + " - " + end);
                var myUser = url.toString().substring(start, end);
                console.log("get user = " + myUser);

                var start = url.indexOf('&type=') + 6;
                var end = url.indexOf('#/wxlogin');
                if (end == -1 || end < start) end = url.length;
                console.log("wxlogin 2" + start + " - " + end);
                var myType = url.toString().substring(start, end);
                console.log("get type = " + myType);
                StateService.clearAllAndGo('wxlogin',{user:myUser,type:myType});
              }
          }else if(next.url.indexOf('login')>0){
              console.log("login");
          }else if(next.url.indexOf('register')>0){
              //未绑定用户者,进入注册绑定页面
              console.log("register");
          }else{
            if (Session.getData('userId') && Session.getData('token')) {
                //login successed
            } else {
                console.log("user not login with ");
                event.preventDefault();
                if (tools.getAgent() != 'wx')
                    StateService.clearAllAndGo('login');
                else
                    StateService.clearAllAndGo('wxlogin');
            }
          }
        });

    });

}());

(function() {
    "use strict";
    angular.module('WxLoginCtrl', [])
        .controller('WxLoginCtrl', function(Constants, AuthService, MessageToaster, LoginService, $timeout, $scope, Session, $stateParams, StateService, $ionicModal, Role) {
            'ngInject';

            var vm = this;
            vm.wxlogin = wxlogin;
            vm.isDev = Constants.ENVIRONMENT == 'dev' ? true : false;
            $scope.$on('$ionicView.beforeEnter', validate);

            function validate() {
                vm.user = $stateParams.user;
                vm.type = $stateParams.type;
                console.log("vm.type = "+vm.type+" with "+vm.user);
            /////////////////////////////////////////////////////////
            //    vm.user = "o_Nkcw4CsZh5dbE2v8XVLUxfd96A";//"oVyGDuNPkAbtljfJKusP4oaCrYG0";//test
            //    vm.type = 2;//test
            ////////////////////////////////////////////////////////
                //MessageToaster.info('user = '+vm.user);
                if (vm.user) {
                    //login failed
                    //MessageToaster.info('logining....');
                    vm.info = "正在登录，请稍后...";
                    vm.showLoginModal = showLoginModal;
                    //vm.roleList = [{type:1,user:'1111'}];//test
                    vm.showChooseModal = showChooseModal;
                    vm.login = login;
                    vm.select = selectChoose;
                    //获取到微信uid后先尝试登陆对应的用户类型
                    if(vm.type){
                        vm.wxlogin(vm.user,vm.type);
                    }else{
                        vm.showChooseModal();
                    }
                }
            }

            function wxlogin(userid,type) {
                console.log(userid+"  type = "+type);
                //MessageToaster.info('准备登录');
                LoginService.wxLogin(userid,type).then(function(response) {
                    console.log(response);
                    if(response.errno==0) {
                        var result = response.data;
                        if (result instanceof Array && result.length > 1) {
                            //modal select type
                            vm.roleList=result;
                            //MessageToaster.info("have select "+result.length);
                            vm.showChooseModal();
                        }else{
                            var u=result[0];
                            if (u.uid != null && u.token != null && u.type != null) {
                                AuthService.setSession(u.uid, u.token, u.eshop, u.type,userid);
                                StateService.clearAllAndGo(AuthService.getNextPath());
                            }
                        }
                    }else{
                        if(response.errno==12004){
                            //no data found
                            AuthService.setSession(null, null, null, Role.unknown,userid);

                            StateService.clearAllAndGo("register",{type:vm.type});
                        }
                        //MessageToaster.error(response.error);
                    }
                });
            };

            //WeuiModalLoading
            function login(user) {
                //WeuiModalLoading.show();
                //test
                AuthService.setSession('1', '123', '1');
                StateService.go(AuthService.getNextPath());
                //test

                LoginService.login(user.userId, user.password).then(function(response) {
                    if (vm.modal)
                        vm.closeDetailsModal();
                    MessageToaster.success(response.message);
                    AuthService.setSession(response.data.uid, response.data.token,response.data.eshop,response.data.type);
                    StateService.clearAllAndGo(AuthService.getNextPath());
                }).finally(function() {
                    //WeuiModalLoading.hide();
                });
            }

            function showLoginModal() {
                $ionicModal.fromTemplateUrl('Login/LoginModal.html', {
                    scope: $scope,
                    animation: 'slide-in-up'
                }).then(function(modal) {
                    vm.modal = modal;
                    vm.modal.show();
                });

                vm.closeDetailsModal = function() {
                    vm.modal.remove();
                };
                $scope.$on('$ionicView.leave', function() {
                    vm.modal.remove();
                });
            }

            function showChooseModal() {
                $ionicModal.fromTemplateUrl('Login/ChooseModal.html', {
                    scope: $scope,
                    animation: 'slide-in-up'
                }).then(function(modal) {
                    vm.cmodal = modal;
                    vm.cmodal.show();
                });

                vm.closeChooseModal = function() {
                    vm.cmodal.remove();
                };
                $scope.$on('$ionicView.leave', function() {
                    vm.cmodal.remove();
                });
            }

            function selectChoose(){
                if(vm.choose!=null){
                    //know user choose then login agin with type
                    wxlogin(vm.user, vm.choose);
                }
            }
        });
}());

(function() {
  'use strict';

  angular.module('WxLoginRouter', [])
    .config(wxLoginRouter);


  function wxLoginRouter($stateProvider,$urlRouterProvider) {
    'ngInject';
    $stateProvider
    .state('wxlogin', {
      url: "/wxlogin?:user&:type",
      params:{
        user:null,
        type:0
      },
      templateUrl: 'WxLogin/wxlogin.html',
      controller: 'WxLoginCtrl',
      controllerAs: 'vm'
    });
    // $urlRouterProvider.when('', '/wxlogin');
    //$urlRouterProvider.otherwise('/wxlogin');
    $urlRouterProvider.otherwise(function($injector, $location) {
          //console.log("Could not find " + $location);
          $location.path('/login');
    });

  }
}());

(function() {
    'use strict';

    angular.module('WxLoginService', [])
        .factory('WxLoginService', wxLoginService);

    function wxLoginService($q, $http, ResultHandler, Constants) {
        'ngInject';
        var service = {
            login: login,
            logout: logout,
            wxLogin: wxLogin
        };

        function logout() {

        }

        function login(userId, password) {
            var data = {
                id: md5(userId),
                psw: md5(password)
            };
            var url = Constants.serverUrl + 'login';
            return $http({
                method: 'post',
                url: url,
                data: data
            }).then(ResultHandler.successedFuc, ResultHandler.failedFuc);
        }

        //POST /api/v1/login
        //Request Body:
        //{
        //    "weixinno": "xxxxxx"
        //}
        //Response Body:
        //{
        //    "errno":0,
        //    "error":"",
        //    "data":{
        //        "token":"fdddsdsdddsssssdfff",
        //        "uid":"用户id",
        //        "type":"用户类型"   uid的第一位数
        //    }
        //}
        function wxLogin(wxId,type) {
            var data = {
                weixinno: wxId
            };
            var end="";
            if(type!=null){
                //console.log("include type "+type);
                data.type=type;
                end="?type="+type;
            }
            var url = Constants.serverUrl + 'login'+end;
            return $http({
                method: 'post',
                url: url,
                data: data
            }).then(function (response) {
                return response.data;
            }, function (error) {
                return $q.reject(error);
            });
        }


        return service;


    }

}());

//# sourceMappingURL=app.js.map
