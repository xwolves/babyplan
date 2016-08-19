(function() {
    "use strict";
    angular.module('childrenCtrl', [])
        .controller('childrenCtrl', function($scope, Constants) {
            'ngInject';
            console.log("childrenCtrl");
            var vm = this;
            vm.activated = false;
            vm.parent={};
            $scope.$on('$ionicView.afterEnter', activate);

            function activate() {
                vm.activated = true;
                vm.version = Constants.buildID;
                vm.parent.wechat={
                    "nickname": "Band",
                    "sex": 1,
                    "language": "zh_CN",
                    "city": "广州",
                    "province": "广东",
                    "country": "中国",
                    "headimgurl":  "http://wx.qlogo.cn/mmopen/g3MonUZtNHkdmzicIlibx6iaFqAc56vxLSUfpb6n5WKSYVY0ChQKkiaJSgQ1dZuTOgvLLrhJbERQQ4eMsv84eavHiaiceqxibJxCfHe/0"
                };
            }
        });
}());
