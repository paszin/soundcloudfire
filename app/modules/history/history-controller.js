/*global angular, _*/
/*jslint plusplus: true*/

/**
 * @ngdoc object
 * @name core.Controllers.HistoryController
 * @description History controller
 * @requires ng.$scope
 */

function HistoryController($scope, HistoryBackend, NextTracks) {
    "use strict";

    var history,
        offset = 0;
    $scope.tracks = [];
    $scope.hasMoreTracks = false;

    $scope.refresh = function refresh() {
        $scope.hasMoreTracks = false;
        offset = 0;
        $scope.tracks = [];
        $scope.loadMore();
    };

    $scope.loadMore = function loadMore() {
        history = HistoryBackend.getTracks(offset);

        history.then(function (response) {
            $scope.tracks = _.concat($scope.tracks, response.data.tracks);
            offset = response.data.offset + response.data.tracks.length;
            $scope.hasMoreTracks = response.data.nextpath !== null;
        });

    };

    $scope.addToPlayNext = function (track) {
        NextTracks.addTrack(track);
    };


    $scope.$on("History", $scope.refresh);

}

angular
    .module("history")
    .controller("HistoryController", HistoryController);