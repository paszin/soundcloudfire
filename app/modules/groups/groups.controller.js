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
    .controller("GroupsController", ["$scope", "$log", "$mdDialog", "$mdMedia", "GroupsBackend", "SoundcloudAPI",
        function ($scope, $log, $mdDialog, $mdMedia, GroupsBackend, SoundcloudAPI) {

            "use strict";
            $scope.groups = [];

            $scope.newGroup = function () {
                var useFullScreen = ($mdMedia("sm") || $mdMedia("xs"));
                $mdDialog.show({
                    controller: NewGroupDialogController,
                    templateUrl: "modules/groups/newGroup.dialog.html",
                    parent: angular.element(document.body),
                    //targetEvent: ev,
                    clickOutsideToClose: true,
                    fullscreen: useFullScreen
                });
            };


            $scope.refresh = function () {
                GroupsBackend.getGroups().then(function (resp) {
                    $scope.groups = resp.data.groups;
                });
            };

            $scope.refresh();

            $scope.showTracks = function (group) {
                group.doShowTracks = !group.doShowTracks;
                if (group.sctracks) {
                    return true; //already loaded
                }
                GroupsBackend.getTracks(group.id).then(function (data) {
                    group.sctracks = data;
                });
            };

        }]);



function NewGroupDialogController($scope, $mdDialog, GroupsBackend) {
    "use strict";
    $scope.newgroup = {};

    $scope.hide = function () {
        $mdDialog.hide();
    };
    $scope.cancel = function () {
        $mdDialog.cancel();
    };
    $scope.answer = function () {
        GroupsBackend.newGroup($scope.newgroup.name, $scope.newgroup.description, 0).then($mdDialog.hide());
    };
}
