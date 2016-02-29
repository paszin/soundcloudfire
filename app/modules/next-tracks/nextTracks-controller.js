/*global angular, console*/
/*jshint quotmark: double */


/**
 * @ngdoc object
 * @name core.Controllers.NextTracksController
 * @description NextTraclsController
 * @requires ng.$scope
 */
function NextTracksCtrl($scope, $log, $mdToast, SoundcloudNextTracks, SoundcloudAPI) {

    "use strict";

    $scope.editMode = false;
    $scope.playlist = {
        name: "Name",
        isPrivate: true
    };
    $scope.loop = false;

    $scope.nextTracks = SoundcloudNextTracks.nextTracks;

    $scope.saveAsPlaylist = function () {
        SoundcloudAPI.postPlaylist($scope.playlist.name, $scope.playlist.isPrivate, SoundcloudNextTracks.getNextTracksIds())
            .then(
                function (resp) {
                    $scope.editMode = false;
                    $mdToast.show(
                        $mdToast.simple()
                            .textContent("Saved as playlist")
                            .position("top right")
                            .hideDelay(3000)
                    );
                },
                function (resp) {
                    $log.error(resp);
                    $mdToast.show(
                        $mdToast.simple()
                            .textContent("Fuck, Error, check console for further details")
                            .position("top right")
                            .hideDelay(3000)
                    );
                }
            );
    };

    $scope.refresh = function () {
        $scope.playlist = SoundcloudNextTracks.getNextTracks();
    };
    
    $scope.$watch("loop", function(current) {
        SoundcloudNextTracks.setLoopMode(current);
    });

}

angular
    .module("core")
    .controller("NextTracksCtrl", NextTracksCtrl);