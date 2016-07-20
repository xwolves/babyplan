(function() {
    "use strict";
    angular.module('MessageSelectDirectives', [])
        .directive('messageSelect', function() {
            return {
                restrict: 'E',
                templateUrl: 'MessageInput/MessageSelect.html',
                controller: MessageSelectCtrl,
                controllerAs: 'vm',
                bindToController: true,
                scope: {
                    label: '=',
                    required: '=?',
                    model: '=?',
                    options: '=',
                    disabled: "=?",
                    placeholder:'=?',
                    noBorder: "=?"
                }
            };
        });

    function MessageSelectCtrl($scope) {
        var vm = this;
        vm.selectChange = selectChange;

        function selectChange() {
            if (!vm.model || vm.model == '') {
                delete vm.model;
            }
        }
    }
}());
