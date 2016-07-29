(function() {
    "use strict";
    angular.module('MessageToaster', []).service('MessageToaster', function(SuccessMessage, ErrorMessage, Constants, toaster) {
        'ngInject';

        var messageToaster = {
            accessFail: accessFail,
            info: info,
            error: error,
            success: success
        };

        function accessFail() {
            toaster.pop('error', Constants.appTitle, ErrorMessage.ACCESS_FAIL);
        }

        function info(content) {
            toaster.pop('info', Constants.appTitle, content);
        }

        function error(content, title) {
            return toaster.pop('error', title || Constants.appTitle, content || ErrorMessage.ACCESS_FAIL);
        }

        function success(content, title) {
            toaster.success('success', title || Constants.appTitle, content || SuccessMessage.OPERATION_SUCESS);
        }


        return messageToaster;
    });

}());