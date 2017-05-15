(function() {
    "use strict";
    angular.module('ResultHandler', []).service('ResultHandler', function($q) {
        'ngInject';

        var handler = {
            successedFuc: successedFuc,
            failedFuc: failedFuc
        };

        function successedFuc(response) {
            //console.log("successedFuc");
            //console.log(response);
            return response.data;
            //if (response.data.errno == 0){
            //    return response.data;
            //} else {
            //    return $q.reject(response.data.error);
            //}
        }

        function failedFuc(error) {
            //console.log("failedFuc");
            //console.log(error);
            return $q.reject(error);
        }

        return handler;
    });

}());