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
            GroupsBackend.getGroups().then(function (resp) {
                $scope.groups = resp.data.groups;
            });


        }]);