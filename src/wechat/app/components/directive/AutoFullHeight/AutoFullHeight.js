(function() {
    "use strict";
    angular.module('AutoFullHeightDirective', [])
        .directive('autoFullHeight', function($window) {
            'ngInject';
            return {
                restrict: 'A',
                link: function(scope, element, attrs, ctrl) {
                    var windowHeight = $window.innerHeight;
                    var barHeightStr = attrs.afhBarHeight || '0px';
                    var barHeight = parseInt(barHeightStr.replace('px', ''));
                    windowHeight -= barHeight;
                    element.css('height', windowHeight + 'px');

                    angular.element($window).bind('resize', function() {
                        var windowHeight = $window.innerHeight;
                        windowHeight -= barHeight;
                        element.css('height', windowHeight + 'px');
                        scope.$digest();
                    });
                }
            };
        });
}());
