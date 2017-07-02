(function() {
    "use strict";
    angular.module('newMessageCtrl', [])
        .controller('newMessageCtrl', function($scope, Constants, messageService, AuthService, StateService, teacherService, MessageToaster, Session, $cordovaCamera, $cordovaImagePicker,$ionicActionSheet,$cordovaFileTransfer) {
            'ngInject';
            var vm = this;
            vm.activated = false;
            $scope.$on('$ionicView.afterEnter', activate);
            vm.id=AuthService.getLoginID();
            vm.dailyType='3';
            vm.desc="";
            vm.imgPosition=0;
            vm.imgCal=0;
            vm.imgs=[];
            vm.imgshow=[];

            vm.isClicked=false;
            vm.btnText='提交';

            function activate() {
                vm.activated = true;
                vm.version = Constants.buildID;
                vm.lat=Session.getData('latitude');
                vm.long = Session.getData('longitude');

                vm.dailyType = '3';
                vm.desc = "";
                vm.imgPosition = 0;
                vm.imgCal = 0;
                vm.imgs = [];
                vm.imgshow = [];

                teacherService.queryTeacherDeposit(vm.id).then(function(data) {
                    console.log(data);
                    if(data!=null && data.data !=null && data.data.length>0)vm.deposit=data.data[0];
                    else MessageToaster.error('找不到老师的机构信息');
                });
            }

            vm.save=function(which){
                if (vm.imgs.length > 0) {
                    vm.isClicked = true;
                    vm.btnText='正在提交';
                    MessageToaster.info('上传信息中，请稍等...');
                    var data = vm.imgs[which];
                    if (data != null)messageService.postPhoto(data).then(function (e) {
                        console.log(e);
                        console.log(e.data.fileurl);
                        vm.imgs[vm.imgCal] = e.data.fileurl;
                        vm.imgCal++;
                        if (vm.imgCal == vm.imgs.length) {
                            console.log(vm.imgs);
                            vm.saveData();
                        } else {
                            vm.save(vm.imgCal);
                        }
                    });
                } else {
                    vm.saveData();
                }
            };

            //infotype:信息类型（1：就餐；2：培训；3：活动；4：作业）
            vm.saveData=function(){
                var json={
                    "depositid": Number(vm.deposit.depositid),
                    "publisherid": Number(vm.id),
                    "infotype": Number(vm.dailyType),
                    "latitude": vm.lat,
                    "longitude": vm.long,
                    "description": vm.desc,
                    "imgs": vm.imgs
                };
                //alert(JSON.stringify(json));
                messageService.newMsg(json).then(function(data) {
                    //alert(JSON.stringify(data));
                    vm.isClicked=false;
                    vm.btnText='提交';
                    if(data.errno==0){
                        Session.setData('refresh',1);
                        StateService.back();
                    }else{
                        MessageToaster.error(data.error);
                    }
                });
            };

            vm.back=function(){
                StateService.back();
            };

            $scope.fileSelect=function(event){
                console.log(event);
                var files = event.target.files;
                $scope.fileName=files[0].name;
                var fileReader = new FileReader();
                console.log(files);
                vm.imgs[vm.imgPosition] = files[0];
                console.log(files[0]);
                //vm.imgPosition++;
                $scope.$apply();
                fileReader.readAsDataURL(files[0]);
                fileReader.onload = function(e) {
                    console.log(e);
                    vm.imgshow[vm.imgPosition] = this.result;
                    console.log(this.result);
                    vm.imgPosition++;
                    $scope.$apply();
                };
            }

            vm.selectImageChooseMethod = function(prop){
              var hideSheet = $ionicActionSheet.show({
                  buttons: [{
                    text: '拍照上传'
                  }, {
                    text: '从相册中选择'
                  }],
                  cancelText: '取 消',
                  cancel: function() {
                    // add cancel code..
                  },
                  buttonClicked: function(index) {
                    // 相册文件选择上传
                    if (index == 1) {
                      vm.readalbum(prop);
                    } else if (index == 0) {
                      // 拍照上传
                      vm.taskPicture(prop);
                    }
                    return true;
                  }
                });
            };

            // 读用户相册
          	vm.readalbum = function(prop) {
          		if (!window.imagePicker) {
          			alert('目前您的环境不支持相册上传。')
          			return;
          		}

          		var options = {
          			maximumImagesCount: 1,
          			width: 800,
          			height: 800,
          			quality: 80
          		};

          		$cordovaImagePicker.getPictures(options).then(function(results) {
                for(var i=0;i<results.length;i++){
              			var uri = results[i];
              			var	name = uri;
              			if (name.indexOf('/')) {
              				var num = name.lastIndexOf('/');
              				name = name.substring(num + 1);
              			}
                    vm.imgshow[vm.imgshow.length]=uri;
              			//$scope.uploadimage(uri, prop);
                }
          		}, function(error) {
          			alert(error);
          		});
          	};

          	// 拍照
          	vm.taskPicture = function(prop) {
          		if (!navigator.camera) {
          			alert('请在真机环境中使用拍照上传。');
          			return;
          		}

          		var options = {
          			quality: 75,
          			targetWidth: 800,
          			targetHeight: 800,
          			saveToPhotoAlbum: false
          		};
          		$cordovaCamera.getPicture(options).then(function(imageURI) {
          			//$scope.uploadimage(imageURI);
          			var name = imageURI;
          			if (name.indexOf('/')) {
          				var i = name.lastIndexOf('/');
          				name = name.substring(i + 1);
          			}
                //alert(imageURI);
          		  //$scope.uploadimage(imageURI, prop);
                vm.imgshow[vm.imgshow.length]=imageURI;
          		}, function(err) {
          			alert("照相机：" + err);
          		});

          	}

          	// 上传到又拍云
          	vm.uploadimage = function(uri) {
              var options ={};
          		$cordovaFileTransfer.upload("http://wx.zxing-tech.cn/upload", uri, options,true).then(function(data) {
          			// 设置图片新地址
          			//alert(data.response);
          			var resp = JSON.parse(data.response);
          			var link = resp.data.fileurl;
          			$scope.image = link;
                vm.imgs[vm.imgCal] = link;
                vm.imgCal++;
                if (vm.imgCal == vm.imgshow.length) {
                    console.log(vm.imgshow);
                    //alert('start saveData');
                    vm.saveData();
                } else {
                    vm.save2(vm.imgCal);
                }
          		}, function(error) {
          			alert(JSON.stringify(error));
                MessageToaster.info('上传照片失败');
          		}, function (progress) {
                  // constant progress updates
              });
          	}

            vm.save2=function(which){
                if (vm.imgshow.length > 0) {
                    vm.isClicked = true;
                    vm.btnText='正在提交';
                    MessageToaster.info('上传信息中，请稍等...');
                    var data = vm.imgshow[which];
                    if (data != null)vm.uploadimage(data);
                } else {
                    vm.saveData();
                }
            };

        });
}());
