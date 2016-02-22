/*global angular*/

// Soundcloud module config
/**
 * @ngdoc object
 * @name Soundcloud.config
 * @description Soundcloud description
 */

function createListener() {

    "use strict";

    var url = window.location.href,
        queryParams = angular.extend.apply(null,
            url.split(/[#?&]+/g)
            .map(function (val) {
                var entry = val.split(/=/);
                var obj = {};
                if (entry.length === 2) {
                    obj[entry[0]] = entry[1];
                }
                return obj;
            }));

    if ("access_token" in queryParams) {
        debugger;
        window.opener._SoundcloudCallback(queryParams.access_token);
        window.close();
    }
    if ("state" in queryParams) {
        debugger;
    }

}

angular
    .module("soundcloud")
    .config(createListener);