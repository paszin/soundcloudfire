'use strict';

/**
 * @ngdoc object
 * @name core.Controllers.HomeController
 * @description Home controller
 * @requires ng.$scope
 */
angular
    .module('core')
    .controller('HomeController', ['$rootScope', '$scope', '$http', '$state', '$stateParams', '$log', '$timeout', '$interval', 'ngAudio', 'Soundcloud',
        function ($rootScope, $scope, $http, $state, $stateParams, $log, $timeout, $interval, ngAudio, Soundcloud) {

            $scope.audio = {
                "info": {
                    "genre": "Deep-House Melodic",
                    "title": "Vijay & Sofia Zlatko - Le Jardin (Pingpong Remix)SNIPPET",
                    "artwork_url": "https://i1.sndcdn.com/artworks-000099309425-kzmqoa-large.jpg",
                    "waveform_url": "https://w1.sndcdn.com/r2r7Vx88BA19_m.png",
                    "stream_url": "https://api.soundcloud.com/tracks/161269750/stream",
                    "playback_count": 50077,
                    "favoritings_count": 1189,
                    "comment_count": 46
                },
                "stream": true
            }

            $scope.info = {
                "me": {},
                "playlists": []
            };

            $scope.savePlaylists = function (data) {
                $timeout(function () {
                    console.log("save playlists");

                    if ($scope.info.playlists.length !== 0) {
                        console.log("take from cache");
                        return;
                    }
                    var i, j;
                    for (i = 0; i < data.length; i++) {
                        $scope.info.playlists[i] = data[i];
                        $scope.info.playlists[i].track_count_readable = (data[i].track_count == 1) ? "1 Track" : data[i].track_count + 'Tracks';
                        $scope.info.playlists[i].duration_readable = moment.duration(data[i].duration, "milliseconds").humanize();
                        $scope.info.playlists[i].index = i;
                        $scope.info.playlists[i].showTracks = false;
                        for (j = 0; j < data[i].length; j++) {
                            $scope.info.playlists[i].tracks[j].isPlaying = false;
                        }

                    }
                });
            };


            $scope.saveMe = function (data) {
                $scope.info.me = data;

                Soundcloud.getPlaylists($scope.savePlaylists); //comment out as soon as we have better soundcloud service
            };
            $scope.saveAuth = function (data) {
                Soundcloud.getMe($scope.saveMe);
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
                    title: 'Stream',
                    content: viewsFolder + "stream.template.html",
                    call: undefined,
                    callback: undefined
                    },
                {
                    title: 'Playlists',
                    content: viewsFolder + "playlists.template.html",
                    call: Soundcloud.getPlaylists,
                    callback: $scope.savePlaylists,
                    },
                {
                    title: 'Likes',
                    content: viewsFolder + "likes.template.html",
                    call: undefined,
                    callback: undefined
                    },
                {
                    title: 'Following',
                    content: viewsFolder + "following.template.html",
                    call: undefined,
                    callback: undefined
                    }
        ];

            $scope.selectedIndex = 1;
            $scope.$watch('selectedIndex', function (current, old) {
                var fnct = $scope.tabs[current]['call'],
                    callback = $scope.tabs[current]['callback'];
                if (fnct !== undefined) {
                    fnct(callback);
                }
            });




            Soundcloud.getAuth($scope.saveAuth);
                }
                ]);