(function() {
    "use strict";
    angular.module('parentInfoCtrl', [])
        .controller('parentInfoCtrl', function ($scope, $q,$cordovaImagePicker, $ionicActionSheet,$ionicListDelegate, $ionicLoading,Session, Constants, MessageToaster, AuthService, StateService, parentService) {
            'ngInject';
            var vm = this;
            vm.activated = false;
            vm.shouldShowDelete = false;
            vm.shouldShowReorder = false;
            vm.listCanSwipe = true

            vm.parentInfo = {
                //name: "刘德华",
                //nickName: "流的花",
                //sex: 1,
                //mobile: '1342222235',
                //childrens: [
                //    {
                //        name: '刘能',
                //        sex:1
                //    },
                //    {
                //        name: '刘星',
                //        sex: 1
                //    }
                //]
            };

          

            $scope.$on('$ionicView.afterEnter', activate);

            function activate() {
                vm.activated = true;
                vm.version = Constants.buildID;
                init();
            };

            function init() {
                var pId = AuthService.getLoginID();
                var queryParentPromise = parentService.queryParent(pId);
                var queryChildrensPromise = parentService.queryChildren(pId);

                $q.all([queryParentPromise, queryChildrensPromise]).then(function (results) {
                    vm.parentInfo = results[0].data || {},
                   vm.parentInfo.childrens=  results[1].data||[];
                }, function (err) {
                    MessageToaster.error("检索异常!");
                });
            }



            // 图片选择项
            vm.showImageUploadChoices = function (prop) {
                var hideSheet = $ionicActionSheet.show({
                    buttons: [{
                        text: '拍照上传'
                    }, {
                        text: '从相册中选'
                    }],
                    titleText: '图片上传',
                    cancelText: '取 消',
                    cancel: function () {
                    },
                    buttonClicked: function (index) {
                        // 相册文件选择上传
                        if (index == 1) {
                            vm.readalbum(prop);
                        } else if (index == 0) {
                            // 拍照上传
                            vn.takePicture(prop);
                        }
                        return true;
                    }
                });

            };


            // 读用户相册
            vm.readalbum = function (prop) {
                if (!window.imagePicker) {
                    MessageToaster.error("目前您的环境不支持相册上传!");
                    return;
                }

                var options = {
                    maximumImagesCount: 1,
                    width: 800,
                    height: 800,
                    quality: 80
                };

                $cordovaImagePicker.getPictures(options).then(function (results) {
                    var uri = results[0],
                        name = uri;
                    if (name.indexOf('/')) {
                        var i = name.lastIndexOf('/');
                        name = name.substring(i + 1);
                    }

                    vm.uploadimage(uri, prop);

                }, function (error) {
                    MessageToaster.error("访问相册异常:请检查是否有权限!");
                });
            };


            // 拍照
            vm.takePicture = function (prop) {
                if (!navigator.camera) {
                    MessageToaster.error("请在真机环境中使用拍照上传!");
                    return;
                }

                var options = {
                    quality: 75,
                    targetWidth: 800,
                    targetHeight: 800,
                    saveToPhotoAlbum: false
                };

                navigator.camera.getPicture(function (imageURI) {
                    vm.uploadimage(imageURI);
                }, function (err) {
                    MessageToaster.error("拍照异常:请检查是否有权限!");
                }, options);

            }

            // 上传
            vm.uploadimage = function (uri) {
                var fileURL = uri;

                var options = new FileUploadOptions();
                options.fileKey = "file";
                options.fileName = fileURL.substr(fileURL.lastIndexOf('/') + 1);
                options.mimeType = "image/jpeg";
                options.chunkedMode = true;

                var ft = new FileTransfer();
                $ionicLoading.show({
                    template: '上传中...'
                });
                ft.upload(fileURL, "http://wx.zxing-tech.cn/upload", function (data) {
                    // 设置图片新地址
                    var resp = JSON.parse(data.response);
                    vm.parentInfo.avatarlink = resp.data.fileurl;

                    parentService.updateParent(vm.parentInfo).then(function (res) {
                        MessageToaster.error("更新成功!");
                        $ionicLoading.hide();
                    }, function (err) {
                        MessageToaster.error("更新失败!");
                        $ionicLoading.hide();
                    })
                  
                }, function (error) {
                    $ionicLoading.hide();
                }, options);
            }


            vm.goTo = function(addr){
                console.log('go to path : '+addr);
                StateService.go(addr);
            };

            vm.editChild = function ( child) {
                //查看孩子信息
                $ionicListDelegate.closeOptionButtons();
                Session.setData('temp', child);
                StateService.go('childrenEdit', { cid: child.uid, type: 2 });
            };

            vm.addChild = function () {
                //创建新的孩子信息,使用新局部编写界面
                $ionicListDelegate.closeOptionButtons();
                StateService.go('childrenAdd');
            };


            vm.back=function(){
                StateService.back();
            };
        });
}());
