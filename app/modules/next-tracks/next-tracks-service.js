/*jslint nomen: true*/
/*global angular, _*/


/**
 * @ngdoc service
 * @name Soundcloud.Services.NextTracks
 * @description NextTracks Service
 */


function NextTracks() {

    "use strict";
    this.nextTracks = [];
    this.currentTrackId = null;
    this.loop = false;

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
    this.deleteTrack = function deleteTrack(track_id, force) {
        if (force || !this.loop) {
            _.remove(this.nextTracks, function (o) {
                return o.id === track_id;
            });
        } else {
            var element = _.find(this.nextTracks, {
                    id: track_id
                }),
                fromIndex = this.nextTracks.indexOf(element);
            this.nextTracks.splice(fromIndex, 1);
            this.nextTracks.splice(this.nextTracks.length, 0, element);
        }
    };


    /**
     * return next track in playlist.
     * @return {object} track
     */
    this.getNextTrack = function getNextTrack() {
        if (this.nextTracks.length) {
            var nextTrack = this.nextTracks[0];
            this.currentTrackId = nextTrack.id;
            return nextTrack;
        }
        return null;
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

    this.setLoopMode = function setLoopMode(on) {
        this.loop = on;
    };
    
    this.isInNextTracks = function isInNextTracks(track_id) {
        return _.find(this.nextTracks, {id: track_id});
    }
}

angular
    .module("next-tracks")
    .service("NextTracks", NextTracks);