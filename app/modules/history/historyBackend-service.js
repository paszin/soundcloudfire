/*global angular*/
/*jshint nomen: true */

/**
 * @ngdoc service
 * @name history.Services.HistoryBackend
 * @description HistoryBackend Service
 */
function HistoryBackend($http, SoundcloudSessionManager) {

    "use strict";

    var baseUrl;
    baseUrl = "http://ec2-54-201-43-157.us-west-2.compute.amazonaws.com:8000";
    //baseUrl = "http://localhost:8000";

    /**
     * Get information
     * @returns {*} 
     */
    this.getTracks = function () {
        return $http({
            method: "GET",
            url: baseUrl + "/history",
            params: {
                "user_id": SoundcloudSessionManager.getUserId()
            }
        });
    };


    this.addTrack = function (track) {
        var statistics = {
            comment_count: track.comment_count,
            playback_count: track.playback_count,
            favoritings_count: track.favoritings_count,
        };
        return $http({
            method: "POST",
            url: baseUrl + "/history",
            data: {
                track_id: track.id,
                user_id: SoundcloudSessionManager.getUserId(),
                statistics: statistics
            }
        });
    };

}


angular
    .module("history")
    .service("HistoryBackend", HistoryBackend);