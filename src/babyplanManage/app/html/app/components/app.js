(function() {
  "use strict";
  angular.module('xhStarter', [
      'vendor',
      'config',
      'code',
      'modules'
    ])
    .run(appRun)//后执行
    .config(appConfig)//先执行
    .factory('AuthInterceptor',AuthInterceptor);

  function appRun($rootScope, $state, Constants, AuthService) {
    'ngInject';
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
        console.log("to "+JSON.stringify(toState)+" - Params "+JSON.stringify(toParams));
        console.log("from "+JSON.stringify(fromState) +" - Params "+JSON.stringify(fromParams));
    });

    AuthService.login(function(data){
//        if(AuthService.needLogin()) {
//        	debugger;
//            $state.go(Constants.LoginStatePath,{needLogin:true});
//        }else{
//        	debugger;
            $state.go(AuthService.getBasePath());
//        }
    },function(){
        
        $state.go(Constants.LoginStatePath,{needLogin:true});
    });
  }

  function appConfig($httpProvider) {
    'ngInject';

    debugger;
    $httpProvider.defaults.cache = false;
    if (!$httpProvider.defaults.headers.get) {
    	$httpProvider.defaults.headers.get = {};
    }
    // disable IE ajax request caching
    $httpProvider.defaults.headers.get['If-Modified-Since'] = '0';

    // Disable IE ajax request caching
    $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
    $httpProvider.defaults.headers.get['Pragma'] = 'no-cache';

    $httpProvider.interceptors.push([
      '$injector',
      function($injector) {
        return $injector.get('AuthInterceptor');
      }
    ]);
  }

  function AuthInterceptor($rootScope, $q, Constants) {
    return {
      responseError: function(response) {
        $rootScope.$broadcast({
          401: Constants.AUTH_EVENTS.notAuthenticated,
          403: Constants.AUTH_EVENTS.notAuthorized,
          419: Constants.AUTH_EVENTS.sessionTimeout,
          440: Constants.AUTH_EVENTS.sessionTimeout
        }[response.status], response);
        return $q.reject(response);
      }
    };
  }


}());
