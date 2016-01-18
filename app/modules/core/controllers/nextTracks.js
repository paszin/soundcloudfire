/*global angular, console*/
/*jshint quotmark: double */


/**
 * @ngdoc object
 * @name core.Controllers.NextTracksController
 * @description NextTraclsController
 * @requires ng.$scope
 */
function NextTracksCtrl($scope, SoundcloudAPI, SoundcloudSessionManager, SoundcloudNextTracks) {

    "use strict";
    $scope.playlist = SoundcloudNextTracks.nextTracks;

}

angular
    .module("core")
    .controller("NextTracksCtrl", NextTracksCtrl);