(function() {
  "use strict";
  angular.module('PrintDocCtrl', [])
  .controller('PrintDocCtrl', function ($scope, WebService, toaster, $state,$stateParams,AuthService) {
      var fwr=AuthService.getUser();
      console.log(fwr);
      var fwbh=$stateParams.fwbh;
      console.log("fwbh = "+fwbh);

      WebService.querySingleDocument(fwbh).then(function (data) {
          if(data.status==0) {
              $scope.doc = data.content;
          }else{
              toaster.pop('error', "查询失败", data.message);
          }
      });
      if(fwbh!=null) {
          // JsBarcode("#barcode")
          //     .options({font: "OCR-B"}) // Will affect all barcodes
          //     .CODE128(fwbh, {fontSize: 18, textMargin: 0})
          //     .blank(20) // Create space between the barcodes
          //     .render();
          var setting = {
            barWidth: 1,
            barHeight: 50,
            fontSize: 16,
            posX: 0,
            posY: 0
          };
          $("#barcode").barcode(fwbh, "code128",setting);
      }
      $scope.cancel = function () {
          $state.go(AuthService.getBasePath());
      };
  });
  }());
