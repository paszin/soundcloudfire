/*global angular, console, moment*/
/*jslint plusplus: true */
/*jshint quotmark: double */


/**
 * @ngdoc object
 * @name core.Controllers.HomeController
 * @description Home controller
 * @requires ng.$scope
 */


function FavoritesCtrl($rootScope, $scope, $http, $state, $stateParams, $log, $timeout, $interval, ngAudio, SoundcloudAPI, SoundcloudNextTracks, Tabs) {
    "use strict";
    
    var favs = SoundcloudAPI.getFavorites();
    favs.then(function (response) {
        $scope.favorites = response.data;
    });
}


angular
    .module("core")
    .controller("FavoritesCtrl", FavoritesCtrl);