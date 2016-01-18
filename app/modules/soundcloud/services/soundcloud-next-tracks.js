/*jslint nomen: true*/
/*global angular, _*/


/**
 * @ngdoc service
 * @name Soundcloud.Services.SoundcloudNextTracks
 * @description SoundcloudNextTracks Service
 */


function SoundcloudNextTracks(localStorageService) {

    "use strict";
    this.nextTracks = [];

    /**
     * add to playlist.
     * @returns {string} the token.
     */
    this.addTrack = function addTrack(track) {
        this.nextTracks.push(track);
        //return localStorageService.get("ouath_token");
    };

    /**
     * delete from playlist.
     * @param track_id id of track
     */
    this.deleteTrack = function deleteTrack(track_id) {
        _.remove(this.nextTracks, function (o) {
            return o.id === track_id;
        });
    };
    
    /**
     * Get the playlist.
     * @returns {array} next tracks playlist
     */
    this.getNextTracks = function getNextTracks() {
        return this.nextTracks;
    };
}

angular
    .module("soundcloud")
    .service("SoundcloudNextTracks", SoundcloudNextTracks);