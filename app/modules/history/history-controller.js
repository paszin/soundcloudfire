/*global angular*/
/*jslint plusplus: true*/

/**
 * @ngdoc object
 * @name core.Controllers.HistoryController
 * @description History controller
 * @requires ng.$scope
 */

function HistoryController($scope, HistoryBackend) {
    "use strict";

    var history;

    $scope.refresh = function refresh() {
        history = HistoryBackend.getTracks();

        history.then(function (response) {
            $scope.tracks = response.data.tracks;
        });
    };
    
    $scope.$on("History", $scope.refresh);

}

angular
    .module("history")
    .controller("HistoryController", HistoryController);