/*global angular*/

/**
 * @ngdoc service
 * @name Soundcloud.Services.SoundcloudUtil
 * @description SoundcloudUtil Service
 */

function SoundcloudUtil() {
    
    "use strict";

    function mapEntry(key) {
        return this[key] ? key + "=" + this[key] : null;
    }

    function mapAndEscape(key) {
        return this[key] ? key + "=" + encodeURIComponent(this[key]) : null;
    }

    /**
     * Convert an object to a string of parameters (separated by &).
     * @param obj Object to be mapped
     * @returns {string}
     */
    this.toParams = function (obj) {
        return Object.keys(obj)
            .map(mapAndEscape.bind(obj))
            .join("&");
    };

    /**
     * Convert an object to a string of options (separated by ,).
     * @param obj Object to be mapped
     * @returns {string}
     */
    this.toOptions = function (obj) {
        return Object.keys(obj)
            .map(mapEntry.bind(obj))
            .join(",");
    };

}


angular
    .module("core")
    .service("SoundcloudUtil", SoundcloudUtil);