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
    .controller("HomeController", ["$rootScope", "$scope", "$http", "$state", "$stateParams", "$log", "$timeout", "$interval", "ngAudio", "Soundcloud", "SoundcloudNextTracks", "Tabs",
        function ($rootScope, $scope, $http, $state, $stateParams, $log, $timeout, $interval, ngAudio, Soundcloud, SoundcloudNextTracks, Tabs) {

            "use strict";
            
            $scope.tabs = Tabs;

            $scope.info = {
                "me": {},
                "playlists": []
            };

            $scope.savePlaylists = function (data) {

                console.log("save playlists");

                if ($scope.info.playlists.length !== 0) {
                    console.log("take from cache");
                    return;
                }
                var i, j;
                for (i = 0; i < data.length; i++) {
                    $scope.info.playlists[i] = data[i];
                    $scope.info.playlists[i].track_count_readable = (data[i].track_count === 1) ? "1 Track" : data[i].track_count + "Tracks";
                    $scope.info.playlists[i].duration_readable = moment.duration(data[i].duration, "milliseconds").humanize();
                    $scope.info.playlists[i].index = i;
                    $scope.info.playlists[i].showTracks = false;
                    for (j = 0; j < data[i].length; j++) {
                        $scope.info.playlists[i].tracks[j].isPlaying = false;
                    }

                }

            };

          

            $scope.saveMe = function (data) {
                $scope.info.me = data;

                Soundcloud.getPlaylists($scope.savePlaylists); //comment out as soon as we have better Soundcloud service
            };


            $scope.getPlaylist = function (index) {

                $scope.info.playlists[index].showTracks = !$scope.info.playlists[index].showTracks;
                //$scope.info.playlist = $scope.info.playlists[index].tracks;
                console.log($scope.info.playlists[index]);
            };

            $rootScope.audio = {
                "stream": undefined,
                "info": undefined,
                "isPlaying": false
            };

            $rootScope.playPauseSound = function (track) {

                track.isPlaying = !track.isPlaying;

                if ($rootScope.audio.info && track.stream_url !== $rootScope.audio.info.stream_url) {
                    $rootScope.audio.stream.pause();
                    $rootScope.audio.isPlaying = false;
                    $rootScope.audio.stream = undefined;
                    $rootScope.audio.info.isPlaying = false;
                    console.log("delete old track");
                }
                if ($rootScope.audio.isPlaying) {
                    $rootScope.audio.stream.pause();
                    $rootScope.audio.isPlaying = false;
                    console.log("pause");
                } else {
                    if ($rootScope.audio.stream) {
                        $rootScope.audio.stream.play();
                        $rootScope.audio.isPlaying = true;
                        console.log("play");
                    } else {
                        $rootScope.audio.stream = ngAudio.load(track.stream_url + "?oauth_token=#{token}".format({
                            token: Soundcloud.getOauth_token()
                        }));
                        $rootScope.audio.stream.play();
                        $rootScope.audio.info = track;
                        $rootScope.audio.isPlaying = true;
                        console.log("play new track");
                    }
                }

            };

            $scope.selectedIndex = 1;
            $scope.$watch("selectedIndex", function (current, old) {
                var fnct = $scope.tabs[current].call,
                    callback = $scope.tabs[current].callback;
                if (fnct !== undefined) {
                    fnct(callback);
                }
            });

            Soundcloud.setToken();
            Soundcloud.getMe($scope.saveMe);

            


        }]);