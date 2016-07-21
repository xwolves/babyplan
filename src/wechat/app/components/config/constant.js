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
            SUBMIT_SUCESS: '提交成功'
        });
}());
