(function() {
    "use strict";
    angular.module('messageCtrl', [])
        .controller('messageCtrl', function($scope, Constants, messageService,childrenSteamService, MessageToaster,teacherService,AuthService, StateService,Session,$ionicModal, $ionicSlideBoxDelegate) {
            'ngInject';
            var vm = this;
            vm.activated = false;

            vm.offset=0;
            vm.limit=30;
            vm.canLoadMore=true;
            $scope.$on('$ionicView.afterEnter', activate);

            function activate() {
                vm.activated = true;
                vm.version = Constants.buildID;
                vm.messages=[];
                vm.who=AuthService.getLoginID();
                vm.getDepositInfo();
            }

            vm.getDepositInfo = function() {
                teacherService.queryTeacherDeposit(AuthService.getLoginID()).then(function(data) {
                  console.log(data);
                  if (data.errno == 0) {
                      vm.deposit=data.data[0];
                      Session.setData('latitude',vm.deposit.latitude);
                      Session.setData('longitude',vm.deposit.longitude);
                      vm.getMsg(vm.deposit.depositid,0,vm.limit);
                  };
                });
            };

            vm.getMsg = function(depositid,offset,limit){
                messageService.getMsg(depositid,offset,limit).then(function(data) {
                  console.log(data);
                  //vm.msg=data.data;
                  if (data.errno == 0) {
                      console.log(data.data);
                      var start=0;
                      if(vm.messages.length == 0)
                          vm.messages=data.data;
                      else{
                          start=vm.messages.length;
                          vm.messages=vm.messages.concat(data.data);
                        }
                      console.log(vm.messages);
                      //update comment
                      for(var i=0;i<data.data.length;i++){
                        //vm.messages[start+i]
                        childrenSteamService.getDailyComment(vm.messages[start+i].InfoID,start+i).then(function(sdata) {
                            if (data.errno == 0) {
                                console.log("getDailyComment: ");
                                console.log(sdata.data);
                                var index=sdata.data.index;
                                vm.messages[index].comments = sdata.data.comments;
                                vm.messages[index].likes = sdata.data.likes;
                            }
                        });
                      }
                      vm.offset+=data.data.length;
                      if(data.data.length < vm.limit){
                          console.log("it is the last data");
                          vm.canLoadMore = false;
                      }else{
                          vm.canLoadMore= true;
                      }
                      $scope.$broadcast('scroll.refreshComplete');
                      $scope.$broadcast('scroll.infiniteScrollComplete');
                    }else{
                      console.log(data);
                    }
                });
            };

            vm.doRefresh = function(offset){
                vm.getMsg(vm.deposit.depositid,offset,vm.limit);
            };


            vm.goPhoto=function(msgIndex,index){
                Session.setData('temp',vm.msg[msgIndex]);
                StateService.go("photo",{index:index});
            };

            vm.new=function(id){
                //创建信息
                StateService.go('newMessage');
            };

            vm.del=function(item){
              //console.log(item);
              messageService.deleteMsg(item.InfoID).then(function(data) {
                console.log(data);
                if (data.errno == 0) {
                    MessageToaster.info("删除成功");
                    vm.messages=[];
                    vm.doRefresh(0);
                }else{
                    MessageToaster.error("删除失败 "+data.error);
                }
              });
            }

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
