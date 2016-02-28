/*global angular, moment*/
/*jslint plusplus: true*/

/**
 * @ngdoc service
 */
function PlaylistService($q, SoundcloudAPI) {

    "use strict";
    var self = {
        playlists: [],
        isLoaded: false
    };


    this.mapPlaylist = function (response) {

        var i, j,
            playlists = [],
            data = response.data;
        for (i = 0; i < data.length; i++) {
            playlists.push(data[i]);
            playlists[i].track_count_readable = (data[i].track_count === 1) ? "1 Track" : data[i].track_count + "Tracks";
            playlists[i].duration_readable = moment.duration(data[i].duration, "milliseconds").humanize();
            playlists[i].index = i;
            playlists[i].showTracks = false;
            for (j = 0; j < data[i].length; j++) {
                playlists[i].tracks[j].isPlaying = false;
            }
        }
        self.playlists = playlists;
        self.isLoaded = true;
        return playlists;
    };

    this.getPlaylists = function (reload) {
        if (reload || !self.isLoaded) {
            return SoundcloudAPI.getPlaylists().then(this.mapPlaylist);
        }
        return $q(function (resolve, reject) {
            return resolve(self.playlists);
        });
    };
}



angular.module("playlists").service("PlaylistService", PlaylistService);