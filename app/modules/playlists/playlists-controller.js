/*global angular*/
/*jslint plusplus: true*/
/**
 * @ngdoc object
 * @name playlists.Controllers.PlaylistController
 * @description Playlist controller
 * @requires ng.$scope
 */

function PlaylistsController($scope, $log, PlaylistService) {
    "use strict";
    $scope.playlists = [];

    $scope.getPlaylist = function (index) {
        $scope.playlists[index].showTracks = !$scope.playlists[index].showTracks;
    };

    function loadPlaylists() {
        $log.info("load playlists");
        PlaylistService.getPlaylists().then(function (data) {
            $scope.playlists = data;
        });
    }
    
    $scope.$on("Playlists", loadPlaylists);

}

angular
    .module("core")
    .controller("PlaylistsController", PlaylistsController);