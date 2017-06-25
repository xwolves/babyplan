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
                Wechat.isInstalled(function (installed) {
                    console.log("Wechat installed: " + (installed ? "Yes" : "No"));
                }, function (reason) {
                    console.log('未装微信插件无法支付:Wechat.isInstalled is fail '+reason);
                    alert("未装微信插件无法支付" + reason);
                });
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
                //alert(parentId);
                vipBuyService.createOrder2(parentId, vm.index)
                    .then(function (response) {
                        //alert(JSON.stringify(response));
                        if (response.errno == 0) {
                            var result=response.data;
                            var orderId=result.orderId;
                            //vm.information = JSON.stringify(result);
                            var params = {
                                mch_id: result.partnerid, // merchant id
                                prepay_id: result.prepayid, // prepay id
                                nonce: result.noncestr, // nonce
                                timestamp: result.timestamp, // timestamp
                                sign: result.pay_sign, // signed string
                            };

                            //alert(JSON.stringify(params));
                            Wechat.sendPaymentRequest(params, function () {
                                //alert("Success");
                                //check order make sure user had pay the order ready.
                                //alert("orderId="+orderId);
                                vipBuyService.checkOrder(orderId).then(
                                    function(result) {
                                        //{"errno":0,"error":"",
                                        // "data":{"orderId":"139630530220161103152842","wechatOrderId":"4003682001201611038611986947",
                                        // "totalFee":"1","payState":"SUCCESS","payTime":"20161103152851"}}
                                        //alert(JSON.stringify(result));
                                        if(result.errno == 0 ){
                                            MessageToaster.info("微信支付完成");
                                            StateService.clearAllAndGo(AuthService.getNextPath());
                                        }
                                      },
                                      function (reason) {
                                          alert("checkOrder error "+JSON.stringify(reason));
                                      }
                                  );
                            }, function (reason) {
                                //alert("Failed: " + reason);
                                MessageToaster.error(reason);
                            });
                          }else{
                            MessageToaster.error(response.error);
                          }
                    }, function (error) {
                        //alert(JSON.stringify(error));
                        vm.information += " 请求付款失败 " + JSON.stringify(error);
                    });
            };

        });
}());
