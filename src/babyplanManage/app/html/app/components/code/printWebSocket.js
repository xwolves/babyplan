(function() {
    "use strict";
    angular.module('PrintWebSocket', []).factory('PrintWebSocket', printWebSocket);
    function printWebSocket($rootScope,Env) {

        var webSocket = {
            connect:connect,
            disconnect:disconnect,
            sendData: sendData
        };

        //*根据readyState属性可以判断webSocket的连接状态，该属性的值可以是下面几种：
        //*0 ：对应常量CONNECTING (numeric value 0)，
        //*正在建立连接连接，还没有完成。.
        //*1 ：对应常量OPEN (numeric value 1)，
        //*连接成功建立，可以进行通信。
        //*2 ：对应常量CLOSING (numeric value 2)
        //*连接正在进行关闭握手，即将关闭。
        //*3 :对应常量CLOSED (numeric value 3)
        //*连接已经关闭或者根本没有建立。

        function connect() {
            webSocket.ws = new WebSocket(Env.webSocket_Addr+":"+Env.webSocket_port);

            webSocket.ws.onopen = function () {
                console.log("web service connected!");
                $rootScope.$broadcast("WebSocketInformation", {connectStatus:1,message:"标签打印服务连接成功"});
            };

            webSocket.ws.onmessage = function (evt) {
                console.log(evt.data);
                $rootScope.$broadcast("WebSocketInformation", {connectStatus:2,message:evt.data});
            };

            webSocket.ws.onclose = function (evt) {
                console.log("WebSocketClosed!");
                if(webSocket.ws.readyState!=3) {
                    $rootScope.$broadcast("WebSocketInformation", {connectStatus: 0, message: "已关闭标签打印服务连接"});
                }
            };

            webSocket.ws.onerror = function (evt) {
                console.log("WebSocketError!");
                console.log(evt);
                if(webSocket.ws.readyState==3){
                    $rootScope.$broadcast("WebSocketInformation", {connectStatus: -2, message: "无标签打印服务"});
                }else {
                    $rootScope.$broadcast("WebSocketInformation", {connectStatus: -1, message: "连接标签打印服务出错"});
                }
            };
        };

        function disconnect() {
            if(webSocket.ws!=null)webSocket.ws.close();
            else
                $rootScope.$broadcast("WebSocketInformation", {connectStatus:-1,message:"未与标签打印服务连接"});
        };

        function sendData(barcode) {
            if(webSocket.ws!=null){
                var data=[
                    {name:'ActiveXopenport',params:['Gprinter2120TF']},
                    {name:'ActiveXsetup',params:['50', '15', '5', '8', '0', '2', '0']},
                    {name:'ActiveXsendcommand',params:['SET TEAR ON']},
                    {name:'ActiveXclearbuffer',params:[]},
                    {name:'ActiveXbarcode',params:['5', '20', '128', '60', '1', '0', '2', '1', barcode]},
                    {name:'ActiveXprintlabel',params:['1', '1']},
                    {name:'ActiveXcloseport',params:[]}
                ];
                console.log("send data : " +JSON.stringify(data));
                //var ws = new WebSocket(Env.webSocket_Addr+":"+Env.webSocket_port);
                webSocket.ws.send(JSON.stringify(data));
            }else{
                $rootScope.$broadcast("WebSocketInformation", {connectStatus:-1,message:"未与标签打印服务连接"});
            }
        };


        return webSocket;
    }

}());