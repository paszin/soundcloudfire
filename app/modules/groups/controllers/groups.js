/*global angular, console*/
/*jslint plusplus: true */


/**
 * @ngdoc object
 * @name core.Controllers.GroupsController
 * @description Groups controller
 * @requires ng.$scope
 */
angular
    .module("groups")
    .controller("GroupsController", ["$scope", "$http", "$state", "$stateParams", "$log", "$timeout", "$interval", "GroupsBackend", "SoundcloudAPI",
        function ($scope, $http, $state, $stateParams, $log, $timeout, $interval, GroupsBackend, SoundcloudAPI) {

            "use strict";
            $scope.groups = [];


            $scope.refresh = function () {
                GroupsBackend.getGroups().then(function (resp) {
                    $scope.groups = resp.data.groups;
                });
            };

            $scope.refresh();

            $scope.showTracks = function (group) {
                group.doShowTracks = !group.doShowTracks;
                if (group.sctracks) {
                    console.log("already there");
                    return true; //already loaded
                }
                GroupsBackend.getTracks(group.id).then(function (resp) {
                    group.sctracks = resp.data.tracks;
                });
            };


        }]);