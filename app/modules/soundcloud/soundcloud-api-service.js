/*global angular, _*/
/*jshint nomen: true */

/*notes: https://api-v2.soundcloud.com/stream?promoted_playlist=false&offset=00000152-609e-7f10-ffff-ffffee7202eb&sc_a_id=6b0b0b1d-af6d-4c7e-82b6-033c8952d91c&limit=50&client_id=02gUJC0hH2ct1EGOcYXQIzRFU91c72Ea&app_version=89b44ce to get the stream

*/

/**
 * @ngdoc service
 * @name Soundcloud.Services.SoundApi
 * @description SoundApi Service
 */
function SoundcloudAPI($http, $log, $httpParamSerializerJQLike, SoundcloudCredentials, SoundcloudSessionManager) {

    "use strict";

    var baseUrl = "https://api.Soundcloud.com",
        //endpoints
        meUrl = baseUrl + "/me",
        userUrl = baseUrl + "/users/#{user_id}/",
        playlistsUrl = baseUrl + "/users/#{user_id}/playlists",
        newPlaylistUrl = baseUrl + "/playlists",
        favoritesUrl = baseUrl + "/users/#{user_id}/favorites",
        //trackUrl = baseUrl + "/tracks/#{track_id}",
        trackSearchUrl = baseUrl + "/tracks",
        resolveUrl = baseUrl + "/resolve",
        followingsUrl = baseUrl + "/users/#{user_id}/followings";


    //  function mapResponse(response) {
    //        return response.data;
    //    }

    /**
     * Get information about the logged in user.
     * @returns {*} metadata about the user
     */
    this.getMe = function () {
        return $http.get(meUrl, {
            params: {
                oauth_token: SoundcloudSessionManager.getToken()
            }
        });
        //  .then(mapResponse, SoundcloudSessionManager.disconnect);
    };

    /**
     * Fetch metadata for a track that exists in Soundcloud.
     * @param trackId Track ID for the song
     * @returns {*} A promise for the song metadata
     
    this.fetchMetadata = function fetchMetadata(trackId) {
        return $http.get(SoundcloudAPIBase + "/tracks/" + trackId, {
            params: {
                client_id: SoundcloudCredentials.getClientId()
            }
        }).then(mapResponse, $log.warn.bind($log, "Unable to retrieve song %s (response: %o)", trackId));
    };*/


    this.getPlaylists = function () {
        return $http({
            method: "GET",
            url: playlistsUrl.format({
                "user_id": SoundcloudSessionManager.getUserId()
            }),
            params: {
                oauth_token: SoundcloudSessionManager.getToken()
            }
        });
    };

    this.postPlaylist = function (title, isPrivate, track_ids) {
        var sharing = isPrivate ? "private" : "public",
            idsSerie = _.join(_.map(track_ids, function (id) {
                return "playlist%5Btracks%5D%5B%5D%5Bid%5D=" + id;
            }), "&");
        return $http({
            method: "POST",
            url: newPlaylistUrl,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            data: $httpParamSerializerJQLike({
                "oauth_token": SoundcloudSessionManager.getToken(),
                "playlist[title]": title,
                "playlist[sharing]": sharing,
                "playlist[_resource_id]": null,
                "playlist[_resource_type]": "playlist"
            }) + "&" + idsSerie
        });
    };


    this.putPlaylist = function (playlist_id, track_ids) {

        var ids = _.map(track_ids, function (id) {
            return {
                id: id
            };
        });
        return $http({
            method: "PUT",
            url: newPlaylistUrl + "/" + playlist_id,
            headers: {
                "Content-Type": "application/json"
            },
            data: {
                "oauth_token": SoundcloudSessionManager.getToken(),
                "playlist": {
                    "tracks": ids
                }
            }
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

    this.getFollowings = function () {
        return $http({
            method: "GET",
            url: followingsUrl.format({
                "user_id": SoundcloudSessionManager.getUserId()
            }),
            params: {
                oauth_token: SoundcloudSessionManager.getToken()
            }
        });
    };

    this.getUser = function (userId) {
        return $http({
            method: "GET",
            url: userUrl.format({
                "user_id": userId
            }),
            params: {
                oauth_token: SoundcloudSessionManager.getToken()
            }
        });
    };

    this.getTrackSearch = function (searchterm) {
        return $http({
            method: "GET",
            url: trackSearchUrl,
            params: {
                oauth_token: SoundcloudSessionManager.getToken(),
                q: searchterm
            }
        });
    };

    this.getTrackFromUrl = function (url) {
        return $http({
            method: "GET",
            url: resolveUrl,
            params: {
                url: url,
                client_id: SoundcloudCredentials.getClientId()
            }
        });
    };

}


angular
    .module("soundcloud")
    .service("SoundcloudAPI", SoundcloudAPI);