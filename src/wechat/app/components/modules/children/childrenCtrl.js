(function() {
    "use strict";
    angular.module('childrenCtrl', [])
        .controller('childrenCtrl', function($scope, Constants,childrenService,AuthService,Session, StateService,$ionicModal, $ionicSlideBoxDelegate) {
            'ngInject';
            console.log("childrenCtrl");
            var vm = this;
            vm.activated = false;
            vm.parent={};
            vm.fingerprintLogs=[];
            vm.fingerprintLogSample=[];
            vm.messages=[];
            vm.offset=0;
            vm.limit=30;
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
                vm.getChildrenInfo(AuthService.getLoginID(),vm.offset,vm.limit);

                vm.getChildren();
            };

            vm.getChildrenInfo = function(pId,offset,limit){
                childrenService.getChildrenAllInfo(pId,offset,limit).then(function(data) {
                    if (data.errno == 0) {
                        console.log("getChildrenAllInfo: ");
                        console.log(data.data);
                        if(vm.messages.length == 0)
                            vm.messages=data.data;
                        else
                            vm.message.push(data.data);
                        console.log(vm.messages);
                        vm.offset+=data.data.length;
                    }else{
                        console.log(data);
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

            vm.getImg = function(type){
                if(type == 1){
                    return {name:"就餐",src:"img/dinner.png"};
                }else if(type == 2){
                    return {name:"培训",src:"img/traning.png"};
                }else if(type == 3){
                    return {name:"活动",src:"img/play.png"};
                }else if(type == 4){
                    return {name:"作业",src:"img/homework.png"};
                }else if(type == 5){
                    return {name:"接入",src:"img/login.png"};
                }else if(type == 6){
                    return {name:"送到",src:"img/logout.png"};
                }else{
                    return {name:"未知信息类型",src:"img/unknown.png"};
                }
            };

            vm.goPhoto=function(msgIndex,index){
                Session.temp=vm.msg[msgIndex];
                StateService.go("photo",{index:index});
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

            vm.getImages=function(msg){
                vm.imgCount=0;
                if(msg.PhotoLink1!=null && msg.PhotoLink1!=""){
                    var data={src:msg.PhotoLink1,msg:''};
                    vm.images[vm.imgCount]=data;
                    vm.imgCount++;
                }
                if(msg.PhotoLink2!=null && msg.PhotoLink2!=""){
                    var data={src:msg.PhotoLink2,msg:''};
                    vm.images[vm.imgCount]=data;
                    vm.imgCount++;
                }
                if(msg.PhotoLink3!=null && msg.PhotoLink3!=""){
                    var data={src:msg.PhotoLink3,msg:''};
                    vm.images[vm.imgCount]=data;
                    vm.imgCount++;
                }
                if(msg.PhotoLink4!=null && msg.PhotoLink4!=""){
                    var data={src:msg.PhotoLink4,msg:''};
                    vm.images[vm.imgCount]=data;
                    vm.imgCount++;
                }
                if(msg.PhotoLink5!=null && msg.PhotoLink5!=""){
                    var data={src:msg.PhotoLink5,msg:''};
                    vm.images[vm.imgCount]=data;
                    vm.imgCount++;
                }
                if(msg.PhotoLink6!=null && msg.PhotoLink6!=""){
                    var data={src:msg.PhotoLink6,msg:''};
                    vm.images[vm.imgCount]=data;
                    vm.imgCount++;
                }
                console.log(vm.images);
            };

            $ionicModal.fromTemplateUrl('message/image-modal.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function(modal) {
                $scope.modal = modal;
            });

            $scope.openModal = function() {
                $ionicSlideBoxDelegate.slide(0);
                $scope.modal.show();
            };

            $scope.closeModal = function() {
                $scope.modal.hide();
            };

            // Cleanup the modal when we're done with it!
            $scope.$on('$destroy', function() {
                $scope.modal.remove();
            });
            // Execute action on hide modal
            $scope.$on('modal.hide', function() {
                // Execute action
            });
            // Execute action on remove modal
            $scope.$on('modal.removed', function() {
                // Execute action
            });
            $scope.$on('modal.shown', function() {
                console.log('Modal is shown!');
            });

            // Call this functions if you need to manually control the slides
            $scope.next = function() {
                $ionicSlideBoxDelegate.next();
            };

            $scope.previous = function() {
                $ionicSlideBoxDelegate.previous();
            };

            $scope.goToSlide = function(index,msg) {
                vm.images=[];
                vm.getImages(msg);
                $scope.modal.show();
                $ionicSlideBoxDelegate.slide(index);
            };

            // Called each time the slide changes
            $scope.slideChanged = function(index) {
                $scope.slideIndex = index;
            };
        });
}());
