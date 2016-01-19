/*global angular*/

/**
 * @ngdoc object
 * @name core.Controllers.HomeController
 * @description Home controller
 * @requires ng.$scope
 */

function SearchCtrl($scope, SoundcloudAPI) {
    "use strict";
    $scope.search = {
        input: ""
    };

    $scope.searchTrack = function () {
        var searchrequest = SoundcloudAPI.getTrackSearch($scope.search.input);
        searchrequest.then(function (response) {
            $scope.results = response.data;
        });
    };
}

angular
    .module("core")
    .controller("SearchCtrl", SearchCtrl);