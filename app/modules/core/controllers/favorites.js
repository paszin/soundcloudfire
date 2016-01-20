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

    var favs = SoundcloudAPI.getFavorites(),
        favUsers = {},
        i,
        addArtist = function (resp) {
            favUsers[resp.data.id] = resp.data;
        };
    $scope.getArtistName = function (userId) {
        return favUsers[userId].user_name;
    };

    favs.then(function (response) {
        $scope.favorites = response.data;
        //        for (i = 0; i < $scope.favorites.length; i++) {
        //            SoundcloudAPI.getUser($scope.favorites[i].user_id)
        //                .then(addArtist);
        //        }
    });
}

angular
    .module("core")
    .controller("FavoritesCtrl", FavoritesCtrl);