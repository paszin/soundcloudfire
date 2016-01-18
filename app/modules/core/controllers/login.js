/*global angular, console*/
/*jshint quotmark: double */


/**
 * @ngdoc object
 * @name core.Controllers.LoginController
 * @description LoginController
 * @requires ng.$scope
 */
angular
    .module("core")
    .controller("LoginController", [
        "$scope", "$state", "$stateParams", "$location", "SoundcloudLogin", "SoundcloudAPI", "SoundcloudSessionManager",
        function ($scope, $state, $stateParams, $location, SoundcloudLogin, SoundcloudAPI, SoundcloudSessionManager) {
            
            "use strict";

            $scope.entrykey = "domo44";
            $scope.loginWithSoundcloud = function () {
                SoundcloudLogin.connect().then(function () {
                    console.log("connected"); // Connected!
                    $state.go("home");
                    
                });
            };

        }
    ]);