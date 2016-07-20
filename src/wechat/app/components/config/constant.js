(function() {
    "use strict";
    angular.module('constant', [])
        .constant('Weixin', {
            'appid': 'wx8839ace7048d181b',
            'originalUrl': 'http%3A%2F%2Fitsmwx.xh.sustc.edu.cn%2F'
        })
        .constant('AUTH_EVENTS', {
            loginSuccess: 'auth-login-success',
            loginFailed: 'auth-login-failed',
            logoutSuccess: 'auth-logout-success',
            sessionTimeout: 'auth-session-timeout',
            notAuthenticated: 'auth-not-authenticated',
            notAuthorized: 'auth-not-authorized'
        });
}());
