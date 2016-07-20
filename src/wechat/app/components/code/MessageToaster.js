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
            toaster.error({
                title: Constants.appTitle,
                body: ErrorMessage.ACCESS_FAIL
            });
        }

        function info(content) {
            toaster.info({
                title: Constants.appTitle,
                body: content
            });
        }

        function error(content, title) {
            return toaster.error({
                title: title || Constants.appTitle,
                body: content || SuccessMessage.SUBMIT_SUCESS
            });
        }

        function success(content, title) {
            toaster.success({
                title: title || Constants.appTitle,
                body: content || SuccessMessage.SUBMIT_SUCESS
            });
        }


        return messageToaster;
    });

}());