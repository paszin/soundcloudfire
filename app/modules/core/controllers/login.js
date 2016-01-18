/*global angular, console*/


/**
 * @ngdoc object
 * @name core.Controllers.LoginController
 * @description LoginController
 * @requires ng.$scope
 */
angular
    .module("core")
    .controller("LoginController", [
        "$scope", "$state", "SoundcloudLogin",
        function ($scope, $state, SoundcloudLogin) {
            
            "use strict";

            $scope.entrykey = "domo44";
            $scope.loginWithSoundcloud = function () {
                SoundcloudLogin.connect().then(function () {
                    $state.go("home");
                    
                });
            };

        }
    ]);