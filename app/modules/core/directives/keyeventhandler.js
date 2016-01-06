'use strict';

/**
 * @ngdoc directive
 * @name core.Directives.keyeventhandler
 * @description keyeventhandler directive
 */
angular
    .module('core')
    .directive('keyeventhandler', [
        function() {
            return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.ngEnter);
                });
 
                event.preventDefault();
            }
        });
    };
}]);
