(function() {
  "use strict";
  angular.module('LeftNavMenuCtrl', [])

  .controller('LeftNavMenuCtrl',function($scope,AuthService,Session) {
      $scope.hide=AuthService.showNav;
      $scope.btnHide=AuthService.isAdmin;

      var menus_normal=[
                        {name:"我的交文",url:"myDocument",active:1,icon:"glyphicon glyphicon-th-list",show:true},
                        {name:"创建文件",url:"createDoc",active:0,icon:"glyphicon glyphicon-open-file",show:true},
                        {name:"个人信息",url:"user",active:0,icon:"glyphicon glyphicon-user",show:true},
                        {name:"关于应用",url:"about",active:0,icon:"glyphicon glyphicon-font",show:true}
                    ];
      var menus_admin=[
                        {name:"交文列表",url:"document",active:1,icon:"glyphicon glyphicon-list",show:false},
                        {name:"我的交文",url:"myDocument",active:0,icon:"glyphicon glyphicon-th-list",show:true},
                        {name:"创建文件",url:"createDoc",active:0,icon:"glyphicon glyphicon-open-file",show:true},
                        {name:"统计信息",url:"statistics",active:0,icon:"glyphicon glyphicon-stats",show:false},
                        {name:"个人信息",url:"user",active:0,icon:"glyphicon glyphicon-user",show:true},
                        {name:"应用设置",url:"settings",active:0,icon:"glyphicon glyphicon-cog",show:false},
                        {name:"关于应用",url:"about",active:0,icon:"glyphicon glyphicon-font",show:true}
                    ];

      $scope.menus=menus_admin;

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
