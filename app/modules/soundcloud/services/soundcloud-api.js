/*global angular, console*/

/**
 * @ngdoc service
 * @name Soundcloud.Services.SoundApi
 * @description SoundApi Service
 */
function SoundcloudAPI($http, $log, SoundcloudAPIBase, SoundcloudCredentials, SoundcloudSessionManager) {

    "use strict";

    var baseUrl = "https://api.Soundcloud.com",
        clientId = SoundcloudCredentials.client_id,
        clientSecret = SoundcloudCredentials.client_secret,
        //endpoints
        meUrl = baseUrl + "/me",
        playlistsUrl = baseUrl + "/users/#{user_id}/playlists",
        favoritesUrl = baseUrl + "/users/#{user_id}/favorites",
        trackUrl = baseUrl + "/tracks/#{track_id}";


    function mapResponse(response) {
        console.log(response.data);
        return response.data;
    }

    /**
     * Get information about the logged in user.
     * @returns {*} metadata about the user
     */
    this.getMe = function me() {
        return $http.get(meUrl, {
            params: {
                oauth_token: SoundcloudSessionManager.getToken()
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
    };


    this.getPlaylists = function () {
        $http({
            method: "GET",
            url: playlistsUrl.format({
                "user_id": SoundcloudSessionManager.userId
            }),
            params: {
                oauth_token: SoundcloudSessionManager.getToken()
            }
        }).then(mapResponse, function errorCallback(response) {
            console.log("error playlists");
        });
    };

    this.getFavorites = function () {
        return $http({
            method: "GET",
            url: favoritesUrl.format({
                "user_id": SoundcloudSessionManager.getUserId()
            }),
            params: {
                oauth_token: SoundcloudSessionManager.getToken()
            }
        });
    };


}



angular
    .module("soundcloud")
    .service("SoundcloudAPI", SoundcloudAPI);