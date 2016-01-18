/*global angular, console*/

/**
 * @ngdoc service
 * @name Soundcloud.Services.SoundApi
 * @description SoundApi Service
 */
function SoundcloudAPI($http, SoundcloudAPIBase, SoundcloudCredentials, SoundcloudSessionManager) {

    "use strict";


    function mapResponse(response) {
        console.log(response.data);
        return response.data;
    }

    /**
     * Get information about the logged in user.
     * @returns {*} metadata about the user
     */
    this.me = function me() {
        return $http.get(SoundcloudAPIBase + "/me.json", {
                params: {
                    oauth_token: SoundcloudSessionManager.accessToken
                }
            })
            .then(mapResponse, SoundcloudSessionManager.disconnect);
    };

    /**
     * Fetch metadata for a track that exists in Soundcloud.
     * @param trackId Track ID for the song
     * @returns {*} A promise for the song metadata
     */
    this.fetchMetadata = function fetchMetadata(trackId) {
        return $http.get(SoundcloudAPIBase + "/tracks/" + trackId, {
            params: {
                client_id: SoundcloudCredentials.client_id
            }
        }).then(mapResponse, $log.warn.bind($log, "Unable to retrieve song %s (response: %o)", trackId));
    }

}



angular
    .module("soundcloud")
    .service("SoundcloudAPI", SoundcloudAPI)