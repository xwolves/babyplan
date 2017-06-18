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

    .run(function ($ionicPlatform, $state, AuthService, JPushService) {
        $ionicPlatform.registerBackButtonAction(function (event) {
           // alert("cur：" + JSON.stringify($state.current));
            if ($state.current.name == AuthService.getNextPath()) {
                event.preventDefault();
                cordova.plugins.backgroundMode.moveToBackground();
            }
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

         
            //应用可以进入后台运行
            //cordova.plugins.backgroundMode.enable();
            //cordova.plugins.backgroundMode.overrideBackButton();
            //cordova.plugins.backgroundMode.on('activate', function () {
            //     cordova.plugins.notification.badge.clear();
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
