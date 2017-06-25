(function () {
    "use strict";
    angular.module('profileCtrl', [])
            .controller('profileCtrl', function ($scope, $q, $window, $cordovaImagePicker, $ionicActionSheet, $ionicListDelegate,
           $ionicPopup, $ionicLoading, Session, Constants, MessageToaster, AuthService, StateService, parentService, childrenSettingService) {

                'ngInject';
                var vm = this;
                vm.activated = false;
                $scope.$on('$ionicView.afterEnter', activate);

                function activate() {
                    vm.activated = true;
                    vm.version = Constants.buildID;
                    vm.getParent();
                    vm.getChildren();
                };

                vm.getParent = function () {
                    parentService.queryParent(AuthService.getLoginID()).then(function (data) {
                        if (data.errno == 0) {
                            console.log(data.data);
                            vm.parent = data.data;
                        }
                    });
                };

                vm.getChildren = function () {
                    parentService.queryChildren(AuthService.getLoginID()).then(function (data) {
                        if (data.errno == 0) {
                            console.log(data.data);
                            vm.children = data.data;
                            var children = "";
                            for (var i = 0; i < vm.children.length; i++) {
                                if (children == "")
                                    children += vm.children[i].name
                                else {
                                    children += "," + vm.children[i].name
                                }
                            }
                            vm.childrenName = children;
                        }
                    });
                };

                vm.goTo = function (addr, params) {
                    console.log('go to path : ' + addr);
                    if (params) console.log(params);
                    StateService.go(addr, params);
                };



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
                                vm.takePicture(prop);
                            }
                            return true;
                        }
                    });
                };

                //打开用户相册
                vm.readalbum = function (prop) {
                    if (!navigator.camera) {
                        MessageToaster.error("目前您的环境不支持相册上传!");
                        return;
                    }

                    var options = {
                        maximumImagesCount: 1,
                        sourceType: 2,
                        targetWidth: 80,
                        targetHeight: 80,
                        allowEdit: true,
                        quality: 80
                    };
                    navigator.camera.getPicture(function (imageURI) {
                        vm.uploadImage(imageURI);
                    }, function (error) {
                        // MessageToaster.error("访问相册异常:请检查是否有权限!");
                    }, options);
                };


                // 拍照
                vm.takePicture = function (prop) {

                    if (!navigator.camera) {
                        MessageToaster.error("请在真机环境中使用拍照上传!");
                        return;
                    }

                    var options = {
                        quality: 100,
                        targetWidth: 80,
                        targetHeight: 80,
                        allowEdit: true,
                        saveToPhotoAlbum: true
                    };


                    navigator.camera.getPicture(function (imageURI) {
                        vm.uploadImage(imageURI);
                    }, function (err) {
                        // MessageToaster.error("拍照异常:请检查是否有权限!");
                    }, options);
                }

                // 上传
                vm.uploadImage = function (uri) {
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
                            MessageToaster.info("更新成功!");
                            $ionicLoading.hide();
                        }, function (err) {
                            MessageToaster.error("更新失败!");
                            $ionicLoading.hide();
                        })

                    }, function (error) {
                        MessageToaster.error("上传失败!");
                        $ionicLoading.hide();
                    }, options);
                };


            });
}());
