/*global angular, console, moment*/
/*jslint plusplus: true */

/**
 * @ngdoc object
 * @name core.Controllers.HomeController
 * @description Home controller
 * @requires ng.$scope
 */
angular
    .module("core")
    .controller("HomeController", ["$rootScope", "$scope", "$http", "$state", "$stateParams", "$log", "$timeout", "$interval", "ngAudio", "Soundcloud",
        function ($rootScope, $scope, $http, $state, $stateParams, $log, $timeout, $interval, ngAudio, Soundcloud) {

            "use strict";

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

            $scope.saveFavorites = function (data) {
                $scope.favorites = data;


            };


            $scope.saveMe = function (data) {
                $scope.info.me = data;

                Soundcloud.getPlaylists($scope.savePlaylists); //comment out as soon as we have better Soundcloud service
            };


            $scope.getPlaylist = function (index) {

                $scope.info.playlists[index].showTracks = !$scope.info.playlists[index].showTracks;
                //$scope.info.playlist = $scope.info.playlists[index].tracks;
                console.log($scope.info.playlists[index]);


                /*  $state.go("playlist", {
                      "playlist_id": playlist_id
                  });*/
            };

            $scope.audio = {
                "stream": undefined,
                "info": undefined,
                "isPlaying": false
            };

            $scope.playPauseSound = function (track) {

                track.isPlaying = !track.isPlaying;

                if ($scope.audio.info && track.stream_url !== $scope.audio.info.stream_url) {
                    $scope.audio.stream.pause();
                    $scope.audio.isPlaying = false;
                    $scope.audio.stream = undefined;
                    $scope.audio.info.isPlaying = false;
                    console.log("delete old track");
                }
                if ($scope.audio.isPlaying) {
                    $scope.audio.stream.pause();
                    $scope.audio.isPlaying = false;
                    console.log("pause");
                } else {
                    if ($scope.audio.stream) {
                        $scope.audio.stream.play();
                        $scope.audio.isPlaying = true;
                        console.log("play");
                    } else {
                        $scope.audio.stream = ngAudio.load(track.stream_url + "?oauth_token=#{token}".format({
                            token: Soundcloud.getOauth_token()
                        }));
                        $scope.audio.stream.play();
                        $scope.audio.info = track;
                        $scope.audio.isPlaying = true;
                        console.log("play new track");
                    }
                }

            };



            var viewsFolder = "modules/core/views/";
            $scope.tabs = [
                {
                    title: "Search",
                    content: viewsFolder + "following.template.html",
                    icon: "fa-search",
                    call: undefined,
                    callback: undefined
                },
                {
                    title: "Stream",
                    content: viewsFolder + "following.template.html",
                    icon: "fa-music",
                    call: undefined,
                    callback: undefined
                },
                {
                    title: "Playlists",
                    content: viewsFolder + "playlists.template.html",
                    icon: "fa-th-list",
                    call: Soundcloud.getPlaylists,
                    callback: $scope.savePlaylists
                },
                {
                    title: "Likes",
                    content: viewsFolder + "favorites.template.html",
                    icon: "fa-heart",
                    call: Soundcloud.getFavorites,
                    callback: $scope.saveFavorites
                },
                {
                    title: "History",
                    content: viewsFolder + "following.template.html",
                    icon: "fa-clock-o",
                    call: undefined,
                    callback: undefined
                },
                {
                    title: "Next Tracks",
                    content: viewsFolder + "following.template.html",
                    icon: "fa-headphones",
                    call: undefined,
                    callback: undefined
                },
                {
                    title: "Groups",
                    content: viewsFolder + "following.template.html",
                    icon: "fa-users",
                    call: undefined,
                    callback: undefined
                }
            ];

            $scope.selectedIndex = 1;
            $scope.$watch("selectedIndex", function (current, old) {
                var fnct = $scope.tabs[current].call,
                    callback = $scope.tabs[current].callback;
                if (fnct !== undefined) {
                    fnct(callback);
                }
            });



            if (window.location.origin === "http://127.0.0.1:9000" && false) {
                Soundcloud.getAuth(function (data) {
                    Soundcloud.getMe($scope.saveMe)
                });
            } else {
                Soundcloud.setToken();
                Soundcloud.getMe($scope.saveMe);
            }



    }]);