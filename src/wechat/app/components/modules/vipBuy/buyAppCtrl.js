(function() {
    "use strict";
    angular.module('buyAppCtrl', [])
        .controller('buyAppCtrl', function($scope, $state, $stateParams, Constants, StateService, vipBuyService, AuthService, MessageToaster, Session) {
            'ngInject';
            var vm = this;

            vm.activated = false;
            vm.information = "";

            $scope.$on('$ionicView.afterEnter', activate);

            function activate() {
                console.log($stateParams);
                vm.index = $stateParams.index;
                vm.activated = true;
                vm.version = Constants.buildID;
                vm.query(vm.index);
            }


            vm.query = function(id){
                console.log(" index = "+id);
                var temp=JSON.parse(Session.getData('temp'));
                console.log(temp);
                if(temp.businessid == id)
                    vm.item=temp;
                console.log(vm.item);
            };

            vm.back = function(){
                StateService.back();
                Session.rmData('temp');
            };

            vm.getEndDate = function(payTime,numOfDays){
                var date=new Date(payTime.substring(0,4),Number(payTime.substring(4,6))-1,payTime.substring(6,8),payTime.substring(8,10),payTime.substring(10,12),payTime.substring(14,16));
                date.setTime(date.getTime()+numOfDays*24*60*60*1000);
                return date.getTime();
                //return ""+date.getFullYear()+(date.getMonth()+1)+(date.getDate()>9?date.getDate():('0'+date.getDate()))+'235959';
            };

            vm.pay=function(){
                var parentId=AuthService.getLoginID();
                vipBuyService.createOrder2(parentId, vm.index)
                    .then(function (response) {
                        //alert(JSON.stringify(response));
                        if (response.errno == 0) {
                            var result=response.data;
                            var orderId=result.orderId;
                            //vm.information = JSON.stringify(result);
                            var params = {
                                partnerid: result.partnerid, // merchant id
                                prepayid: result.prepayid, // prepay id
                                noncestr: result.noncestr, // nonce
                                timestamp: result.timestamp, // timestamp
                                sign: result.sign, // signed string
                            };

                            Wechat.sendPaymentRequest(params, function () {
                                alert("Success");
                            }, function (reason) {
                                alert("Failed: " + reason);
                            });
                            // WeixinJSBridge.invoke(
                            //     'getBrandWCPayRequest',
                            //     {
                            //         "appId":result.appId,
                            //         "timeStamp":""+result.timeStamp,
                            //         "nonceStr":result.nonceStr,
                            //         "package":"prepay_id="+result.prepay_id,
                            //         "signType":"MD5",
                            //         "paySign":result.paySign
                            //     },
                            //     function(res){
                            //         var msg = res.err_msg;
                            //         if(msg == "get_brand_wcpay_request:ok" ) {
                            //             //保存数据．跳转页面
                            //             //check order make sure user had pay the order ready.
                            //             vipBuyService.checkOrder(orderId).then(
                            //                 function(result) {
                            //                     if(result.errno == 0 ){
                            //                         MessageToaster.info("微信支付完成");
                            //                         StateService.clearAllAndGo(AuthService.getNextPath());
                            //                     }
                            //                 },
                            //                 function (reason) {
                            //                     alert("checkOrder error "+JSON.stringify(reason));
                            //                 }
                            //             );
                            //         }else if(msg.endsWith("cancel")){
                            //             MessageToaster.info("微信支付已取消");
                            //         }else if(msg.endsWith("fail")){
                            //             alert("付款失败");
                            //         }
                            //     }
                            // );
                          }else{
                            MessageToaster.error(response.error);
                          }
                    }, function (error) {
                        //alert(JSON.stringify(error));
                        vm.information += " 请求付款失败 " + error;
                    });
            };

        });
}());
