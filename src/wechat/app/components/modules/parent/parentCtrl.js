(function () {
    "use strict";
    angular.module('parentCtrl', [])
        .controller('parentCtrl', function ($scope, $q, $cordovaImagePicker, $ionicActionSheet, $ionicListDelegate,
            $ionicPopup, $ionicLoading, Session, Constants, MessageToaster, AuthService, StateService, parentService, childrenSettingService) {
            'ngInject';
            var vm = this;
            vm.activated = false;
            vm.shouldShowDelete = false;
            vm.shouldShowReorder = false;
            vm.listCanSwipe = true
            vm.parentInfo = {
                //name: "���»�",
                //nickName: "���Ļ�",
                //sex: 1,
                //mobile: '1342222235',
                //childrens: [
                //    {
                //        name: '����',
                //        sex:1
                //    },
                //    {
                //        name: '����',
                //        sex: 1
                //    }
                //]
            };

            //ҳ�漤��ʱ�����߼�
            $scope.$on('$ionicView.afterEnter', activate);
            function activate() {
                vm.activated = true;
                vm.version = Constants.buildID;
                init();
            };

            //��ʼ���߼�
            function init() {
                var pId = AuthService.getLoginID();
                var queryParentPromise = parentService.queryParent(pId);
                var queryChildrensPromise = parentService.queryChildren(pId);

                $q.all([queryParentPromise, queryChildrensPromise]).then(function (results) {
                    vm.parentInfo = results[0].data || {},
                   vm.parentInfo.childrens = results[1].data || [];
                }, function (err) {
                    MessageToaster.error("�����쳣!");
                });
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
                            vn.takePicture(prop);
                        }
                        return true;
                    }
                });
            };

            //���û����
            vm.readalbum = function (prop) {
                if (!window.imagePicker) {
                    MessageToaster.error("Ŀǰ���Ļ�����֧������ϴ�!");
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
                    MessageToaster.error("��������쳣:�����Ƿ���Ȩ��!");
                });
            };


            // ����
            vm.takePicture = function (prop) {
                if (!navigator.camera) {
                    MessageToaster.error("�������������ʹ�������ϴ�!");
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
                    MessageToaster.error("�����쳣:�����Ƿ���Ȩ��!");
                }, options);

            }

            // �ϴ�
            vm.uploadimage = function (uri) {
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
                        MessageToaster.error("���³ɹ�!");
                        $ionicLoading.hide();
                    }, function (err) {
                        MessageToaster.error("����ʧ��!");
                        $ionicLoading.hide();
                    })

                }, function (error) {
                    $ionicLoading.hide();
                }, options);
            };


            //�����µĺ�����Ϣ,ʹ���¾ֲ���д����
            vm.addChild = function () {
                $ionicListDelegate.closeOptionButtons();
                StateService.go('childrenAdd');
            };

            //�鿴������Ϣ
            vm.editChild = function (child) {
                $ionicListDelegate.closeOptionButtons();
                Session.setData('temp', child);
                StateService.go('childrenEdit', { cid: child.uid, type: 2 });
            };

            //ɾ��������Ϣ
            vm.delChild = function (child) {

                $ionicListDelegate.closeOptionButtons();

                var confirmPopup = $ionicPopup.confirm({
                    title: 'ȷ��Ҫɾ���˺���:' + child.name,
                    buttons: [
                        { text: 'ȡ��', type: 'button-positive' },
                        { text: 'ȷ��', type: 'button-assertive', onTap: function (e) { return true } }
                    ]
                });
                confirmPopup.then(function (result) {
                    if (result) {
                        childrenSettingService.deleteChild(child.uid).then(function (data) {
                            console.log(data);
                            if (data.errno == 0) {

                                console.log(data.data);

                                var idx = vm.parentInfo.childrens.indexOf(child);
                                vm.parentInfo.childrens.splice(idx, 1);

                                MessageToaster.error("ɾ���ɹ�!");
                            }
                        });
                    } else {
                        console.log('cancel delete');
                    }
                });
            };

            //��ת��ָ��ҳ��
            vm.goTo = function (addr) {
                console.log('go to path : ' + addr);
                StateService.go(addr);
            };

            //���ص���һҳ��
            vm.back = function () {
                StateService.back();
            };
        });
}());
