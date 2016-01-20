/*global angular, console, moment*/
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
    .controller("HomeController", ["$rootScope", "$scope", "$http", "$state", "$stateParams", "$log", "$timeout", "$interval", "ngAudio", "SoundcloudAPI", "SoundcloudNextTracks", "SoundcloudSessionManager", "Tabs",
        function ($rootScope, $scope, $http, $state, $stateParams, $log, $timeout, $interval, ngAudio, SoundcloudAPI, SoundcloudNextTracks, SoundcloudSessionManager, Tabs) {

            "use strict";

            $scope.tabs = Tabs;

            $rootScope.audio = {
                "stream": null,
                "info": null,
                "isPlaying": false
            };

            $rootScope.playPauseSound = function (track) {

                track.isPlaying = !track.isPlaying;

                if ($rootScope.audio.info && track.stream_url !== $rootScope.audio.info.stream_url) {
                    $rootScope.audio.stream.pause();
                    $rootScope.audio.isPlaying = false;
                    $rootScope.audio.stream = null;
                    $rootScope.audio.info.isPlaying = false;
                    $log.info("delete old track");
                }
                if ($rootScope.audio.isPlaying) {
                    $rootScope.audio.stream.pause();
                    $rootScope.audio.isPlaying = false;
                    $log.info("pause");
                } else {
                    if ($rootScope.audio.stream) {
                        $rootScope.audio.stream.play();
                        $rootScope.audio.isPlaying = true;
                        $log.info("play");
                    } else {
                        $rootScope.audio.stream = ngAudio.load(track.stream_url + "?oauth_token=#{token}".format({
                            token: SoundcloudSessionManager.getToken()
                        }));
                        $rootScope.audio.stream.play();
                        $rootScope.audio.info = track;
                        $rootScope.audio.isPlaying = true;
                        $log.info("play new track");
                    }
                }

            };

            $scope.selectedIndex = 3;
            // $scope.$watch("selectedIndex", function (current) { });
            
            $scope.$watch("audio.stream.progress", function (current) {
                if (current === 1) {
                    var nextTrack = SoundcloudNextTracks.getNextTrack();
                    if (nextTrack) {
                        $rootScope.playPauseSound(nextTrack);
                    }
                }
            });
            
            SoundcloudAPI.getMe().then(function (response) {
                $scope.me = response.data;
            });

        }]);