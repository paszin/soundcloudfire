/*global angular, moment, _*/

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
                    track: "=track",
                    group: "=group"
                }, // {} = isolate, true = child, false/undefined = no change
                controller: function controller($scope, $element, $attrs, $transclude, playerService, SoundcloudSessionManager, NextTracks, GroupsBackend, GroupDialog) {
                    $scope.play = function (track) {
                        playerService.playPauseSound(track);
                    };
                    $scope.addToPlayNext = function (track) {
                        NextTracks.addTrack(track);
                    };
                    
                    $scope.track.showComments = false;
                    
                    //$scope.showComments = true;
                   
                    $scope.addToGroup = function () {
                        GroupDialog.show($scope.track.id);
                    };
                    
                    $scope.findMember = function (id) {
                        return _.find($scope.group.members, {id: id});
                    };
                    
                    $scope.addComment = function () {
                        $scope.track.comments.push({text: $scope.track.newcomment, author_id: SoundcloudSessionManager.getUserId(), added_at: moment()});
                        GroupsBackend.addCommentToTrack($scope.group.id,
                                                        $scope.track.id,
                                                        SoundcloudSessionManager.getUserId(),
                                                        $scope.track.newcomment);
                        $scope.track.newcomment = "";
                    };
                },
                // require: "ngModel", // Array = multiple requires, ? = optional, ^ = check parent elements
                restrict: "E", // E = Element, A = Attribute, C = Class, M = Comment
                templateUrl: "modules/soundcloud/track.html"
                // replace: true,
                // transclude: true,
                // compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
                //link ($scope, iElm, iAttrs, controller) {}
            };
        }
    ]);