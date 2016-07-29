(function() {
    "use strict";
    angular.module('ResultHandler', []).service('ResultHandler', function($q, MessageToaster) {
        'ngInject';

        var handler = {
            successedFuc: successedFuc,
            failedFuc: failedFuc
        };

        function successedFuc(response) {
            //if (response.data.status == 0) {
            if (response.data.errno == 0){
                return response.data;
            } else {
                response.data.error ? MessageToaster.error(response.data.error) : MessageToaster.accessFail();;
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