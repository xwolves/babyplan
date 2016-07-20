(function() {
    "use strict";
    angular.module('ResultHandler', []).service('ResultHandler', function($q, MessageToaster) {
        'ngInject';

        var handler = {
            successedFuc: successedFuc,
            failedFuc: failedFuc
        };

        function successedFuc(response) {
            if (response.data.status == 0) {
                return response.data;
            } else {
                response.data.message ? MessageToaster.error(response.data.message) : MessageToaster.accessFail();;
                return $q.reject();
            }
        }


        function failedFuc(error) {
            MessageToaster.accessFail();
            return $q.reject(error);
        }


        return handler;
    });

}());