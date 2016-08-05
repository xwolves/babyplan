/**
 * PortalCtrl Created by sam on 5/19/16.
 */

(function() {
    "use strict";
    angular.module('PortalCtrl', [])
        .controller('PortalCtrl',function($scope,$state,AuthService,$window,Env) {
            $scope.title=Env.AppName;
            //{name:"退出",url:"./logout.html"}

            $scope.hide=AuthService.showNav;
            $scope.btnHide=AuthService.isAdmin;

            var menus_normal=[
                {name:"托管机构列表",url:".depositList",active:0,icon:"glyphicon glyphicon-list",show:true},
                {name:"老师列表",url:".depositList",active:0,icon:"glyphicon glyphicon-list",show:true},
                {name:"孩子列表",url:"portal.childrenList",active:0,icon:"glyphicon glyphicon-list",show:true},
                {name:"不在托管结构的孩子列表",url:".depositList",active:0,icon:"glyphicon glyphicon-list",show:true},
                {name:"指纹设备列表",url:".myDocument",active:0,icon:"glyphicon glyphicon-th-list",show:true},
                {name:"广告列表",url:".mySign",active:0,icon:"glyphicon glyphicon-ok-sign",show:true},
                {name:"关于应用",url:".about",active:0,icon:"glyphicon glyphicon-font",show:true}
            ];
            var menus_admin=[
                {name:"托管机构列表",url:".depositList",active:0,icon:"glyphicon glyphicon-list",show:true},
                {name:"老师列表",url:".teacherList",active:0,icon:"glyphicon glyphicon-list",show:true},
                {name:"孩子列表",url:".childrenList",active:0,icon:"glyphicon glyphicon-list",show:true},
                {name:"指纹设备列表",url:".myDocument",active:0,icon:"glyphicon glyphicon-th-list",show:true},
                {name:"广告列表",url:".mySign",active:0,icon:"glyphicon glyphicon-ok-sign",show:true},
                {name:"关于应用",url:".about",active:0,icon:"glyphicon glyphicon-font",show:true}
            ];

            $scope.menus=menus_admin;

            $scope.navbtns=[
                {name:"用户",url:"#/user",show:true},
                {name:"设置",url:"#/settings",show:true},
                {name:"退出",url:"#/logout",show:true}
            ];

            $scope.$watch('hide', function(newValue, oldValue) {
                console.log("hide value change : "+newValue+ '===' +oldValue);
            });
            $scope.$watch('btnHide', function(newValue, oldValue) {
                console.log("Session.userRole value change : "+newValue+ '===' +oldValue);

            });
            $scope.$on("hideNav", function(event, args){
                $scope.hide=args.hideNav;
                console.log("GET nav hide = "+args);
            });

            $scope.$on("isAdmin", function(event, args){
                console.log("GET btnHide = "+args);
                if(args.isAdmin){
                    $scope.menus=menus_admin;
                }else{
                    $scope.menus=menus_normal;
                };
                $scope.btnHide=args.isAdmin;
            });

        });
}());
