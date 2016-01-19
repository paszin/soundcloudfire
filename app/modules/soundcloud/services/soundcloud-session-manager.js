/*global angular, console*/

/**
 * @ngdoc service
 * @name Soundcloud.Services.SoundcloudSessionManager
 * @description SoundcloudSessionManager Service
 */


function SoundcloudSessionManager($http, localStorageService, SoundcloudAPIBase) {

    "use strict";

    /**
     * Initialize a Soundcloud session.
     * @param token OAuth token
     */
    this.init = function init(token) {
        $http.get(SoundcloudAPIBase + "/me", {
            params: {
                oauth_token: token
            }
        })
            .then(function (response) {
                localStorageService.set("user_id", response.data.id);
            }, angular.noop);
        localStorageService.set("ouath_token", token);
    };
    
    /**
     * Get token.
     * @returns {string} the token.
     */
    this.getToken = function getToken() {
        return localStorageService.get("ouath_token");
    };
    
    /**
     * Get User ID.
     * @returns {string} the id of logged in user.
     */
    this.getUserId = function getUserId() {
        return localStorageService.get("user_id");
    };

    /**
     * Check if we are logged in to Soundcloud.
     * @returns {boolean}
     */
    this.isConnected = function isConnected() {
        return !!localStorageService.get("ouath_token");
    };

    /**
     * Disconnect from Soundcloud.
     */
    this.disconnect = function disconnect() {
        console.log("disconnected");
        localStorageService.set("ouath_token", null);
    };

    

}

angular
    .module("soundcloud")
    .service("SoundcloudSessionManager", SoundcloudSessionManager);