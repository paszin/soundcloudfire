/*global angular */

/**
 * @ngdoc object
 * @name Soundcloud.Value.SoundcloudCredentials
 * @description client_id depending on production or test enviroment
 */

function SoundcloudCredentials(SoundcloudRedirectUri) {
    "use strict";
    
    var clientIdLocal = "460ffd8b4467887b82e277fb997d644b",
        clientIdGithub = "8cc5ee91d9e6015109dc93302c43e99c";
    this.getClientId = function getClientId() {
        if (SoundcloudRedirectUri === "http://paszin.github.io/soundcloudfire/") {
            return clientIdGithub;
        } else {
            return clientIdLocal;
        }
    };
}

angular.module("soundcloud")
    .service("SoundcloudCredentials", SoundcloudCredentials);