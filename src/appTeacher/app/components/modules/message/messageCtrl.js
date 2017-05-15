(function() {
    "use strict";
    angular.module('messageCtrl', [])
        .controller('messageCtrl', function($scope, Constants, messageService,childrenSteamService, teacherService,AuthService, StateService,Session,$ionicModal, $ionicSlideBoxDelegate) {
            'ngInject';
            var vm = this;
            vm.activated = false;
            vm.messages=[];
            vm.offset=0;
            vm.limit=30;
            vm.canLoadMore=true;
            $scope.$on('$ionicView.afterEnter', activate);

            function activate() {
                vm.activated = true;
                vm.version = Constants.buildID;

                vm.getDepositInfo();
            }

            vm.getDepositInfo = function() {
                teacherService.queryTeacherDeposit(AuthService.getLoginID()).then(function(data) {
                  console.log(data);
                  if (data.errno == 0) {
                      vm.deposit=data.data[0];
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

            vm.getImages=function(msg){
                vm.imgCount=0;
                if(msg.photolink1!=null && msg.photolink1!=""){
                    var data={src:msg.photolink1,msg:''};
                    vm.images[vm.imgCount]=data;
                    vm.imgCount++;
                }
                if(msg.photolink2!=null && msg.photolink2!=""){
                    var data={src:msg.photolink2,msg:''};
                    vm.images[vm.imgCount]=data;
                    vm.imgCount++;
                }
                if(msg.photolink3!=null && msg.photolink3!=""){
                    var data={src:msg.photolink3,msg:''};
                    vm.images[vm.imgCount]=data;
                    vm.imgCount++;
                }
                if(msg.photolink4!=null && msg.photolink4!=""){
                    var data={src:msg.photolink4,msg:''};
                    vm.images[vm.imgCount]=data;
                    vm.imgCount++;
                }
                if(msg.photolink5!=null && msg.photolink5!=""){
                    var data={src:msg.photolink5,msg:''};
                    vm.images[vm.imgCount]=data;
                    vm.imgCount++;
                }
                if(msg.photolink6!=null && msg.photolink6!=""){
                    var data={src:msg.photolink6,msg:''};
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
