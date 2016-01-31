/*global angular*/

/**
 * @ngdoc directive
 * @name soundcloud.Directives.track
 * @description track directive
 */
angular
    .module("soundcloud")
    .directive("track", [
        function () {
            "use strict";
            return {
                // name: "",
                // priority: 1,
                // terminal: true,
                scope: {
                    track: "=track"
                }, // {} = isolate, true = child, false/undefined = no change
                controller: function controller($rootScope, $scope, $element, $attrs, $transclude, playerService, SoundcloudNextTracks) {
                    $scope.play = function (track) {
                        playerService.playPauseSound(track);
                    };
                    $scope.addToPlayNext = function (track) {
                        SoundcloudNextTracks.addTrack(track);
                    };
                },
                // require: "ngModel", // Array = multiple requires, ? = optional, ^ = check parent elements
                restrict: "E", // E = Element, A = Attribute, C = Class, M = Comment
                templateUrl: "modules/soundcloud/views/track.html"
                // replace: true,
                // transclude: true,
                // compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
                //link ($scope, iElm, iAttrs, controller) {}
            };
        }
    ]);