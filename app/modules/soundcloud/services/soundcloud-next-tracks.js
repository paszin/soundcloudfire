/*jslint nomen: true*/
/*global angular, _*/


/**
 * @ngdoc service
 * @name Soundcloud.Services.SoundcloudNextTracks
 * @description SoundcloudNextTracks Service
 */


function SoundcloudNextTracks() {

    "use strict";
    this.nextTracks = [];
    this.currentTrackId = null;

    /**
     * add to playlist.
     * @returns {string} the token.
     */
    this.addTrack = function addTrack(track) {
        if (_.findIndex(this.nextTracks, ["id", track.id]) < 0) {
            this.nextTracks.push(track);
        }
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
     * return next track in playlist.
     * @return {object} track
     */
    this.getNextTrack = function getNextTrack() {
        var currentIndex = _.findIndex(this.nextTracks, ["id", this.currentTrackId]),
            nextTrack = this.nextTracks[currentIndex + 1];
        this.currentTrackId = nextTrack.id;
        return nextTrack;
    };

    /**
     * Get the playlist.
     * @returns {array} next tracks playlist
     */
    this.getNextTracks = function getNextTracks() {
        return this.nextTracks;
    };

    /**
     * Get the playlist.
     * @returns {array} next tracks ids
     */
    this.getNextTracksIds = function getNextTracksIds() {
        return _.map(this.nextTracks, function (obj) {
            return obj.id;
        });
    };
}

angular
    .module("soundcloud")
    .service("SoundcloudNextTracks", SoundcloudNextTracks);