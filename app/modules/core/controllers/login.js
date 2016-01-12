'use strict';




/**
 * @ngdoc object
 * @name core.Controllers.LoginController
 * @description LoginController
 * @requires ng.$scope
 */
angular
    .module('core')
    .controller('LoginController', [
        '$scope', '$state', '$stateParams', '$location', 'credentials', 'SoundCloudLogin', 'SoundCloudAPI', 'SoundCloudSessionManager',
        function ($scope, $state, $stateParams, $location, crendentials, SoundCloudLogin, SoundCloudAPI, SoundCloudSessionManager) {

            $scope.entrykey = "domo44";
            $scope.loginWithSoundcloud = function () {
                SoundCloudLogin.connect().then(function () {
                    console.log("connected"); // Connected!
                    $state.go('home');
                    SoundCloudAPI.me();
                });
            };

        }
]);