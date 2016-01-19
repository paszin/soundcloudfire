/*global angular */

/**
 * @ngdoc object
 * @name Soundcloud.Value.SoundcloudCredentials
 * @description client_id depending on production or test enviroment
 */
angular
    .module("soundcloud")
    .value("SoundcloudCredentials", {
        client_id: (window.location.origin === "http://paszin.github.io/soundcloudfire/") ? "8cc5ee91d9e6015109dc93302c43e99c" : "460ffd8b4467887b82e277fb997d644b"
    });