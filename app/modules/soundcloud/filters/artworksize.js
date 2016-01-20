/*global angular*/

/**
 * @ngdoc filter
 * @name login.Filters.artworksize
 * @description artworksize filter
 */
angular
    .module("soundcloud")
    .filter("artworksize", [

        function () {
            "use strict";
            return function (url, size) {
                //available sizes: large
                if (!url) {
                    return url;
                }
                return url.replace("-large.jpg", "-" + size + ".jpg");
            };
        }
    ]);