(function () {
    "use strict";
    angular.module('childrenSteamCtrl', [])
        .controller('childrenSteamCtrl', function ($scope, $ionicPopup, $sce, Constants, childrenService, childrenSteamService, AuthService, Session, StateService, $ionicModal, $ionicSlideBoxDelegate) {
            'ngInject';
            console.log("childrenSteamCtrl");
            var vm = this;
            vm.activated = false;
            vm.parent = {};
            vm.deposits = {};
            vm.fingerprintLogs = [];
            vm.messages = [];
            vm.cameras = [];
            vm.unPaid = false,
            vm.myComment;
            vm.simpleFilter = '';
            vm.offset = [0, 0, 0];
            vm.limit = 30;
            vm.error = '';
            vm.canLoadMore = [true, true, true];
            $scope.$on('$ionicView.afterEnter', activate);
            vm.steam = 1;
            function activate() {
                vm.activated = true;
                vm.version = Constants.buildID;
                vm.user = AuthService.getLoginID();
                //从微信获取家长的基本信息
                //vm.getWechatInfo(AuthService.getWechatId());
                //vm.parent.wechat={
                //    "nickname": "Band",
                //    "sex": 1,
                //    "language": "zh_CN",
                //    "city": "广州",
                //    "province": "广东",
                //    "country": "中国",
                //    "headimgurl":  "http://wx.qlogo.cn/mmopen/g3MonUZtNHkdmzicIlibx6iaFqAc56vxLSUfpb6n5WKSYVY0ChQKkiaJSgQ1dZuTOgvLLrhJbERQQ4eMsv84eavHiaiceqxibJxCfHe/0"
                //};
                //vm.getChildrenInfo(AuthService.getLoginID(),vm.offset,vm.limit);
                //vm.getChildren();
                vm.getChildrenDeposit();
                vm.steam = Session.getData('steam');

                if (vm.steam === null) {
                    vm.steam = 1;
                    console.log('steam = ' + vm.steam);
                }
                vm.changeSteam(vm.steam);
            };

            vm.changeSteam = function (index) {
                vm.steam = index;
                Session.setData('steam', index);
                if (index === 0) {
                    vm.showCamera = true;
                    vm.showFingerPrint = false;
                    vm.showNotificatin = false;
                    if (vm.cameras.length === 0) vm.getCamera();
                } else if (index === 1) {
                    vm.showCamera = false;
                    vm.showFingerPrint = true;
                    vm.showNotificatin = false;
                    console.log('fingerprintLogs = ' + vm.fingerprintLogs);
                    if (vm.fingerprintLogs.length === 0) vm.getFingerPrint(0, vm.limit);
                } else if (index === 2) {
                    vm.showCamera = false;
                    vm.showFingerPrint = false;
                    vm.showNotificatin = true;
                    if (vm.messages.length === 0) vm.getMessage(0, vm.limit);
                }
            };

            vm.watchVideo = function (video, name) {
                video.deposit_name = name;
                Session.setData('video', JSON.stringify(video));
                StateService.go('video');
            };

            vm.getChildrenDeposit = function () {
                childrenSteamService.getChildrenDeposit(AuthService.getLoginID()).then(function (data) {
                    if (data.errno == 0) {
                        console.log(data.data);
                        vm.deposits = data.data;
                    }else {
                        vm.unPaid = true;
                        vm.error = data.error;
                    }
                });
            };

            vm.getCamera = function () {

                var count = 1,
                    depositsCount = vm.deposits.length;

                //获取摄像头信息
                for (var i = 0; i < depositsCount; i++) {
                    var id = vm.deposits[i].DepositID;
                    //get camera
                    if (id != null) {
                        //console.log('http://v.zxing-tech.cn/?v='+id);
                        //vm.cameraSrc = $sce.trustAsResourceUrl('http://v.zxing-tech.cn/?v='+id);
                        childrenSteamService.getCamera(id).then(function (data) {
                            vm.cameras[vm.cameras.length] = data.data;

                            if (data.errno === 16005) {
                                vm.unPaid = true;
                            }

                            count += 1;
                            if (count === depositsCount) {
                                $scope.$broadcast('scroll.refreshComplete');
                                $scope.$broadcast('scroll.infiniteScrollComplete');
                            }

                        }, function (e) {
                            count += 1;
                            if (count === depositsCount) {
                                $scope.$broadcast('scroll.refreshComplete');
                                $scope.$broadcast('scroll.infiniteScrollComplete');
                            }
                        });
                    }
                }
            };

            vm.getFingerPrint = function (offset, limit) {
                console.log("getFingerPrint");
                childrenSteamService.getAllChildrenSignIn(AuthService.getLoginID(), offset, limit).then(function (data) {
                    if (data.errno == 0) {
                        console.log(data.data);
                        if (vm.fingerprintLogs.length == 0)
                            vm.fingerprintLogs = data.data;
                        else
                            vm.fingerprintLogs = vm.fingerprintLogs.concat(data.data);
                        console.log(vm.fingerprintLogs);
                        vm.offset[1] += data.data.length;
                        if (data.data.length < vm.limit) {
                            console.log("it is the last data");
                            vm.canLoadMore[1] = false;
                        } else {
                            vm.canLoadMore[1] = true;
                        }
                    } else {
                        console.log(data);
                    }

                    //始终隐藏加载更多面板
                    $scope.$broadcast('scroll.refreshComplete');
                    $scope.$broadcast('scroll.infiniteScrollComplete');

                }, function () {
                    //始终隐藏加载更多面板
                    $scope.$broadcast('scroll.refreshComplete');
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                })
            };

            vm.getMessage = function (offset, limit) {
                console.log("getMessage");
                childrenSteamService.getAllChildrenMsg(AuthService.getLoginID(), offset, limit).then(function (data) {
                    if (data.errno == 0) {
                        console.log(data.data);
                        var start = 0;
                        if (vm.messages.length == 0)
                            vm.messages = data.data;
                        else {
                            start = vm.messages.length;
                            vm.messages = vm.messages.concat(data.data);
                        }
                        console.log(vm.messages);
                        //update comment
                        for (var i = 0; i < data.data.length; i++) {
                            //vm.messages[start+i]
                            childrenSteamService.getDailyComment(vm.messages[start + i].InfoID, start + i).then(function (sdata) {
                                if (data.errno == 0) {
                                    console.log("getDailyComment: ");
                                    console.log(sdata.data);
                                    var index = sdata.data.index;
                                    vm.messages[index].comments = sdata.data.comments;
                                    vm.messages[index].likes = sdata.data.likes;
                                }
                            });
                        }
                        vm.offset[2] += data.data.length;
                        if (data.data.length < vm.limit) {
                            console.log("it is the last data");
                            vm.canLoadMore[2] = false;
                        } else {
                            vm.canLoadMore[2] = true;
                        }
                        //$scope.$broadcast('scroll.refreshComplete');
                        //$scope.$broadcast('scroll.infiniteScrollComplete');
                    } else {
                        console.log(data);
                    }

                    //始终隐藏加载更多面板
                    $scope.$broadcast('scroll.refreshComplete');
                    $scope.$broadcast('scroll.infiniteScrollComplete');

                }, function () {
                    //始终隐藏加载更多面板
                    $scope.$broadcast('scroll.refreshComplete');
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                });
            };

            vm.doRefresh = function (type, offset) {
                if (vm.steam === '0') {
                    vm.getCamera();
                } else if (vm.steam === '1') {
                    vm.getFingerPrint(offset, vm.limit);
                } else if (vm.steam === '2') {
                    vm.getMessage(offset, vm.limit);
                }
            };

            vm.getChildrenInfo = function (pId, offset, limit) {
                childrenService.getChildrenAllInfo(pId, offset, limit).then(function (data) {
                    if (data.errno == 0) {
                        console.log("getChildrenAllInfo: ");
                        console.log(data.data);
                        if (vm.messages.length == 0)
                            vm.messages = data.data;
                        else
                            vm.messages = vm.messages.concat(data.data);
                        console.log(vm.messages);
                        vm.offset += data.data.length;
                        if (data.data.length < vm.limit) {
                            console.log("it is the last data");
                            vm.canLoadMore = false;
                        } else {
                            vm.canLoadMore = true;
                        }
                        $scope.$broadcast('scroll.refreshComplete');
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                    } else {
                        console.log(data);
                    }
                });
            };

            vm.getWechatInfo = function (wId) {
                console.log("wechat id : " + wId);
                childrenService.getWechatInfo(wId).then(function (data) {
                    if (data.errno == 0) {
                        console.log("wechat info: ");
                        console.log(data.data);
                        vm.parent.wechat = data.data;
                    }
                });
            };

            vm.getImg = function (type) {
                if (type == 1) {
                    return { name: "就餐", src: "img/dinner.png" };
                } else if (type == 2) {
                    return { name: "培训", src: "img/traning.png" };
                } else if (type == 3) {
                    return { name: "活动", src: "img/play.png" };
                } else if (type == 4) {
                    return { name: "作业", src: "img/homework.png" };
                } else if (type == 5) {
                    return { name: "接入", src: "img/login.png" };
                } else if (type == 6) {
                    return { name: "送到", src: "img/logout.png" };
                } else {
                    return { name: "未知信息类型", src: "img/unknown.png" };
                }
            };

            vm.goPhoto = function (msgIndex, index) {
                Session.setData('temp', vm.msg[msgIndex]);
                StateService.go("photo", { index: index });
            };

            vm.star = function () {
                console.log("add star");
            };

            vm.getDailyComments = function (infoid, index) {
                console.log("getDailyComments index = " + index);
                childrenSteamService.getDailyComment(infoid, index).then(function (sdata) {
                    if (sdata.errno == 0) {
                        console.log("getDailyComment: ");
                        console.log(sdata.data);
                        var sindex = sdata.data.index;
                        vm.messages[sindex].comments = sdata.data.comments;
                        vm.messages[sindex].likes = sdata.data.likes;
                    }
                });
            };

            vm.like = function (info, index) {
                //如果已经like，去like
                //没有like，加like
                console.log(info + " and index=" + index);
                var needAdd = true;
                for (var i = 0; i < info.likes.length; i++) {
                    if (info.likes[i].CommentBy == vm.user) {
                        //remove
                        needAdd = false;
                        childrenSteamService.delDailyComment(info.likes[i].CommentID).then(function (data) {
                            console.log('rmComment likes');
                            console.log(data);
                            vm.getDailyComments(info.InfoID, index);
                            return;
                        });
                    }
                }
                //add
                if (needAdd) {
                    var comment = { infoid: info.InfoID, commentby: vm.user, commentdata: null };
                    childrenSteamService.createDailyComment(comment).then(function (data) {
                        console.log('addComment likes');
                        console.log(data);
                        vm.getDailyComments(info.InfoID, index);
                        return;
                    });
                }
            };

            vm.comment = function (info, index) {
                console.log(info + " and index=" + index);
                vm.showPopup(info, index);
            };

            vm.rmComment = function (comment, index) {
                childrenSteamService.delDailyComment(comment.CommentID).then(function (data) {
                    console.log('rmComment');
                    console.log(data);
                    vm.getDailyComments(comment.InfoID, index);
                });
            };

            vm.showPopup = function (info, index) {
                var myPopup = $ionicPopup.show({
                    template: '<input type="edittext" ng-model="vm.myComment">',
                    title: '请输入评论内容',
                    scope: $scope,
                    buttons: [
                      { text: '取消' },
                      {
                          text: '<b>提交</b>',
                          type: 'button-positive',
                          onTap: function (e) {
                              if (!vm.myComment) {
                                  e.preventDefault();
                              } else {
                                  return vm.myComment;
                              }
                          }
                      }
                    ]
                });

                myPopup.then(function (res) {
                    console.log('Tapped!', res);
                    //add comment
                    if (res.length > 0) {
                        var comment = { infoid: info.InfoID, commentby: vm.user, commentdata: res };
                        childrenSteamService.createDailyComment(comment).then(function (data) {
                            console.log('addComment comments');
                            console.log(data);
                            vm.myComment = null;
                            vm.getDailyComments(info.InfoID, index);
                            return;
                        });
                    }
                });
            };

            vm.getChildren = function () {
                childrenService.getChildren(AuthService.getLoginID()).then(function (data) {
                    var title = "";
                    if (data.errno == 0) {
                        console.log(data.data);
                        vm.childs = data.data;
                        for (var i = 0; i < vm.childs.length; i++) {
                            if (i == vm.childs.length - 1)
                                title += (vm.childs[i].name + "的家长");
                            else
                                title += (vm.childs[i].name + ",");
                            //vm.getMsg(vm.childs[i].uid);
                            //vm.getChildSignIn(vm.childs[i].uid,vm.childs[i].name);
                        }
                        vm.parent.title = title;
                    }
                    //vm.fingerprintLogs.sort(function(a,b){return a.log-b.log});
                });
            };

            vm.change = function () {
                if (vm.simpleFilterSelect === '-1') {
                    vm.simpleFilter = "";
                } else if (vm.simpleFilterSelect === '0') {
                    vm.simpleFilter = { datatype: '2' };
                } else if (vm.simpleFilterSelect === '1') {
                    vm.simpleFilter = { datatype: '1', InfoType: '1' };
                } else if (vm.simpleFilterSelect === '2') {
                    vm.simpleFilter = { datatype: '1', InfoType: '2' };
                } else if (vm.simpleFilterSelect === '3') {
                    vm.simpleFilter = { datatype: '1', InfoType: '3' };
                } else if (vm.simpleFilterSelect === '4') {
                    vm.simpleFilter = { datatype: '1', InfoType: '4' };
                } else if (vm.simpleFilterSelect === '5') {
                    vm.simpleFilter = { datatype: '1', InfoType: '5' };
                } else if (vm.simpleFilterSelect === '6') {
                    vm.simpleFilter = { datatype: '1', InfoType: '6' };
                }
            };

            vm.getImages = function (msg) {
                vm.imgCount = 0;
                if (msg.PhotoLink1 != null && msg.PhotoLink1 != "") {
                    var data = { src: msg.PhotoLink1, msg: '' };
                    vm.images[vm.imgCount] = data;
                    vm.imgCount++;
                }
                if (msg.PhotoLink2 != null && msg.PhotoLink2 != "") {
                    var data = { src: msg.PhotoLink2, msg: '' };
                    vm.images[vm.imgCount] = data;
                    vm.imgCount++;
                }
                if (msg.PhotoLink3 != null && msg.PhotoLink3 != "") {
                    var data = { src: msg.PhotoLink3, msg: '' };
                    vm.images[vm.imgCount] = data;
                    vm.imgCount++;
                }
                if (msg.PhotoLink4 != null && msg.PhotoLink4 != "") {
                    var data = { src: msg.PhotoLink4, msg: '' };
                    vm.images[vm.imgCount] = data;
                    vm.imgCount++;
                }
                if (msg.PhotoLink5 != null && msg.PhotoLink5 != "") {
                    var data = { src: msg.PhotoLink5, msg: '' };
                    vm.images[vm.imgCount] = data;
                    vm.imgCount++;
                }
                if (msg.PhotoLink6 != null && msg.PhotoLink6 != "") {
                    var data = { src: msg.PhotoLink6, msg: '' };
                    vm.images[vm.imgCount] = data;
                    vm.imgCount++;
                }
                console.log(vm.images);
            };

            $ionicModal.fromTemplateUrl('message/image-modal.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                $scope.modal = modal;
            });

            $scope.openModal = function () {
                $ionicSlideBoxDelegate.slide(0);
                $scope.modal.show();
            };

            $scope.closeModal = function () {
                $scope.modal.hide();
            };

            // Cleanup the modal when we're done with it!
            $scope.$on('$destroy', function () {
                $scope.modal.remove();
            });
            // Execute action on hide modal
            $scope.$on('modal.hide', function () {
                // Execute action
            });
            // Execute action on remove modal
            $scope.$on('modal.removed', function () {
                // Execute action
            });
            $scope.$on('modal.shown', function () {
                console.log('Modal is shown!');
            });

            // Call this functions if you need to manually control the slides
            $scope.next = function () {
                $ionicSlideBoxDelegate.next();
            };

            $scope.previous = function () {
                $ionicSlideBoxDelegate.previous();
            };

            $scope.goToSlide = function (index, msg) {
                vm.images = [];
                vm.getImages(msg);
                $scope.modal.show();
                $ionicSlideBoxDelegate.slide(index);
            };

            // Called each time the slide changes
            $scope.slideChanged = function (index) {
                $scope.slideIndex = index;
            };

        });
}());
