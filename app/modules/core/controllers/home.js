/*global angular, console, _*/
/*jslint plusplus: true */
/*jshint quotmark: double */


/**
 * @ngdoc object
 * @name core.Controllers.HomeController
 * @description Home controller
 * @requires ng.$scope
 */
angular
    .module("core")
    .controller("HomeController", ["$rootScope", "$scope", "$state", "$stateParams", "$log", "SoundcloudAPI", "GroupsBackend", "SoundcloudNextTracks", "Tabs", "playerService",
        function ($rootScope, $scope, $state, $stateParams, $log, SoundcloudAPI, GroupsBackend, SoundcloudNextTracks, Tabs, playerService) {

            "use strict";

            $scope.tabs = _.filter(Tabs, function (ta) {
                return ta.content !== "modules/core/views/empty.template.html";
            });


            $scope.selectedIndex = 2;
            // $scope.$watch("selectedIndex", function (current) { });

            $scope.playerService = playerService;

            $scope.$watch("playerService.audio.stream.progress", function (current) {
                if (current === 1) {
                    SoundcloudNextTracks.deleteTrack(playerService.audio.info.id);
                    var nextTrack = SoundcloudNextTracks.getNextTrack();
                    if (nextTrack) {
                        playerService.playPauseSound(nextTrack);
                    }
                }
            });

            
            $scope.addToGroup = function () {
                GroupsBackend.addTrack(5, playerService.audio.info.id, 1);
            }

            SoundcloudAPI.getMe().then(function (response) {
                $scope.me = response.data;
            });

        }]);