/*global angular*/
/*jshint nomen: true */



function DialogController($scope, $mdDialog, GroupsBackend, SoundcloudSessionManager, track_id) {
    $scope.track_id = track_id;
    $scope.groups = [];
    GroupsBackend.getGroups().then(function (resp) {
        $scope.groups = resp.data.groups;
        $scope.groups.map(function(group) {
            group.preSelected = GroupsBackend.hasTrack(group.id, $scope.track_id);
            group.selected = group.preSelected;
            return group;
        });
    });
    
    $scope.hide = function () {
        $mdDialog.hide();
    };
    $scope.cancel = function () {
        $mdDialog.cancel();
    };
    $scope.answer = function () {
        $scope.groups.forEach(function (group) {
            if (group.selected) {
                GroupsBackend.addTrack(group.id, $scope.track_id, SoundcloudSessionManager.getUserId(), $scope.comment).then($mdDialog.hide());
            }
        });


    };
}

/**
 * @ngdoc service
 * @name core.Services.
 * @description  Service
 */
function GroupDialog($log, $mdDialog, $mdMedia) {

    this.show = function (track_id) {
        var useFullScreen = ($mdMedia("sm") || $mdMedia("xs"));
        $mdDialog.show({
            controller: DialogController,
            locals: {
                track_id: track_id
            },
            templateUrl: "modules/groups/dialog.html",
            parent: angular.element(document.body),
            //targetEvent: ev,
            clickOutsideToClose: true,
            fullscreen: useFullScreen
        });
    };

}

angular
    .module("groups")
    .service("GroupDialog", GroupDialog);

