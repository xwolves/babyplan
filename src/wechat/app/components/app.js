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

    .config(function($ionicConfigProvider, $urlRouterProvider, $stateProvider, $httpProvider) {
            console.log("start app");
            if (!ionic.Platform.isIOS()) {
                $ionicConfigProvider.scrolling.jsScrolling(false);
            }

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
