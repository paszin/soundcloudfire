/*global angular*/

/**
 * @ngdoc service
 * @name Soundcloud.Services.SoundcloudSessionManager
 * @description SoundcloudSessionManager Service
 */


function SoundcloudSessionManager($http, $log, localStorageService, SoundcloudAPIBase) {

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
                localStorageService.set("me", response.data);
            }, angular.noop);
        
        localStorageService.set("ouath_token", token);
    };
    
    this.getMe = function getMe() {
        return localStorageService.get("me");
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
        $log.error("disconnected");
        localStorageService.set("ouath_token", null);
    };
    
    this.setInvitationCode = function(code) {
        localStorageService.set("invitationcode", code);
    };
    
    this.getInvitationCode = function() {
        return localStorageService.get("invitationcode");
    };

    

}

angular
    .module("soundcloud")
    .service("SoundcloudSessionManager", SoundcloudSessionManager);