'use strict';

/**
 * @ngdoc object
 * @name core.Controllers.PlaylistController
 * @description PlaylistController
 * @requires ng.$scope
 */
angular
    .module('core')
    .controller('PlaylistController', [
        '$rootScope', '$scope', '$state', '$stateParams', '$http', 'ngAudio',
        function ($rootScope, $scope, $state, $stateParams, $http, ngAudio) {

            var playlistUrl = "https://api.soundcloud.com/playlists/#{playlist_id}?oauth_token=#{token}".format({
                "token": $rootScope.oauth_token,
                "playlist_id": $stateParams.playlist_id
            });
            var streamUrl = "https://api.soundcloud.com/tracks/{track_id}/stream?oauth_token=#{token}";

            $scope.info = {};
            $scope.sound = undefined;
            $scope.playing = false;



            $scope.getPlaylist = function () {
                $http({
                    method: 'GET',
                    url: playlistUrl
                }).then(function successCallback(response) {
                    console.log("success playlist")
                    $scope.info.playlist = response['data'];

                }, function errorCallback(response) {
                    console.log("error playlist");
                    console.log(playlistUrl);
                });
            };

            $scope.playSound = function (stream_url) {
                if ($scope.sound !== undefined) {
                    if ($scope.playing) {
                        $scope.sound.pause();
                    } else {
                        $scope.sound.play();
                    }
                } else {

                    $scope.sound = ngAudio.load(stream_url + "?oauth_token=#{token}".format({
                        token: $rootScope.oauth_token
                    })); // returns NgAudioObject
                    $scope.sound.play();
                    $scope.playing = true;
                }
            };

            var getKeyboardEventResult = function (keyEvent, keyEventDesc) {
                return keyEventDesc + " (keyCode: " + (window.event ? keyEvent.keyCode : keyEvent.which) + ")";
            };

            // Event handlers
            $scope.onKeyDown = function ($event) {
                console.log("keydown");
                $scope.onKeyDownResult = getKeyboardEventResult($event, "Key down");
            };


            $scope.getPlaylist();

        }
]);