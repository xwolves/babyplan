(function() {
    "use strict";
    angular.module('buyCtrl', [])
        .controller('buyCtrl', function($scope, $state, $stateParams, Constants, StateService, vipBuyService, AuthService, MessageToaster, Session) {
            'ngInject';
            var vm = this;

            vm.activated = false;
            vm.wechatPayReady = false;
            vm.information = "";

            $scope.onBridgeReady=function () {
                //alert('wechat ok');
                vm.wechatPayReady=true;
            };

            if (typeof WeixinJSBridge == "undefined"){
                console.log("not found WeixinJSBridge");
                if(document.addEventListener){
                    document.addEventListener('WeixinJSBridgeReady', $scope.onBridgeReady, false);
                }else if (document.attachEvent){
                    document.attachEvent('WeixinJSBridgeReady', $scope.onBridgeReady);
                    document.attachEvent('onWeixinJSBridgeReady', $scope.onBridgeReady);
                }
                console.log("add event listener for WeixinJSBridge");
            }else{
                console.log("WeixinJSBridge exist");
                $scope.onBridgeReady();
            }

            $scope.$on('$ionicView.afterEnter', activate);

            function activate() {
                console.log($stateParams);
                vm.index = $stateParams.index;

                vm.activated = true;
                vm.version = Constants.buildID;
                vm.query(vm.index);
                vm.wechatInit();
            }

            vm.query = function(id){
                console.log(" index = "+id);
                if(Session.temp.businessid == id)
                    vm.item=Session.temp;

            };

            vm.back = function(){
                StateService.back();
                Session.temp = null;
            };

            vm.getEndDate = function(payTime,numOfDays){
                var date=new Date(payTime.substring(0,4),Number(payTime.substring(4,6))-1,payTime.substring(6,8),payTime.substring(8,10),payTime.substring(10,12),payTime.substring(14,16));
                date.setTime(date.getTime()+numOfDays*24*60*60*1000);
                return date.getTime();
                //return ""+date.getFullYear()+(date.getMonth()+1)+(date.getDate()>9?date.getDate():('0'+date.getDate()))+'235959';
            };

            vm.pay=function(){
                var parentId=AuthService.getLoginID();
                vipBuyService.createOrder(parentId, AuthService.getWechatId(), vm.index)
                    .then(function (response) {
                        var result=response.data;
                        var orderId=result.orderId;
                        //vm.information = JSON.stringify(result);
                        //alert(JSON.stringify(result));
                        if(vm.wechatPayReady){
                            WeixinJSBridge.invoke(
                                'getBrandWCPayRequest',
                                {
                                    "appId":result.appId,
                                    "timeStamp":""+result.timeStamp,
                                    "nonceStr":result.nonceStr,
                                    "package":"prepay_id="+result.prepay_id,
                                    "signType":"MD5",
                                    "paySign":result.paySign
                                },
                                function(res){
                                    alert(JSON.stringify(res));
                                    var msg = res.err_msg;
                                    alert(msg);

                                    if(msg == "get_brand_wcpay_request:ok" ) {
                                        //保存数据．跳转页面
                                        //check order make sure user had pay the order ready.
                                        vipBuyService.checkOrder(orderId).then(
                                            function(result) {
                                                //{"errno":0,"error":"",
                                                // "data":{"orderId":"139630530220161103152842","wechatOrderId":"4003682001201611038611986947",
                                                // "totalFee":"1","payState":"SUCCESS","payTime":"20161103152851"}}
                                                //alert(JSON.stringify(result));
                                                var status = result.data.payState;
                                                var payTime=result.data.payTime;
                                                var endDate=vm.getEndDate(payTime,vm.item.numofdays);
                                                if(status === 'SUCCESS'){
                                                    //保存数据．跳转页面
                                                    vipBuyService.updatePayedOrder(parentId,orderId,payTime,endDate).then(
                                                        function(updateResult) {
                                                            //alert("updatePayedOrder sucess "+JSON.stringify(updateResult));
                                                            //vm.information += " udpate success ";
                                                            //跳转页面
                                                            if(updateResult.errno===0) {
                                                                MessageToaster.info("微信支付完成");
                                                                StateService.clearAllAndGo(AuthService.getNextPath());
                                                            }
                                                        },
                                                        function(error) {
                                                            alert("updatePayedOrder error "+JSON.stringify(error));
                                                        }
                                                    );
                                                }
                                            },
                                            function (reason) {
                                                alert("checkOrder error "+JSON.stringify(reason));
                                            }
                                        );
                                    //}else if(msg == "get_brand_wcpay_request:cancel"){
                                    }else if(msg.endsWith("cancel")){
                                        //alert("用户取消");
                                        //vm.information="用户取消";
                                        MessageToaster.info("微信支付已取消");
                                    //}else if(msg == "get_brand_wcpay_request:fail"){
                                    }else if(msg.endsWith("fail")){
                                        alert("付款失败");
                                    }
                                }
                            );
                        }
                    }, function (error) {
                        //alert(JSON.stringify(error));
                        vm.information += " 请求付款失败 " + error;
                    });
            };

        });
}());
