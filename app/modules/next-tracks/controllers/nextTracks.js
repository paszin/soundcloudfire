/*global angular, console*/
/*jshint quotmark: double */


/**
 * @ngdoc object
 * @name core.Controllers.NextTracksController
 * @description NextTraclsController
 * @requires ng.$scope
 */
function NextTracksCtrl($scope, SoundcloudNextTracks) {

    "use strict";
    $scope.playlist = SoundcloudNextTracks.nextTracks;

    $scope.refresh = function () {
        $scope.playlist = SoundcloudNextTracks.getNextTracks();
    };

}

angular
    .module("core")
    .controller("NextTracksCtrl", NextTracksCtrl);