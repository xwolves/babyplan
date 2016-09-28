(function() {
    "use strict";
    angular.module('childrenCtrl', [])
        .controller('childrenCtrl', function($scope, Constants,childrenService,AuthService,Session, StateService) {
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

        });
}());
