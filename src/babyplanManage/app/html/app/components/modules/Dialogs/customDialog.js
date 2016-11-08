(function() {
'use strict';

angular.module('CustomDialog', [])
.factory('XHDialog', dialog);
  function dialog(WebService,toaster,$modal) {

      var myDialog = {
          checkDocument: checkDocument,
          createDocument: createDocument,
          parentDetail: parentDetail,
          teacherDetail: teacherDetail,
          msgDetail: msgDetail,
          priceDetail:priceDetail,
          chargedetail:chargedetail
      };
      return myDialog;

      function createDocument (ry,confirm,cancel) {
          var modalInstance = $modal.open({
              animation: true,
              templateUrl: 'Dialogs/createDocModal.html',
              controller: 'CreateDocModalCtrl',
              size: 'lg',
              resolve: {
                  fwr: function () {
                      return ry;
                  }
              }
          });

          modalInstance.result.then(function (item) {
              console.log("back from item "+item);
              confirm();
          }, function () {
              console.log('Modal dismissed at: ' + new Date());
              cancel();
          });
      };

      function checkDocument (docNo,confirm,cancel) {
          var modalInstance = $modal.open({
              animation: true,
              templateUrl: 'Dialogs/docDetailsModal.html',
              controller: 'DocDetailsModalCtrl',
              size: 'lg',
              resolve: {
                  item: function () {
                      return docNo;
                  }
              }
          });

          modalInstance.result.then(function (item) {
              console.log("back from item "+item);
              confirm();
          }, function () {
              console.log('Modal dismissed at: ' + new Date());
              cancel();
          });
      };

      function signDocument(bh,ry) {
          var sm=ry.mc+"扫码签收";
          if(bh!=null){
              WebService.querySingleDocument(bh).then(function(data){
                  if(data.status==0){
                      //更新签收
                      WebService.signDocument(bh,ry,sm).then(function(data){
                          if (data.status == 0) {
                              toaster.pop('success', "签收成功",data.message);
                          }else{
                              toaster.pop('error', "无法签收",data.message);
                          }
                      });
                  }else{
                      toaster.pop('error',"查询失败","无此发文信息");
                  }
              });
          }else{
              toaster.pop('error', "查询失败", "发文编号不能为空");
          }
      };


      function teacherDetail (teacherDetail,confirm,cancel) {
          var modalInstance = $modal.open({
              animation: true,
              templateUrl: 'Dialogs/teacherDetailModal.html',
              controller: 'TeacherDetailModalCtrl',
              size: 'lg',
              resolve: {
                  user: function () {
                      return teacherDetail;
                  }
              }
          });

          modalInstance.result.then(function (item) {
              console.log("back from item "+item);
              confirm();
          }, function () {
              console.log('Modal dismissed at: ' + new Date());
              cancel();
          });
      };
      
      function parentDetail (parentDetail,confirm,cancel) {
          var modalInstance = $modal.open({
              animation: true,
              templateUrl: 'Dialogs/parentDetailModal.html',
              controller: 'ParentDetailModalCtrl',
              size: 'lg',
              resolve: {
                  user: function () {
                      return parentDetail;
                  }
              }
          });

          modalInstance.result.then(function (item) {
              console.log("back from item "+item);
              confirm();
          }, function () {
              console.log('Modal dismissed at: ' + new Date());
              cancel();
          });
      };
      
      
      
      function msgDetail(msgDetail,confirm,cancel) {
          var modalInstance = $modal.open({
              animation: true,
              templateUrl: 'Dialogs/msgDetailModal.html',
              controller: 'MsgDetailModalCtrl',
              size: 'lg',
              resolve: {
                  user: function () {
                      return msgDetail;
                  }
              }
          });

          modalInstance.result.then(function (item) {
              console.log("back from item "+item);
              confirm();
          }, function () {
              console.log('Modal dismissed at: ' + new Date());
              cancel();
          });
      };
      
      function priceDetail(priceDetail,confirm,cancel) {
          var modalInstance = $modal.open({
              animation: true,
              templateUrl: 'Dialogs/priceDetailModal.html',
              controller: 'PriceDetailModalCtrl',
              size: 'lg',
              resolve: {
                  user: function () {
                      return priceDetail;
                  }
              }
          });

          modalInstance.result.then(function (item) {
              WebService.priceSeting(item).then(function(data){
            	  confirm();
                  toaster.pop('success', "", "保存成功");
              },function(error){
                  toaster.pop('error', "保存失败", error);
                  confirm();
              });
              console.log("back from item "+item);
              
          }, function () {
              console.log('Modal dismissed at: ' + new Date());
              cancel();
          });
      };
      
      function chargedetail(chargedetail,confirm,cancel) {
          var modalInstance = $modal.open({
              animation: true,
              templateUrl: 'Dialogs/chargeDetailModal.html',
              controller: 'ChargeDetailModalCtrl',
              size: 'lg',
              resolve: {
                  user: function () {
                      return chargedetail;
                  }
              }
          });

          modalInstance.result.then(function (item) {
              WebService.parentOrderDetial(item).then(function(data){
            	  confirm();
                  toaster.pop('success', "", "保存成功");
              },function(error){
            	  debugger;
                  toaster.pop('error', "保存失败", error);
                  confirm();
              });
              console.log("back from item "+item);
              
          }, function () {
              console.log('Modal dismissed at: ' + new Date());
              cancel();
          });
      };
  }
}());
