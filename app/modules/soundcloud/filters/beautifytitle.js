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
                //available sizes: large
                
                return title.replace("Free Download", "").replace("OUT NOW !!!", "").replace("FREE DOWNLOAD", "");
            };
        }
    ]);