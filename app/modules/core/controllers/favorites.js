/*global angular*/
/*jslint plusplus: true*/

/**
 * @ngdoc object
 * @name core.Controllers.HomeController
 * @description Home controller
 * @requires ng.$scope
 */

function FavoritesCtrl($scope, SoundcloudAPI) {
    "use strict";

    var favs = SoundcloudAPI.getFavorites();

    favs.then(function (response) {
        $scope.favorites = response.data;
    });
}

angular
    .module("core")
    .controller("FavoritesCtrl", FavoritesCtrl);