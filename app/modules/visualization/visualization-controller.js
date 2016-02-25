/*global angular*/

/**
 * @ngdoc object
 * @name core.Controllers.HomeController
 * @description Home controller
 * @requires ng.$scope
 */

function VisualizationCtrl($scope, $timeout, $interval, playerService, AnalyzerAPI) {
    "use strict";


    $scope.result = {
        "status": {
            message: null
        },
        "track": {
            audio_summary: null
        }
    };
    $scope.loading = false;

    $scope.labels = ["danceability", "energy", "speechiness", "acousticness", "liveness"];

    $scope.data = [
        [0, 0, 0, 0, 0]
    ];

    $scope.analyzeTrack = function () {
        $scope.uploadTrack();
    };

    $scope.progress = {
        value: 0
    };

    $scope.getDownload = function () {
        if (playerService.audio.info) {
            return "http://ec2-54-201-43-157.us-west-2.compute.amazonaws.com:9088/download/" + playerService.audio.info.id + ".mp3";
        }
    };

    $scope.uploadTrack = function () {
        $scope.loading = true;
        var uploadRequest = AnalyzerAPI.getTrackUpload(playerService.audio.info.id);
        uploadRequest.then(function (response) {

            $timeout(function () {
                $scope.profileTrack(response.data.echonest_trackid);
            }, 10000);
        });
    };

    $scope.profileTrack = function (nest_id) {
        AnalyzerAPI.getTrackProfile(nest_id).then(function (resp) {
            $scope.loading = false;
            $scope.result = resp.data.response;
            var as = resp.data.response.track.audio_summary;
            $scope.data = [[as.danceability, as.energy, as.speechiness, as.acousticness, as.liveness]];
        });
    };
}

angular
    .module("core")
    .controller("VisualizationCtrl", VisualizationCtrl);