(function() {
    "use strict";
    angular.module('MessageInputTextDirectives', [])
        .directive('messageInputText', function() {
            return {
                restrict: 'E',
                templateUrl: 'MessageInput/MessageInputText.html',
                controller: MessageInputTextCtrl,
                controllerAs: 'vm',
                bindToController: true,
                scope: {
                    label: '=',
                    required: '=?',
                    model:'=?',
                    placeholder:'=?',
                    disabled:"=?",
                    type:"=?",
                    noBorder:"=?"
                }
            };
        });

    function MessageInputTextCtrl($scope) {
        var vm = this;
        vm.type=vm.type || 'text';
    }
}());
