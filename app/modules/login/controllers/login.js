/*global angular*/


/**
 * @ngdoc object
 * @name core.Controllers.LoginController
 * @description LoginController
 * @requires ng.$scope
 */

function LoginCtrl($scope, $state, SoundcloudLogin) {

    "use strict";
    
    $scope.mainOptions = {
      sectionsColor: ["#100055"],
			anchors: ["WelcomePage"],
			menu: '#menu'
    };


    $scope.loginWithSoundcloud = function () {
        SoundcloudLogin.connect().then(function () {
            $state.go("home");

        });
    };
}

angular
    .module("login")
    .controller("LoginCtrl", LoginCtrl);