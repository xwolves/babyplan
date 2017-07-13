(function () {
    "use strict";
    angular.module('xhStarter', [
        'vendor',
        'config',
        'code',
        'directive',
        'tools',
        'modules'
    ])

    .run(function ($ionicPlatform, $state, $ionicHistory, AuthService, JPushService, Constants) {
        $ionicPlatform.registerBackButtonAction(function (event) {
           // alert("cur：" + JSON.stringify($state.current));
            if ($state.current.name.indexOf("tabs")>-1) {
                event.preventDefault();
                cordova.plugins.backgroundMode.moveToBackground();
            } else  if ($ionicHistory.backView()) {
                    $ionicHistory.goBack();
            }
            return false;
        }, 100);

        $ionicPlatform.ready(function () {
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

         
            //版本更新
            function checkAppUpdate() {
                window.AppUpdate && window.AppUpdate.checkAppUpdate(function () {
                    //console.log('success', JSON.stringify(arguments), arguments);
                   // alert("success" + JSON.stringify(arguments));
                }, function () {
                    //console.log('fail', JSON.stringify(arguments), arguments);
                   // alert("fail" + JSON.stringify(arguments));
                }, Constants.versionUpdateUrl + "apk-pub/ktyy.version.xml");
            }

            //应用可以进入后台运行
            //cordova.plugins.backgroundMode.enable();
            //cordova.plugins.backgroundMode.overrideBackButton();
            cordova.plugins.backgroundMode.on('activate', function () {
                checkAppUpdate();
            });

           
            checkAppUpdate();

            //cordova.getAppVersion.getVersionNumber(function (version) {
            //    alert(version);
            //});

            //推送初始化
            var onOpenNotificationInAndroidCallback = function (data) {
                $state.go(AuthService.getNextPath(), { index:1});
            }
            var config = {
                openNotificationInAndroidCallback: onOpenNotificationInAndroidCallback
            };
            //启动极光推送服务
            JPushService.init(config);
        });
    })

    .config(function ($ionicConfigProvider, $urlRouterProvider, $stateProvider, $httpProvider, $sceDelegateProvider) {
        console.log("start app");

        if (!ionic.Platform.isIOS()) {
            $ionicConfigProvider.scrolling.jsScrolling(false);
        }
        $sceDelegateProvider.resourceUrlWhitelist(['**']);
        $httpProvider.interceptors.push([
            '$injector',
            function ($injector) {
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
        .factory('AuthInterceptor', function ($rootScope, $q, AUTH_EVENTS) {
            return {
                responseError: function (response) {
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
            'ngCordova',
            'templates',
            'ngStorage',
            'toaster',
            'ui.rCalendar.tpls',
            'baiduMap',
            'ionic-ratings'
        ]);
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
            'VisitorRolePath':'tabs.map'
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
            'appTitle':'肯特育园',
            'company':'深圳知行信息技术开发有限公司',
            'serverUrl': 'http://wx.zxing-tech.cn/api/v1/',
            'eshopApiUrl': 'http://api.mall.zxing-tech.cn/v2/',
            'dfsUrl': 'http://wx.zxing-tech.cn/',
            'versionUpdateUrl': 'http://wx.zxing-tech.cn/',
            'buildID': '20170614v1',
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
    'BaiduService',
     'JPushService'
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
            return d.Format('MM月dd日 hh:mm:ss');
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

(function () {
    'use strict';

    angular.module('JPushService', [])
    .factory('JPushService', JPushService);

    JPushService.$inject = ['$http', '$window', '$document'];

    function JPushService($http, $window, $document) {
        var jpushServiceFactory = {};

        //var jpushapi=$window.plugins.jPushPlugin;

        //������������
        var _init = function (config) {

            if(!$window.plugins) return;

            $window.plugins.jPushPlugin.init();
            //����tag��Alias�����¼�����
            //document.addEventListener('jpush.setTagsWithAlias', config.stac, false);
            //��������Ϣ�¼�����
            $window.plugins.jPushPlugin.openNotificationInAndroidCallback = config.openNotificationInAndroidCallback;
            $window.plugins.jPushPlugin.receiveMessageInAndroidCallback = config.receiveMessageInAndroidCallback;
            $window.plugins.jPushPlugin.receiveNotificationInAndroidCallback = config.receiveNotificationInAndroidCallback;

            document.addEventListener('jpush.receiveNotification', config.receiveNotificationInAndroidCallback, false);
            document.addEventListener('jpush.receiveMessage', config.receiveMessageInAndroidCallback, false);
            document.addEventListener('jpush.openNotification', config.openNotificationInAndroidCallback, false);
            
            $window.plugins.jPushPlugin.setDebugMode(true);
        }
        //��ȡ״̬
        var _isPushStopped = function (fun) {
            $window.plugins && $window.plugins.jPushPlugin.isPushStopped(fun)
        }
        //ֹͣ��������
        var _stopPush = function () {
            $window.plugins && $window.plugins.jPushPlugin.stopPush();
        }

        //������������
        var _resumePush = function () {
            $window.plugins && $window.plugins.jPushPlugin.resumePush();
        }

        //���ñ�ǩ�ͱ���
        var _setTagsWithAlias = function (tags, alias) {
            $window.plugins && $window.plugins.jPushPlugin.setTagsWithAlias(tags, alias);
        }

        //���ñ�ǩ
        var _setTags = function (tags) {
            $window.plugins && $window.plugins.jPushPlugin.setTags(tags);
        }

        //���ñ���
        var _setAlias = function (alias) {
            $window.plugins && $window.plugins.jPushPlugin.setAlias(alias);
        }


        jpushServiceFactory.init = _init;
        jpushServiceFactory.isPushStopped = _isPushStopped;
        jpushServiceFactory.stopPush = _stopPush;
        jpushServiceFactory.resumePush = _resumePush;
        jpushServiceFactory.setTagsWithAlias = _setTagsWithAlias;
        jpushServiceFactory.setTags = _setTags;
        jpushServiceFactory.setAlias = _setAlias;

        return jpushServiceFactory;
    }

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
    angular.module('Session', []).service('Session', function ($http, $window, JPushService) {
        'ngInject';

        var session = {
            create: create,
            destroy: destroy,
            updateRoles: updateRoles,
            setData:setData,
            getData:getData,
            rmData:rmData,
        };

        function create(token, eshop, userId, roles, wechat) {
            $window.localStorage.setItem("token", token);
            $window.localStorage.setItem("eshop_auth", JSON.stringify(eshop));
            $window.localStorage.setItem("userId", userId);
            $window.localStorage.setItem("userRole", roles);
            $window.localStorage.setItem("wechat", wechat);

            if(token!=null){
                //$http.defaults.headers.common.Authorization = "Bearer-"+token;
                $http.defaults.headers.common.token = token;
            }

            //�����û�ID��Ϊ֪ͨ����
            JPushService.setAlias(userId);

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
    angular.module('directive', [
      'BaiduMapDirective'
    ]);

}());

(function() {
    'use strict';

   


var app = angular.module('BaiduMapDirective', []);

app.directive('uiMap', function ($parse, $q, $window, $timeout, $ionicModal, $ionicSlideBoxDelegate,RichMarkerFactory, MessageToaster, BaiduService) {
    'ngInject';

    var MARKER_TYPES = {
        CURRENT: 0,
        CUSTOM: 1,
        BAIDU: 2
    };


      /**
       * 加载百度地图
       * @param {object}  $q angular $q
       * @param {string} apiKey 百度apiKey
       * @param {string} version 版本号
       */
      function loadMap(apiKey) {

          // 判断是否执行过加载过程
          //if ($window.loadBaiduPromise) {
          //    return $window.loadBaiduPromise;
          //}

          var deferred = $q.defer(),
            resolve = function () {
                deferred.resolve($window.BMap ? $window.BMap : false);
            },
            callbackName = 'loadBaiduMaps_' + (new Date().getTime()),
            params = {
                'ak': apiKey
            };
          if ($window.BMap) {
              resolve();
          } else {
              angular.extend(params, {
                  'v': '2.0',
                  'callback': callbackName
              });

              // 百度地图加载成功后回调用方法
              $window[callbackName] = function () {
                  // 标识异步任务完成
                  resolve();

                  // 成功后删除全局回调方法
                  $timeout(function () {
                      try {
                          delete $window[callbackName];
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
         // $window.loadBaiduPromise = deferred.promise;

          // 返回异步任务对象
          return deferred.promise
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
              enableMapClick: false
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
      function addMapMarker(map, point, options) {

          //{} clickCallback, poInfo, icon,markText

          var ovs = map.getOverlays();
          var isExist = false;
          for (var i = 0; i < ovs.length; i++) {
              var pt = ovs[i].getPosition();
              if (pt.equals(point)) {
                  isExist = true;
                  break;
              }
          }

          if (isExist) return;

          options = options || {};
          var mk;

          if (options.type == MARKER_TYPES.CURRENT) {
              var label = new BMap.Label(options.text, { offset: new BMap.Size(-15, 25) });
              mk = new BMap.Marker(point, { icon: options.icon });
              mk.setLabel(label)
          } else if (options.type == MARKER_TYPES.CUSTOM) {
              options.data = options.data || {};

              var htm = "<div class='custom-marker'>"
                        + "<div class='header'>" + options.data.Scores + "</div><div class='content'>" + options.data.OrgName + "</div>"
                        + "</div>";

               mk = RichMarkerFactory.buildRichMarker(htm, point, {
                  "anchor": new BMap.Size(-72, -84),
                  "enableDragging": true
               });

               if (options.onClick) {
                   mk.addEventListener('ontouchend', options.onClick);
               }
          } else {
              mk = new BMap.Marker(point);
              if (options.onClick) {
                  mk.addEventListener('click', options.onClick);
              }
          }

          mk.babyPoi = options.data;
          map.addOverlay(mk);

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
          try {
              if (baidumap_location) {
                  // 获取GPS当前位置
                  baidumap_location.getCurrentPosition(function (result) {
                    // alert(JSON.stringify(result));
                     // alert(result.locType);
                      var point;
                      if (result.locType == 161) {
                          point = new BMap.Point(result.lontitude, result.latitude);
                          $window.localStorage.setItem("current_pos", JSON.stringify(result));
                      } else {
                          //var curPos = $window.localStorage.getItem("current_pos");
                          //curPos = JSON.parse(curPos);
                          //point = new BMap.Point(curPos.lontitude, curPos.latitude);

                          var point = new BMap.Point(options.center.longitude, options.center.latitude); // 定义一个中心点坐标
                          deferred.resolve(point);
                      }

                      deferred.resolve(point);
                  }, function (error) {
                      var point = new BMap.Point(options.center.longitude, options.center.latitude); // 定义一个中心点坐标
                      deferred.resolve(point);
                      //alert(error.message);
                      //deferred.reject(error);
                  });
              } else {
                  var point = new BMap.Point(options.center.longitude, options.center.latitude); // 定义一个中心点坐标
                  deferred.resolve(point);
              }
          } catch (e) {
              alert(e.message);
              var point = new BMap.Point(options.center.longitude, options.center.latitude); // 定义一个中心点坐标
              deferred.resolve(point);
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
                      if (!result.vr) continue;

                      for (let i = 0; i < result.vr.length; i++) {
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
                              tempPoi["Dist"] = map.getDistance(poi.point, map.scope.currentPosition);
                          }

                          //只看5公里内的数据
                          if (tempPoi["Dist"] && tempPoi["Dist"] < 5000) {
                              pois.push(tempPoi);
                          }
                      }
                  }

                  deferred.resolve(pois);
              } catch (err) {
                  deferred.reject(err);
              }
          }
          var local = new BMap.LocalSearch(map, {
              onSearchComplete: onSearchComplete,
              pageCapacity: 30
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
                  addMapMarker(map, point,{onClick:openInfoWindow,type:MARKER_TYPES.BAIDU,data:results[i]});
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
            map = e.target._map || e.target.map;

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
                  LIST_SEARCH: 3,
              };
              if(opts.mode){
                scope.currMode = opts.mode;
              }else{
                scope.currMode = MAP_MODES.MAP_SHOW;
              }

              scope.only_show_list = false;
              if (!!opts.onlyShowList) {
                  scope.only_show_list = opts.onlyShowList;
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
                 // scope.map.clearOverlays();
                  var point = new BMap.Point(poi.Longitude, poi.Latitude);
                  if (poi.AccountID === 0) {
                      addMapMarker(scope.map, point, { onClick: openInfoWindow, type: MARKER_TYPES.BAIDU, data: poi });
                  } else {
                      addMapMarker(scope.map, point, { onClick: openInfoWindow, type: MARKER_TYPES.CUSTOM, data: poi });
                  }
                 // addMapMarker(scope.map, point, openInfoWindow, poi);
                  $timeout(function () {
                      scope.map.panTo(point);
                  }, 20);
              };

              /**
               * 定位到当前位置
               */
              scope.locationCurrent = function () {
                  $timeout(function () {

                      // 指定Marker的icon属性为Symbol
                      var icon = new BMap.Symbol(BMap_Symbol_SHAPE_POINT, {
                          scale: 1,//图标缩放大小
                          fillColor: "orange",//填充颜色
                          fillOpacity: 0.8//填充透明度
                      });
                     // scope.map.clearOverlays();
                      addMapMarker(scope.map, scope.currentPosition, { type: MARKER_TYPES.CURRENT, icon: icon, text: '我的位置' });
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
                      // addMapMarker(scope.map, point, openInfoWindow, poi);

                      addMapMarker(scope.map, point, { onClick: openInfoWindow, type: MARKER_TYPES.BAIDU, data: poi });
                  }

                  for (var i = 0; i < scope.babyPlanSearchResults.length; i++) {
                      poi = scope.babyPlanSearchResults[i];
                      point = new BMap.Point(poi.Longitude, poi.Latitude);
                      //  addMapCustomMarker(scope.map, point, openInfoWindow, poi,poi.OrgName);
                      addMapMarker(scope.map, point, { onClick: openInfoWindow, type: MARKER_TYPES.CUSTOM, data: poi });
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
                  $window.BMap = null;
                  // document.getElementById('map').remove();
                  elm.remove();
                  scope.modal && scope.modal.remove();
              });

              var onLoadMapSuccessed = function () {

                  try{

                      // 创建百度地图
                   // var map = scope.map = buildMap(document.getElementById('map'), opts);
                      var map = scope.map = buildMap(elm.children().eq(0).children()[1], opts);
                      map.scope = scope;

                      // 添加导航栏
                      addMapNavigation(map, BMAP_ANCHOR_BOTTOM_RIGHT);

                      // 添加地图搜索框自动完成功能
                      addMapAutoComplete(map, scope);

                      // 设置地图可视区中心位置
                      getCurrentPosition(map, opts).then(function (p) {
                          // 记录当前位置并标记
                          scope.currentPosition = p;

                          // 指定Marker的icon属性为Symbol
                          var symbol = new BMap.Symbol(BMap_Symbol_SHAPE_POINT, {
                              scale: 1,//图标缩放大小
                              fillColor: "orange",//填充颜色
                              fillOpacity: 0.8//填充透明度
                          });

                          addMapMarker(map, p, { onClick: openInfoWindow, type: MARKER_TYPES.CURRENT, icon: symbol, text: '我的位置'});

                         //  addMapMarker(map, p, openInfoWindow, null, symbol,'我的位置');
                          // 设置为中心
                          map.centerAndZoom(p, 16);

                          // 根据关键字检索百度相关位置数据和根据当前位置检索后台维护附近数据
                          var bpSearchDeferred = babyPlanLocalSearch(p);
                          var bdSearchDeferred = baiDuLocalSearch(map, opts.keywords);
                          $q.all([bpSearchDeferred, bdSearchDeferred]).then(function (results) {

                              // 缓存结果
                              var baiDuSearchResults= scope.baiDuSearchResults = results[1].sort(function (a, b) { return parseFloat(a.Dist) - parseFloat(b.Dist); });
                              var babyPlanSearchResults=  scope.babyPlanSearchResults = results[0];

                              // 对满足条件的位置进行标记，
                              var point;
                              for (var i = 0; i < baiDuSearchResults.length; i++) {
                                  point = new BMap.Point(baiDuSearchResults[i].Longitude, baiDuSearchResults[i].Latitude);
                                  addMapMarker(map, point, { onClick: openInfoWindow, type: MARKER_TYPES.BAIDU, data: baiDuSearchResults[i] });
                              }

                              for (var i = 0; i < babyPlanSearchResults.length; i++) {
                                  point = new BMap.Point(babyPlanSearchResults[i].Longitude, babyPlanSearchResults[i].Latitude);
                                  addMapMarker(map, point, { onClick: openInfoWindow, type: MARKER_TYPES.CUSTOM, data: babyPlanSearchResults[i] });
                              }


                              // 把最后一个位置移动到地图中心
                              // point && map.panTo(point)
                          }, function (err) {
                              //ionicToast.show('获取位置信息失败!', 'middle', false, 3000);
                              MessageToaster.error("获取位置信息失败!");
                          })
                      }, function (err) {
                          //ionicToast.show('获取位置信息失败!', 'middle', false, 3000);
                          MessageToaster.error("获取位置信息失败!");
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
  app.factory('RichMarkerFactory', function () {
      function _getRichMarkerClass(BMap) {

          var BMapLib = window.BMapLib = BMapLib || {};
          if (BMapLib.RichMarker) return BMapLib.RichMarker;

          /**
           * 声明baidu包
           */
          var baidu = baidu || {
              guid: "$BAIDU$"
          };

          // 一些页面级别唯一的属性，需要挂载在window[baidu.guid]上
          window[baidu.guid] = {};

          /**
           * 将源对象的所有属性拷贝到目标对象中
           * @name baidu.extend
           * @function
           * @grammar baidu.extend(target, source)
           * @param {Object} target 目标对象
           * @param {Object} source 源对象
           * @returns {Object} 目标对象
           */
          baidu.extend = function (target, source) {
              for (var p in source) {
                  if (source.hasOwnProperty(p)) {
                      target[p] = source[p];
                  }
              }
              return target;
          };

          /**
           * @ignore
           * @namespace
           * @baidu.lang 对语言层面的封装，包括类型判断、模块扩展、继承基类以及对象自定义事件的支持。
           * @property guid 对象的唯一标识
           */
          baidu.lang = baidu.lang || {};

          /**
           * 返回一个当前页面的唯一标识字符串。
           * @function
           * @grammar baidu.lang.guid()
           * @returns {String} 当前页面的唯一标识字符串
           */
          baidu.lang.guid = function () {
              return "TANGRAM__" + (window[baidu.guid]._counter++).toString(36);
          };

          window[baidu.guid]._counter = window[baidu.guid]._counter || 1;

          /**
           * 所有类的实例的容器
           * key为每个实例的guid
           */
          window[baidu.guid]._instances = window[baidu.guid]._instances || {};

          /**
           * Tangram继承机制提供的一个基类，用户可以通过继承baidu.lang.Class来获取它的属性及方法。
           * @function
           * @name baidu.lang.Class
           * @grammar baidu.lang.Class(guid)
           * @param {string} guid	对象的唯一标识
           * @meta standard
           * @remark baidu.lang.Class和它的子类的实例均包含一个全局唯一的标识guid。
           * guid是在构造函数中生成的，因此，继承自baidu.lang.Class的类应该直接或者间接调用它的构造函数。<br>
           * baidu.lang.Class的构造函数中产生guid的方式可以保证guid的唯一性，及每个实例都有一个全局唯一的guid。
           */
          baidu.lang.Class = function (guid) {
              this.guid = guid || baidu.lang.guid();
              window[baidu.guid]._instances[this.guid] = this;
          };

          window[baidu.guid]._instances = window[baidu.guid]._instances || {};

          /**
           * 判断目标参数是否string类型或String对象
           * @name baidu.lang.isString
           * @function
           * @grammar baidu.lang.isString(source)
           * @param {Any} source 目标参数
           * @shortcut isString
           * @meta standard
           *             
           * @returns {boolean} 类型判断结果
           */
          baidu.lang.isString = function (source) {
              return '[object String]' == Object.prototype.toString.call(source);
          };
          baidu.isString = baidu.lang.isString;

          /**
           * 判断目标参数是否为function或Function实例
           * @name baidu.lang.isFunction
           * @function
           * @grammar baidu.lang.isFunction(source)
           * @param {Any} source 目标参数
           * @returns {boolean} 类型判断结果
           */
          baidu.lang.isFunction = function (source) {
              return '[object Function]' == Object.prototype.toString.call(source);
          };

          /**
           * 自定义的事件对象。
           * @function
           * @name baidu.lang.Event
           * @grammar baidu.lang.Event(type[, target])
           * @param {string} type	 事件类型名称。为了方便区分事件和一个普通的方法，事件类型名称必须以"on"(小写)开头。
           * @param {Object} [target]触发事件的对象
           * @meta standard
           * @remark 引入该模块，会自动为Class引入3个事件扩展方法：addEventListener、removeEventListener和dispatchEvent。
           * @see baidu.lang.Class
           */
          baidu.lang.Event = function (type, target) {
              this.type = type;
              this.returnValue = true;
              this.target = target || null;
              this.currentTarget = null;
          };

          /**
           * 注册对象的事件监听器。引入baidu.lang.Event后，Class的子类实例才会获得该方法。
           * @grammar obj.addEventListener(type, handler[, key])
           * @param 	{string}   type         自定义事件的名称
           * @param 	{Function} handler      自定义事件被触发时应该调用的回调函数
           * @param 	{string}   [key]		为事件监听函数指定的名称，可在移除时使用。如果不提供，方法会默认为它生成一个全局唯一的key。
           * @remark 	事件类型区分大小写。如果自定义事件名称不是以小写"on"开头，该方法会给它加上"on"再进行判断，即"click"和"onclick"会被认为是同一种事件。 
           */
          baidu.lang.Class.prototype.addEventListener = function (type, handler, key) {
              if (!baidu.lang.isFunction(handler)) {
                  return;
              } !this.__listeners && (this.__listeners = {});
              var t = this.__listeners,
                  id;
              if (typeof key == "string" && key) {
                  if (/[^\w\-]/.test(key)) {
                      throw ("nonstandard key:" + key);
                  } else {
                      handler.hashCode = key;
                      id = key;
                  }
              }
              type.indexOf("on") != 0 && (type = "on" + type);
              typeof t[type] != "object" && (t[type] = {});
              id = id || baidu.lang.guid();
              handler.hashCode = id;
              t[type][id] = handler;
          };

          /**
           * 移除对象的事件监听器。引入baidu.lang.Event后，Class的子类实例才会获得该方法。
           * @grammar obj.removeEventListener(type, handler)
           * @param {string}   type     事件类型
           * @param {Function|string} handler  要移除的事件监听函数或者监听函数的key
           * @remark 	如果第二个参数handler没有被绑定到对应的自定义事件中，什么也不做。
           */
          baidu.lang.Class.prototype.removeEventListener = function (type, handler) {
              if (baidu.lang.isFunction(handler)) {
                  handler = handler.hashCode;
              } else if (!baidu.lang.isString(handler)) {
                  return;
              } !this.__listeners && (this.__listeners = {});
              type.indexOf("on") != 0 && (type = "on" + type);
              var t = this.__listeners;
              if (!t[type]) {
                  return;
              }
              t[type][handler] && delete t[type][handler];
          };

          /**
           * 派发自定义事件，使得绑定到自定义事件上面的函数都会被执行。引入baidu.lang.Event后，Class的子类实例才会获得该方法。
           * @grammar obj.dispatchEvent(event, options)
           * @param {baidu.lang.Event|String} event 	Event对象，或事件名称(1.1.1起支持)
           * @param {Object} options 扩展参数,所含属性键值会扩展到Event对象上(1.2起支持)
           * @remark 处理会调用通过addEventListenr绑定的自定义事件回调函数之外，还会调用直接绑定到对象上面的自定义事件。
           * 例如：<br>
           * myobj.onMyEvent = function(){}<br>
           * myobj.addEventListener("onMyEvent", function(){});
           */
          baidu.lang.Class.prototype.dispatchEvent = function (event, options) {
              if (baidu.lang.isString(event)) {
                  event = new baidu.lang.Event(event);
              } !this.__listeners && (this.__listeners = {});
              options = options || {};
              for (var i in options) {
                  event[i] = options[i];
              }
              var i, t = this.__listeners,
                  p = event.type;
              event.target = event.target || this;
              event.currentTarget = this;
              p.indexOf("on") != 0 && (p = "on" + p);
              baidu.lang.isFunction(this[p]) && this[p].apply(this, arguments);
              if (typeof t[p] == "object") {
                  for (i in t[p]) {
                      t[p][i].apply(this, arguments);
                  }
              }
              return event.returnValue;
          };

          /**
           * @ignore
           * @namespace baidu.dom 
           * 操作dom的方法
           */
          baidu.dom = baidu.dom || {};

          /**
           * 从文档中获取指定的DOM元素
           * **内部方法**
           * 
           * @param {string|HTMLElement} id 元素的id或DOM元素
           * @meta standard
           * @return {HTMLElement} DOM元素，如果不存在，返回null，如果参数不合法，直接返回参数
           */
          baidu.dom._g = function (id) {
              if (baidu.lang.isString(id)) {
                  return document.getElementById(id);
              }
              return id;
          };
          baidu._g = baidu.dom._g;

          /**
           * @ignore
           * @namespace baidu.event 屏蔽浏览器差异性的事件封装。
           * @property target 	事件的触发元素
           * @property pageX 		鼠标事件的鼠标x坐标
           * @property pageY 		鼠标事件的鼠标y坐标
           * @property keyCode 	键盘事件的键值
           */
          baidu.event = baidu.event || {};

          /**
           * 事件监听器的存储表
           * @private
           * @meta standard
           */
          baidu.event._listeners = baidu.event._listeners || [];

          /**
           * 为目标元素添加事件监听器
           * @name baidu.event.on
           * @function
           * @grammar baidu.event.on(element, type, listener)
           * @param {HTMLElement|string|window} element 目标元素或目标元素id
           * @param {string} type 事件类型
           * @param {Function} listener 需要添加的监听器
           * @remark
           * 
          1. 不支持跨浏览器的鼠标滚轮事件监听器添加<br>
          2. 改方法不为监听器灌入事件对象，以防止跨iframe事件挂载的事件对象获取失败
              
           * @shortcut on
           * @meta standard
           * @see baidu.event.un
           * @returns {HTMLElement|window} 目标元素
           */
          baidu.event.on = function (element, type, listener) {
              type = type.replace(/^on/i, '');
              element = baidu.dom._g(element);

              var realListener = function (ev) {
                  listener.call(element, ev);
              },
                  lis = baidu.event._listeners,
                  filter = baidu.event._eventFilter,
                  afterFilter, realType = type;
              type = type.toLowerCase();
              if (filter && filter[type]) {
                  afterFilter = filter[type](element, type, realListener);
                  realType = afterFilter.type;
                  realListener = afterFilter.listener;
              }
              if (element.addEventListener) {
                  element.addEventListener(realType, realListener, false);
              } else if (element.attachEvent) {
                  element.attachEvent('on' + realType, realListener);
              }
              lis[lis.length] = [element, type, listener, realListener, realType];
              return element;
          };
          baidu.on = baidu.event.on;

          /**
           * 为目标元素移除事件监听器
           * @name baidu.event.un
           * @function
           * @grammar baidu.event.un(element, type, listener)
           * @param {HTMLElement|string|window} element 目标元素或目标元素id
           * @param {string} type 事件类型
           * @param {Function} listener 需要移除的监听器
           * @shortcut un
           * @meta standard
           * @see baidu.event.on
           *             
           * @returns {HTMLElement|window} 目标元素
           */
          baidu.event.un = function (element, type, listener) {
              element = baidu.dom._g(element);
              type = type.replace(/^on/i, '').toLowerCase();

              var lis = baidu.event._listeners,
                  len = lis.length,
                  isRemoveAll = !listener,
                  item, realType, realListener;
              while (len--) {
                  item = lis[len];
                  if (item[1] === type && item[0] === element && (isRemoveAll || item[2] === listener)) {
                      realType = item[4];
                      realListener = item[3];
                      if (element.removeEventListener) {
                          element.removeEventListener(realType, realListener, false);
                      } else if (element.detachEvent) {
                          element.detachEvent('on' + realType, realListener);
                      }
                      lis.splice(len, 1);
                  }
              }

              return element;
          };
          baidu.un = baidu.event.un;

          /**
           * 阻止事件的默认行为
           * @name baidu.event.preventDefault
           * @function
           * @grammar baidu.event.preventDefault(event)
           * @param {Event} event 事件对象
           * @meta standard
           */
          baidu.preventDefault = baidu.event.preventDefault = function (event) {
              if (event.preventDefault) {
                  event.preventDefault();
              } else {
                  event.returnValue = false;
              }
          };


          /** 
           * @exports RichMarker as BMapLib.RichMarker 
           */
          var RichMarker =
          /**
           * RichMarker类的构造函数
           * @class 富Marker定义类，实现丰富的Marker展现效果。
           * 
           * @constructor
           * @param {String | HTMLElement} content 用户自定义的Marker内容，可以是字符串，也可以是dom节点
           * @param {BMap.Point} position marker的位置
           * @param {Json} RichMarkerOptions 可选的输入参数，非必填项。可输入选项包括：<br />
           * {"<b>anchor</b>" : {BMap.Size} Marker的的位置偏移值,
           * <br />"<b>enableDragging</b>" : {Boolean} 是否启用拖拽，默认为false}
           *
           * @example <b>参考示例：</b>
           * var map = new BMap.Map("container");
           * map.centerAndZoom(new BMap.Point(116.309965, 40.058333), 17);
           * var htm = "&lt;div style='background:#E7F0F5;color:#0082CB;border:1px solid #333'&gt;"
           *              +     "欢迎使用百度地图！"
           *              +     "&lt;img src='http://map.baidu.com/img/logo-map.gif' border='0' /&gt;"
           *              + "&lt;/div&gt;";
           * var point = new BMap.Point(116.30816, 40.056863);
           * var myRichMarkerObject = new BMapLib.RichMarker(htm, point, {"anchor": new BMap.Size(-72, -84), "enableDragging": true});
           * map.addOverlay(myRichMarkerObject);
           */
          BMapLib.RichMarker = function (content, position, opts) {
              if (!content || !position || !(position instanceof BMap.Point)) {
                  return;
              }

              /**
               * map对象
               * @private
               * @type {Map}
               */
              this._map = null;

              /**
               * Marker内容
               * @private
               * @type {String | HTMLElement}
               */
              this._content = content;

              /**
               * marker显示位置
               * @private
               * @type {BMap.Point}
               */
              this._position = position;

              /**
               * marker主容器
               * @private
               * @type {HTMLElement}
               */
              this._container = null;

              /**
               * marker主容器的尺寸
               * @private
               * @type {BMap.Size}
               */
              this._size = null;

              opts = opts || {};
              /**
               * _opts是默认参数赋值。
               * 下面通过用户输入的opts，对默认参数赋值
               * @private
               * @type {Json}
               */
              this._opts = baidu.extend(
              baidu.extend(this._opts || {}, {

                  /**
                   * Marker是否可以拖拽
                   * @private
                   * @type {Boolean}
                   */
                  enableDragging: false,

                  /**
                   * Marker的偏移量
                   * @private
                   * @type {BMap.Size}
                   */
                  anchor: new BMap.Size(0, 0)
              }), opts);
          }

          // 继承覆盖物类
          RichMarker.prototype = new BMap.Overlay();

          /**
           * 初始化，实现自定义覆盖物的initialize方法
           * 主要生成Marker的主容器，填充自定义的内容，并附加事件
           * 
           * @private
           * @param {BMap} map map实例对象
           * @return {Dom} 返回自定义生成的dom节点
           */
          RichMarker.prototype.initialize = function (map) {
              var me = this,
                  div = me._container = document.createElement("div");
              me._map = map;
              baidu.extend(div.style, {
                  position: "absolute",
                  zIndex: BMap.Overlay.getZIndex(me._position.lat),
                  background: "#FFF",
                  cursor: "pointer"
              });
              map.getPanes().labelPane.appendChild(div);

              // 给主容器添加上用户自定义的内容
              me._appendContent();
              // 给主容器添加事件处理
              me._setEventDispath();
              // 获取主容器的高宽
              me._getContainerSize();

              return div;
          }

          /**
           * 为自定义的Marker设定显示位置，实现自定义覆盖物的draw方法
           * 
           * @private
           */
          RichMarker.prototype.draw = function () {
              var map = this._map,
                  anchor = this._opts.anchor,
                  pixel = map.pointToOverlayPixel(this._position);
              this._container.style.left = pixel.x + anchor.width + "px";
              this._container.style.top = pixel.y + anchor.height + "px";
          }

          /**
           * 设置Marker可以拖拽
           * @return 无返回值
           * 
           * @example <b>参考示例：</b>
           * myRichMarkerObject.enableDragging();
           */
          RichMarker.prototype.enableDragging = function () {
              this._opts.enableDragging = true;
          }

          /**
           * 设置Marker不能拖拽
           * @return 无返回值
           * 
           * @example <b>参考示例：</b>
           * myRichMarkerObject.disableDragging();
           */
          RichMarker.prototype.disableDragging = function () {
              this._opts.enableDragging = false;
          }

          /**
           * 获取Marker是否能被拖拽的状态
           * @return {Boolean} true为可以拖拽，false为不能被拖拽
           * 
           * @example <b>参考示例：</b>
           * myRichMarkerObject.isDraggable();
           */
          RichMarker.prototype.isDraggable = function () {
              return this._opts.enableDragging;
          }

          /**
           * 获取Marker的显示位置
           * @return {BMap.Point} 显示的位置
           * 
           * @example <b>参考示例：</b>
           * myRichMarkerObject.getPosition();
           */
          RichMarker.prototype.getPosition = function () {
              return this._position;
          }

          /**
           * 设置Marker的显示位置
           * @param {BMap.Point} position 需要设置的位置
           * @return 无返回值
           * 
           * @example <b>参考示例：</b>
           * myRichMarkerObject.setPosition(new BMap.Point(116.30816, 40.056863));
           */
          RichMarker.prototype.setPosition = function (position) {
              if (!position instanceof BMap.Point) {
                  return;
              }
              this._position = position;
              this.draw();
          }

          /**
           * 获取Marker的偏移量
           * @return {BMap.Size} Marker的偏移量
           * 
           * @example <b>参考示例：</b>
           * myRichMarkerObject.getAnchor();
           */
          RichMarker.prototype.getAnchor = function () {
              return this._opts.anchor;
          }

          /**
           * 设置Marker的偏移量
           * @param {BMap.Size} anchor 需要设置的偏移量
           * @return 无返回值
           * 
           * @example <b>参考示例：</b>
           * myRichMarkerObject.setAnchor(new BMap.Size(-72, -84));
           */
          RichMarker.prototype.setAnchor = function (anchor) {
              if (!anchor instanceof BMap.Size) {
                  return;
              }
              this._opts.anchor = anchor;
              this.draw();
          }

          /**
           * 添加用户的自定义的内容
           * 
           * @private
           * @return 无返回值
           */
          RichMarker.prototype._appendContent = function () {
              var content = this._content;
              // 用户输入的内容是字符串，需要转化成dom节点
              if (typeof content == "string") {
                  var div = document.createElement('DIV');
                  div.innerHTML = content;
                  if (div.childNodes.length == 1) {
                      content = (div.removeChild(div.firstChild));
                  } else {
                      var fragment = document.createDocumentFragment();
                      while (div.firstChild) {
                          fragment.appendChild(div.firstChild);
                      }
                      content = fragment;
                  }
              }
              this._container.innerHTML = "";
              this._container.appendChild(content);
          }

          /**
           * 获取Marker的内容
           * @return {String | HTMLElement} 当前内容
           * 
           * @example <b>参考示例：</b>
           * myRichMarkerObject.getContent();
           */
          RichMarker.prototype.getContent = function () {
              return this._content;
          }

          /**
           * 设置Marker的内容
           * @param {String | HTMLElement} content 需要设置的内容
           * @return 无返回值
           * 
           * @example <b>参考示例：</b>
           * var htm = "&lt;div style='background:#E7F0F5;color:#0082CB;border:1px solid #333'&gt;"
           *              +     "欢迎使用百度地图API！"
           *              +     "&lt;img src='http://map.baidu.com/img/logo-map.gif' border='0' /&gt;"
           *              + "&lt;/div&gt;";
           * myRichMarkerObject.setContent(htm);
           */
          RichMarker.prototype.setContent = function (content) {
              if (!content) {
                  return;
              }
              // 存储用户输入的Marker显示内容
              this._content = content;
              // 添加进主容器
              this._appendContent();
          }

          /**
           * 获取Marker的高宽
           * 
           * @private
           * @return {BMap.Size} 当前高宽
           */
          RichMarker.prototype._getContainerSize = function () {
              if (!this._container) {
                  return;
              }
              var h = this._container.offsetHeight;
              var w = this._container.offsetWidth;
              this._size = new BMap.Size(w, h);
          }

          /**
           * 获取Marker的宽度
           * @return {Number} 当前宽度
           * 
           * @example <b>参考示例：</b>
           * myRichMarkerObject.getWidth();
           */
          RichMarker.prototype.getWidth = function () {
              if (!this._size) {
                  return;
              }
              return this._size.width;
          }

          /**
           * 设置Marker的宽度
           * @param {Number} width 需要设置的宽度
           * @return 无返回值
           * 
           * @example <b>参考示例：</b>
           * myRichMarkerObject.setWidth(300);
           */
          RichMarker.prototype.setWidth = function (width) {
              if (!this._container) {
                  return;
              }
              this._container.style.width = width + "px";
              this._getContainerSize();
          }

          /**
           * 获取Marker的高度
           * @return {Number} 当前高度
           * 
           * @example <b>参考示例：</b>
           * myRichMarkerObject.getHeight();
           */
          RichMarker.prototype.getHeight = function () {
              if (!this._size) {
                  return;
              }
              return this._size.height;
          }

          /**
           * 设置Marker的高度
           * @param {Number} height 需要设置的高度
           * @return 无返回值
           * 
           * @example <b>参考示例：</b>
           * myRichMarkerObject.setHeight(200);
           */
          RichMarker.prototype.setHeight = function (height) {
              if (!this._container) {
                  return;
              }
              this._container.style.height = height + "px";
              this._getContainerSize();
          }

          /**
           * 设置Marker的各种事件
           * 
           * @private
           * @return 无返回值
           */
          RichMarker.prototype._setEventDispath = function () {
              var me = this,
                  div = me._container,
                  isMouseDown = false,
                  // 鼠标是否按下，用以判断鼠标移动过程中的拖拽计算
                  startPosition = null; // 拖拽时，鼠标按下的初始位置，拖拽的辅助计算参数   

              // 通过e参数获取当前鼠标所在位置
              function _getPositionByEvent(e) {
                  var e = window.event || e,
                      x = e.pageX || e.clientX || 0,
                      y = e.pageY || e.clientY || 0,
                      pixel = new BMap.Pixel(x, y),
                      point = me._map.pixelToPoint(pixel);
                  return {
                      "pixel": pixel,
                      "point": point
                  };
              }

              // 单击事件
              baidu.on(div, "onclick", function (e) {
                  /**
                   * 点击Marker时，派发事件的接口
                   * @name RichMarker#onclick
                   * @event
                   * @param {Event Object} e 回调函数会返回event参数，包括以下返回值：
                   * <br />{"<b>target</b> : {BMap.Overlay} 触发事件的元素,
                   * <br />"<b>type</b>：{String} 事件类型}
                   *
                   * @example <b>参考示例：</b>
                   * myRichMarkerObject.addEventListener("onclick", function(e) { 
                   *     alert(e.type);  
                   * });
                   */
                  _dispatchEvent(me, "onclick");
                  _stopAndPrevent(e);
              });

              // 单击事件
              baidu.on(div, "ontouchend", function (e) {
                  /**
                   * 点击Marker时，派发事件的接口
                   * @name RichMarker#onclick
                   * @event
                   * @param {Event Object} e 回调函数会返回event参数，包括以下返回值：
                   * <br />{"<b>target</b> : {BMap.Overlay} 触发事件的元素,
                   * <br />"<b>type</b>：{String} 事件类型}
                   *
                   * @example <b>参考示例：</b>
                   * myRichMarkerObject.addEventListener("onclick", function(e) { 
                   *     alert(e.type);  
                   * });
                   */
                  _dispatchEvent(me, "ontouchend");
                  _dispatchEvent(me, "onclick");
                  _stopAndPrevent(e);
              });
              // 双击事件
              baidu.on(div, "ondblclick", function (e) {
                  var position = _getPositionByEvent(e);
                  /**
                   * 双击Marker时，派发事件的接口
                   * @name RichMarker#ondblclick
                   * @event
                   * @param {Event Object} e 回调函数会返回event参数，包括以下返回值：
                   * <br />{"<b>target</b> : {BMap.Overlay} 触发事件的元素,
                   * <br />"<b>type</b>：{String} 事件类型,
                   * <br />"<b>point</b>：{BMap.Point} 鼠标的物理坐标,
                   * <br />"<b>pixel</b>：{BMap.Pixel} 鼠标的像素坐标}
                   *
                   * @example <b>参考示例：</b>
                   * myRichMarkerObject.addEventListener("ondblclick", function(e) { 
                   *     alert(e.type);  
                   * });
                   */
                  _dispatchEvent(me, "ondblclick", {
                      "point": position.point,
                      "pixel": position.pixel
                  });
                  _stopAndPrevent(e);
              });

              // 鼠标移上事件
              div.onmouseover = function (e) {
                  var position = _getPositionByEvent(e);
                  /**
                   * 鼠标移到Marker上时，派发事件的接口
                   * @name RichMarker#onmouseover
                   * @event
                   * @param {Event Object} e 回调函数会返回event参数，包括以下返回值：
                   * <br />{"<b>target</b> : {BMap.Overlay} 触发事件的元素,
                   * <br />"<b>type</b>：{String} 事件类型,
                   * <br />"<b>point</b>：{BMap.Point} 鼠标的物理坐标,
                   * <br />"<b>pixel</b>：{BMap.Pixel} 鼠标的像素坐标}
                   *
                   * @example <b>参考示例：</b>
                   * myRichMarkerObject.addEventListener("onmouseover", function(e) { 
                   *     alert(e.type);  
                   * });
                   */
                  _dispatchEvent(me, "onmouseover", {
                      "point": position.point,
                      "pixel": position.pixel
                  });
                  _stopAndPrevent(e);
              }

              // 鼠标移出事件
              div.onmouseout = function (e) {
                  var position = _getPositionByEvent(e);
                  /**
                   * 鼠标移出Marker时，派发事件的接口
                   * @name RichMarker#onmouseout
                   * @event
                   * @param {Event Object} e 回调函数会返回event参数，包括以下返回值：
                   * <br />{"<b>target</b> : {BMap.Overlay} 触发事件的元素,
                   * <br />"<b>type</b>：{String} 事件类型,
                   * <br />"<b>point</b>：{BMap.Point} 鼠标的物理坐标,
                   * <br />"<b>pixel</b>：{BMap.Pixel} 鼠标的像素坐标}
                   *
                   * @example <b>参考示例：</b>
                   * myRichMarkerObject.addEventListener("onmouseout", function(e) { 
                   *     alert(e.type);  
                   * });
                   */
                  _dispatchEvent(me, "onmouseout", {
                      "point": position.point,
                      "pixel": position.pixel
                  });
                  _stopAndPrevent(e);
              }

              // 鼠标弹起事件
              var mouseUpEvent = function (e) {
                  var position = _getPositionByEvent(e);
                  /**
                   * 在Marker上弹起鼠标时，派发事件的接口
                   * @name RichMarker#onmouseup
                   * @event
                   * @param {Event Object} e 回调函数会返回event参数，包括以下返回值：
                   * <br />{"<b>target</b> : {BMap.Overlay} 触发事件的元素,
                   * <br />"<b>type</b>：{String} 事件类型,
                   * <br />"<b>point</b>：{BMap.Point} 鼠标的物理坐标,
                   * <br />"<b>pixel</b>：{BMap.Pixel} 鼠标的像素坐标}
                   *
                   * @example <b>参考示例：</b>
                   * myRichMarkerObject.addEventListener("onmouseup", function(e) { 
                   *     alert(e.type);  
                   * });
                   */
                  _dispatchEvent(me, "onmouseup", {
                      "point": position.point,
                      "pixel": position.pixel
                  });

                  if (me._container.releaseCapture) {
                      baidu.un(div, "onmousemove", mouseMoveEvent);
                      baidu.un(div, "onmouseup", mouseUpEvent);
                  } else {
                      baidu.un(window, "onmousemove", mouseMoveEvent);
                      baidu.un(window, "onmouseup", mouseUpEvent);
                  }

                  // 判断是否需要进行拖拽事件的处理
                  if (!me._opts.enableDragging) {
                      _stopAndPrevent(e);
                      return;
                  }
                  // 拖拽结束时，释放鼠标捕获
                  me._container.releaseCapture && me._container.releaseCapture();
                  /**
                   * 拖拽Marker结束时，派发事件的接口
                   * @name RichMarker#ondragend
                   * @event
                   * @param {Event Object} e 回调函数会返回event参数，包括以下返回值：
                   * <br />{"<b>target</b> : {BMap.Overlay} 触发事件的元素,
                   * <br />"<b>type</b>：{String} 事件类型,
                   * <br />"<b>point</b>：{BMap.Point} 鼠标的物理坐标,
                   * <br />"<b>pixel</b>：{BMap.Pixel} 鼠标的像素坐标}
                   *
                   * @example <b>参考示例：</b>
                   * myRichMarkerObject.addEventListener("ondragend", function(e) { 
                   *     alert(e.type);  
                   * });
                   */
                  _dispatchEvent(me, "ondragend", {
                      "point": position.point,
                      "pixel": position.pixel
                  });
                  isMouseDown = false;
                  startPosition = null;
                  // 设置拖拽结束后的鼠标手型
                  me._setCursor("dragend");
                  // 拖拽过程中防止文字被选中
                  me._container.style['MozUserSelect'] = '';
                  me._container.style['KhtmlUserSelect'] = '';
                  me._container.style['WebkitUserSelect'] = '';
                  me._container['unselectable'] = 'off';
                  me._container['onselectstart'] = function () { };

                  _stopAndPrevent(e);
              }

              // 鼠标移动事件
              var mouseMoveEvent = function (e) {
                  // 判断是否需要进行拖拽事件的处理
                  if (!me._opts.enableDragging || !isMouseDown) {
                      return;
                  }
                  var position = _getPositionByEvent(e);

                  // 计算当前marker应该所在的位置
                  var startPixel = me._map.pointToPixel(me._position);
                  var x = position.pixel.x - startPosition.x + startPixel.x;
                  var y = position.pixel.y - startPosition.y + startPixel.y;

                  startPosition = position.pixel;
                  me._position = me._map.pixelToPoint(new BMap.Pixel(x, y));
                  me.draw();
                  // 设置拖拽过程中的鼠标手型
                  me._setCursor("dragging");
                  /**
                   * 拖拽Marker的过程中，派发事件的接口
                   * @name RichMarker#ondragging
                   * @event
                   * @param {Event Object} e 回调函数会返回event参数，包括以下返回值：
                   * <br />{"<b>target</b> : {BMap.Overlay} 触发事件的元素,
                   * <br />"<b>type</b>：{String} 事件类型,
                   * <br />"<b>point</b>：{BMap.Point} 鼠标的物理坐标,
                   * <br />"<b>pixel</b>：{BMap.Pixel} 鼠标的像素坐标}
                   *
                   * @example <b>参考示例：</b>
                   * myRichMarkerObject.addEventListener("ondragging", function(e) { 
                   *     alert(e.type);  
                   * });
                   */
                  _dispatchEvent(me, "ondragging", {
                      "point": position.point,
                      "pixel": position.pixel
                  });
                  _stopAndPrevent(e);
              }

              // 鼠标按下事件
              baidu.on(div, "onmousedown", function (e) {
                  var position = _getPositionByEvent(e);
                  /**
                   * 在Marker上按下鼠标时，派发事件的接口
                   * @name RichMarker#onmousedown
                   * @event
                   * @param {Event Object} e 回调函数会返回event参数，包括以下返回值：
                   * <br />{"<b>target</b> : {BMap.Overlay} 触发事件的元素,
                   * <br />"<b>type</b>：{String} 事件类型,
                   * <br />"<b>point</b>：{BMap.Point} 鼠标的物理坐标,
                   * <br />"<b>pixel</b>：{BMap.Pixel} 鼠标的像素坐标}
                   *
                   * @example <b>参考示例：</b>
                   * myRichMarkerObject.addEventListener("onmousedown", function(e) { 
                   *     alert(e.type);  
                   * });
                   */
                  _dispatchEvent(me, "onmousedown", {
                      "point": position.point,
                      "pixel": position.pixel
                  });

                  if (me._container.setCapture) {
                      baidu.on(div, "onmousemove", mouseMoveEvent);
                      baidu.on(div, "onmouseup", mouseUpEvent);
                  } else {
                      baidu.on(window, "onmousemove", mouseMoveEvent);
                      baidu.on(window, "onmouseup", mouseUpEvent);
                  }

                  // 判断是否需要进行拖拽事件的处理
                  if (!me._opts.enableDragging) {
                      _stopAndPrevent(e);
                      return;
                  }
                  startPosition = position.pixel;
                  /**
                   * 开始拖拽Marker时，派发事件的接口
                   * @name RichMarker#ondragstart
                   * @event
                   * @param {Event Object} e 回调函数会返回event参数，包括以下返回值：
                   * <br />{"<b>target</b> : {BMap.Overlay} 触发事件的元素,
                   * <br />"<b>type</b>：{String} 事件类型,
                   * <br />"<b>point</b>：{BMap.Point} 鼠标的物理坐标,
                   * <br />"<b>pixel</b>：{BMap.Pixel} 鼠标的像素坐标}
                   *
                   * @example <b>参考示例：</b>
                   * myRichMarkerObject.addEventListener("ondragstart", function(e) { 
                   *     alert(e.type);  
                   * });
                   */
                  _dispatchEvent(me, "ondragstart", {
                      "point": position.point,
                      "pixel": position.pixel
                  });
                  isMouseDown = true;
                  // 设置拖拽开始的鼠标手型
                  me._setCursor("dragstart");
                  // 拖拽开始时，设置鼠标捕获
                  me._container.setCapture && me._container.setCapture();
                  // 拖拽过程中防止文字被选中
                  me._container.style['MozUserSelect'] = 'none';
                  me._container.style['KhtmlUserSelect'] = 'none';
                  me._container.style['WebkitUserSelect'] = 'none';
                  me._container['unselectable'] = 'on';
                  me._container['onselectstart'] = function () {
                      return false;
                  };
                  _stopAndPrevent(e);
              });
          }

          /**
           * 设置拖拽过程中的手型
           *
           * @private 
           * @param {string} cursorType 需要设置的手型类型
           */
          RichMarker.prototype._setCursor = function (cursorType) {
              var cursor = '';
              var cursorStylies = {
                  "moz": {
                      "dragstart": "-moz-grab",
                      "dragging": "-moz-grabbing",
                      "dragend": "pointer"
                  },
                  "other": {
                      "dragstart": "move",
                      "dragging": "move",
                      "dragend": "pointer"
                  }
              };

              if (navigator.userAgent.indexOf('Gecko/') !== -1) {
                  cursor = cursorStylies.moz[cursorType];
              } else {
                  cursor = cursorStylies.other[cursorType];
              }

              if (this._container.style.cursor != cursor) {
                  this._container.style.cursor = cursor;
              }
          }

          /**
           * 删除Marker
           * 
           * @private
           * @return 无返回值
           */
          RichMarker.prototype.remove = function () {
              _dispatchEvent(this, "onremove");
              // 清除主容器上的事件绑定
              if (this._container) {
                  _purge(this._container);
              }
              // 删除主容器
              if (this._container && this._container.parentNode) {
                  this._container.parentNode.removeChild(this._container);
              }
          }

          /**
           * 集中派发事件函数
           *
           * @private
           * @param {Object} instance 派发事件的实例
           * @param {String} type 派发的事件名
           * @param {Json} opts 派发事件里添加的参数，可选
           */
          function _dispatchEvent(instance, type, opts) {
              type.indexOf("on") != 0 && (type = "on" + type);
              var event = new baidu.lang.Event(type);
              if (!!opts) {
                  for (var p in opts) {
                      event[p] = opts[p];
                  }
              }
              instance.dispatchEvent(event);
          }

          /**
           * 清理DOM事件，防止循环引用
           *
           * @type {DOM} dom 需要清理的dom对象
           */
          function _purge(dom) {
              if (!dom) {
                  return;
              }
              var attrs = dom.attributes,
                  name = "";
              if (attrs) {
                  for (var i = 0, n = attrs.length; i < n; i++) {
                      name = attrs[i].name;
                      if (typeof dom[name] === "function") {
                          dom[name] = null;
                      }
                  }
              }
              var child = dom.childnodes;
              if (child) {
                  for (var i = 0, n = child.length; i < n; i++) {
                      _purge(dom.childnodes[i]);
                  }
              }
          }

          /**
           * 停止事件冒泡传播
           *
           * @type {Event} e e对象
           */
          function _stopAndPrevent(e) {
              var e = window.event || e;
              e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;
              return baidu.preventDefault(e);
          }

          return RichMarker;

      }

      function _buildRichMarker(html, point, options) {
          var RichMarker = _getRichMarkerClass(window.BMap);
          return new RichMarker(html, point, options);
      }

      return {
          buildRichMarker: _buildRichMarker
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
        'childrenModule',
        'nearbyModule',
        'orderModule',
        'profileModule',
        'organizerModule',
        'messageModule',
        'parentModule',
        'childrenSettingModule',
        'teacherModule',
        'teacherSettingModule',
        'depositChildrenModule',
        'vipBuyModule',
        'vipRecordModule',
        'vipTipsModule',
        'commentModule',
        'exitModule',
        'photoModule',
        'MapModule',
        'eshopEntryModule',
        'estimateModule',
        'helpModule',
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
  angular.module('childrenModule', [
    'childrenCtrl',
    'childrenRouter',
    'childrenService'
  ]);

}());

(function() {
    "use strict";
    angular.module('childrenCtrl', [])
        .controller('childrenCtrl', function($scope, Constants,childrenService,AuthService,Session, StateService,$ionicModal, $ionicSlideBoxDelegate) {
            'ngInject';
            console.log("childrenCtrl");
            var vm = this;
            vm.activated = false;
            vm.parent={};
            vm.fingerprintLogs=[];
            vm.fingerprintLogSample=[];
            vm.messages=[];
            vm.simpleFilter='';
            vm.offset=0;
            vm.limit=30;
            vm.canLoadMore=true;
            $scope.$on('$ionicView.afterEnter', activate);

            function activate() {
                vm.activated = true;
                vm.version = Constants.buildID;
                //从微信获取家长的基本信息
                vm.getWechatInfo(AuthService.getWechatId());
                //vm.parent.wechat={
                //    "nickname": "Band",
                //    "sex": 1,
                //    "language": "zh_CN",
                //    "city": "广州",
                //    "province": "广东",
                //    "country": "中国",
                //    "headimgurl":  "http://wx.qlogo.cn/mmopen/g3MonUZtNHkdmzicIlibx6iaFqAc56vxLSUfpb6n5WKSYVY0ChQKkiaJSgQ1dZuTOgvLLrhJbERQQ4eMsv84eavHiaiceqxibJxCfHe/0"
                //};
                vm.getChildrenInfo(AuthService.getLoginID(),vm.offset,vm.limit);

                vm.getChildren();
            };

            vm.doRefresh = function(offset){
                vm.getChildrenInfo(AuthService.getLoginID(),offset,vm.limit);
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

  angular.module('childrenRouter', [])
    .config(myRouter);


  function myRouter($stateProvider, $urlRouterProvider) {
    'ngInject';
    $stateProvider
      .state('tabs.children', {
        url: "/children",
          views: {
            'tab-children': {
              templateUrl: 'children/children.html',
              controller: 'childrenCtrl',
              controllerAs: 'vm'
            }
          }
      })
      .state('tabs.childrenSignIn', {
        url: "/childrenSignIn",
        views: {
          'tab-children': {
            templateUrl: 'children/childrenSignIn.html',
            controller: 'childrenCtrl',
            controllerAs: 'vm'
          }
        }
      });
  }
}());

(function() {
  'use strict';

  angular.module('childrenService', [])
    .factory('childrenService', childrenService);

  function childrenService( $q, $http,Constants,ResultHandler) {
    'ngInject';
    var service = {
      getMsg:getMsg,
      getChildrenMsg:getChildrenMsg,
      getChildren:getChildren,
      getChildSignIn:getChildSignIn,
      getChildrenSignIn:getChildrenSignIn,
      getWechatInfo:getWechatInfo,
      getChildrenAllInfo:getChildrenAllInfo
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

    function getChildrenAllInfo(parentId,offset,count){
        var url = Constants.serverUrl + 'parent/childrenInformation/fetch/'+parentId+'?offset='+offset+'&limitcount='+count;
        return $http.get(url).then(ResultHandler.successedFuc, ResultHandler.failedFuc);
    }

    function getWechatInfo(wid) {
        var url = Constants.serverUrl + 'wechat/'+wid;
        return $http.get(url).then(ResultHandler.successedFuc, ResultHandler.failedFuc);
    };

    return service;


  }


}());

(function() {
    "use strict";
    angular.module('childrenAddCtrl', [])
        .controller('childrenAddCtrl', function($scope, $stateParams, Constants, StateService, childrenSettingService, AuthService) {
            'ngInject';
            var vm = this;
            vm.activated = false;
            vm.page = 1;
            vm.child = {
                "name": "",
                "sex": "1",
                "remark": "",
                "birthday": "",
                "relationship": "",
                "guardian1": "",
                "guardianPhone1": "",
                "guardianWorkplace1": "",
                "guardian2": "",
                "guardianPhone2": "",
                "guardianWorkplace2": "",
                "homeAddr": "",
                "allergyRemark": "",
                "allergy": "0",
                "favoriteFood": "",
                "grade": "",
                "schoolName": "",
                "classTeacherPhone": ""
            };//{sex:'1'};
            $scope.$on('$ionicView.afterEnter', activate);

            function activate() {
                //console.log($stateParams);
                //vm.cid = $stateParams.cid;
                ////0:query 1:create 2:update
                //vm.type = $stateParams.type;
                //if(vm.type=='0')vm.isEditing = false;
                //else vm.isEditing = true;

                vm.activated = true;
                vm.version = Constants.buildID;

            }

            vm.back=function(){
                StateService.back();
            };

            vm.next=function(){
                if(vm.page==5){
                    //save data
                    //alert('尚未开放');
                    console.log(vm.child.birthday);
                    var date=new Date();
                    console.log(vm.child.birthday.getTime());

                    childrenSettingService.registerChild(vm.child, AuthService.getLoginID()).then(function (data) {
                        console.log(data);
                        if (data.errno == 0) {
                            //var userId = data.data.uid;
                            //wxlogin(vm.user.wechat);
                            StateService.back();
                        }
                    });
                }else{
                    vm.page++;
                }
            };

            vm.prev=function(){
                if(vm.page==1){
                    // it is the first,no prev
                }else{
                    vm.page--;
                }
            };
        });
}());

(function() {
    "use strict";
    angular.module('childrenEditCtrl', [])
        .controller('childrenEditCtrl', function($scope, $stateParams,$filter, Constants, StateService,childrenSettingService,AuthService,Session,MessageToaster) {
            'ngInject';
            var vm = this;
            vm.activated = false;

            vm.query = function(id){
                console.log("child id = "+id);
                vm.child=Session.getData('temp');
                childrenSettingService.queryChild(id).then(function(data) {
                    if (data.errno == 0) {
                        console.log(data.data);

                        //日期格式字符串转日期
                        data.data.Birthday =data.data.Birthday && new Date(data.data.Birthday);
                        vm.child = data.data;
                    }
                });

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
                else {
                    vm.child = {
                        "Name": "",
                        "Sex": "",
                        "Remark": "",
                        "Birthday": "",
                        "Guardian1": "",
                        "Guardianphone1": "",
                        "Guardianworkplace1": "",
                        "Guardian2": "",
                        "Guardianphone2": "",
                        "Guardianworkplace2": "",
                        "HomeAddr": "",
                        "AllergyRemark": "",
                        "Allergy": "",
                        "FavoriteFood": "",
                        "Grade": "",
                        "SchoolName": "",
                        "ClassTeacherPhone": "",
                        "Course": "",
                        "OpenTime": "",
                        "DepositCardID": "",
                        "DepositType": "",
                        "Benefit": ""
                    };
                }
            }

            vm.back=function(){
                StateService.back();
            };

            vm.save=function(valid,dirty){
                //console.log("valid = "+valid+" dirty = "+dirty);
                if (valid && dirty) {

                    //日期转为日期格式字符串
                    vm.child.Birthday = vm.child.Birthday && $filter('date')(vm.child.Birthday, "yyyy-MM-dd hh:mm");

                    //save
                    if (vm.type == '1') {
                        //create
                        childrenSettingService.registerChild(vm.child, AuthService.getLoginID()).then(function (data) {
                            if (data.errno == 0) {
                                //var userId = data.data.uid;
                                //wxlogin(vm.user.wechat);
                                StateService.back();
                            }
                        });
                    } else {
                        //update
                        childrenSettingService.updateChild(vm.child).then(function (data) {
                            console.log(data);
                            if (data.errno == 0) {
                                StateService.back();
                            }
                        });
                    }
                }else{
                    if(!valid){
                        MessageToaster.info("内容不全，无法更新");
                    }else if(!dirty) {
                        MessageToaster.info("无内容修改，无需更新");
                    }
                }
            };


        });
}());

(function() {
  "use strict";
  angular.module('childrenSettingModule', [
    'childrenSettingCtrl',
    'childrenEditCtrl',
    'childrenAddCtrl',
    'childrenSettingRouter',
    'childrenSettingService'
  ]);

}());

(function() {
    "use strict";
    angular.module('childrenSettingCtrl', [])
        .controller('childrenSettingCtrl', function($scope,Constants,StateService,$ionicListDelegate,$ionicPopup,AuthService,parentService,Session,childrenSettingService) {
            'ngInject';
            var vm = this;
            vm.activated = false;
            $scope.$on('$ionicView.afterEnter', activate);

            function activate() {
                vm.activated = true;
                vm.version = Constants.buildID;
                vm.getChildren();
            }

            vm.getChildren = function(){
                parentService.queryChildren(AuthService.getLoginID()).then(function(data) {
                    if (data.errno == 0) {
                        console.log(data.data);
                        vm.children = data.data;
                    }
                });
            };

            vm.back=function(){
                StateService.back();
            };

            vm.goTo=function(id,child){
                //查看孩子信息
                $ionicListDelegate.closeOptionButtons();
                Session.setData('temp',child);
                StateService.go('childrenEdit',{cid:id,type:0});
            };

            vm.newChild=function(){
                //创建新的孩子信息
                $ionicListDelegate.closeOptionButtons();
                StateService.go('childrenEdit',{type:1});
            };

            vm.newChild2=function(){
                //创建新的孩子信息,使用新局部编写界面
                $ionicListDelegate.closeOptionButtons();
                StateService.go('childrenAdd');
            };

            vm.editChild=function(id,child){
                //编辑孩子信息
                $ionicListDelegate.closeOptionButtons();
                Session.setData('temp',child);
                StateService.go('childrenEdit',{cid:id,type:2});
            };

            vm.delChild=function(child){
                //删除孩子信息
                $ionicListDelegate.closeOptionButtons();

                var confirmPopup = $ionicPopup.confirm({
                    title: '确定要删除此孩子:'+child.name,
                    buttons: [
                        {text: '取消', type: 'button-positive'},
                        {text: '确定', type: 'button-assertive',onTap: function(e) { return true}}
                    ]
                });
                confirmPopup.then(function(result) {
                    if(result) {
                        console.log('confirm to del this child '+child.uid);
                        //delete(id);
                        childrenSettingService.deleteChild(child.uid).then(function(data) {
                            console.log(data);
                            if (data.errno == 0) {
                                console.log(data.data);
                              
                            }
                        });
                    } else {
                        console.log('cancel delete');
                    }
                });
            };
        });
}());

(function() {
  'use strict';

  angular.module('childrenSettingRouter', [])
    .config(myRouter);


  function myRouter($stateProvider, $urlRouterProvider) {
    'ngInject';
    $stateProvider
      .state('childrenSetting', {
        url: "/childrenSetting",
        templateUrl: 'childrenSetting/childrenSetting.html',
        controller: 'childrenSettingCtrl',
        controllerAs: 'vm'
      })
      .state('childrenAdd', {
        url: "/childrenAdd",
        templateUrl: 'childrenSetting/childrenAdd.html',
        controller: 'childrenAddCtrl',
        controllerAs: 'vm'
      })
      .state('childrenEdit', {
        url: "/childrenEdit?:cid&:type",
        params: {
          cid : null,
          type : '0'
        },
        templateUrl: 'childrenSetting/childrenEdit.html',
        controller: 'childrenEditCtrl',
        controllerAs: 'vm'
      })
    ;
  }
}());

(function() {
  'use strict';

  angular.module('childrenSettingService', [])
    .factory('childrenSettingService', childrenSettingService);

  function childrenSettingService( $q, $http, Constants, ResultHandler) {
    'ngInject';
    var service = {
      queryChild:queryChild,
      updateChild:updateChild,
      deleteChild:deleteChild,
      registerChild:registerChild
    };

    //POST
    //URL: /api/v1/account/register/children
    //Request Body:
    //{
    //  "name":"小强",
    //    "sex":1,
    //    "fingerfeature":"value"
    //}
    //Response Body:
    //{
    //  "errno":0,
    //    "error":"",
    //    "data":{
    //      "uid":40000001
    //    }
    //}
    //need token in headers
    // "name", "sex", "fingerfeature", "remark", "grade", "birthday", "homeaddr", "allergy", "allergyremark","favoritefood",
    //"guardian1","guardianphone1","guardianworkplace1", "guardian2", "guardianphone2", "guardianworkplace2", "schoolname", "classteacherphone",
    //    "course","opentime", "depositcardid", "deposittype", "benefit
    function registerChild(child,parentId) {
      var time=child.birthday.toISOString().slice(0, 19).replace('T', ' ');
      var data = {
        "p_uid":parentId,
        "name": child.name,
        "sex": child.sex,
        "relationship": child.relationship,
        "remark": child.remark,
        "birthday":time,
        "guardian1":child.guardian1,
        "guardianphone1":child.guardianPhone1,
        "guardianworkplace1":child.guardianWorkplace1,
        "guardian2":child.guardian2,
        "guardianphone2":child.guardianPhone2,
        "guardianworkplace2":child.guardianWorkplace2,
        "homeaddr":child.homeAddr,
        "allergyremark":child.allergyRemark,
        "allergy":child.allergy,
        "favoritefood":child.favoriteFood,
        "grade":child.grade,
        "schoolname":child.schoolName,
        "classteacherphone":child.classTeacherPhone
      };
      console.log(JSON.stringify(data));
      var url = Constants.serverUrl + 'account/register/children';
      return $http({
        method: 'post',
        url: url,
        data: data
      }).then(ResultHandler.successedFuc, ResultHandler.failedFuc);
    };

    //http://172.18.1.166/api/v1/account/children/update/40000015     POST 更新孩子信息
    function updateChild(child) {
      var data = {
        "name": child.Name,
        "sex": child.Sex,
        "remark": child.Remark!=null?child.Remark:"",
        "birthday":child.Birthday!=null?child.Birthday:"",
        "guardian1":child.Guardian1!=null?child.Guardian1:"",
        "guardianphone1":child.GuardianPhone1!=null?child.GuardianPhone1:"",
        "guardianworkplace1":child.GuardianWorkplace1!=null?child.GuardianWorkplace1:"",
        "guardian2":child.Guardian2!=null?child.Guardian2:"",
        "guardianphone2":child.GuardianPhone2!=null?child.GuardianPhone2:"",
        "guardianworkplace2":child.GuardianWorkplace2!=null?child.GuardianWorkplace2:"",
        "homeaddr":child.HomeAddr!=null?child.HomeAddr:"",
        "allergyremark":child.AllergyRemark!=null?child.AllergyRemark:"",
        "allergy":child.Allergy!=null?child.Allergy:"0",
        "favoritefood":child.FavoriteFood!=null?child.FavoriteFood:"",
        "grade":child.Grade!=null?child.Grade:"0",
        "schoolname":child.SchoolName!=null?child.SchoolName:"",
        "classteacherphone":child.ClassTeacherPhone!=null?child.ClassTeacherPhone:"",
        "course":child.Course!=null?child.Course:"",
        "opentime":child.OpenTime!=null?child.OpenTime:"",
        "depositcardid":child.DepositCardID!=null?child.DepositCardID:"",
        "deposittype":child.DepositType!=null?child.DepositType:"0",
        "benefit":child.Benefit!=null?child.Benefit:"0"
      };
      console.log(JSON.stringify(data));
      var url = Constants.serverUrl + 'account/children/update/'+child.AccountID;
      return $http({
        method: 'post',
        url: url,
        data: data
      }).then(ResultHandler.successedFuc, ResultHandler.failedFuc);
    };

    //http://172.18.1.166/api/v1/account/children/query/40000015    GET 获取孩子信息
    function queryChild(childId) {
      var url = Constants.serverUrl + 'account/children/query/'+childId;
      return $http.get(url).then(ResultHandler.successedFuc, ResultHandler.failedFuc);
    };

    function deleteChild(childId) {
      var url = Constants.serverUrl + 'account/children/delete/'+childId;
      return $http.get(url).then(ResultHandler.successedFuc, ResultHandler.failedFuc);
    };

    return service;


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

(function () {
    "use strict";
    angular.module('childrenSteamCtrl', [])
        .controller('childrenSteamCtrl', function ($scope, $ionicPopup, $sce,$stateParams, Constants, childrenService, childrenSteamService, AuthService, Session, StateService, $ionicModal, $ionicSlideBoxDelegate) {
            'ngInject';
            console.log("childrenSteamCtrl");
            var vm = this;
            vm.activated = false;
            vm.parent = {};
            vm.deposits = {};
            vm.fingerprintLogs = [];
            vm.messages = [];
            vm.cameras = [];
            vm.unPaid = false,
            vm.myComment;
            vm.simpleFilter = '';
            vm.offset = [0, 0, 0];
            vm.limit = 30;
            vm.error = '';
            vm.canLoadMore = true;
            $scope.$on('$ionicView.afterEnter', activate);
            vm.steam = 0;
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

                //如果是通知消息进来，直接根据通知消息参数打开指定页面
                var index = $stateParams.index;;
                vm.steam =index || Session.getData('steam');
                if (vm.steam === null) {
                    vm.steam = 1;
                    console.log('steam = ' + vm.steam);
                }

                //转为数字
                vm.steam = parseInt(vm.steam);


                vm.changeSteam(vm.steam);
            };

            vm.changeSteam = function (index) {
                vm.steam = index;
                Session.setData('steam', index);
                vm.canLoadMore = true;
                if (index === 0) {
                    vm.showCamera = true;
                    vm.showFingerPrint = false;
                    vm.showNotificatin = false;
                    if (vm.cameras.length === 0) vm.getCamera();
                } else if (index === 1) {
                    vm.showCamera = false;
                    vm.showFingerPrint = true;
                    vm.showNotificatin = false;
                    console.log('fingerprintLogs = ' + vm.fingerprintLogs);
                    if (vm.fingerprintLogs.length === 0) vm.getFingerPrint(0, vm.limit);
                } else if (index === 2) {
                    vm.showCamera = false;
                    vm.showFingerPrint = false;
                    vm.showNotificatin = true;
                    if (vm.messages.length === 0) vm.getMessage(0, vm.limit);
                }
            };

            vm.watchVideo = function (video, name) {
                video.deposit_name = name;
                Session.setData('video', JSON.stringify(video));
                StateService.go('video');
            };

            vm.getChildrenDeposit = function () {
                childrenSteamService.getChildrenDeposit(AuthService.getLoginID()).then(function (data) {
                    if (data.errno == 0) {
                        console.log(data.data);
                        vm.deposits = data.data;
                    }else {
                        vm.unPaid = true;
                        vm.error = data.error;
                    }
                });
            };

            vm.getCamera = function () {
              console.log("getCamera "+ vm.steam);
                var count = 1,
                    depositsCount = vm.deposits.length;
                vm.canLoadMore = false;
                vm.cameras = [];
                if(typeof(depositsCount) == "undefined"){
                    console.log("Camera = "+ depositsCount);
                    vm.canLoadMore = false;
                    $scope.$broadcast('scroll.refreshComplete');
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                }
                //获取摄像头信息
                for (var i = 0; i < depositsCount; i++) {
                    var id = vm.deposits[i].DepositID;
                    //get camera
                    if (id != null) {
                        //console.log('http://v.zxing-tech.cn/?v='+id);
                        //vm.cameraSrc = $sce.trustAsResourceUrl('http://v.zxing-tech.cn/?v='+id);
                        childrenSteamService.getCamera(id).then(function (data) {
                            //if(data.data.length<vm.limit){vm.canLoadMore = false;}
                            vm.cameras[vm.cameras.length] = data.data;

                            if (data.errno === 16005) {
                                vm.unPaid = true;

                            }

                            count += 1;
                            if (count === depositsCount) {
                                $scope.$broadcast('scroll.refreshComplete');
                                $scope.$broadcast('scroll.infiniteScrollComplete');
                            }

                        }, function (e) {
                            count += 1;
                            if (count === depositsCount) {
                                $scope.$broadcast('scroll.refreshComplete');
                                $scope.$broadcast('scroll.infiniteScrollComplete');
                            }
                        });
                    }
                }
            };

            vm.getFingerPrint = function (offset, limit) {
                console.log("getFingerPrint");
                childrenSteamService.getAllChildrenSignIn(AuthService.getLoginID(), offset, limit).then(function (data) {
                    if (data.errno == 0) {
                        console.log(data.data);
                        if(offset==0)vm.fingerprintLogs=[];
                        if (vm.fingerprintLogs.length == 0)
                            vm.fingerprintLogs = data.data;
                        else
                            vm.fingerprintLogs = vm.fingerprintLogs.concat(data.data);
                        console.log(vm.fingerprintLogs);
                        vm.offset[1] += data.data.length;
                        if (data.data.length < vm.limit) {
                            console.log("it is the last data");
                            vm.canLoadMore = false;
                        } else {
                            vm.canLoadMore = true;
                        }
                    } else {
                        console.log(data);
                        if (data.errno === 16005) {
                            vm.unPaid = true;
                        }
                        vm.canLoadMore = false;
                    }

                    //始终隐藏加载更多面板
                    $scope.$broadcast('scroll.refreshComplete');
                    $scope.$broadcast('scroll.infiniteScrollComplete');

                }, function () {
                    //始终隐藏加载更多面板
                    vm.canLoadMore = false;
                    $scope.$broadcast('scroll.refreshComplete');
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                })
            };

            vm.getMessage = function (offset, limit) {
                console.log("getMessage");
                childrenSteamService.getAllChildrenMsg(AuthService.getLoginID(), offset, limit).then(function (data) {
                    if (data.errno == 0) {
                        console.log(data.data);
                        if(offset==0)vm.messages=[];
                        var start = 0;
                        if (vm.messages.length == 0)
                            vm.messages = data.data;
                        else {
                            start = vm.messages.length;
                            vm.messages = vm.messages.concat(data.data);
                        }
                        console.log(vm.messages);
                        //update comment
                        for (var i = 0; i < data.data.length; i++) {
                            //vm.messages[start+i]
                            childrenSteamService.getDailyComment(vm.messages[start + i].InfoID, start + i).then(function (sdata) {
                                if (data.errno == 0) {
                                    console.log("getDailyComment: ");
                                    console.log(sdata.data);
                                    var index = sdata.data.index;
                                    vm.messages[index].comments = sdata.data.comments;
                                    vm.messages[index].likes = sdata.data.likes;
                                }
                            });
                        }
                        vm.offset[2] += data.data.length;
                        if (data.data.length < vm.limit) {
                            console.log("it is the last data");
                            vm.canLoadMore = false;
                        } else {
                            vm.canLoadMore = true;
                        }
                        //$scope.$broadcast('scroll.refreshComplete');
                        //$scope.$broadcast('scroll.infiniteScrollComplete');
                    } else {
                        console.log(data);
                        if (data.errno == 16005) {
                            vm.unPaid = true;
                        }
                        vm.canLoadMore = false;
                    }

                    //始终隐藏加载更多面板
                    $scope.$broadcast('scroll.refreshComplete');
                    $scope.$broadcast('scroll.infiniteScrollComplete');

                }, function () {
                    //始终隐藏加载更多面板
                    $scope.$broadcast('scroll.refreshComplete');
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                });
            };

            vm.doRefresh = function (type, offset) {
              console.log(vm.steam +" - "+type+" = "+offset);
                if (vm.steam === 0) {
                    vm.getCamera();
                } else if (vm.steam === 1) {
                    vm.getFingerPrint(offset, vm.limit);
                } else if (vm.steam === 2) {
                    vm.getMessage(offset, vm.limit);
                }
            };

            vm.getChildrenInfo = function (pId, offset, limit) {
                childrenService.getChildrenAllInfo(pId, offset, limit).then(function (data) {
                    if (data.errno == 0) {
                        console.log("getChildrenAllInfo: ");
                        console.log(data.data);
                        if (vm.messages.length == 0)
                            vm.messages = data.data;
                        else
                            vm.messages = vm.messages.concat(data.data);
                        console.log(vm.messages);
                        vm.offset += data.data.length;
                        if (data.data.length < vm.limit) {
                            console.log("it is the last data");
                            vm.canLoadMore = false;
                        } else {
                            vm.canLoadMore = true;
                        }
                        $scope.$broadcast('scroll.refreshComplete');
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                    } else {
                        console.log(data);
                    }
                });
            };

            vm.getWechatInfo = function (wId) {
                console.log("wechat id : " + wId);
                childrenService.getWechatInfo(wId).then(function (data) {
                    if (data.errno == 0) {
                        console.log("wechat info: ");
                        console.log(data.data);
                        vm.parent.wechat = data.data;
                    }
                });
            };

            vm.getImg = function (type) {
                if (type == 1) {
                    return { name: "就餐", src: "img/dinner.png" };
                } else if (type == 2) {
                    return { name: "培训", src: "img/traning.png" };
                } else if (type == 3) {
                    return { name: "活动", src: "img/play.png" };
                } else if (type == 4) {
                    return { name: "作业", src: "img/homework.png" };
                } else if (type == 5) {
                    return { name: "接入", src: "img/login.png" };
                } else if (type == 6) {
                    return { name: "送到", src: "img/logout.png" };
                } else {
                    return { name: "未知信息类型", src: "img/unknown.png" };
                }
            };

            vm.goPhoto = function (msgIndex, index) {
                Session.setData('temp', vm.msg[msgIndex]);
                StateService.go("photo", { index: index });
            };

            vm.star = function () {
                console.log("add star");
            };

            vm.getDailyComments = function (infoid, index) {
                console.log("getDailyComments index = " + index);
                childrenSteamService.getDailyComment(infoid, index).then(function (sdata) {
                    if (sdata.errno == 0) {
                        console.log("getDailyComment: ");
                        console.log(sdata.data);
                        var sindex = sdata.data.index;
                        vm.messages[sindex].comments = sdata.data.comments;
                        vm.messages[sindex].likes = sdata.data.likes;
                    }
                });
            };

            vm.like = function (info, index) {
                //如果已经like，去like
                //没有like，加like
                console.log(info + " and index=" + index);
                var needAdd = true;
                for (var i = 0; i < info.likes.length; i++) {
                    if (info.likes[i].CommentBy == vm.user) {
                        //remove
                        needAdd = false;
                        childrenSteamService.delDailyComment(info.likes[i].CommentID).then(function (data) {
                            console.log('rmComment likes');
                            console.log(data);
                            vm.getDailyComments(info.InfoID, index);
                            return;
                        });
                    }
                }
                //add
                if (needAdd) {
                    var comment = { infoid: info.InfoID, commentby: vm.user, commentdata: null };
                    childrenSteamService.createDailyComment(comment).then(function (data) {
                        console.log('addComment likes');
                        console.log(data);
                        vm.getDailyComments(info.InfoID, index);
                        return;
                    });
                }
            };

            vm.comment = function (info, index) {
                console.log(info + " and index=" + index);
                vm.showPopup(info, index);
            };

            vm.rmComment = function (comment, index) {
                childrenSteamService.delDailyComment(comment.CommentID).then(function (data) {
                    console.log('rmComment');
                    console.log(data);
                    vm.getDailyComments(comment.InfoID, index);
                });
            };

            vm.showPopup = function (info, index) {
                var myPopup = $ionicPopup.show({
                    template: '<input type="edittext" ng-model="vm.myComment">',
                    title: '请输入评论内容',
                    scope: $scope,
                    buttons: [
                      { text: '取消' },
                      {
                          text: '<b>提交</b>',
                          type: 'button-positive',
                          onTap: function (e) {
                              if (!vm.myComment) {
                                  e.preventDefault();
                              } else {
                                  return vm.myComment;
                              }
                          }
                      }
                    ]
                });

                myPopup.then(function (res) {
                    console.log('Tapped!', res);
                    //add comment
                    if (res.length > 0) {
                        var comment = { infoid: info.InfoID, commentby: vm.user, commentdata: res };
                        childrenSteamService.createDailyComment(comment).then(function (data) {
                            console.log('addComment comments');
                            console.log(data);
                            vm.myComment = null;
                            vm.getDailyComments(info.InfoID, index);
                            return;
                        });
                    }
                });
            };

            vm.getChildren = function () {
                childrenService.getChildren(AuthService.getLoginID()).then(function (data) {
                    var title = "";
                    if (data.errno == 0) {
                        console.log(data.data);
                        vm.childs = data.data;
                        for (var i = 0; i < vm.childs.length; i++) {
                            if (i == vm.childs.length - 1)
                                title += (vm.childs[i].name + "的家长");
                            else
                                title += (vm.childs[i].name + ",");
                            //vm.getMsg(vm.childs[i].uid);
                            //vm.getChildSignIn(vm.childs[i].uid,vm.childs[i].name);
                        }
                        vm.parent.title = title;
                    }
                    //vm.fingerprintLogs.sort(function(a,b){return a.log-b.log});
                });
            };

            vm.change = function () {
                if (vm.simpleFilterSelect === '-1') {
                    vm.simpleFilter = "";
                } else if (vm.simpleFilterSelect === '0') {
                    vm.simpleFilter = { datatype: '2' };
                } else if (vm.simpleFilterSelect === '1') {
                    vm.simpleFilter = { datatype: '1', InfoType: '1' };
                } else if (vm.simpleFilterSelect === '2') {
                    vm.simpleFilter = { datatype: '1', InfoType: '2' };
                } else if (vm.simpleFilterSelect === '3') {
                    vm.simpleFilter = { datatype: '1', InfoType: '3' };
                } else if (vm.simpleFilterSelect === '4') {
                    vm.simpleFilter = { datatype: '1', InfoType: '4' };
                } else if (vm.simpleFilterSelect === '5') {
                    vm.simpleFilter = { datatype: '1', InfoType: '5' };
                } else if (vm.simpleFilterSelect === '6') {
                    vm.simpleFilter = { datatype: '1', InfoType: '6' };
                }
            };

            vm.getImages = function (msg) {
                vm.imgCount = 0;
                if (msg.PhotoLink1 != null && msg.PhotoLink1 != "") {
                    var data = { src: msg.PhotoLink1, msg: '' };
                    vm.images[vm.imgCount] = data;
                    vm.imgCount++;
                }
                if (msg.PhotoLink2 != null && msg.PhotoLink2 != "") {
                    var data = { src: msg.PhotoLink2, msg: '' };
                    vm.images[vm.imgCount] = data;
                    vm.imgCount++;
                }
                if (msg.PhotoLink3 != null && msg.PhotoLink3 != "") {
                    var data = { src: msg.PhotoLink3, msg: '' };
                    vm.images[vm.imgCount] = data;
                    vm.imgCount++;
                }
                if (msg.PhotoLink4 != null && msg.PhotoLink4 != "") {
                    var data = { src: msg.PhotoLink4, msg: '' };
                    vm.images[vm.imgCount] = data;
                    vm.imgCount++;
                }
                if (msg.PhotoLink5 != null && msg.PhotoLink5 != "") {
                    var data = { src: msg.PhotoLink5, msg: '' };
                    vm.images[vm.imgCount] = data;
                    vm.imgCount++;
                }
                if (msg.PhotoLink6 != null && msg.PhotoLink6 != "") {
                    var data = { src: msg.PhotoLink6, msg: '' };
                    vm.images[vm.imgCount] = data;
                    vm.imgCount++;
                }
                console.log(vm.images);
            };

            $ionicModal.fromTemplateUrl('message/image-modal.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                $scope.modal = modal;
            });

            $scope.openModal = function () {
                $ionicSlideBoxDelegate.slide(0);
                $scope.modal.show();
            };

            $scope.closeModal = function () {
                $scope.modal.hide();
            };

            // Cleanup the modal when we're done with it!
            $scope.$on('$destroy', function () {
                $scope.modal.remove();
            });
            // Execute action on hide modal
            $scope.$on('modal.hide', function () {
                // Execute action
            });
            // Execute action on remove modal
            $scope.$on('modal.removed', function () {
                // Execute action
            });
            $scope.$on('modal.shown', function () {
                console.log('Modal is shown!');
            });

            $scope.$on('scroll.refreshComplete', function () {
                console.log('scroll.refreshComplete is call!');
            });

            $scope.$on('scroll.infiniteScrollComplete', function () {
                console.log('scroll.infiniteScrollComplete is call!');
            });

            // Call this functions if you need to manually control the slides
            $scope.next = function () {
                $ionicSlideBoxDelegate.next();
            };

            $scope.previous = function () {
                $ionicSlideBoxDelegate.previous();
            };

            $scope.goToSlide = function (index, msg) {
                vm.images = [];
                vm.getImages(msg);
                $scope.modal.show();
                $ionicSlideBoxDelegate.slide(index);
            };

            // Called each time the slide changes
            $scope.slideChanged = function (index) {
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
          url: "/childrenSteam?:index",
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
  angular.module('depositChildrenModule', [
    'depositChildrenCtrl',
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

            vm.goTo=function(id,item){
                //查看孩子的更多家长信息列表
                StateService.go('teacherEdit',{cid:id,type:0});
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
      queryDepositChildren:queryDepositChildren
    };

    //'/deposit/children/:depositid',
    function queryDepositChildren(id) {
      var url = Constants.serverUrl + 'deposit/children/'+id;
      return $http.get(url).then(ResultHandler.successedFuc, ResultHandler.failedFuc);
    };

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
  angular.module('eshopEntryModule', [
    'eshopEntryRouter',
    'eshopEntryCtrl',
    'eshopService'
  ]);

}());

(function() {
    "use strict";
    angular.module('eshopEntryCtrl', [])
        .controller('eshopEntryCtrl', function($scope, $sce, Constants, $location, StateService) {
            'ngInject';
            window.location.href='./eshop/index.html';
            
            var vm = this;
            vm.activated = false;
            $scope.$on('$ionicView.afterEnter', activate);
            function activate() {
                vm.activated = true;
                vm.version = Constants.buildID;
                //vm.src = $sce.trustAsResourceUrl('./eshop/index.html');//iframe redirect
                //$location.path("myEShop/index.html");
                //$location.replace();
            }
        });
}());

(function() {
  'use strict';

  angular.module('eshopEntryRouter', [])
    .config(myRouter);


  function myRouter($stateProvider, $urlRouterProvider) {
    'ngInject';
    $stateProvider
      .state('tabs.eshop', {
        url: "/eshop",
          views: {
            'tab-eshop': {
              templateUrl: 'eshop/eshopEntry.html',
              controller: 'eshopEntryCtrl',
              controllerAs: 'vm'
            }
          }
      });
  }
}());

/**
 * 商城API服务
 */

angular.module('eshopService', [])
  .service('eshopService', function ($q, $http, $window, Constants) {

      /**
        * 注册
        * @param {*} userName 账号 
        * @param {*} password 密码 
        * @param {*} email    邮箱 
        */
      function _signup(userName, password, email) {
          var defer = $q.defer(),
           apiUrl = Constants.eshopApiUrl + 'ecapi.auth.default.signup';

          var singUpInfo = {
              username: userName,
              password: password,
              email: email
          };

          $http({
              method: 'POST',
              url: apiUrl,
              params: null,
              data: singUpInfo
          }).success(function (data) {
              if (!!data["error_code"] && data["error_code"] > 0) {
                  defer.reject(data["error_desc"]);
              } else {
                  $window.localStorage.setItem("eshop_auth", JSON.stringify(data));
                  defer.resolve(data);
              }
          }).error(function (err) {
              defer.reject(err);
          });

          return defer.promise;
      }

      /**
        * 登录
        * @param {*} userName 账号 
        * @param {*} password 密码 
        */
      function _signin(userName, password) {
          var defer = $q.defer(),
           apiUrl = Constants.eshopApiUrl + 'ecapi.auth.signin';

          var singInInfo = {
              username: userName,
              password: password,
          };

          $http({
              method: 'POST',
              url: apiUrl,
              params: null,
              data: singInInfo
          }).success(function (data) {
              if (!!data["error_code"] && data["error_code"] > 0) {
                  defer.reject(data["error_desc"]);
              } else {
                  $window.localStorage.setItem("eshop_auth", JSON.stringify(data));
                  defer.resolve(data);
              }
          }).error(function (err) {
              defer.reject(err);
          });

          return defer.promise;
      }



      /**
        * 更改密码
        * @param {*} oldPassword 账号 
        * @param {*} password 密码 
        */
      function _changePassword(oldPassword, password) {
          var defer = $q.defer(),
           apiUrl = Constants.eshopApiUrl + 'ecapi.user.password.update';

          var changePwdInfo = {
              old_password: oldPassword,
              password: password,
          };

          var header=null,
              authInfo = $window.localStorage.getItem("eshop_auth");
          if (!!authInfo) {
              authInfo = JSON.parse(authInfo);
              header={"X-ECAPI-Authorization":authInfo.token};
          }

          $http({
              method: 'POST',
              url: apiUrl,
              params: null,
              data: changePwdInfo,
              headers: header
          })
          .success(function (data) {
              if (!!data["error_code"] && data["error_code"] > 0) {
                  defer.reject(data["error_desc"]);
              } else {
                  defer.resolve();
              }
          }).error(function (err) {
              defer.reject(err);
          });

          return defer.promise;
      }

      /**
       * 注销
       */
      function _signout() {
          $window.localStorage.removeItem("eshop_auth");
      }

      return {
          signup: _signup,
          signin: _signin,
          changePassword: _changePassword,
          signout: _signout
      };
  });

(function() {
  "use strict";
  angular.module('estimateModule', [
    'estimateCtrl',
    'estimateDepositCtrl',
    'estimateRouter'
  ]);

}());

(function() {
    "use strict";
    angular.module('estimateCtrl', [])
        .controller('estimateCtrl', function($scope, Constants, StateService) {
            'ngInject';
            var vm = this;
            vm.activated = false;
            $scope.$on('$ionicView.afterEnter', activate);

            function activate() {
                vm.activated = true;
                vm.version = Constants.buildID;
            };

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
    angular.module('estimateDepositCtrl', [])
        .controller('estimateDepositCtrl', function($scope, Constants, StateService, BaiduService, AuthService, childrenSteamService, MessageToaster, $ionicModal) {
            'ngInject';
            var vm = this;
            vm.activated = false;

            $scope.$on('$ionicView.afterEnter', activate);
            function activate() {
                vm.activated = true;
                vm.version = Constants.buildID;
                vm.list=[];
                vm.getChildrenDeposit();
            };

            vm.getChildrenDeposit = function(){
              childrenSteamService.getChildrenDeposit(AuthService.getLoginID()).then(function(data) {
                  if (data.errno == 0) {
                      console.log(data.data);
                      var de=data.data;
                      for(var i=0;i<de.length;i++){
                        console.log(de[i]);
                        if(de[i].DepositID!=null){
                          BaiduService.getDepositInfoWithComments(de[i].DepositID).then(function (depositInfo) {
                              console.log(depositInfo);
                              depositInfo.show=false;
                              vm.list.push(depositInfo);
                          }, function (err) {
                              //ionicToast.show('获取机构详情信息失败!', 'middle', false, 3000);
                              //MessageToaster.error("获取机构详情信息失败!");
                          })
                        }
                      }
                  }
              });
            };

            vm.back=function(){
                StateService.back();
            };

            vm.gotoEdit=function(did){
              StateService.go('depositComment', {id: did,type:1});
            };
        });
}());

(function() {
  'use strict';

  angular.module('estimateRouter', [])
    .config(myRouter);


  function myRouter($stateProvider, $urlRouterProvider) {
    'ngInject';
    $stateProvider
        .state('estimate', {
          url: "/estimate",
          templateUrl: 'estimate/estimate.html',
          controller: 'estimateCtrl',
          controllerAs: 'vm'
        })
        .state('myEstimate', {
          url: "/myEstimate",
          templateUrl: 'estimate/myEstimateDeposit.html',
          controller: 'estimateDepositCtrl',
          controllerAs: 'vm'
        })
        .state('estimateDeposit', {
          url: "/estimateDeposit",
          templateUrl: 'estimate/estimateDeposit.html',
          controller: 'estimateDepositCtrl',
          controllerAs: 'vm'
        })
  }
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
                          StateService.clearAllAndGo("register");
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
        'resetPswCtrl',
        'LoginRouter',
        'LoginService'
    ])
}());

(function () {
    "use strict";
    angular.module('LoginCtrl', [])
        .controller('LoginCtrl', function (Constants, AuthService, MessageToaster, LoginService, $timeout, $scope, Session, $stateParams, StateService, $ionicModal, Role, $http, eshopService) {
            'ngInject';

            var vm = this;
            vm.isDev = Constants.ENVIRONMENT == 'dev' ? true : false;
            vm.type = '2';
            $scope.$on('$ionicView.beforeEnter', validate);
            //vm.user = { userId: 18603070911, password: "82267049" }
            function validate() {
                if (Session.getData('userId') && Session.getData('token') && Session.getData('userId') != '-1') {
                    //AuthService.setSession(response.data.uid, response.data.token, response.data.eshop, response.data.type);
                    $http.defaults.headers.common.token = Session.getData('token');
                    StateService.clearAllAndGo(AuthService.getNextPath());
                } else {
                    console.log("normal login");
                }
            }

            //WeuiModalLoading
            vm.login = function (user) {
                //test
                //AuthService.setSession('1', '123', '1');
                //StateService.go(AuthService.getNextPath());
                //test
                if (user) {
                    LoginService.login(user.userId, user.password).then(function (response) {
                        console.log(response);
                        if (response.errno == 0) {

                            AuthService.setSession(response.data.uid, response.data.token, response.data.eshop, response.data.type);
                            StateService.clearAllAndGo(AuthService.getNextPath());

                        } else {
                            //MessageToaster.error(response.error);
                            MessageToaster.error("帐号或密码不正确");
                        }
                    },
                    function (error) {
                        MessageToaster.error(error);
                    }).finally(function () {
                        //WeuiModalLoading.hide();
                    });
                } else {
                    MessageToaster.error("请输入正确账号密码");
                }
            }

            vm.reset = function(){
              StateService.go("resetPsw");
            }

            vm.visit = function () {
                AuthService.setSession('-1', '-1', '-1', '-1');
                StateService.clearAllAndGo(AuthService.getNextPath());
            }

            vm.register = function () {
                StateService.go("register", { type: vm.type });
              //  StateService.clearAllAndGo("register", { type: vm.type });
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
    })
    .state('resetPsw', {
      url: "/resetPsw",
      templateUrl: 'Login/resetPsw.html',
      controller: 'resetPswCtrl',
      controllerAs: 'vm'
    });
    ;
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

        function login(userId, password) {
            var data = {
                username: userId,
                password: password,
                type: 2
            };
            var url = Constants.serverUrl + 'parentLogin';
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

(function () {
    "use strict";
    angular.module('resetPswCtrl', [])
        .controller('resetPswCtrl', function (Constants, AuthService, MessageToaster, LoginService, $timeout, $scope, Session, $stateParams, StateService, $ionicModal, Role, $http, parentService) {
            'ngInject';

            var vm = this;
            $scope.$on('$ionicView.beforeEnter', validate);
            function validate() {
                vm.mobile = "";
            }

            vm.back = function () {
                StateService.back();
            }

            vm.reset = function () {
                if (vm.mobile != "") {
                parentService.resetPsw(vm.mobile).then(function(data) {
                    console.log(data);
                    if(data.errno==0){
                        StateService.back();
                        MessageToaster.info("请登录到你的邮箱查询你的新密码！");
                    }else{
                        if(data.errno==10009){
                            MessageToaster.error("该账号邮箱格式错误，请联系管理员！");
                        }else if(data.errno==10010){
                          MessageToaster.error("帐号未设置电子邮箱，无法重置密码！");
                        }else if(data.errno==10002){
                          MessageToaster.error("手机号未绑定任何账号！");
                        }else{
                          MessageToaster.error(data.error);
                        }
                    }
                });
              }else{
                MessageToaster.error("必须填写正确的手机号");
              }
            }
        });
}());

(function() {
    "use strict";
    angular.module('MapModule', [
        'MapCtrl',
        'MapRouter',
        'MapService'
    ])
}());

(function() {
    "use strict";
    angular.module('MapCtrl', [])
        .controller('MapCtrl', function($scope, $state, $stateParams,Constants, StateService, $ionicModal, $window,BaiduService) {
            'ngInject';
            var vm = this;
            vm.activated = false;
            $scope.$on('$ionicView.afterEnter', activate);
            $scope.mapOpts = {
                apiKey: 'IGp7UfrinXNxV6IwrQTC0PWoDCQlf0TR',
                center: {longitude:113.271,latitude:23.1353},
                keywords: ['午托','晚托','托管'],
                zoom: 16,
                onlyShowList:false,
                onMapLoadFailded: function () {
                    //ionicToast.show('地图加载失败!', 'middle', false, 3000)
                    console.log('地图加载失败');
                }
            };
            vm.type = $stateParams.type;
            vm.nav = $stateParams.nav;
            console.log("vm.type = "+vm.type+" vm.nav = "+vm.nav);
            if (vm.type == 1) {
                $scope.mapOpts.mode = 2;
               // $scope.mapOpts.onlyShowList = true;
            } 

            function activate() {
                vm.activated = true;
                vm.version = Constants.buildID;
            }

            vm.goTo = function(addr){
                console.log(addr);
                StateService.go(addr);
            };

            vm.back=function(){
                StateService.back();
            };
        });
}());

(function() {
  'use strict';

  angular.module('MapRouter', [])
    .config(MapRouter);


  function MapRouter($stateProvider,$urlRouterProvider) {
    'ngInject';
    $stateProvider
    .state('tabs.map', {
        url: "/map?:type",
      views: {
        'tab-map': {
          templateUrl: 'map/map.html',
          controller: 'MapCtrl',
          controllerAs: 'vm'
        }
      }
    })
    .state('orgmap', {
      url: "/orgmap?:type&:nav",
      templateUrl: 'map/map.html',
      params:{
        type:0,
        nav:false
      },
      controller: 'MapCtrl',
      controllerAs: 'vm'
    }).state('nearbyorgmap', {
        url: "/nearbyorgmap?:type&:nav",
        templateUrl: 'map/map.html',
        params: {
            type: 0,
            nav: false
        },
        controller: 'MapCtrl',
        controllerAs: 'vm'
    });

  }
}());

(function() {
  'use strict';

  angular.module('MapService', [])
    .factory('MapService', mapService);

  function mapService( $q, $http) {
    'ngInject';
    var service = {
    };
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
        .controller('messageCtrl', function($scope, Constants, messageService, AuthService, StateService,Session,$ionicModal, $ionicSlideBoxDelegate) {
            'ngInject';
            var vm = this;
            vm.activated = false;
            $scope.$on('$ionicView.afterEnter', activate);

            function activate() {
                vm.activated = true;
                vm.version = Constants.buildID;
                messageService.getMsg(AuthService.getLoginID()).then(function(data) {
                    console.log(data);
                    vm.msg=data.data;
                });
            }

            vm.goPhoto=function(msgIndex,index){
                Session.setData('temp',vm.msg[msgIndex]);
                StateService.go("photo",{index:index});
            };

            vm.new=function(id){
                //创建信息
                StateService.go('newMessage');
            };

            vm.getImages=function(msg){
                vm.imgCount=0;
                if(msg.photolink1!=null && msg.photolink1!=""){
                    var data={src:msg.photolink1,msg:''};
                    vm.images[vm.imgCount]=data;
                    vm.imgCount++;
                }
                if(msg.photolink2!=null && msg.photolink2!=""){
                    var data={src:msg.photolink2,msg:''};
                    vm.images[vm.imgCount]=data;
                    vm.imgCount++;
                }
                if(msg.photolink3!=null && msg.photolink3!=""){
                    var data={src:msg.photolink3,msg:''};
                    vm.images[vm.imgCount]=data;
                    vm.imgCount++;
                }
                if(msg.photolink4!=null && msg.photolink4!=""){
                    var data={src:msg.photolink4,msg:''};
                    vm.images[vm.imgCount]=data;
                    vm.imgCount++;
                }
                if(msg.photolink5!=null && msg.photolink5!=""){
                    var data={src:msg.photolink5,msg:''};
                    vm.images[vm.imgCount]=data;
                    vm.imgCount++;
                }
                if(msg.photolink6!=null && msg.photolink6!=""){
                    var data={src:msg.photolink6,msg:''};
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

    function getMsg(depositid) {
      var url = Constants.serverUrl + 'deposit/allInformation/'+depositid;
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


    return service;


  }

}());

(function() {
    "use strict";
    angular.module('newMessageCtrl', [])
        .controller('newMessageCtrl', function($scope, Constants, messageService, AuthService, StateService, teacherService, MessageToaster) {
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
                var data={
                    "depositid": Number(vm.deposit.depositid),
                    "publisherid": Number(vm.id),
                    "infotype":Number(vm.dailyType),
                    "latitude":0,
                    "longitude":0,
                    "description":vm.desc,
                    "imgs":vm.imgs
                };
                messageService.newMsg(data).then(function(data) {
                    console.log(data);
                    vm.isClicked=false;
                    vm.btnText='提交';
                    if(data.errno==0){
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
                //console.log(event);
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
                    //console.log(e);
                    vm.imgshow[vm.imgPosition] = this.result;
                    //console.log(this.result);
                    vm.imgPosition++;
                    $scope.$apply();
                };
            }
        });
}());

(function() {
    "use strict";
    angular.module('depositCommentCtrl', [])
        .controller('depositCommentCtrl', function($scope, Constants,$stateParams,StateService,AuthService,depositCommentService,MessageToaster) {
            'ngInject';
            var vm = this;
            vm.activated = false;
            vm.item = {
                "scores":{
                    "kitchen":8,
                    "food":8,
                    "roadsafety":8,
                    "edufiresafety":8,
                    "teacherresp":8
                },
                "commenttext":""
            };
            $scope.$on('$ionicView.afterEnter', activate);

            function activate() {
                console.log($stateParams);
                vm.cid = $stateParams.id;
                vm.type = $stateParams.type;
                if(vm.type==1)vm.edit();
                //vm.cid='10000002';//test
                console.log("deposit id = "+vm.cid);
                vm.activated = true;
                vm.version = Constants.buildID;
                vm.getComment(AuthService.getLoginID(),vm.cid);
                //vm.getCommentScores(vm.cid);//test
            }

            vm.back=function(){
                StateService.back();
            };

            vm.cancel=function(){
                vm.isEditing=false;
                //data return
                vm.item=angular.copy(vm.itembackup);
                vm.itembackup=null;
            };

            vm.edit=function(){
                vm.isEditing=true;;
                vm.itembackup=angular.copy(vm.item);
            };

            vm.save=function(){
                //check data
                vm.item.depositid=vm.cid;
                vm.item.parentid=AuthService.getLoginID();
                depositCommentService.saveDepositComment(vm.item).then(function(data) {
                    console.log(data);
                    if (data.errno == 0) {
                        //vm.item = data.data;
                        vm.isEditing=false;
                        vm.itembackup=null;
                        MessageToaster.success("更新成功");
                        vm.getComment(AuthService.getLoginID(),vm.cid);
                    }else{
                        console.log('error,get comment fail');
                        console.log(data);
                    }
                });

            };

            vm.getComment=function(pid,did){
                depositCommentService.getDepositComment(pid,did).then(function(data) {
                    if (data.errno == 0) {
                        console.log(data.data);
                        vm.item = data.data;
                    }else{
                        console.log(data);
                        if(data.errno==10003){
                            vm.edit();
                        }else{
                            console.log('error,get comment fail');
                        }
                    }
                });
            };

            vm.getCommentScores=function(id){
                depositCommentService.getTotalDepositScore(id).then(function(data) {
                        console.log(data);
                });
            };
        });
}());

(function() {
    'use strict';

    angular.module('depositCommentService', [])
        .factory('depositCommentService', myService);

    function myService( $q, $http,Constants,ResultHandler) {
        'ngInject';
        var service = {
            saveDepositComment:saveDepositComment,
            getDepositComment:getDepositComment,
            getTotalDepositScore:getTotalDepositScore
        };


        //1.家长评分
        //POST
        //URL: /api/v1/comments/parent/deposit
        //Request Body:
        //{
        //    "depositid":10000001,
        //    "parentid": 31000001,
        //    "scores":{
        //    "kitchen":8,
        //        "food":8,
        //        "road_safety":8,
        //        "edu_fire_safety":8,
        //        "teacher_responsibility":8
        //      },
        //    "comments_text":"老师责任心很好"
        //}
        function saveDepositComment(data) {
            var url = Constants.serverUrl + 'comments/parent/deposit';
            return $http({
                method: 'post',
                url: url,
                data: data
            }).then(ResultHandler.successedFuc, ResultHandler.failedFuc);
        };

        //2.获取家长评分
        //GET
        //URL: /api/v1/comments/parent/deposit/?parentid=30000001&depositid=10000001
        //    Response Body:
        //{
        //    "errno":0,
        //    "error":"",
        //    "data":{
        //    "scores":{
        //        "kitchen":8,
        //            "food":8,
        //            "road_safety":8,
        //            "edu_fire_safety":8,
        //            "teacher_responsibility":8
        //        },
        //    "comments_text":"老师责任心很好"
        //    }
        //}
        function getDepositComment(pid,did) {
            var url = Constants.serverUrl + 'comments/parent/deposit?parentid='+pid+"&depositid="+did;
            return $http.get(url).then(ResultHandler.successedFuc, ResultHandler.failedFuc);
        };

        //3.获取总评分
        //总评分计算公式： 总评分 = 公司评分 * 40% + 所有家长的各项评分的总平均分 * 60%
        //GET
        //URL: /api/v1/comments/deposit/?depositid=10000001
        //Response Body:
        //{
        //    "errno":0,
        //    "error":"",
        //    "data":{
        //        "scores":8
        //    }
        //}
        function getTotalDepositScore(did) {
            var url = Constants.serverUrl + 'comments/deposit?depositid='+did;
            console.log(url);
            return $http.get(url).then(ResultHandler.successedFuc, ResultHandler.failedFuc);
        };

        return service;


    }

}());
(function() {
  "use strict";
  angular.module('nearbyModule', [
    'nearbyCtrl',
    'nearbyListCtrl',
    'nearbyDepositInfoCtrl',
    'depositCommentCtrl',
    'nearbyRouter',
    'depositCommentService',
    'nearbyService'
  ]);

}());

(function() {
    "use strict";
    angular.module('nearbyCtrl', [])
        .controller('nearbyCtrl', function($scope, Constants,nearbyService,MessageToaster,StateService,CacheData) {
            'ngInject';

            var vm = this;
            vm.activated = false;
            vm.map = null;
            vm.point = null;
            vm.city = 'shenzhen';
            vm.show=false;
            vm.distance = 5000;
            vm.changeName = '列表';
            $scope.temp={mine:null,baidu:null};
            vm.list=[];

            var watch = $scope.$watchGroup(['temp.mine','temp.baidu'],function(newValue, oldValue, scope){
                console.log(newValue);
                //console.log(oldValue);
                if(newValue[0]!=null && newValue[1]!=null){
                    console.log('ok ,do it');
                    //确认距离，锁定在10000
                    for(var i=0;i<newValue[0].length;i++){
                        if(newValue[0][i].Dist < vm.distance*2){
                            vm.list.push(newValue[0][i]);
                            var marker = new BMap.Marker(new BMap.Point(newValue[0][i].Longitude,newValue[0][i].Latitude));  // 创建标注
                            var number = vm.list.length;
                            var label=new BMap.Label(''+number);
                            var margin=4;
                            if(number>9)margin=0;
                            label.setStyle({
                                "color":"white",
                                "background":"none",
                                "fontSize":"14px",
                                "margin-left":margin+"px",
                                "border":"0"});
                            marker.setLabel(label);
                            var content=vm.getOrgContent(newValue[0][i]);
                            marker.setTitle(newValue[0][i].OrgName);
                            vm.map.addOverlay(marker);
                            vm.addClickHandler(content,marker);
                        }
                    }

                    console.log(vm.list);
                    //检查百度是否有我们的数据一样的信息
                    //将百度数据转成我们的
                    for(var i=0;i<newValue[1].length;i++){
                            var tmp={
                                AccountID: i,
                                Address: newValue[1][i].address,
                                Dist: vm.map.getDistance(vm.point,newValue[1][i].point).toFixed(0),
                                FrontDeskLink: "./img/place.png",
                                Latitude: newValue[1][i].point.lat,
                                Longitude:newValue[1][i].point.lng,
                                OrgName: newValue[1][i].title
                            };
                            vm.list.push(tmp);
                        var marker = new BMap.Marker(newValue[1][i].point);  // 创建标注
                        var number = vm.list.length;
                        var label=new BMap.Label(''+number);
                        var margin=4;
                        var content=vm.getOrgContent(tmp);
                        if(number>9)margin=0;
                        label.setStyle({
                            "color":"white",
                            "background":"none",
                            "fontSize":"14px",
                            "margin-left":margin+"px",
                            "border":"0"});
                        marker.setLabel(label);
                        marker.setTitle(newValue[1][i].title);
                        vm.map.addOverlay(marker);              // 将标注添加到地图中
                        vm.addClickHandler(content,marker);
                    }
                    console.log(vm.list);
                    //清空tmp
                    $scope.temp={mine:null,baidu:null};
                    //vm.show=true;
                    //显示在列表，

                    //显示在图片
                }else if(newValue[0]!=null){
                    console.log('get babyplan data');
                }else if(newValue[1]!=null){
                    console.log('get baidu map data');
                }
            });

            vm.addClickHandler=function(content,marker){
                marker.addEventListener("click",function(e){
                        vm.openInfo(content,e)}
                );
            };

            vm.openInfo=function(content,e){
                var p = e.target;
                var point = new BMap.Point(p.getPosition().lng, p.getPosition().lat);
                var infoWindow = new BMap.InfoWindow(content,{enableCloseOnClick:true});  // 创建信息窗口对象
                vm.map.openInfoWindow(infoWindow,point); //开启信息窗口
            };

            vm.getOrgContent = function(org){
                var sContent =
                    "<h4 style='margin:0 0 5px 0;padding:0.2em 0'>"+org.OrgName+"</h4>" +
                    "<img style='margin:4px' id='imgDemo' src='"+org.FrontDeskLink+"' width='139' height='104' title='"+org.OrgName+"'/>" +
                    "<p style='margin:0;line-height:1.5;font-size:13px;text-indent:2em'>"+org.Address+"</p>" ;
                if(org.AccountID.length==8){
                    sContent+="<a class='button' href='#nearbyDepositInfo?id="+org.AccountID+"' target='_self' >更多信息</a>";
                }
                return sContent;
            };

            vm.search=function(){
                vm.list=[];
                vm.searchOurInfo();
                vm.searchNearBy(vm.inputData);
            };

            vm.change=function(){
                vm.show=!vm.show;
                if(vm.show){
                    vm.changeName = '地图';
                }else {
                    vm.changeName = '列表';
                }
            };

            vm.searchOurInfo=function(){
                if(vm.point != null) {
                    nearbyService.findNearbyDeposit(vm.point.lng, vm.point.lat).then(function (data) {
                        if (data.errno == 0) {
                            console.log(data.data);
                            //是否要删除圆形范围内
                            $scope.temp.mine = data.data;
                        } else {
                            console.log('error,find nearby deposit fail');
                            console.log(data);
                        }
                    });
                }else{
                    MessageToaster.error("定位不成功");
                }
            };

            //renderOptions: {map: vm.map, panel: "r-result"},
            vm.searchNearBy=function(data){
                var myPoint=null;
                if(data!=null) {
                    var myGeo = new BMap.Geocoder();
                    // 将地址解析结果显示在地图上,并调整地图视野
                    console.log(data);
                    myGeo.getPoint(data, function (point) {
                        if (point) {
                            console.log("change address point");
                            console.log(point);
                            myPoint=point;
                            vm.map.clearOverlays();
                            vm.map.centerAndZoom(point, 15);
                            vm.map.addOverlay(new BMap.Marker(point));
                            vm.map.panTo(point);

                            var local = new BMap.LocalSearch(vm.map, {
                                renderOptions:{},
                                onSearchComplete: vm.onSearchComplete
                            });
                            local.searchNearby('托管',myPoint, vm.distance);
                        } else {
                            alert("您选择地址没有解析到结果!");
                        }
                    }, vm.city);
                }else{
                    myPoint=vm.point;
                }
                var local = new BMap.LocalSearch(vm.map, {
                    renderOptions:{},
                    onSearchComplete: vm.onSearchComplete
                    });
                local.searchNearby('托管',myPoint, vm.distance);
                //local.search("托管");
            };

            vm.onSearchComplete=function(results){
                console.log(results);
                $scope.temp.baidu = results.wr;
            };

            vm.setMapControl=function(map){
                // 添加定位控件
                var geolocationControl = new BMap.GeolocationControl();
                geolocationControl.addEventListener("locationSuccess", function(e){
                    // 定位成功事件
                    var address = '';
                    address += e.addressComponent.province;
                    address += e.addressComponent.city;
                    address += e.addressComponent.district;
                    address += e.addressComponent.street;
                    address += e.addressComponent.streetNumber;
                    alert("当前定位地址为：" + address);

                });
                geolocationControl.addEventListener("locationError",function(e){
                    // 定位失败事件
                    alert(e.message);
                });
                map.addControl(geolocationControl);

                //添加地图类型控件
                map.addControl(new BMap.MapTypeControl());
            };

            vm.setBaiduMap=function(){
                vm.map = new BMap.Map("allmap");    // 创建Map实例
                vm.setMapControl(vm.map);
                //get position
                var geolocation = new BMap.Geolocation();
                geolocation.getCurrentPosition(function(r){
                    if(this.getStatus() == BMAP_STATUS_SUCCESS){
                        vm.city = r.address.city;
                        vm.map.setCurrentCity(vm.city);
                        vm.point = r.point;
                        vm.map.centerAndZoom(vm.point , 15);  // 初始化地图,设置中心点坐标和地图级别
                        var myIcon = new BMap.Icon("http://api.map.baidu.com/img/markers.png", new BMap.Size(23, 25), {
                            offset: new BMap.Size(10, 25), // 指定定位位置
                            imageOffset: new BMap.Size(0, 0 - 10 * 25) // 设置图片偏移
                        });
                        var mk = new BMap.Marker(r.point,{icon:myIcon});
                        vm.map.addOverlay(mk);
                        vm.map.panTo(r.point);
                    } else {
                        alert('failed'+this.getStatus());
                    }
                },{enableHighAccuracy: true})
            };

            vm.goto=function(item){
                if(item.AccountID.length!=8){
                    MessageToaster.error("暂不提供此信息");
                }else {
                    CacheData.putObject(item.AccountID, item);
                    StateService.go('nearbyDepositInfo', {id: item.AccountID});
                }
            };

            $scope.$on('$ionicView.afterEnter', activate);

            function activate() {
                vm.activated = true;
                vm.version = Constants.buildID;
                vm.setBaiduMap();
            }
        });


}());

(function() {
    "use strict";
    angular.module('nearbyDepositInfoCtrl', [])
        .controller('nearbyDepositInfoCtrl', function($scope, Constants,nearbyService,CacheData,$stateParams,StateService,organizerService,depositCommentService,parentService,AuthService) {
            'ngInject';
            var vm = this;
            vm.activated = false;

            $scope.$on('$ionicView.afterEnter', activate);

            function activate() {
                console.log($stateParams);
                vm.cid = $stateParams.id;
                console.log("id = "+vm.cid);
                vm.activated = true;
                vm.version = Constants.buildID;
                vm.item =CacheData.getObject(vm.cid);
                console.log(vm.item);
                vm.getMoreInfo(vm.cid);
                vm.getComment(vm.cid);
                vm.getParentChildren();
            }

            vm.back=function(){
                StateService.back();
            };

            vm.gotoDepositComment=function(){
                if(vm.access) {
                    StateService.go('depositComment', {id: vm.cid});
                }else{
                    console.log('not allow');
                }
            };

            vm.getParentChildren=function() {
                parentService.queryChildren(AuthService.getLoginID()).then(function(data) {
                    if (data.errno == 0) {
                        console.log(data.data);
                        vm.deposits = data.data;
                        for(var i=0;i<vm.deposits.length;i++){
                            if( vm.cid == vm.deposits[i].depositid){
                                vm.access=true;
                                break;
                            }
                        }

                    }else{
                        console.log(data);
                    }
                });
            };

            vm.getMoreInfo=function(id){
                organizerService.queryDepositInfo(id).then(function(data) {
                    if (data.errno == 0) {
                        console.log(data.data);
                        vm.more = data.data;
                    }else{
                        console.log('error,find nearby deposit fail');
                        console.log(data);
                    }
                });
            };

            vm.getComment=function(id){
                depositCommentService.getTotalDepositScore(id).then(function(data) {
                    if (data.errno == 0) {
                        console.log(data.data);
                        vm.scores = data.data.scores;
                    }else{
                        console.log(data);
                        if(data.errno==10003){
                            vm.scores=0;
                        }else{
                            console.log('error,get comment fail');
                        }
                    }
                });
            };
        });
}());

(function() {
    "use strict";
    angular.module('nearbyListCtrl', [])
        .controller('nearbyListCtrl', function($scope, Constants,nearbyService,StateService,CacheData) {
            'ngInject';
            var vm = this;
            vm.activated = false;
            vm.isMapMode=true;

            $scope.$on('$ionicView.afterEnter', activate);

            $scope.offlineOpts = {
                retryInterval: 10000,
                txt: 'Offline Mode'
            };
            var longitude = 114.2;
            var latitude = 22.5;
            $scope.mapOptions = {
                center: {
                    longitude: longitude,
                    latitude: latitude
                },
                zoom: 11,
                city: 'ShenZhen',
                markers: [{
                    longitude: longitude,
                    latitude: latitude,
                    icon: 'img/mappiont.png',
                    width: 49,
                    height: 60,
                    title: 'Where',
                    content: '这是哪里'
                }]
            };

            $scope.loadMap = function(map) {
                console.log(map);//gets called while map instance created
            };

            vm.loadData=function(longitude,latitude){
                nearbyService.findNearbyDeposit(longitude,latitude).then(function(data) {
                    if (data.errno == 0) {
                        console.log(data.data);
                        vm.list = data.data;
                    }else{
                        console.log('error,find nearby deposit fail');
                        console.log(data);
                    }
                });
            };

            vm.goto=function(item){
                CacheData.putObject(item.AccountID,item);
                StateService.go('nearbyDepositInfo',{id:item.AccountID});
            };

            function activate() {
                vm.activated = true;
                vm.version = Constants.buildID;
                vm.loadData(longitude,latitude);
            }
        });
}());

(function() {
  'use strict';

  angular.module('nearbyRouter', [])
    .config(myRouter);


  function myRouter($stateProvider, $urlRouterProvider) {
    'ngInject';
    $stateProvider
      .state('tabs.nearbyList', {
        url: "/nearbyList",
          views: {
            'tab-nearby': {
              templateUrl: 'nearby/nearbyList.html',
              controller: 'nearbyListCtrl',
              controllerAs: 'vm'
            }
          }
      })
      .state('tabs.nearby', {
        url: "/nearby",
        views: {
          'tab-nearby': {
            templateUrl: 'nearby/nearby.html',
            controller: 'nearbyCtrl',
            controllerAs: 'vm'
          }
        }
      })
      .state('nearbyDepositInfo', {
        url: "/nearbyDepositInfo?:id",
        params: {
          id : null
        },
        templateUrl: 'nearby/nearbyDepositInfo.html',
        controller: 'nearbyDepositInfoCtrl',
        controllerAs: 'vm'
      })
      .state('depositComment', {
        url: "/depositComment?:id",
        params: {
          id : null,
          type : 0
        },
        templateUrl: 'nearby/depositComment.html',
        controller: 'depositCommentCtrl',
        controllerAs: 'vm'
      });
  }
}());

(function() {
  'use strict';

  angular.module('nearbyService', [])
    .factory('nearbyService', myService);

  function myService( $q, $http,Constants,ResultHandler) {
    'ngInject';
    var service = {
      findNearbyDeposit:findNearbyDeposit
    };

    //http://172.18.1.166/api/v1/nearbyDepositList/113.271/23.1353     附近的机构列表
    function findNearbyDeposit(x,y) {
      var url = Constants.serverUrl + 'nearbyDepositList/'+x+"/"+y;
      return $http.get(url).then(ResultHandler.successedFuc, ResultHandler.failedFuc);
    };

    return service;


  }

}());

(function() {
    "use strict";
    angular.module('depositListctrl', [])
        .controller('depositListctrl', function($scope,Constants,StateService,$ionicListDelegate,$ionicPopup,AuthService,parentService,vipBuyService) {
            'ngInject';
            var vm = this;
            vm.activated = false;
            $scope.$on('$ionicView.afterEnter', activate);

            function activate() {
                vm.activated = true;
                vm.version = Constants.buildID;
                vm.getRecords();
            };

            vm.getDeposits = function(){
                parentService.queryChildren(AuthService.getLoginID()).then(function(data) {
                    if (data.errno == 0) {
                        console.log(data.data);
                        vm.deposits = [];
                        var array=[];
                        //获取deposits，取出唯一
                        data.data.forEach(function(item){
                            var obj={};
                            obj.depositid=item.depositid;
                            obj.orgname=item.orgname;
                            //console.log(array);
                            // console.log(item.depositid);
                            if(!array.includes(item.depositid)&& item.depositid ){
                                array[array.length]=item.depositid;
                                vm.deposits[vm.deposits.length]=obj;
                            }
                            //获取机构信息，获取权限是否能查看编辑
                        });
                    }
                });
            };

            vm.getRecords = function () {
                vipBuyService.getOrders(AuthService.getLoginID()).then(function(data) {
                    var isDO=false;
                    if (data.errno == 0) {
                        console.log(data.data);
                        data.data.forEach(function(item){
                            if(item.PayStatus==1){
                                if(!isDO) {
                                    vm.getDeposits();
                                    isDO = true;
                                }
                            }

                        });
                        return false;
                    }
                });
            };

            vm.back=function(){
                StateService.back();
            };

            vm.goToDepositComment=function(did){
                StateService.go('depositComment', {id: did});
            };

        });
}());

(function() {
  "use strict";
  angular.module('orderModule', [
    'orderCtrl',
    'depositListctrl',
    'orderRouter',
    'orderService'
  ]);

}());

(function() {
    "use strict";
    angular.module('orderCtrl', [])
        .controller('orderCtrl', function($scope, Constants, StateService) {
            'ngInject';
            var vm = this;
            vm.activated = false;
            console.log("tabs come");
            $scope.$on('$ionicView.afterEnter', activate);

            function activate() {
                vm.activated = true;
                vm.version = Constants.buildID;
            }

            vm.goTo=function(where){
                StateService.go(where);
            };

            vm.back=function(){
                StateService.back();
            };
        });
}());

(function() {
  'use strict';

  angular.module('orderRouter', [])
    .config(myRouter);


  function myRouter($stateProvider, $urlRouterProvider) {
    'ngInject';
    $stateProvider
      .state('tabs.order', {
        url: "/order",
          views: {
            'tab-order': {
              templateUrl: 'order/order.html',
              controller: 'orderCtrl',
              controllerAs: 'vm'
            }
          }
      })
      .state('orders', {
        url: "/orders",
        templateUrl: 'order/order.html',
        controller: 'orderCtrl',
        controllerAs: 'vm'
      })
      .state('vipOrg', {
        url: "/vipOrg",
        templateUrl: 'order/depositList.html',
        controller: 'depositListctrl',
        controllerAs: 'vm'
      })
    ;
  }
}());

(function() {
  'use strict';

  angular.module('orderService', [])
    .factory('orderService', orderService);

  function orderService( $q, $http) {
    'ngInject';
    var service = {
    };
    return service;


  }

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
  angular.module('parentModule', [
    'parentCtrl',
    'parentEditCtrl',
    'parentRouter',
    'parentService',
    'parentInfoCtrl'
  ]);

}());

(function () {
    "use strict";
    angular.module('parentCtrl', [])
        .controller('parentCtrl', function ($scope, $q, $cordovaImagePicker, $ionicActionSheet, $ionicListDelegate,
            $ionicPopup, $ionicLoading, Session, Constants, MessageToaster, AuthService, StateService, parentService, childrenSettingService) {
            'ngInject';
            var vm = this;
            vm.activated = false;
            vm.shouldShowDelete = false;
            vm.shouldShowReorder = false;
            vm.listCanSwipe = true
            vm.parentInfo = {
              //name: "刘德华",
              //nickName: "流的花",
              //sex: 1,
              //mobile: '1342222235',
              //childrens: [
              //    {
              //        name: '刘能',
              //        sex:1
              //    },
              //    {
              //        name: '刘星',
              //        sex: 1
              //    }
              //]
            };

            //页面激活时处理逻辑
            $scope.$on('$ionicView.afterEnter', activate);
            function activate() {
                vm.activated = true;
                vm.version = Constants.buildID;
                init();
            };

            //初始化逻辑
            function init() {
                var pId = AuthService.getLoginID();
                var queryParentPromise = parentService.queryParent(pId);
                var queryChildrensPromise = parentService.queryChildren(pId);

                $q.all([queryParentPromise, queryChildrensPromise]).then(function (results) {
                    vm.parentInfo = results[0].data || {},
                   vm.parentInfo.childrens = results[1].data || [];
                }, function (err) {
                    MessageToaster.error("检索异常!");
                });
            };


            // 图片选择项
            vm.showImageUploadChoices = function (prop) {
                var hideSheet = $ionicActionSheet.show({
                    buttons: [{
                        text: '拍照上传'
                    }, {
                        text: '从相册中选'
                    }],
                    titleText: '图片上传',
                    cancelText: '取 消',
                    cancel: function () {
                    },
                    buttonClicked: function (index) {
                        //相册文件选择上传
                        if (index == 1) {
                            vm.readalbum(prop);
                        } else if (index == 0) {
                            //拍照上传
                            vn.takePicture(prop);
                        }
                        return true;
                    }
                });
            };

            //打开用户相册
            vm.readalbum = function (prop) {
                if (!window.imagePicker) {
                    MessageToaster.error("目前您的环境不支持相册上传!");
                    return;
                }

                var options = {
                    maximumImagesCount: 1,
                    width: 800,
                    height: 800,
                    quality: 80
                };

                $cordovaImagePicker.getPictures(options).then(function (results) {
                    var uri = results[0],
                        name = uri;
                    if (name.indexOf('/')) {
                        var i = name.lastIndexOf('/');
                        name = name.substring(i + 1);
                    }

                    vm.uploadimage(uri, prop);

                }, function (error) {
                    MessageToaster.error("访问相册异常:请检查是否有权限!");
                });
            };


            //拍照
            vm.takePicture = function (prop) {
                if (!navigator.camera) {
                    MessageToaster.error("请在真机环境中使用拍照上传!");
                    return;
                }

                var options = {
                    quality: 75,
                    targetWidth: 800,
                    targetHeight: 800,
                    saveToPhotoAlbum: false
                };

                navigator.camera.getPicture(function (imageURI) {
                    vm.uploadimage(imageURI);
                }, function (err) {
                    MessageToaster.error("拍照异常:请检查是否有权限!");
                }, options);

            }

            //上传
            vm.uploadimage = function (uri) {
                var fileURL = uri;

                var options = new FileUploadOptions();
                options.fileKey = "file";
                options.fileName = fileURL.substr(fileURL.lastIndexOf('/') + 1);
                options.mimeType = "image/jpeg";
                options.chunkedMode = true;

                var ft = new FileTransfer();
                $ionicLoading.show({
                    template: '上传中...'
                });
                ft.upload(fileURL, "http://wx.zxing-tech.cn/upload", function (data) {
                    //设置图片新地址
                    var resp = JSON.parse(data.response);
                    vm.parentInfo.avatarlink = resp.data.fileurl;

                    parentService.updateParent(vm.parentInfo).then(function (res) {
                        MessageToaster.error("更新成功!");
                        $ionicLoading.hide();
                    }, function (err) {
                        MessageToaster.error("更新失败!");
                        $ionicLoading.hide();
                    })

                }, function (error) {
                    $ionicLoading.hide();
                }, options);
            };


            //创建新的孩子信息,使用新局部编写界面
            vm.addChild = function () {
                $ionicListDelegate.closeOptionButtons();
                StateService.go('childrenAdd');
            };

            //查看孩子信息
            vm.editChild = function (child) {
                $ionicListDelegate.closeOptionButtons();
                Session.setData('temp', child);
                StateService.go('childrenEdit', { cid: child.uid, type: 2 });
            };

            //删除孩子信息
            vm.delChild = function (child) {

                $ionicListDelegate.closeOptionButtons();

                var confirmPopup = $ionicPopup.confirm({
                    title: '确定要删除此孩子:' + child.name,
                    buttons: [
                        { text: '取消', type: 'button-positive' },
                        { text: '确定', type: 'button-assertive', onTap: function (e) { return true } }
                    ]
                });
                confirmPopup.then(function (result) {
                    if (result) {
                        childrenSettingService.deleteChild(child.uid).then(function (data) {
                            console.log(data);
                            if (data.errno == 0) {

                                console.log(data.data);

                                var idx = vm.parentInfo.childrens.indexOf(child);
                                vm.parentInfo.childrens.splice(idx, 1);

                                MessageToaster.error("删除成功!");
                            }
                        });
                    } else {
                        console.log('cancel delete');
                    }
                });
            };

            //跳转到指定页面
            vm.goTo = function (addr) {
                console.log('go to path : ' + addr);
                StateService.go(addr);
            };

            //返回到上一页面
            vm.back = function () {
                StateService.back();
            };
        });
}());

(function() {
    "use strict";
    angular.module('parentEditCtrl', [])
        .controller('parentEditCtrl', function ($scope, Constants, AuthService, parentService, StateService, MessageToaster) {
            'ngInject';
            var vm = this;
            vm.activated = false;
            vm.parentInfo = {
                //name: "刘德华",
                //nickName: "流的花",
                //sex: 1,
                //mobile: '1342222235'
            };

            //页面激活时处理逻辑
            $scope.$on('$ionicView.afterEnter', activate);
            function activate() {
                vm.activated = true;
                vm.version = Constants.buildID;
                init();
            }

            //初始化逻辑
            function init() {
                var pId = AuthService.getLoginID();
                var queryParentPromise = parentService.queryParent(pId).then(function (res) {
                    vm.parentInfo = res.data || {}
                }, function (err) {
                    MessageToaster.error("检索异常!");
                });
            }

            //保存家长信息
            vm.save = function () {
                if (!vm.parentInfo.name) {
                    MessageToaster.error("请填写用户名!");
                    return;
                }

                parentService.updateParent(vm.parentInfo).then(function (res) {
                    vm.back();
                    MessageToaster.info("更新成功!");
                }, function (err) {
                    MessageToaster.error("更新失败!");
                })
            };

            //返回到上一页面
            vm.back = function () {
                StateService.back();
            };
        });
}());

(function() {
    "use strict";
    angular.module('parentInfoCtrl', [])
        .controller('parentInfoCtrl', function ($scope, $q,$window, $cordovaImagePicker, $ionicActionSheet, $ionicListDelegate,
            $ionicPopup, $ionicLoading, Session, Constants, MessageToaster, AuthService, StateService, parentService, childrenSettingService) {
            'ngInject';
            var vm = this;
            vm.activated = false;
            vm.shouldShowDelete = false;
            vm.shouldShowReorder = false;
            vm.listCanSwipe = true
            vm.parentInfo = {
                //name: "刘德华",
                //nickName: "流的花",
                //sex: 1,
                //mobile: '1342222235',
                //childrens: [
                //    {
                //        name: '刘能',
                //        sex:1
                //    },
                //    {
                //        name: '刘星',
                //        sex: 1
                //    }
                //]
            };

            //页面激活时处理逻辑
            $scope.$on('$ionicView.afterEnter', activate);
            function activate() {
                vm.activated = true;
                vm.version = Constants.buildID;
                init();
            };

            //初始化逻辑
            function init() {
                var pId = AuthService.getLoginID();
                var queryParentPromise = parentService.queryParent(pId);
                var queryChildrensPromise = parentService.queryChildren(pId);

                $q.all([queryParentPromise, queryChildrensPromise]).then(function (results) {
                    vm.parentInfo = results[0].data || {},
                   vm.parentInfo.childrens = results[1].data || [];
                }, function (err) {
                    MessageToaster.error("检索异常!");
                });
            };


            // 图片选择项
            vm.showImageUploadChoices = function (prop) {
                var hideSheet = $ionicActionSheet.show({
                    buttons: [{
                        text: '拍照上传'
                    }, {
                        text: '从相册中选'
                    }],
                    titleText: '图片上传',
                    cancelText: '取 消',
                    cancel: function () {
                    },
                    buttonClicked: function (index) {
                        // 相册文件选择上传
                        if (index == 1) {
                            vm.readalbum(prop);
                        } else if (index == 0) {
                            // 拍照上传
                            vm.takePicture(prop);
                        }
                        return true;
                    }
                });
            };

            //打开用户相册
            vm.readalbum = function (prop) {
                if (!navigator.camera) {
                    MessageToaster.error("目前您的环境不支持相册上传!");
                    return;
                }

                var options = {
                    maximumImagesCount: 1,
                    sourceType: 2,
                    targetWidth: 80,
                    targetHeight: 80,
                    allowEdit: true,
                    quality: 80
                };
                navigator.camera.getPicture(function (imageURI) {
                    vm.uploadImage(imageURI);
                }, function (error) {
                    // MessageToaster.error("访问相册异常:请检查是否有权限!");
                }, options);
            };


            // 拍照
            vm.takePicture = function (prop) {

                if (!navigator.camera) {
                    MessageToaster.error("请在真机环境中使用拍照上传!");
                    return;
                }

                var options = {
                    quality: 100,
                    targetWidth: 80,
                    targetHeight: 80,
                    allowEdit: true,
                    saveToPhotoAlbum: true
                };


                navigator.camera.getPicture(function (imageURI) {
                    vm.uploadImage(imageURI);
                }, function (err) {
                  // MessageToaster.error("拍照异常:请检查是否有权限!");
                }, options);
            }

            // 上传
            vm.uploadImage = function (uri) {
                var fileURL = uri;

                var options = new FileUploadOptions();
                options.fileKey = "file";
                options.fileName = fileURL.substr(fileURL.lastIndexOf('/') + 1);
                options.mimeType = "image/jpeg";
                options.chunkedMode = true;

                var ft = new FileTransfer();
                $ionicLoading.show({
                    template: '上传中...'
                });
                ft.upload(fileURL, "http://wx.zxing-tech.cn/upload", function (data) {
                    // 设置图片新地址
                    var resp = JSON.parse(data.response);
                    vm.parentInfo.avatarlink = resp.data.fileurl;

                    parentService.updateParent(vm.parentInfo).then(function (res) {
                        MessageToaster.info("更新成功!");
                        $ionicLoading.hide();
                    }, function (err) {
                        MessageToaster.error("更新失败!");
                        $ionicLoading.hide();
                    })

                }, function (error) {
                    MessageToaster.error("上传失败!");
                    $ionicLoading.hide();
                }, options);
            };


            //创建新的孩子信息,使用新局部编写界面
            vm.addChild = function () {
                $ionicListDelegate.closeOptionButtons();
                StateService.go('childrenAdd');
            };

            //查看孩子信息
            vm.editChild = function ( child) {
                $ionicListDelegate.closeOptionButtons();
                Session.setData('temp', child);
                StateService.go('childrenEdit', { cid: child.uid, type: 2 });
            };

            //删除孩子信息
            vm.delChild = function (child) {
               
                $ionicListDelegate.closeOptionButtons();

                var confirmPopup = $ionicPopup.confirm({
                    title: '确定要删除此孩子:' + child.name,
                    buttons: [
                        { text: '取消', type: 'button-positive' },
                        { text: '确定', type: 'button-assertive', onTap: function (e) { return true } }
                    ]
                });
                confirmPopup.then(function (result) {
                    if (result) {
                        childrenSettingService.deleteChild(child.uid).then(function (data) {
                            console.log(data);
                            if (data.errno == 0) {

                                console.log(data.data);

                                var idx = vm.parentInfo.childrens.indexOf(child);
                                vm.parentInfo.childrens.splice(idx, 1);

                                MessageToaster.info("删除成功!");
                            }
                        });
                    } else {
                        console.log('cancel delete');
                    }
                });
            };

            //跳转到指定页面
            vm.goTo = function (addr) {
                console.log('go to path : ' + addr);
                StateService.go(addr);
            };

            //返回到上一页面
            vm.back=function(){
                StateService.back();
            };
        });
}());

(function() {
  'use strict';

  angular.module('parentRouter', [])
    .config(myRouter);


  function myRouter($stateProvider, $urlRouterProvider) {
    'ngInject';
    $stateProvider
    .state('parentInfo', {
        url: "/parentInfo",
        templateUrl: 'parent/parentInfo.html',
        controller: 'parentInfoCtrl',
        controllerAs: 'vm'
      })
      .state('parent', {
        url: "/parent",
        templateUrl: 'parent/parent.html',
        controller: 'parentCtrl',
        controllerAs: 'vm'
      })
      .state('parentEdit', {
        url: "/parentEdit",
        templateUrl: 'parent/parentEdit.html',
        controller: 'parentEditCtrl',
        controllerAs: 'vm'
      })
    ;
  }
}());

(function() {
  'use strict';

  angular.module('parentService', [])
    .factory('parentService', parentService);

  function parentService( $q, $http, Session, Constants, ResultHandler) {
    'ngInject';
    var service = {
      queryParent:queryParent,
      updateParent:updateParent,
      queryChildren:queryChildren,
      resetPsw:resetPsw
    };

    //-----HTTP Header => Authorization: Bearer-{$token}-----//

    //GET /api/v1/account/query/parent/{parent_accnt_id}
    //return
    //{
    //  "errno":0,
    //  "error":"",
    //  "data":{
    //  "uid":10000001,
    //      "name":"张粑粑",
    //      "sex":1,
    //      "mobile":"18612345678",
    //      "nick":"sam"
    //  }
    //}
    function queryParent(id) {
        console.log($http.defaults.headers);
        var url = Constants.serverUrl + 'account/query/parent/'+id;
        return $http.get(url).then(ResultHandler.successedFuc, ResultHandler.failedFuc);
    };

    function updateParent(data) {
        var url = Constants.serverUrl + 'account/parent/' + data.uid;
        return $http({
            method: 'post',
            url: url,
            data: data
        }).then(ResultHandler.successedFuc, ResultHandler.failedFuc);
    };



    //GET /api/v1/account/query/parentChildren/{parent_accnt_id}
    //return
    //{
    //  "errno":0,
    //  "error":"",
    //  "data":[
    //    {
    //      "uid":10000001,
    //      "relationship":1,
    //      "name":"赵大萌",
    //      "sex":1,
    //      "fingerfeature":"xxxxx",
    //      "remark":"xxxx"
    //    },
    //    ...
    //  ]
    //}
    function queryChildren(id) {
      var url = Constants.serverUrl + 'account/query/parentChildren/'+id;
      return $http.get(url).then(ResultHandler.successedFuc, ResultHandler.failedFuc);
    };

    function resetPsw(mobile){
     // var authInfo = JSON.parse(Session.getData("eshop_auth"));
     // console.log(authInfo);
     // var data = {eshopToken:authInfo.token};
        var url = Constants.serverUrl + 'account/resetPsw/' + mobile;
      return $http({
        method: 'post',
        url: url
      }).then(ResultHandler.successedFuc, ResultHandler.failedFuc);
    };

    return service;

  };
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
  angular.module('profileModule', [
    'profileCtrl',
    'profileRouter',
    'profileService'
  ]);

}());

(function () {
    "use strict";
    angular.module('profileCtrl', [])
            .controller('profileCtrl', function ($scope, $q, $window, $cordovaImagePicker, $ionicActionSheet, $ionicListDelegate,
           $ionicPopup, $ionicLoading, Session, Constants, MessageToaster, AuthService, StateService, parentService, childrenSettingService) {

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

                vm.getParent = function () {
                    parentService.queryParent(AuthService.getLoginID()).then(function (data) {
                        if (data.errno == 0) {
                            console.log(data.data);
                            vm.parent = data.data;
                        }
                    });
                };

                vm.getChildren = function () {
                    parentService.queryChildren(AuthService.getLoginID()).then(function (data) {
                        if (data.errno == 0) {
                            console.log(data.data);
                            vm.children = data.data;
                            var children = "";
                            for (var i = 0; i < vm.children.length; i++) {
                                if (children == "")
                                    children += vm.children[i].name
                                else {
                                    children += "," + vm.children[i].name
                                }
                            }
                            vm.childrenName = children;
                        }
                    });
                };

                vm.goTo = function (addr, params) {
                    console.log('go to path : ' + addr);
                    if (params) console.log(params);
                    StateService.go(addr, params);
                };



                // 图片选择项
                vm.showImageUploadChoices = function (prop) {
                    var hideSheet = $ionicActionSheet.show({
                        buttons: [{
                            text: '拍照上传'
                        }, {
                            text: '从相册中选'
                        }],
                        titleText: '图片上传',
                        cancelText: '取 消',
                        cancel: function () {
                        },
                        buttonClicked: function (index) {
                            // 相册文件选择上传
                            if (index == 1) {
                                vm.readalbum(prop);
                            } else if (index == 0) {
                                // 拍照上传
                                vm.takePicture(prop);
                            }
                            return true;
                        }
                    });
                };

                //打开用户相册
                vm.readalbum = function (prop) {
                    if (!navigator.camera) {
                        MessageToaster.error("目前您的环境不支持相册上传!");
                        return;
                    }

                    var options = {
                        maximumImagesCount: 1,
                        sourceType: 2,
                        targetWidth: 80,
                        targetHeight: 80,
                        allowEdit: true,
                        quality: 80
                    };
                    navigator.camera.getPicture(function (imageURI) {
                        vm.uploadImage(imageURI);
                    }, function (error) {
                        // MessageToaster.error("访问相册异常:请检查是否有权限!");
                    }, options);
                };


                // 拍照
                vm.takePicture = function (prop) {

                    if (!navigator.camera) {
                        MessageToaster.error("请在真机环境中使用拍照上传!");
                        return;
                    }

                    var options = {
                        quality: 100,
                        targetWidth: 80,
                        targetHeight: 80,
                        allowEdit: true,
                        saveToPhotoAlbum: true
                    };


                    navigator.camera.getPicture(function (imageURI) {
                        vm.uploadImage(imageURI);
                    }, function (err) {
                        // MessageToaster.error("拍照异常:请检查是否有权限!");
                    }, options);
                }

                // 上传
                vm.uploadImage = function (uri) {
                    var fileURL = uri;

                    var options = new FileUploadOptions();
                    options.fileKey = "file";
                    options.fileName = fileURL.substr(fileURL.lastIndexOf('/')+1);
                    options.mimeType = "image/jpeg";
                    options.chunkedMode = true;

                    var ft = new FileTransfer();
                    $ionicLoading.show({
                        template: '上传中...'
                    });
                    ft.upload(fileURL, "http://wx.zxing-tech.cn/upload", function (data) {
                        // 设置图片新地址
                        var resp = JSON.parse(data.response);
                        vm.parent.avatarlink = resp.data.fileurl;

                        parentService.updateParent(vm.parent).then(function (res) {
                            MessageToaster.info("更新成功!");
                            $ionicLoading.hide();
                        }, function (err) {
                            MessageToaster.error("更新失败!");
                            $ionicLoading.hide();
                        })

                    }, function (error) {
                        MessageToaster.error("上传失败!");
                        $ionicLoading.hide();
                    }, options);
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
  angular.module('registerModule', [
    'registerCtrl',
    'registerRouter',
    'registerService'
  ]);

}());

(function () {
    "use strict";
    angular.module('registerCtrl', [])
        .controller('registerCtrl', function ($scope, Constants, StateService, Session, AuthService, registerService, LoginService, eshopService, $stateParams, MessageToaster) {
            'ngInject';
            var vm = this;
            vm.activated = false;
            vm.count = 0;
            vm.isLock = false;
            vm.org = { mobile: '', password: '' };
            //微信uid的初始化
            vm.user = { gendar: '1', name: '', mobile: '', password: '', pswConfirm: '', wechat: AuthService.getWechatId(), email: '' };
            vm.error = null;
            vm.isParent = false;
            $scope.$on('$ionicView.afterEnter', activate);

            function activate() {
                vm.activated = true;
                vm.version = Constants.buildID;
                vm.type = $stateParams.type;
                //console.log("user type = "+vm.type);
                //if(vm.type==2) {
                //    vm.roleType = '2';
                //    vm.isParent = true;
                //}else{
                //    vm.roleType = '3';
                //    vm.isParent = false;
                //}

                vm.roleType = '2';
                vm.isParent = true;

            };

            $scope.$watch('vm.user.name', function (newValue, oldValue) {
                if (vm.user.name != undefined) {
                    if (vm.user.name.length < 1) {
                        vm.error = '姓名不能为空';
                    } else {
                        vm.error = null;
                    }
                } else {
                    vm.error = '姓名必须填写';
                }
            });
            $scope.$watch('vm.user.mobile', function (newValue, oldValue) {
                if (vm.user.mobile != undefined) {
                    if (vm.user.mobile.length != 11) {
                        vm.error = '手机长度必须为11位';
                    } else {
                        vm.error = null;
                    }
                } else {
                    vm.error = '手机号码必须填写';
                }
            });
            $scope.$watch('vm.user.email', function (newValue, oldValue) {
                if (vm.user.email != undefined) {
                    if (vm.user.email.search(/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/) != -1) {
                        vm.error = null;
                    } else {
                        vm.error = '电子邮箱格式不对';
                    }
                } else {
                    vm.error = '电子邮箱必须填写，用于找回密码';
                }
            });
            $scope.$watch('vm.user.password', function (newValue, oldValue) {
                if (vm.user.password != undefined) {
                    if (vm.user.password.length < 6) {
                        vm.error = '密码长度必须不小于6位';
                    } else {
                        vm.error = null;
                    }
                } else {
                    vm.error = '密码必须填写';
                }
            });
            $scope.$watch('vm.user.pswConfirm', function (newValue, oldValue) {
                if (vm.user.pswConfirm != undefined) {
                    if (vm.user.password != '' && vm.user.password.length >= 6 && vm.user.pswConfirm != vm.user.password) {
                        vm.error = '密码不一致';
                    } else {
                        vm.error = null;
                    }
                } else {
                    vm.error = '';
                }
            });

            vm.check = function () {
                if (vm.error != null) {
                    vm.error = '数据未完善哦!';
                    return false;
                }
                else {
                    if (vm.user.password.length >= 6 && vm.user.pswConfirm.length >= 6
                        && vm.user.name.length > 0 && vm.user.mobile.length == 11
                        && vm.user.email.length > 0 && vm.user.email.length > 3
                        && vm.user.password == vm.user.pswConfirm) return true;
                    else vm.error = '数据未填完哦!';
                }
            };


            function login(userid, pwd) {
                LoginService.login(userid, pwd).then(function (response) {
                    console.log(response);
                    if (response.errno == 0) {

                        //登录ESHOP
                        eshopService.signin(userid, pwd).then(function (data) {
                            AuthService.setSession(response.data.uid, response.data.token, data, response.data.type);
                            StateService.clearAllAndGo(AuthService.getNextPath());
                        }, function (ex) {
                            MessageToaster.error(ex);
                        })
                    } else {
                        MessageToaster.error(response.error);
                    }
                },
               function (error) {
                   MessageToaster.error(error);
               }).finally(function () {
                   //WeuiModalLoading.hide();
               });
            };


            vm.register = function () {
                //检测输入数值是否正确
                if (!vm.check()) return;
                //先注册
                vm.user.weixinno = '';
                vm.user.wechat = '';

                registerService.registerParent(vm.user).then(function (data) {
                    console.log(data);
                    if (data.errno == 0) {
                        LoginService.login(vm.user.mobile, vm.user.password).then(function (response) {
                            if (response.errno == 0) {
                                AuthService.setSession(response.data.uid, response.data.token, data.data.eshop, response.data.type);
                                StateService.clearAllAndGo(AuthService.getNextPath());
                            } else {
                                MessageToaster.error(response.error);
                            }
                        },function (error) {
                              MessageToaster.error(error);
                          });

                    } else {
                        //vm.error = data.error;
                        if (data.errno == 10008) {
                            MessageToaster.error("手机号码已注册过");
                        } else {
                            MessageToaster.error("注册不成功");
                        }
                    }
                });

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
        "password" : user.password,
        "email":user.email
      };
      var url = Constants.serverUrl + 'account/parentRegister';
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
    angular.module('aboutCtrl', [])
        .controller('aboutCtrl', function($scope, Constants, Session,StateService, MessageToaster, parentService, AuthService ) {
            'ngInject';
            var vm = this;
            vm.activated = false;
            $scope.$on('$ionicView.afterEnter', activate);

            function activate() {
                vm.activated = true;

                cordova.getAppVersion.getVersionNumber(function (version) {
                    vm.version = version;
                });
              
                vm.name = Constants.appTitle;
                vm.company = Constants.company;
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
    angular.module('changePswCtrl', [])
        .controller('changePswCtrl', function($scope, Constants, Session,StateService, MessageToaster, parentService, AuthService ) {
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

            $scope.$watch('vm.originPsw', function(newValue, oldValue) {
              if(vm.originPsw!=undefined) {
                  if (vm.originPsw.length < 6) {
                      vm.error = '密码长度必须不小于6位';
                  } else {
                      vm.error = null;
                  }
              }else{
                  vm.error = '密码必须填写';
              }
            });
            $scope.$watch('vm.password', function(newValue, oldValue) {
                if(vm.password!=undefined) {
                    if (vm.password.length < 6) {
                        vm.error = '密码长度必须不小于6位';
                    } else {
                        vm.error = null;
                    }
                }else{
                    vm.error = '密码必须填写';
                }
            });
            $scope.$watch('vm.pswConfirm', function(newValue, oldValue) {
                if(vm.pswConfirm!=undefined) {
                    if (vm.password != '' && vm.password.length >= 6  && vm.pswConfirm != vm.password) {
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
                    if(vm.password.length >= 6 && vm.pswConfirm.length >= 6 && vm.originPsw.length >= 6 && vm.password == vm.pswConfirm){
                        vm.error = '';
                        return true;
                    }
                    else vm.error = '数据未填完哦!';
                }
            };

            vm.changePsw = function() {
                if(!vm.check())return;
                var json={
                  uid:AuthService.getLoginID(),
                  password:vm.pswConfirm
                };
                parentService.updateParent(json).then(function (res) {
                    //vm.back();
                    Session.destroy();
                    StateService.clearAllAndGo("login");
                    MessageToaster.info("密码修改成功!");
                }, function (err) {
                    MessageToaster.error("密码修改失败!");
                })
            };

        });
}());

(function() {
  "use strict";
  angular.module('settingsModule', [
    'settingsCtrl',
    'changePswCtrl',
    'aboutCtrl',
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

            vm.changePsw=function(){
                StateService.go('changePsw');
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
        .state('settings', {
          url: "/settings",
          templateUrl: 'settings/settings.html',
          controller: 'settingsCtrl',
          controllerAs: 'vm'
        })
        .state('about', {
          url: "/about",
          templateUrl: 'settings/about.html',
          controller: 'aboutCtrl',
          controllerAs: 'vm'
        })
        .state('changePsw', {
          url: "/changePsw",
          templateUrl: 'settings/changePsw.html',
          controller: 'changePswCtrl',
          controllerAs: 'vm'
        })
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
        .controller('teacherCtrl', function($scope,Constants,StateService,$ionicListDelegate,$ionicPopup,teacherService,AuthService,CacheData) {
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
                        console.log('confirm to del this teacher '+item.sid);
                        //delete(id);
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
    angular.module('buyAppCtrl', [])
        .controller('buyAppCtrl', function($scope, $state, $stateParams, Constants, StateService, vipBuyService, AuthService, MessageToaster, Session) {
            'ngInject';
            var vm = this;

            vm.activated = false;
            vm.information = "";

            $scope.$on('$ionicView.afterEnter', activate);

            function activate() {
                console.log($stateParams);
                vm.index = $stateParams.index;
                vm.activated = true;
                vm.version = Constants.buildID;
                vm.query(vm.index);
                Wechat.isInstalled(function (installed) {
                    console.log("Wechat installed: " + (installed ? "Yes" : "No"));
                }, function (reason) {
                    console.log('未装微信插件无法支付:Wechat.isInstalled is fail '+reason);
                    alert("未装微信插件无法支付" + reason);
                });
            }


            vm.query = function(id){
                console.log(" index = "+id);
                var temp=JSON.parse(Session.getData('temp'));
                console.log(temp);
                if(temp.businessid == id)
                    vm.item=temp;
                console.log(vm.item);
            };

            vm.back = function(){
                StateService.back();
                Session.rmData('temp');
            };

            vm.getEndDate = function(payTime,numOfDays){
                var date=new Date(payTime.substring(0,4),Number(payTime.substring(4,6))-1,payTime.substring(6,8),payTime.substring(8,10),payTime.substring(10,12),payTime.substring(14,16));
                date.setTime(date.getTime()+numOfDays*24*60*60*1000);
                return date.getTime();
                //return ""+date.getFullYear()+(date.getMonth()+1)+(date.getDate()>9?date.getDate():('0'+date.getDate()))+'235959';
            };

            vm.pay=function(){
                var parentId=AuthService.getLoginID();
                //alert(parentId);
                vipBuyService.createOrder2(parentId, vm.index)
                    .then(function (response) {
                        //alert(JSON.stringify(response));
                        if (response.errno == 0) {
                            var result=response.data;
                            var orderId=result.orderId;
                            //vm.information = JSON.stringify(result);
                            var params = {
                                mch_id: result.partnerid, // merchant id
                                prepay_id: result.prepayid, // prepay id
                                nonce: result.noncestr, // nonce
                                timestamp: result.timestamp, // timestamp
                                sign: result.pay_sign, // signed string
                            };

                            //alert(JSON.stringify(params));
                            Wechat.sendPaymentRequest(params, function () {
                                //alert("Success");
                                //check order make sure user had pay the order ready.
                                //alert("orderId="+orderId);
                                vipBuyService.checkOrder(orderId).then(
                                    function(result) {
                                        //{"errno":0,"error":"",
                                        // "data":{"orderId":"139630530220161103152842","wechatOrderId":"4003682001201611038611986947",
                                        // "totalFee":"1","payState":"SUCCESS","payTime":"20161103152851"}}
                                        //alert(JSON.stringify(result));
                                        if(result.errno == 0 ){
                                            MessageToaster.info("微信支付完成");
                                            StateService.clearAllAndGo(AuthService.getNextPath());
                                        }
                                      },
                                      function (reason) {
                                          alert("checkOrder error "+JSON.stringify(reason));
                                      }
                                  );
                            }, function (reason) {
                                //alert("Failed: " + reason);
                                MessageToaster.error(reason);
                            });
                          }else{
                            MessageToaster.error(response.error);
                          }
                    }, function (error) {
                        //alert(JSON.stringify(error));
                        vm.information += " 请求付款失败 " + JSON.stringify(error);
                    });
            };

        });
}());

(function() {
    "use strict";
    angular.module('buyCtrl', [])
        .controller('buyCtrl', function($scope, $state, $stateParams, Constants, StateService, vipBuyService, AuthService, MessageToaster, Session,Wechat) {
            'ngInject';
            var vm = this;

            vm.activated = false;
            //vm.wechatPayReady = false;
            vm.information = "";

            // $scope.onBridgeReady=function () {
            //     //alert('wechat ok');
            //     vm.wechatPayReady=true;
            // };

            // if (typeof WeixinJSBridge == "undefined"){
            //     console.log("not found WeixinJSBridge");
            //     if(document.addEventListener){
            //         document.addEventListener('WeixinJSBridgeReady', $scope.onBridgeReady, false);
            //     }else if (document.attachEvent){
            //         document.attachEvent('WeixinJSBridgeReady', $scope.onBridgeReady);
            //         document.attachEvent('onWeixinJSBridgeReady', $scope.onBridgeReady);
            //     }
            //     console.log("add event listener for WeixinJSBridge");
            // }else{
            //     console.log("WeixinJSBridge exist");
            //     $scope.onBridgeReady();
            // }

            $scope.$on('$ionicView.afterEnter', activate);

            function activate() {
                console.log($stateParams);
                vm.index = $stateParams.index;

                vm.activated = true;
                vm.version = Constants.buildID;
                vm.query(vm.index);
                vm.wechatInit();
            }

            vm.wechatInit = function(){};

            vm.query = function(id){
                console.log(" index = "+id);
                var temp=Session.getData('temp');
                if(temp.businessid == id)
                    vm.item=temp;

            };

            vm.back = function(){
                StateService.back();
                Session.rmData('temp');
            };

            vm.getEndDate = function(payTime,numOfDays){
                var date=new Date(payTime.substring(0,4),Number(payTime.substring(4,6))-1,payTime.substring(6,8),payTime.substring(8,10),payTime.substring(10,12),payTime.substring(14,16));
                date.setTime(date.getTime()+numOfDays*24*60*60*1000);
                return date.getTime();
                //return ""+date.getFullYear()+(date.getMonth()+1)+(date.getDate()>9?date.getDate():('0'+date.getDate()))+'235959';
            };

            vm.pay=function(){
                var parentId=AuthService.getLoginID();
                alert(parentId);
                vipBuyService.createOrder2(parentId, vm.item.businessid)
                    .then(function (response) {
                        var result=response.data;
                        var orderId=result.orderId;
                        //vm.information = JSON.stringify(result);
                        //alert(JSON.stringify(result));
                        var params = {
                            partnerid: result.partnerid, // merchant id
                            prepayid: result.prepay_id, // prepay id
                            noncestr: result.nonceStr, // nonce
                            timestamp: ""+result.timeStamp, // timestamp
                            sign: result.paySign // signed string
                        };
                        alert(JSON.parse(params));
                        Wechat.sendPaymentRequest(params, function (res) {
                            alert("Success");
                            alert(JSON.prase(res));
                            var msg = res.err_msg;
                            //alert(msg);

                            if(msg == "get_brand_wcpay_request:ok" ) {
                                //保存数据．跳转页面
                                //check order make sure user had pay the order ready.
                                vipBuyService.checkOrder(orderId).then(
                                    function(result) {
                                        //{"errno":0,"error":"",
                                        // "data":{"orderId":"139630530220161103152842","wechatOrderId":"4003682001201611038611986947",
                                        // "totalFee":"1","payState":"SUCCESS","payTime":"20161103152851"}}
                                        alert(JSON.stringify(result));
                                        if(result.errno == 0 ){
                                            MessageToaster.info("微信支付完成");
                                            StateService.clearAllAndGo(AuthService.getNextPath());
                                        }
                                      },
                                      function (reason) {
                                          alert("checkOrder error "+JSON.stringify(reason));
                                      }
                                  );
                              //}else if(msg == "get_brand_wcpay_request:cancel"){
                              } else if(msg.endsWith("cancel")) {
                                  //alert("用户取消");
                                  //vm.information="用户取消";
                                  MessageToaster.info("微信支付已取消");
                              //}else if(msg == "get_brand_wcpay_request:fail"){
                              } else if(msg.endsWith("fail")) {
                                  alert("付款失败");
                              }

                        }, function (reason) {
                            alert("Failed sendPaymentRequest: " + reason);
                            vm.information += " 请求付款失败 " + reason;
                        });
                      }, function (reason) {
                            alert("Failed createOrder2: " + reason);
                            vm.information += " 请求付款失败 " + reason;
                      }
                    );
                        /*
                        if(vm.wechatPayReady){
                            WeixinJSBridge.invoke(
                                'getBrandWCPayRequest',
                                {
                                    "appId":result.appId,
                                    "timeStamp":""+result.timeStamp,
                                    "nonceStr":result.nonceStr,
                                    "package":"prepay_id="+result.prepay_id,
                                    "signType":"MD5",
                                    "paySign":result.paySign
                                },
                                function(res){
                                    //alert(JSON.stringify(res));
                                    var msg = res.err_msg;
                                    //alert(msg);

                                    if(msg == "get_brand_wcpay_request:ok" ) {
                                        //保存数据．跳转页面
                                        //check order make sure user had pay the order ready.
                                        vipBuyService.checkOrder(orderId).then(
                                            function(result) {
                                                //{"errno":0,"error":"",
                                                // "data":{"orderId":"139630530220161103152842","wechatOrderId":"4003682001201611038611986947",
                                                // "totalFee":"1","payState":"SUCCESS","payTime":"20161103152851"}}
                                                //alert(JSON.stringify(result));
                                                if(result.errno == 0 ){
                                                    MessageToaster.info("微信支付完成");
                                                    StateService.clearAllAndGo(AuthService.getNextPath());
                                                }
                                                //var status = result.data.payState;
                                                /*
                                                var payTime=result.data.payTime;
                                                var endDate=vm.getEndDate(payTime,vm.item.numofdays);
                                                if(status === 'SUCCESS'){
                                                    //保存数据．跳转页面
                                                    vipBuyService.updatePayedOrder(parentId,orderId,payTime,endDate).then(
                                                        function(updateResult) {
                                                            //alert("updatePayedOrder sucess "+JSON.stringify(updateResult));
                                                            //vm.information += " udpate success ";
                                                            //跳转页面
                                                            if(updateResult.errno===0) {
                                                                MessageToaster.info("微信支付完成");
                                                                StateService.clearAllAndGo(AuthService.getNextPath());
                                                            }
                                                        },
                                                        function(error) {
                                                            alert("updatePayedOrder error "+JSON.stringify(error));
                                                        }
                                                    );
                                                }
                                                */
                                          /*  },
                                            function (reason) {
                                                alert("checkOrder error "+JSON.stringify(reason));
                                            }
                                        );
                                    //}else if(msg == "get_brand_wcpay_request:cancel"){
                                    }else if(msg.endsWith("cancel")){
                                        //alert("用户取消");
                                        //vm.information="用户取消";
                                        MessageToaster.info("微信支付已取消");
                                    //}else if(msg == "get_brand_wcpay_request:fail"){
                                    }else if(msg.endsWith("fail")){
                                        alert("付款失败");
                                    }
                                }
                            );
                        }
                    }, function (error) {
                        //alert(JSON.stringify(error));
                        vm.information += " 请求付款失败 " + error;
                    });
                    */
          //  };

        };
    });
}());

(function() {
  "use strict";
  angular.module('vipBuyModule', [
    'vipBuyCtrl',
    'buyCtrl',
    'buyAppCtrl',
    'vipBuyRouter',
    'vipBuyService'
  ]);

}());

(function() {
    "use strict";
    angular.module('vipBuyCtrl', [])
        .controller('vipBuyCtrl', function($scope, $state, Constants, StateService,vipBuyService,AuthService,MessageToaster,Session) {
            'ngInject';
            var vm = this;
            vm.activated = false;
            vm.isSelected=-1;
            $scope.$on('$ionicView.afterEnter', activate);

            function activate() {
                vm.activated = true;
                vm.version = Constants.buildID;
                vm.getMenu();
            }

            vm.gotoBuy = function(){
                var where = vm.menu[vm.isSelected];
                Session.setData('temp',JSON.stringify(where));
                StateService.go('buy',{index:where.businessid});
            };

            vm.back = function(){
                StateService.back();
            };

            vm.getMenu = function(){
                vipBuyService.getMenu().then(function(data) {
                    if (data.errno == 0) {
                        console.log(data.data);
                        vm.menu = data.data;
                    }
                });
            };
        });
}());

(function() {
  'use strict';

  angular.module('vipBuyRouter', [])
    .config(myRouter);


  function myRouter($stateProvider, $urlRouterProvider) {
    'ngInject';
    $stateProvider
        .state('vipBuy', {
          url: "/vipBuy",
          templateUrl: 'vipBuy/vipBuy.html',
          controller: 'vipBuyCtrl',
          controllerAs: 'vm'
        })
        .state('buy', {
          url: "/buy?:index",
          params:{
              index:0
          },
          templateUrl: 'vipBuy/buy.html',
          controller: 'buyAppCtrl',
          controllerAs: 'vm'
        });
  }
}());

(function() {
  'use strict';

  angular.module('vipBuyService', [])
    .factory('vipBuyService', myService);

  function myService($http,Constants,ResultHandler) {
    'ngInject';

    var service = {
      getMenu:getMenu,
      getOrders:getOrders,
      checkOrder:checkOrder,
      createOrder:createOrder,
      createOrder2:createOrder2,
      updatePayedOrder:updatePayedOrder
    };

    function getMenu(){
      var url = Constants.serverUrl + 'charge/fetch/menuList';
      return $http.get(url).then(ResultHandler.successedFuc, ResultHandler.failedFuc);
    };

    function getOrders(parentId) {
      var url = Constants.serverUrl + 'charge/order/fetch/'+parentId;
      return $http.get(url).then(ResultHandler.successedFuc, ResultHandler.failedFuc);
    };

    function checkOrder(orderId){
      var url = Constants.serverUrl + 'wechatPay/order/'+orderId;
      return $http.get(url).then(ResultHandler.successedFuc, ResultHandler.failedFuc);
    };

    function createOrder(parentId,wxId,goodsId){
      var data = {
        goodsId:goodsId,
        userId:parentId,
        wxId:wxId
      };
      var url = Constants.serverUrl + 'wechatPay/order';
      return $http({
        method: 'post',
        url: url,
        data: data
      }).then(ResultHandler.successedFuc, ResultHandler.failedFuc);
    };

    function createOrder2(parentId,goodsId){
      var data = {
        goodsId:goodsId,
        userId:parentId
      };
      var url = Constants.serverUrl + 'wechatPay/appOrder';
      return $http({
        method: 'post',
        url: url,
        data: data
      }).then(ResultHandler.successedFuc, ResultHandler.failedFuc);
    };

    function updatePayedOrder(parentId,orderId,payTime,endDate){
        //  "cutofftime":endDate, //不确定是什么值
        var data = {
        "paystatus":1,
        "paytime":payTime,
        "orderid":orderId
      };
      var url = Constants.serverUrl + 'charge/order/update/'+parentId;
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
    angular.module('recordCtrl', [])
        .controller('recordCtrl', function($scope, $state, $stateParams, Constants, StateService, vipBuyService, AuthService, MessageToaster, Session) {
            'ngInject';
            var vm = this;

            vm.activated = false;


            $scope.$on('$ionicView.afterEnter', activate);

            function activate() {
                console.log($stateParams);
                vm.index = $stateParams.index;

                vm.activated = true;
                vm.version = Constants.buildID;
                vm.query(vm.index);
            }

            vm.query = function(id){
                console.log(" index = "+id);
                var temp=Session.getData('temp');
                if(temp.OrderID == id)
                    vm.item=temp;

            };

            vm.back = function(){
                StateService.back();
                Session.rmData('temp');
            };


        });
}());

(function() {
  "use strict";
  angular.module('vipRecordModule', [
    'vipRecordCtrl',
    'recordCtrl',
    'vipRecordRouter',
    'vipRecordService'
  ]);

}());

(function() {
    "use strict";
    angular.module('vipRecordCtrl', [])
        .controller('vipRecordCtrl', function($scope, $state, Constants, StateService,vipBuyService,AuthService,MessageToaster,Session) {
            'ngInject';
            var vm = this;
            vm.activated = false;

            $scope.$on('$ionicView.afterEnter', activate);

            function activate() {
                vm.activated = true;
                vm.version = Constants.buildID;
                vm.getRecords();
            }

            vm.back=function(){
                StateService.back();
            };

            vm.goTo=function(id,item){
                Session.setData('temp',item);
                StateService.go('record',{index:id});
            };

            vm.getRecords = function () {
                vipBuyService.getOrders(AuthService.getLoginID()).then(function(data) {
                    if (data.errno == 0) {
                        console.log(data.data);
                        vm.records = data.data;
                    }
                });
            };
        });
}());

(function() {
  'use strict';

  angular.module('vipRecordRouter', [])
    .config(myRouter);


  function myRouter($stateProvider, $urlRouterProvider) {
    'ngInject';
    $stateProvider
        .state('vipRecord', {
          url: "/vipRecord",
          templateUrl: 'vipRecord/vipRecord.html',
          controller: 'vipRecordCtrl',
          controllerAs: 'vm'
        })
        .state('record', {
          url: "/record?:index",
          params:{
            index:0
          },
          templateUrl: 'vipRecord/record.html',
          controller: 'recordCtrl',
          controllerAs: 'vm'
        });
  }
}());

(function() {
  'use strict';

  angular.module('vipRecordService', [])
    .factory('vipRecordService', eService);

  function eService( $q, $http,Constants,ResultHandler) {
    'ngInject';
    var service = {
      exit:exit
    };

    function exit(id) {
      var url = Constants.serverUrl + 'account/exit/'+id;
      return $http.get(url).then(ResultHandler.successedFuc, ResultHandler.failedFuc);
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
          }else if(next.url.indexOf('resetPsw')>0){
              console.log("resetPsw");
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

(function() {
  "use strict";
  angular.module('vipTipsModule', [
    'vipTipsCtrl',
    'vipTipsRouter',
    'vipTipsService'
  ]);

}());

(function() {
    "use strict";
    angular.module('vipTipsCtrl', [])
        .controller('vipTipsCtrl', function($scope, $state, Constants, StateService) {
            'ngInject';
            var vm = this;
            vm.activated = false;
            $scope.$on('$ionicView.afterEnter', activate);
            vm.expend1=false;
            function activate() {
                vm.activated = true;
                vm.version = Constants.buildID;
            }

            vm.back=function(){
                StateService.back();
            };

            vm.test=function(){
                console.log('test');
            }
        });
}());

(function() {
  'use strict';

  angular.module('vipTipsRouter', [])
    .config(myRouter);


  function myRouter($stateProvider, $urlRouterProvider) {
    'ngInject';
    $stateProvider
        .state('vipTips', {
          url: "/vipTips",
          templateUrl: 'vipTips/vipTips.html',
          controller: 'vipTipsCtrl',
          controllerAs: 'vm'
        })
  }
}());

(function() {
  'use strict';

  angular.module('vipTipsService', [])
    .factory('vipTipsService', eService);

  function eService( $q, $http,Constants,ResultHandler) {
    'ngInject';
    var service = {
      exit:exit
    };

    function exit(id) {
      var url = Constants.serverUrl + 'account/exit/'+id;
      return $http.get(url).then(ResultHandler.successedFuc, ResultHandler.failedFuc);
    };

    return service;


  }

}());

//# sourceMappingURL=app.js.map
