/*global angular*/

/**
 * @ngdoc directive
 * @name soundcloud.Directives.track
 * @description track directive
 */
angular
    .module("audioplayer")
    .directive("audioplayer", [
        function () {
            "use strict";
            return {
                // name: "",
                // priority: 1,
                // terminal: true,
                scope: {
                    track: "=track"
                }, // {} = isolate, true = child, false/undefined = no change
                controller: function controller($rootScope, $scope, $element, $attrs, $transclude, playerService, NextTracks) {
                    $scope.full = {info: false};
                    $scope.playerService = playerService;
                    $scope.play = function (track) {
                        playerService.playPauseSound(track);
                    };

                    $scope.clickWaveform = function (event) {
                        var element = document.getElementById("waveformprogress");
                        playerService.goTo((event.offsetX) / element.clientWidth);

                    };

                },
                // require: "ngModel", // Array = multiple requires, ? = optional, ^ = check parent elements
                restrict: "E", // E = Element, A = Attribute, C = Class, M = Comment
                templateUrl: "modules/audioplayer/audioplayer.html"
                    // replace: true,
                    // transclude: true,
                    // compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
                    //link ($scope, iElm, iAttrs, controller) {}
            };
        }
    ]);