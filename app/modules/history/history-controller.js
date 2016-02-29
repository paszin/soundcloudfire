/*global angular, moment*/
/*jslint plusplus: true*/

/**
 * @ngdoc object
 * @name core.Controllers.HistoryController
 * @description History controller
 * @requires ng.$scope
 */

function HistoryController($scope, HistoryBackend) {
    "use strict";

    var history = HistoryBackend.getTracks();

    history.then(function (response) {
        $scope.tracks = response.data.tracks;
    });
}

angular
    .module("history")
    .controller("HistoryController", HistoryController);