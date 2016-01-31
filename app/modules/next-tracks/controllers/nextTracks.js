/*global angular, console*/
/*jshint quotmark: double */


/**
 * @ngdoc object
 * @name core.Controllers.NextTracksController
 * @description NextTraclsController
 * @requires ng.$scope
 */
function NextTracksCtrl($scope, $log, SoundcloudNextTracks, SoundcloudAPI) {

    "use strict";

    $scope.editMode = false;
    $scope.playlist = {
        name: "Name",
        isPrivate: true
    };


    $scope.playlist = SoundcloudNextTracks.nextTracks;

    $scope.saveAsPlaylist = function () {
        SoundcloudAPI.postPlaylist($scope.playlist.name, $scope.playlist.isPrivate, SoundcloudNextTracks.getNextTracksIds())
            .then(
                function (resp) {
                    $log.info("awesome, it worked");
                },
                function (resp) {
                    $log.error(resp);
                }
            );
    };

    $scope.refresh = function () {
        $scope.playlist = SoundcloudNextTracks.getNextTracks();
    };

}

angular
    .module("core")
    .controller("NextTracksCtrl", NextTracksCtrl);