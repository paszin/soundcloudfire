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
    .controller("HomeController", ["$rootScope", "$scope", "$state", "$stateParams", "$log", "SoundcloudSessionManager", "SoundcloudAPI", "GroupsBackend", "NextTracks", "Tabs", "playerService", "HistoryBackend",
        function ($rootScope, $scope, $state, $stateParams, $log, SoundcloudSessionManager, SoundcloudAPI, GroupsBackend, NextTracks, Tabs, playerService, HistoryBackend) {

            "use strict";

            $scope.tabs = _.filter(Tabs, function (ta) {
                return ta.content !== "modules/core/empty.template.html";
            });


            $scope.selectedIndex = 2;
            $scope.$watch("selectedIndex", function (current) {
                $scope.$broadcast($scope.tabs[current].title);
            });

            $scope.playerService = playerService;

            $scope.$watch("playerService.audio.stream.progress", function (current) {
                if (current === 1) {
                    HistoryBackend.addTrack(playerService.audio.info);
                    NextTracks.deleteTrack(playerService.audio.info.id);
                    var nextTrack = NextTracks.getNextTrack();
                    if (nextTrack) {
                        playerService.playPauseSound(nextTrack);
                    }
                }
            });

            $scope.addMeToGroup = function () {

                GroupsBackend.invitationCheck(SoundcloudSessionManager.getInvitationCode())
                    .then(
                        function (resp) {
                            //SoundcloudSessionManager.setInvationCode(null);
                        }
                    );
            };

            SoundcloudAPI.getMe().then(function (response) {
                $scope.me = response.data;
                //add 

                if (SoundcloudSessionManager.getInvitationCode()) {

                    $scope.addMeToGroup();

                }

            });





        }]);