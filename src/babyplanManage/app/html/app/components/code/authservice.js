(function() {
'use strict';

var app = angular.module('AuthService', [])// 申明
app.factory('AuthService', AuthService);
function AuthService(WebService, Session, Constants, CasService, $cookieStore, $rootScope, $window) {

    var authService = {hideNav:true,isAdmin:false};

    authService.logout = function (casPath){
        Session.destroy();
        $cookieStore.remove('session');
        $cookieStore.remove('id');
        $cookieStore.remove('JSESSIONID');
        CasService.logoutCas().then(function(){
            $window.location.href=casPath;
        });
    };

    //传参为成功的回调success和失败的回调error
    authService.login = function (success,error){
        CasService.queryCasInfo().then(function(cas) {
            console.log(cas);
            Session.ry={gh:cas.gh,mc:cas.mc,bm:cas.bm,sjhm:cas.sjhm,dzyx:cas.dzyx};
            WebService.queryUser(cas.gh).then(function(data){
                if(data.status==0) {
                    //用户存在,不需保存,保存权限
                    Session.userRole=data.content.js;
                    authService.showNav=true;
                    authService.isAdmin=data.content.js=="1"||data.content.js=="0";
                    Session.ry={gh:cas.gh,mc:data.content.mc,bm:data.content.bm,sjhm:data.content.sjhm,dzyx:data.content.dzyx};
                    $rootScope.$broadcast("hideNav", {hideNav:false});
                    $rootScope.$broadcast("isAdmin", {isAdmin:authService.isAdmin});
                    success(Session.userRole);
                }else{
                    //用户第一次登录先保存资料
                    WebService.saveUser(cas.gh, cas.mc, cas.bm, cas.sjhm, cas.dzyx,true).then(function(data){
                        console.log("保存"+cas.mc+"信息成功");
                        Session.userRole="2";
                        authService.showNav=true;
                        authService.isAdmin=false;
                        success(Session.userRole);
                        $rootScope.$broadcast("hideNav", {hideNav:false});
                        $rootScope.$broadcast("isAdmin", {isAdmin:authService.isAdmin});
                    }, function (reason) {
                    	console.log("authService login fail : "+reason);
                    	authService.showNav=true;
                        authService.isAdmin=false;
                        success(Session.userRole);
                        $rootScope.$broadcast("hideNav", {hideNav:false});
                        $rootScope.$broadcast("isAdmin", {isAdmin:authService.isAdmin});
                    });
                }
            }, function (reason) {
                error();
            });
        }, function (reason) {
            error();
        });
    };

    authService.getBasePath = function(){
//        if(Session.userRole==Constants.USER_ROLES.normal){
//        	return Constants.NormalStatePath;
//        }else if(Session.userRole==Constants.USER_ROLES.admin||Session.userRole==Constants.USER_ROLES.receiver){
//         	return Constants.PortalStatePath;
//        }else{
         	return Constants.LoginStatePath;
//        }
    };

    authService.isLogin = function () {
        return !!Session.ry.gh;
    };

    authService.needLogin = function () {
        console.log("check role if needLogin "+Session.userRole);
        return (Session.userRole == Constants.USER_ROLES.unknown)||(Session.userRole == Constants.USER_ROLES.all);
    };

    authService.hasPermission = function () {
        return (Session.userRole == Constants.USER_ROLES.admin)||(Session.userRole == Constants.USER_ROLES.receiver);
    };

    authService.isReceiver = function () {
        console.log("isReceiver userRole="+Session.userRole+" result="+(Session.userRole===Constants.USER_ROLES.receiver));
        return Session.userRole === Constants.USER_ROLES.receiver;
    };

    authService.isNormalUser = function () {
        console.log("isNormal userRole="+Session.userRole+" result="+(Session.userRole===Constants.USER_ROLES.normal));
        return Session.userRole === Constants.USER_ROLES.normal;
    };

    authService.getUser = function(){
        return Session.ry;
    };

    authService.setUser = function(mc,bm,sjhm,dzyx){
        if(mc!=null)Session.ry.mc=mc;
        if(bm!=null)Session.ry.bm=bm;
        if(sjhm!=null)Session.ry.sjhm=sjhm;
        if(dzyx!=null)Session.ry.dzyx=dzyx;
    };

    authService.getUserRole = function(){
        return Session.userRole;
    };

    return authService;
};

}());
