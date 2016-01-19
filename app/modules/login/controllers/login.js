/*global angular*/


/**
 * @ngdoc object
 * @name core.Controllers.LoginController
 * @description LoginController
 * @requires ng.$scope
 */

function LoginCtrl($scope, $state, SoundcloudLogin) {

    "use strict";

    $scope.entrykey = "domo44";
    $scope.loginWithSoundcloud = function () {
        SoundcloudLogin.connect().then(function () {
            $state.go("home");

        });
    };
}

angular
    .module("login")
    .controller("LoginCtrl", LoginCtrl);