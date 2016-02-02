/*global angular*/
/*jshint nomen: true */

/**
 * @ngdoc service
 * @name Soundcloud.Services.SoundApi
 * @description SoundApi Service
 */
function playerService($log, ngAudio, SoundcloudSessionManager) {

    "use strict";
    this.audio = {
        "stream": null,
        "info": null,
        "isPlaying": false
    };

    this.playPauseSound = function (track) {
        if (track === undefined) {
            track = this.audio.info;
        }

        track.isPlaying = !track.isPlaying;

        if (this.audio.info && track.stream_url !== this.audio.info.stream_url) {
            this.audio.stream.pause();
            this.audio.isPlaying = false;
            this.audio.stream = null;
            this.audio.info.isPlaying = false;
            $log.info("delete old track");
        }
        if (this.audio.isPlaying) {
            this.audio.stream.pause();
            this.audio.isPlaying = false;
            $log.info("pause");
        } else {
            if (this.audio.stream) {
                this.audio.stream.play();
                this.audio.isPlaying = true;
                $log.info("play");
            } else {
                this.audio.stream = ngAudio.load(track.stream_url + "?oauth_token=#{token}".format({
                    token: SoundcloudSessionManager.getToken()
                }));
                this.audio.stream.play();
                this.audio.info = track;
                this.audio.isPlaying = true;
                $log.info("play new track");
            }
        }
    };
    
    
    this.goTo = function (pos) { 
        this.audio.stream.progress = pos;
    };
}


angular.module("audioplayer")
       .service("playerService", playerService);