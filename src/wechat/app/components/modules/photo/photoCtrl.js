(function() {
    "use strict";
    angular.module('photoCtrl', [])
        .controller('photoCtrl', function($scope, Constants,$stateParams,Session,StateService,$ionicSlideBoxDelegate,$timeout) {
            'ngInject';
            var vm = this;
            vm.activated = false;
            $scope.$on('$ionicView.afterEnter', activate);

            function activate() {
                vm.activated = true;
                vm.version = Constants.buildID;
                vm.msg=Session.temp;
                vm.images=[];
                vm.imgCount=0;
                if(vm.msg.photolink1!=null && vm.msg.photolink1!=""){
                    vm.images[vm.imgCount]=vm.msg.photolink1;
                    vm.imgCount++;
                }
                if(vm.msg.photolink2!=null && vm.msg.photolink2!=""){
                    vm.images[vm.imgCount]=vm.msg.photolink2;
                    vm.imgCount++;
                }
                if(vm.msg.photolink3!=null && vm.msg.photolink3!=""){
                    vm.images[vm.imgCount]=vm.msg.photolink3;
                    vm.imgCount++;
                }
                if(vm.msg.photolink4!=null && vm.msg.photolink4!=""){
                    vm.images[vm.imgCount]=vm.msg.photolink4;
                    vm.imgCount++;
                }
                if(vm.msg.photolink5!=null && vm.msg.photolink5!=""){
                    vm.images[vm.imgCount]=vm.msg.photolink5;
                    vm.imgCount++;
                }
                if(vm.msg.photolink6!=null && vm.msg.photolink6!=""){
                    vm.images[vm.imgCount]=vm.msg.photolink6;
                    vm.imgCount++;
                }
                console.log(vm.images);
                vm.index=$stateParams.index;
                console.log(vm.index);

                $timeout(function(){
                    $scope.slider.slideTo(vm.index);
                    $scope.slider.updateLoop();
                    //$ionicSlideBoxDelegate.enableSlide(true);
                    //$ionicSlideBoxDelegate.slide(vm.index);
                    //console.log($ionicSlideBoxDelegate.currentIndex()+" - "+$ionicSlideBoxDelegate.slidesCount());
                }, 300);

            }
            vm.back=function(){
                StateService.back();
            };

            $scope.options = {
                loop: false
            }

            $scope.$on("$ionicSlides.sliderInitialized", function(event, data){
                // data.slider is the instance of Swiper
                console.log(data);
                $scope.slider = data.slider;
            });

            $scope.$on("$ionicSlides.slideChangeStart", function(event, data){
                console.log('Slide change is beginning');
                //console.log(event);
                //console.log(data);
            });

            $scope.$on("$ionicSlides.slideChangeEnd", function(event, data){
                // note: the indexes are 0-based
                //console.log(event);
                console.log($scope.slider.activeIndex+" - "+$scope.slider.previousIndex);
                //$scope.activeIndex = data.activeIndex;
                //$scope.previousIndex = data.previousIndex;
                //console.log('Slide from '+data.previousIndex +' to '+data.activeIndex);
            });
        });
}());
