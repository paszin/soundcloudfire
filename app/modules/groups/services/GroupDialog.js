/*global angular*/
/*jshint nomen: true */


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
            templateUrl: "modules/groups/views/dialog.html",
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


function DialogController($scope, $mdDialog, GroupsBackend, track_id) {
    $scope.track_id = track_id;
    $scope.groups = [];
    GroupsBackend.getGroups().then(function (resp) {
        $scope.groups = resp.data.groups;
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
                GroupsBackend.addTrack(group.id, $scope.track_id, 0).then($mdDialog.hide());
            }
        })


    };
}