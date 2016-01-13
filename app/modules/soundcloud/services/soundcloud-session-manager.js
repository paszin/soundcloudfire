/*global angular*/

/**
 * @ngdoc service
 * @name Soundcloud.Services.SoundcloudSessionManager
 * @description SoundcloudSessionManager Service
 */


function SoundcloudSessionManager() {
    
    "use strict";

    var that = this;
    this.accessToken = null;

    /**
     * Get token.
     * @returns {string} the token.
     */
    this.getToken = function getToken() {
        return that.accessToken;
    };

    /**
     * Initialize a Soundcloud session.
     * @param token OAuth token
     */
    this.init = function init(token) {
        that.accessToken = token;
    };

    /**
     * Check if we are logged in to Soundcloud.
     * @returns {boolean}
     */
    this.isConnected = function isConnected() {
        return !!that.accessToken;
    };

    /**
     * Disconnect from Soundcloud.
     */
    this.disconnect = function disconnect() {
        that.accessToken = null;
    };

}

angular
    .module("core")
    .service("SoundcloudSessionManager", SoundcloudSessionManager);
