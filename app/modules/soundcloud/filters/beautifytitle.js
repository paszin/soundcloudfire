/*global angular*/

/**
 * @ngdoc filter
 * @name login.Filters.artworksize
 * @description artworksize filter
 */
angular
    .module("soundcloud")
    .filter("beautifyTitle", [

        function () {
            "use strict";
            return function (title) {
                if (title === void 0) {
                    return void 0;
                }
                return title.replace("Free Download", "").replace("OUT NOW !!!", "").replace("FREE DOWNLOAD", "").replace("[OUT NOW!]", "");
            };
        }
    ]);