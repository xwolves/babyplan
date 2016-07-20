(function() {
    "use strict";
    angular.module('JustifiedDirectives', [])
        .directive('left', function() {
            return {
                restrict: 'E',
                replace: true,
                compile: function(element, attrs, transclude) {
                    var template = angular.element('<div class="left"></div>');

                    var leftContents = element.contents();
                    var leftClass = element.attr('class');
                    var leftStyle = element.attr('style');

                    template.addClass(leftClass);
                    template.attr('style', leftStyle);
                    template.append(leftContents);

                    element.html('');
                    element.append(template);
                }
            };
        })
        .directive('right', function() {
            return {
                restrict: 'E',
                replace: true,
                compile: function(element, attrs, transclude) {
                    var template = angular.element('<div class="right"></div>');
                    var clearTemplate = angular.element('<div class="clear"></div>');

                    var rightContents = element.contents();
                    var rightClass = element.attr('class');
                    var rightStyle = element.attr('style');

                    template.addClass(rightClass);
                    template.attr('style', rightStyle);
                    template.append(rightContents);


                    element.html('');
                    element.append(template);
                    element.append(clearTemplate);
                }
            };
        });
}());
