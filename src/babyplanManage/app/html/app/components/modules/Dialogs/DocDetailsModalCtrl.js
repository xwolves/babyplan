(function() {
  "use strict";
  angular.module('DocDetailsModalCtrl', [])
  .controller('DocDetailsModalCtrl', function ($scope,WebService,toaster,$state,$modalInstance,AuthService,PrintWebSocket,item) {
    $scope.ry=AuthService.getUser();
    $scope.isRecevicer=AuthService.hasPermission();
    $scope.noClick=false;
    $scope.labelPrintDisable=false;
    //$scope.itemNo = item;
    console.log("see item number is "+item);
    PrintWebSocket.connect();

    $scope.$on("WebSocketInformation", function(event, args){
        console.log(args);
        if(args.connectStatus==0){
            //close
            toaster.pop('info', "标签打印", args.message);
            PrintWebSocket.disconnect();
        }else if(args.connectStatus==1){
            //connected
            toaster.pop('info', "标签打印", args.message);
            $scope.labelPrintShow=true;
        }else if(args.connectStatus==2){
            //message back
            $scope.labelPrintDisable=false;
        }else if(args.connectStatus==-1){
            //error
            toaster.pop('error', "标签打印", args.message);
            $scope.labelPrintShow=false;
        }else if(args.connectStatus==-1){
            $scope.labelPrintShow=false;
        }
    });

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.queryDocument=function(item){
        WebService.querySingleDocument(item).then(function (data) {
            console.log(data);
            if(data.status==0) {
                $scope.doc = data.content;
                if($scope.doc.fwzt=='1'){
                    $scope.noClick=true;
                }
            }else{
                toaster.pop('error', "查询失败", data.message);
            }
        });
    };
    $scope.querySignProcess = function(item){
        WebService.querySignProcess(item).then(function (data) {
            if(data.status==0){
                $scope.signs = data.content;
            }else{
                toaster.pop('error', "查询失败", data.message);
            }
        });
    };

    $scope.queryDocument(item);
    $scope.querySignProcess(item);

    $scope.printDocument = function(fwbh){
        $modalInstance.close("finish");
        $state.go("printDoc",{fwbh:fwbh});
    };

    $scope.printLabel = function(fwbh){
        $scope.labelPrintDisable=true;
        PrintWebSocket.sendData(fwbh);
    };

    $scope.signDocument = function (fwbh) {
        WebService.signDocument(fwbh,$scope.ry).then(function(data){
            if (data.status == 0) {
                WebService.querySignProcess(item).then(function(data) {
                    if(data.status==0){
                        $scope.signs = data;
                    }else{
                        toaster.pop('error', "无法签收", data.message);
                    }
                });
                $modalInstance.close(data.message);
            }else{
                toaster.pop('error', "无法签收", data.message);
            }
        });
    };

    $scope.confirmDel = function(index){
        $scope.signs[index].confirm=true;
    };

    $scope.deleteSignProcess = function(bh){
        WebService.deleteSignProcess(bh).then(function(data) {
            if(data.status==0){
                //refresh signprocess list
                $scope.querySignProcess(item);
            }else{
                toaster.pop('error', "无法删除流程", data.message);
            }
        });
    };

    $scope.finishDocment = function (bh) {
        WebService.finishDocment(bh).then(function(data) {
            if(data.status==0){
                $modalInstance.close(data.content);
            }else{
                toaster.pop('error', "无法办结", data.message);
            }
        });
    };

    //监听PrintWebSocket的广播
});
}());
