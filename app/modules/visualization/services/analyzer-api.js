/*global angular*/

/**
 * @ngdoc service
 * @name Soundcloud.Services.SoundApi
 * @description SoundApi Service
 */
function AnalyzerAPI($http) {

    "use strict";

    var uploadUrl = "http://ec2-54-201-43-157.us-west-2.compute.amazonaws.com:9088/upload?track_id=#{track_id}",
        profileUrl = "http://developer.echonest.com/api/v4/track/profile?api_key=E2X5BMEC5HNVZDTS1&format=json&id=#{upload_id}&bucket=audio_summary";


    this.getTrackUpload = function (track_id) {
        return $http({
            method: "GET",
            url: uploadUrl.format({
                track_id: track_id
            })
        });
    };


    this.getTrackProfile = function (upload_id) {
        return $http({
            method: "GET",
            url: profileUrl.format({
                upload_id: upload_id
            })
        });
    };

}


angular
    .module("core")
    .service("AnalyzerAPI", AnalyzerAPI);