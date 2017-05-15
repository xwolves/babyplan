(function() {
    "use strict";
    angular.module('LoadingAlert', []).service('LoadingAlert', function($document, $rootScope) {
        'ngInject';
        var activeNavView;
        return {
            show: show,
            hide: hide
        };

        function init() {
            var body = angular.element($document[0].body);
            var ionViewArr = body.find('ion-view');
            for (var i = 0; i < ionViewArr.length; i++) {
                if (angular.element(ionViewArr[i]).attr('nav-view') == 'active') {
                    activeNavView = angular.element(ionViewArr[i]);
                    activeNavView.append("<loading><div class=\"loading-alert-container\"><div class=\"loading-body\"><div class=\"loading-text\">加载中...<div><div></div></loading>");
                }
            }
        }

        function show() {
            init();
        }

        function hide() {
            angular.element(activeNavView.find('loading')[0]).remove();
        }

    });

}());
