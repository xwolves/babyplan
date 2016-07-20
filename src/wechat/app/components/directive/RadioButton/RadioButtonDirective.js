(function() {
    "use strict";
    angular.module('RadioButtonDirective', [])
        .directive('radioButton', function() {
            return {
                restrict: 'E',
                templateUrl: 'RadioButton/RadioButton.html',
                controller: RadioButtonCtrl,
                controllerAs: 'vm',
                bindToController: true,
                scope: {
                    content: '=',
                    value: '=',
                    selectValue: '=',
                    enabledEmpty: '=?',
                    disabled: '=?'
                }
            };
        });

    function RadioButtonCtrl($scope) {
        var vm = this;
        vm.click = click;
        vm.iconStyle = {}
        if (vm.disabled) {
            vm.iconStyle.color = 'gray';
        } else {
            vm.iconStyle.color = '#4F8EF7';
        }
        if (vm.selectValue != vm.value) {
            vm.iconClass = 'ion-android-radio-button-off';
        } else {
            vm.iconClass = 'ion-android-radio-button-on';
        }

        function click() {
            if (vm.disabled)
                return;
            if (vm.selectValue != vm.value) {
                vm.selectValue = vm.value;
            } else {
                if (vm.enabledEmpty) {
                    vm.selectValue = null;
                }
            }
        }
        $scope.$watch('vm.selectValue', function(newValue, oldValue) {
            if (newValue != oldValue) {
                if (vm.selectValue != vm.value) {
                    vm.iconClass = 'ion-android-radio-button-off';
                } else {
                    vm.iconClass = 'ion-android-radio-button-on';
                }
            }
        })

    }
}());
