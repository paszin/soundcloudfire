/*global angular, moment*/
/*jslint plusplus: true*/
/**
 * @ngdoc object
 * @name core.Controllers.HomeController
 * @description Home controller
 * @requires ng.$scope
 */

function PlaylistsCtrl($scope, SoundcloudAPI) {
    "use strict";
    $scope.playlists = [];
    $scope.savePlaylists = function (response) {
       
        var i, j,
            data = response.data;
        for (i = 0; i < data.length; i++) {
            $scope.playlists[i] = data[i];
            $scope.playlists[i].track_count_readable = (data[i].track_count === 1) ? "1 Track" : data[i].track_count + "Tracks";
            $scope.playlists[i].duration_readable = moment.duration(data[i].duration, "milliseconds").humanize();
            $scope.playlists[i].index = i;
            $scope.playlists[i].showTracks = false;
            for (j = 0; j < data[i].length; j++) {
                $scope.playlists[i].tracks[j].isPlaying = false;
            }
        }
    };


    $scope.getPlaylist = function (index) {

        $scope.playlists[index].showTracks = !$scope.playlists[index].showTracks;
    };

    var playlists = SoundcloudAPI.getPlaylists();
    playlists.then($scope.savePlaylists);
}

angular
    .module("core")
    .controller("PlaylistsCtrl", PlaylistsCtrl);