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
            if (window.cordova && window.cordova.plugins.Keyboard) {
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
            $ionicConfigProvider.platform.android.tabs.position('bottom');
            $ionicConfigProvider.views.transition('none');
            $ionicConfigProvider.backButton.text('返回').icon('ion-ios-arrow-left');
            $ionicConfigProvider.tabs.style("standard");
            $ionicConfigProvider.navBar.alignTitle('center');
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
            'baiduMap'
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
      return Session.userId;
    };

    function getLoginToken() {
      return Session.token;
    };

    function getUserRole() {
      return Session.userRole;
    };
    function getWechatId(){
      return Session.wechat;
    }

    function setSession(id,token,role,wechat){
      Session.create(token,id,role,wechat);
    };

    function getNextPath() {
      if(Session.userRole==Role.Organizer){
        return Path.OrganizerRolePath;
      }else if(Session.userRole==Role.Parent){
        return Path.ParentRolePath;
      }else if(Session.userRole==Role.Teacher){
        return Path.TeacherRolePath;
      }
    };

    return authService;
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
    angular.module('Session', []).service('Session', function($http) {
        'ngInject';

        var session = {
            create: create,
            destroy: destroy,
            updateRoles: updateRoles
        };

        function create(token, userId, roles, wechat) {
            session.token = token;
            session.userId = userId;
            session.userRole = roles;
            session.wechat = wechat;
            if(token!=null){
                //$http.defaults.headers.common.Authorization = "Bearer-"+token;
                $http.defaults.headers.common.token = token;
            }

            //    $httpProvider.defaults.headers.common["Authorization"] = "Bearer-"+token;
            console.log(session);
        }

        function destroy() {
            session.token = null;
            session.userId = null;
            session.userRole = null;
            session.wechat = null;
            console.log("session destroy");
            alert("my session destroyed");
        }

        function updateRoles(roles) {
            session.userRole = roles;
        };
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
      var currentStateId = [$ionicHistory.currentView().stateId];
      $ionicViewSwitcher.nextDirection('back');
      $timeout(clearPreviousStateCache(currentStateId), 700);
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
  angular.module('code', [
    'Session',
    'StateService',
    'CacheData',
    'AuthService',
    'LoadingAlert',
    'ResultHandler',
    'MessageToaster',
    'CustomFilter'
  ]);

}());

(function() {
'use strict';

var app = angular.module('CustomFilter', []);
app.filter('gendarChange', function () {
    return function (input) {
        if (input == "1")return "男";
        else if (input == "2")return "女";
        else return "未知";
    };
});

app.filter('JSchange', function () {
    return function (input) {
        if (input == "1")return "托管机构";
        else if (input == "3")return "老师";
        else if (input == "2")return "家长";
        else return "未知人员";
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
            return d.Format('hh')+"小时前";
        }else{
            return d.Format('mm')+"分钟前";
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
            'ParentRolePath':'tabs.children',
            'OrganizerRolePath':'tabs.organizer',
            'TeacherRolePath':'tabs.message'
        })
        .constant('Role',{
            'unknown':'-1',
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
            'appTitle':'托管系统',
            'serverUrl': '/api/v1/',
            'dfsUrl': '/',
            'buildID': '20161101v1',
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

    ]);

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
  angular.module('tools', [
    
  ]);

}());

(function() {
    "use strict";
    angular.module('modules', [
        'LoginModule',
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
        'photoModule'
    ]);

}());

(function() {
    "use strict";
    angular.module('LoginModule', [
        'WXLoginCtrl',
        'LoginRouter',
        'LoginService'
    ]).run(function($rootScope, Session, StateService,$location) {
        $rootScope.$on('$stateChangeStart', function(event, next) {
          if (next.url.indexOf('wxlogin')>0 ) {
              console.log("wxlogin");
          }else if(next.url.indexOf('login')>0){
              console.log("login");
          }else if(next.url.indexOf('register')>0){
              //未绑定用户者,进入注册绑定页面
              console.log("register");
          }else{
            if (Session.userId && Session.token) {
                //login successed
            } else {
                console.log("user not login with ");
                event.preventDefault();
                StateService.clearAllAndGo('wxlogin');
            }
          }
        });
        //alert($location.absUrl());
        var url = $location.absUrl();
        //获取ticket参数，因为angualr的路径不规范，会出现http://10.20.68.73:8080/casOauth/?ticket=ST-16-HzIjcAlxbKvlyJQAX2XI-cas01.sustc.edu.cn#/login，无法用公共方法获取
        var start = url.indexOf('user=') + 5;
        var end = url.indexOf('&type=');
        //如果是http://10.20.68.73:8080/casOauth?ticket=ST-16-HzIjcAlxbKvlyJQAX2XI-cas01.sustc.edu.cn这种情况
        //或者是是http://10.20.68.73:8080/casOauth/#/login?ticket=ST-16-HzIjcAlxbKvlyJQAX2XI-cas01.sustc.edu.cn这种情况
        if (end == -1 || end < start) end = url.length;
        console.log("login 1" + start + " - " + end);
        var myUser = url.toString().substring(start, end);
        console.log("get user = " + myUser);

        var start = url.indexOf('&type=') + 6;
        var end = url.indexOf('#/wxlogin');
        if (end == -1 || end < start) end = url.length;
        console.log("login 2" + start + " - " + end);
        var myType = url.toString().substring(start, end);
        console.log("get type = " + myType);

        StateService.clearAllAndGo('wxlogin',{user:myUser,type:myType});
    });

}());

(function() {
  'use strict';

  angular.module('LoginRouter', [])
    .config(LoginRouter);


  function LoginRouter($stateProvider,$urlRouterProvider) {
    'ngInject';
    $stateProvider
    .state('wxlogin', {
      url: "/wxlogin?:user&:type",
      params:{
        user:null,
        type:0
      },
      templateUrl: 'Login/wxlogin.html',
      controller: 'WXLoginCtrl',
      controllerAs: 'vm'
    });
    // $urlRouterProvider.when('', '/wxlogin');
    $urlRouterProvider.otherwise('/wxlogin');

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
    angular.module('WXLoginCtrl', [])
        .controller('WXLoginCtrl', function(Constants, AuthService, MessageToaster, LoginService, $timeout, $scope, Session, $stateParams, StateService, $ionicModal, Role) {
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
            //    vm.user = "oVyGDuNPkAbtljfJKusP4oaCrYG0";//test
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
                                AuthService.setSession(u.uid, u.token, u.type,userid);
                                StateService.clearAllAndGo(AuthService.getNextPath());
                            }
                        }
                    }else{
                        if(response.errno==12004){
                            //no data found
                            AuthService.setSession(null, null, Role.unknown,userid);

                            StateService.clearAllAndGo("register");
                        }
                        MessageToaster.error(response.error);
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
                    AuthService.setSession(response.data.uid, response.data.token,response.data.type);
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
                vm.getChildrenInfo(AuthService.getLoginID());

                vm.getChildrenMsg(AuthService.getLoginID());

                vm.getChildren();
            };

            vm.getChildrenInfo = function(pId){
                childrenService.getChildrenSignIn(pId).then(function(data) {
                    if (data.errno == 0) {
                        console.log("getChildrenSignIn: ");
                        console.log(data.data);
                        vm.fingerprintLogs=data.data;
                        for(var i=0;i<vm.fingerprintLogs.length;i++){
                            vm.fingerprintLogSample[i]=vm.fingerprintLogs[i];
                            if(i>=1){
                                break;
                            }
                        }
                        console.log(vm.fingerprintLogSample);
                    }else{
                        console.log(data);
                    }
                });
            };
            vm.getChildrenMsg = function(pId){
                childrenService.getChildrenMsg(pId).then(function(data) {
                    if (data.errno == 0) {
                        console.log("getChildrenMsg: ");
                        console.log(data.data);
                        vm.msg = data.data;
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

            vm.goPhoto=function(msgIndex,index){
                Session.temp=vm.msg[msgIndex];
                StateService.go("photo",{index:index});
            };

            // {childuid: "40000003", childname: "赵小萌", timeline: Array[1]}
            //childname:"赵小萌"
            //childuid:"40000003"
            //timeline:Array[1]
            //0:Object
            //clickcount:"0"
            //createtime:"2016-08-12 09:29:36"
            //depositid:"10000001"
            //description:null
            //infoid:"1"
            //infotype:null
            //latitude:null
            //longitude:null
            //photolink1:"http://a"
            //photolink2:"http://b"
            //photolink3:null
            //photolink4:null
            //photolink5:null
            //photolink6:null
            //publisherid:"0"
            //status:"1"
            vm.getMsg = function(childId){
                childrenService.getMsg(childId).then(function(data) {
                    if (data.errno == 0) {
                        console.log(data.data);
                        vm.msg = data.data;
                    }
                });
            };
            vm.getChildSignIn = function(childId,name){
                childrenService.getChildSignIn(childId).then(function(data) {
                    if (data.errno == 0 ) {
                        data.data.forEach(function(item){
                            item.childId=childId;
                            item.childName=name;
                            vm.fingerprintLogs.push(item);
                        });
                    }
                    console.log(JSON.stringify(vm.fingerprintLogs));
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
      getWechatInfo:getWechatInfo
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

    function getWechatInfo(wid) {
        var url = Constants.serverUrl + 'wechat/'+wid;
        return $http.get(url).then(ResultHandler.successedFuc, ResultHandler.failedFuc);
    };

    return service;


  }


}());

(function() {
    "use strict";
    angular.module('childrenEditCtrl', [])
        .controller('childrenEditCtrl', function($scope, $stateParams, Constants, StateService,childrenSettingService,AuthService,Session) {
            'ngInject';
            var vm = this;
            vm.activated = false;

            vm.query = function(id){
                console.log("child id = "+id);
                vm.child=Session.temp;
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
                else vm.child = {name:'',sex:'',remark:'',relationship:''};
            }

            vm.back=function(){
                StateService.back();
            };

            vm.save=function(){
                //save
                if(vm.type=='1'){
                    //create
                    childrenSettingService.registerChildren(vm.child,AuthService.getLoginID()).then(function(data) {
                        if (data.errno == 0) {
                            //var userId = data.data.uid;
                            //wxlogin(vm.user.wechat);
                            StateService.back();
                        }
                    });

                }else{
                    //update
                    StateService.back();
                }

            };


        });
}());

(function() {
  "use strict";
  angular.module('childrenSettingModule', [
    'childrenSettingCtrl',
    'childrenEditCtrl',
    'childrenSettingRouter',
    'childrenSettingService'
  ]);

}());

(function() {
    "use strict";
    angular.module('childrenSettingCtrl', [])
        .controller('childrenSettingCtrl', function($scope,Constants,StateService,$ionicListDelegate,$ionicPopup,AuthService,parentService,Session) {
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
                Session.temp=child;
                StateService.go('childrenEdit',{cid:id,type:0});
            };

            vm.newChild=function(){
                //创建新的孩子信息
                $ionicListDelegate.closeOptionButtons();
                StateService.go('childrenEdit',{type:1});
            };

            vm.editChild=function(id,child){
                //编辑孩子信息
                $ionicListDelegate.closeOptionButtons();
                Session.temp=child;
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
                        console.log('confirm to del this child '+child.sid);
                        //delete(id);
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
      registerChildren:registerChildren
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
    function registerChildren(child,parentId) {
      var data = {
        "p_uid":parentId,
        "name": child.name,
        "sex": child.sex,
        "relationship": child.relationship,
        "remark": child.remark
      };
      console.log(data);
      var url = Constants.serverUrl + 'account/register/children';
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
            vm.text='确定要退出本微信用户绑定的业务';//'正在退出...';
            $scope.$on('$ionicView.afterEnter', activate);

            function activate() {
                vm.activated = true;
                vm.version = Constants.buildID;
            }

            vm.exit=function(){
                vm.text='正在退出...';
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
                Session.temp=vm.msg[msgIndex];
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
      //var url = "http://zssys.sustc.edu.cn/testApi/" + 'upload1';
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
                    "latitude":"",
                    "longitude":"",
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
  angular.module('nearbyModule', [
    'nearbyCtrl',
    'nearbyListCtrl',
    'nearbyDepositInfoCtrl',
    'nearbyRouter',
    'nearbyService'
  ]);

}());

(function() {
    "use strict";
    angular.module('nearbyCtrl', [])
        .controller('nearbyCtrl', function($scope, Constants,nearbyService,MessageToaster,StateService,Session,CacheData) {
            'ngInject';

            var vm = this;
            vm.activated = false;
            vm.map = null;
            vm.point = null;
            vm.city = 'shenzhen';
            vm.show=false;
            vm.distance = 100000;
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
        .controller('nearbyDepositInfoCtrl', function($scope, Constants,nearbyService,CacheData,$stateParams,StateService,organizerService,commentService) {
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
            }

            vm.back=function(){
                StateService.back();
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
                commentService.queryDepositComment(id).then(function(data) {
                    if (data.errno == 0) {
                        console.log(data.data);
                        vm.comments = data.data;
                    }else{
                        console.log('error,get comment fail');
                        console.log(data);
                    }
                });
            };
        });
}());

(function() {
    "use strict";
    angular.module('nearbyListCtrl', [])
        .controller('nearbyListCtrl', function($scope, Constants,nearbyService,StateService,Session,CacheData) {
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
                //Session.temp=item;
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
  angular.module('orderModule', [
    'orderCtrl',
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
      });
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
    'parentService'
  ]);

}());

(function() {
    "use strict";
    angular.module('parentCtrl', [])
        .controller('parentCtrl', function($scope, Constants, StateService, parentService, AuthService) {
            'ngInject';
            var vm = this;
            vm.activated = false;
            $scope.$on('$ionicView.afterEnter', activate);

            function activate() {
                vm.activated = true;
                vm.version = Constants.buildID;
                vm.getTeacher();
                vm.getChildren();
            }

            vm.back = function(){
                StateService.back();
            };

            vm.getTeacher = function(){
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
                    }
                });
            };

        });
}());

(function() {
    "use strict";
    angular.module('parentEditCtrl', [])
        .controller('parentEditCtrl', function($scope, Constants,AuthService,parentService) {
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

        });
}());

(function() {
  'use strict';

  angular.module('parentRouter', [])
    .config(myRouter);


  function myRouter($stateProvider, $urlRouterProvider) {
    'ngInject';
    $stateProvider
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

  function parentService( $q, $http, Constants, ResultHandler) {
    'ngInject';
    var service = {
      queryParent:queryParent,
      queryChildren:queryChildren
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
                vm.msg=Session.temp;
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

(function() {
    "use strict";
    angular.module('profileCtrl', [])
        .controller('profileCtrl', function($scope, $state, Constants, StateService) {
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

(function() {
    "use strict";
    angular.module('registerCtrl', [])
        .controller('registerCtrl', function($scope, Constants,StateService,Session,AuthService,registerService,LoginService,MessageToaster,Role) {
            'ngInject';
            var vm = this;
            vm.activated = false;
            console.log("tabs come");
            vm.count=0;
            vm.isLock=false;
            vm.org={mobile:'', password:''};
            //微信uid的初始化
            vm.user={ gendar:'1', name:'', mobile:'', password:'', pswConfirm:'', wechat:AuthService.getWechatId()};
            vm.error=null;
            $scope.$on('$ionicView.afterEnter', activate);

            function activate() {
                vm.activated = true;
                vm.version = Constants.buildID;
                vm.roleType = '2';
                console.log(vm.user);
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
                    if (vm.user.password.length < 8) {
                        vm.error = '密码长度必须不小于8位';
                    } else {
                        vm.error = null;
                    }
                }else{
                    vm.error = '密码必须填写';
                }
            });
            $scope.$watch('vm.user.pswConfirm', function(newValue, oldValue) {
                if(vm.user.pswConfirm!=undefined) {
                    if (vm.user.password != '' && vm.user.password.length >= 8  && vm.user.pswConfirm != vm.user.password) {
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
                    if(vm.user.password.length >= 8 && vm.user.pswConfirm.length >= 8
                        && vm.user.name.length > 0 && vm.user.mobile.length == 11
                        && vm.user.password == vm.user.pswConfirm) return true;
                    else vm.error = '数据未填完哦!';
                }
            };

            vm.simpleCheck = function(){
                if(vm.org.password.length >= 8 && (vm.org.account.length == 11 || vm.org.account.length == 8 )){
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
                            MessageToaster.info("undefine have select  " + result.length);
                            //vm.showChooseModal();

                        } else {
                            console.log(result[0]);
                            if (result[0].uid != null && result[0].token != null && result[0].type != null) {
                                console.log("goto next");
                                AuthService.setSession(result[0].uid, result[0].token, result[0].type, userid);
                                StateService.clearAllAndGo(AuthService.getNextPath());
                            }
                        }
                        console.log(result);

                    } else {
                        if (response.errno == 12004) {
                            //no data found
                            console.log("找不到任何信息");
                        }
                        MessageToaster.error(response.error);
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
        url: "/register",
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
            getHomeOptions: getHomeOptions,
            getSlideBoxImgs: getSlideBoxImgs
        };

        function getHomeOptions() {
            return [{
                label: '填写信息',
                iconSrc: 'img/home_icon1.png',
                state: 'PersonalDetails',
                textColor:"#DC5858"
            }, {
                label: '到校方式',
                iconSrc: 'img/home_icon2.png',
                state: 'PersonalDetails',
                textColor:"#5976DF"
            }, {
                label: '新生报到',
                iconSrc: 'img/home_icon3.png',
                state: 'Register',
                textColor:"#27CAD4"
            }, {
                label: '修改密码',
                iconSrc: 'img/home_icon4.png',
                state: 'ModifyPsw',
                textColor:"#DC75E0"
            }, {
                label: '关于应用',
                iconSrc: 'img/home_icon5.png',
                state: 'About',
                textColor:"#75E084"
            }]
        }

        function getSlideBoxImgs() {
            return [{
                index: 0,
                src: "img/home_bg1.png"
            }, {
                index: 1,
                src: "img/home_bg2.png"
            }, {
                index: 2,
                src: "img/home_bg3.png"
            }];
        }
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
    angular.module('buyCtrl', [])
        .controller('buyCtrl', function($scope, $state, $stateParams, Constants, StateService, vipBuyService, AuthService, MessageToaster, Session) {
            'ngInject';
            var vm = this;

            vm.activated = false;
            vm.wechatPayReady = false;
            vm.information = "";

            $scope.onBridgeReady=function () {
                //alert('wechat ok');
                vm.wechatPayReady=true;
            };

            if (typeof WeixinJSBridge == "undefined"){
                console.log("not found WeixinJSBridge");
                if(document.addEventListener){
                    document.addEventListener('WeixinJSBridgeReady', $scope.onBridgeReady, false);
                }else if (document.attachEvent){
                    document.attachEvent('WeixinJSBridgeReady', $scope.onBridgeReady);
                    document.attachEvent('onWeixinJSBridgeReady', $scope.onBridgeReady);
                }
                console.log("add event listener for WeixinJSBridge");
            }else{
                console.log("WeixinJSBridge exist");
                $scope.onBridgeReady();
            }

            $scope.$on('$ionicView.afterEnter', activate);

            function activate() {
                console.log($stateParams);
                vm.index = $stateParams.index;

                vm.activated = true;
                vm.version = Constants.buildID;
                vm.query(vm.index);
                vm.wechatInit();
            }

            vm.query = function(id){
                console.log(" index = "+id);
                if(Session.temp.businessid == id)
                    vm.item=Session.temp;

            };

            vm.back = function(){
                StateService.back();
                Session.temp = null;
            };

            vm.getEndDate = function(payTime,numOfDays){
                var date=new Date(payTime.substring(0,4),Number(payTime.substring(4,6))-1,payTime.substring(6,8),payTime.substring(8,10),payTime.substring(10,12),payTime.substring(14,16));
                date.setTime(date.getTime()+numOfDays*24*60*60*1000);
                return date.getTime();
                //return ""+date.getFullYear()+(date.getMonth()+1)+(date.getDate()>9?date.getDate():('0'+date.getDate()))+'235959';
            };

            vm.pay=function(){
                var parentId=AuthService.getLoginID();
                vipBuyService.createOrder(parentId, AuthService.getWechatId(), vm.index)
                    .then(function (response) {
                        var result=response.data;
                        var orderId=result.orderId;
                        //vm.information = JSON.stringify(result);
                        //alert(JSON.stringify(result));
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
                                    alert(JSON.stringify(res));
                                    //alert(res.err_msg);
                                    if(res.err_msg == "get_brand_wcpay_request:ok" ) {
                                        //保存数据．跳转页面
                                        //check order make sure user had pay the order ready.
                                        vipBuyService.checkOrder(orderId).then(
                                            function(result) {
                                                //{"errno":0,"error":"",
                                                // "data":{"orderId":"139630530220161103152842","wechatOrderId":"4003682001201611038611986947",
                                                // "totalFee":"1","payState":"SUCCESS","payTime":"20161103152851"}}
                                                //alert(JSON.stringify(result));
                                                var status = result.data.payState;
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
                                            },
                                            function (reason) {
                                                alert("checkOrder error "+JSON.stringify(reason));
                                            }
                                        );
                                    //}else if(res.err_msg == "get_brand_wcpay_request:cancel"){
                                    }else if(res.err_msg.endsWith("cancel")){
                                        //alert("用户取消");
                                        //vm.information="用户取消";
                                        MessageToaster.info("微信支付已取消");
                                    //}else if(res.err_msg == "get_brand_wcpay_request:fail"){
                                    }else if(res.err_msg.endsWith("fail")){
                                        alert("付款失败");
                                    }
                                }
                            );
                        }
                    }, function (error) {
                        //alert(JSON.stringify(error));
                        vm.information += " 请求付款失败 " + error;
                    });
            };

        });
}());

(function() {
  "use strict";
  angular.module('vipBuyModule', [
    'vipBuyCtrl',
    'buyCtrl',
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
                Session.temp=where;
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
          controller: 'buyCtrl',
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
  angular.module('vipRecordModule', [
    'vipRecordCtrl',
    'vipRecordRouter',
    'vipRecordService'
  ]);

}());

(function() {
    "use strict";
    angular.module('vipRecordCtrl', [])
        .controller('vipRecordCtrl', function($scope, $state, Constants, StateService,exitService,AuthService,MessageToaster,Session) {
            'ngInject';
            var vm = this;
            vm.activated = false;

            $scope.$on('$ionicView.afterEnter', activate);

            function activate() {
                vm.activated = true;
                vm.version = Constants.buildID;
                vm.records=[{name:'骗你的数据',time:'2016-09-09 19:59:59'}];
            }

            vm.back=function(){
                StateService.back();
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
