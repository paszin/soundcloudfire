/*global angular */
/*jshint quotmark: double */

 

/**
 * @ngdoc object
 * @name Soundcloud.Constants.SoundcloudConstants
 * @description Define a constant
 */
angular
    .module("soundcloud")
    .constant("SoundcloudPopupDefaults", {
        width: 456,
        height: 510,
        location: 1,
        left: 20,
        top: 20,
        toolbar: "no",
        scrollbars: "yes"
    })
    .constant("SoundcloudRedirectUri", window.location.origin)
    .constant("SoundcloudConnectParamBase", {
        scope: "non-expiring",
        response_type: "token",
        display: "popup"
    })
    .constant("SoundcloudAPIBase", "https://api.Soundcloud.com")
    .constant("SoundcloudCredentials", {
        client_id: "460ffd8b4467887b82e277fb997d644b",
        client_secret: "f4bd70d1c70fe99da3a52d97d749f761"
    });