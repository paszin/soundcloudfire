/*global angular, console*/
/*jslint plusplus: true */



function NewGroupDialogController($scope, $mdDialog, GroupsBackend, SoundcloudSessionManager) {
    "use strict";
    $scope.newgroup = {};

    $scope.hide = function () {
        $mdDialog.hide();
    };
    $scope.cancel = function () {
        $mdDialog.cancel();
    };
    $scope.answer = function () {
        GroupsBackend.newGroup($scope.newgroup.name, $scope.newgroup.description, SoundcloudSessionManager.getUserId())
            .then($mdDialog.hide());
    };
}


function AddMembersDialogController($scope, $mdDialog, GroupsBackend, SoundcloudRedirectUri, group_id) {
    "use strict";
    $scope.url = "";
    GroupsBackend.inviteToGroup(group_id).then(function (code) {
        $scope.url = SoundcloudRedirectUri + "#!/login?code=" + code;
    });

    $scope.hide = function () {
        $mdDialog.hide();
    };
    $scope.cancel = function () {
        $mdDialog.cancel();
    };
}

/**
 * @ngdoc object
 * @name core.Controllers.GroupsController
 * @description Groups controller
 * @requires ng.$scope
 */
angular
    .module("groups")
    .controller("GroupsController", ["$scope", "$log", "$mdDialog", "$mdMedia", "GroupsBackend", "SoundcloudAPI",
        function ($scope, $log, $mdDialog, $mdMedia, GroupsBackend) {

            "use strict";
            $scope.groups = [];

            $scope.newGroup = function () {
                var useFullScreen = ($mdMedia("sm") || $mdMedia("xs"));
                $mdDialog.show({
                    controller: NewGroupDialogController,
                    templateUrl: "modules/groups/newGroup-dialog.html",
                    parent: angular.element(document.body),
                    //targetEvent: ev,
                    clickOutsideToClose: true,
                    fullscreen: useFullScreen
                });
            };

            $scope.inviteToGroup = function (group_id) {
                $mdDialog.show({
                    controller: AddMembersDialogController,
                    locals: {
                        group_id: group_id
                    },
                    templateUrl: "modules/groups/addMembers-dialog.html",
                    parent: angular.element(document.body),
                    //targetEvent: ev,
                    clickOutsideToClose: true
                });
                //GroupsBackend.inviteToGroup(group_id);
            };


            $scope.refresh = function () {
                GroupsBackend.getGroups().then(function (resp) {
                    $scope.groups = resp.data.groups;
                });
            };


            $scope.showTracks = function (group) {
                group.moreInfos = !group.moreInfos;
                if (group.sctracks) {
                    return true; //already loaded
                }
                GroupsBackend.getTracks(group.id).then(function (data) {
                    group.sctracks = data;
                });

                GroupsBackend.getMembers(group.id)
                    .then(function (data) {
                        group.members = data;
                    });
            };
            
            $scope.$on("Groups", $scope.refresh);

        }]);