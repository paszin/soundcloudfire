/*global angular*/


/**
 * @ngdoc object
 * @name core.Controllers.LoginController
 * @description LoginController
 * @requires ng.$scope
 */

function LoginCtrl($scope, $state, SoundcloudSessionManager, SoundcloudLogin, GroupsBackend) {

    "use strict";

    $scope.mainOptions = {
        sectionsColor: ["#100055"],
        anchors: ["WelcomePage"]
    };

    //parse invitation Code
    if ($state.params.code) {
        SoundcloudSessionManager.setInvitationCode($state.params.code);
    }



    $scope.loginWithSoundcloud = function () {
        SoundcloudLogin.connect().then(function () {
            $state.go("home");

        });
    };
}

angular
    .module("login")
    .controller("LoginCtrl", LoginCtrl);