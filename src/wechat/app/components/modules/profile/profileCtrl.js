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



                // ͼƬѡ����
                vm.showImageUploadChoices = function (prop) {
                    var hideSheet = $ionicActionSheet.show({
                        buttons: [{
                            text: '�����ϴ�'
                        }, {
                            text: '�������ѡ'
                        }],
                        titleText: 'ͼƬ�ϴ�',
                        cancelText: 'ȡ ��',
                        cancel: function () {
                        },
                        buttonClicked: function (index) {
                            // ����ļ�ѡ���ϴ�
                            if (index == 1) {
                                vm.readalbum(prop);
                            } else if (index == 0) {
                                // �����ϴ�
                                vm.takePicture(prop);
                            }
                            return true;
                        }
                    });
                };

                //���û����
                vm.readalbum = function (prop) {
                    if (!navigator.camera) {
                        MessageToaster.error("Ŀǰ���Ļ�����֧������ϴ�!");
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
                        // MessageToaster.error("��������쳣:�����Ƿ���Ȩ��!");
                    }, options);
                };


                // ����
                vm.takePicture = function (prop) {

                    if (!navigator.camera) {
                        MessageToaster.error("�������������ʹ�������ϴ�!");
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
                        // MessageToaster.error("�����쳣:�����Ƿ���Ȩ��!");
                    }, options);
                }

                // �ϴ�
                vm.uploadImage = function (uri) {
                    var fileURL = uri;

                    var options = new FileUploadOptions();
                    options.fileKey = "file";
                    options.fileName = fileURL.substr(fileURL.lastIndexOf('/') + 1);
                    options.mimeType = "image/jpeg";
                    options.chunkedMode = true;

                    var ft = new FileTransfer();
                    $ionicLoading.show({
                        template: '�ϴ���...'
                    });
                    ft.upload(fileURL, "http://wx.zxing-tech.cn/upload", function (data) {
                        // ����ͼƬ�µ�ַ
                        var resp = JSON.parse(data.response);
                        vm.parentInfo.avatarlink = resp.data.fileurl;

                        parentService.updateParent(vm.parentInfo).then(function (res) {
                            MessageToaster.info("���³ɹ�!");
                            $ionicLoading.hide();
                        }, function (err) {
                            MessageToaster.error("����ʧ��!");
                            $ionicLoading.hide();
                        })

                    }, function (error) {
                        MessageToaster.error("�ϴ�ʧ��!");
                        $ionicLoading.hide();
                    }, options);
                };


            });
}());
