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
                {name:"托管机构管理",url:".depositList",active:0,icon:"glyphicon glyphicon-list",show:true},
                {name:"老师管理",url:".depositList",active:0,icon:"glyphicon glyphicon-list",show:true},
                {name:"孩子管理",url:"portal.childrenList",active:0,icon:"glyphicon glyphicon-list",show:true},
                {name:"打卡记录管理",url:".signList",active:0,icon:"glyphicon glyphicon-font",show:true},
                {name:"不在托管结构的孩子管理",url:".depositList",active:0,icon:"glyphicon glyphicon-list",show:true},
                {name:"指纹设备管理",url:".myDocument",active:0,icon:"glyphicon glyphicon-th-list",show:true},
                {name:"广告管理",url:".mySign",active:0,icon:"glyphicon glyphicon-ok-sign",show:true},
                {name:"关于应用",url:".about",active:0,icon:"glyphicon glyphicon-font",show:true}
            ];
            var menus_admin=[
                {name:"托管机构管理",url:".depositList",active:0,icon:"glyphicon glyphicon-list",show:true},
                {name:"老师管理",url:".teacherList",active:0,icon:"glyphicon glyphicon-list",show:true},
                {name:"孩子管理",url:".childrenList",active:0,icon:"glyphicon glyphicon-list",show:true},
                {name:"打卡记录管理",url:".signList",active:0,icon:"glyphicon glyphicon-list",show:true},
                {name:"指纹设备管理",url:".devicesList",active:0,icon:"glyphicon glyphicon-th-list",show:true},
                {name:"信息发布管理",url:".msgPostList",active:0,icon:"glyphicon glyphicon-th-list",show:true},
                {name:"家长订单表",url:".chargeList",active:0,icon:"glyphicon glyphicon-th-list",show:true},
                {name:"套餐管理",url:".priceList",active:0,icon:"glyphicon glyphicon-th-list",show:true},
                {name:"模拟注册登录",url:".simulatedregistration",active:0,icon:"glyphicon glyphicon-th-list",show:true},
                {name:"广告管理",url:".mySign",active:0,icon:"glyphicon glyphicon-ok-sign",show:true},
                {name:"关于应用",url:".about",active:0,icon:"glyphicon glyphicon-font",show:true}
            ];

            $scope.menus=menus_admin;
            
            $scope.nemuclick=function(menus)
            {
            	
            	for(var i=0;i<$scope.menus.length;i++)
        		{
            		$scope.menus[i].active=0;
        		}
            	
            	menus.active=1;
            	$scope.menus;
            		debugger;
            	
            };

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
