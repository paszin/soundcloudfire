/*global angular*/

/**
 * @ngdoc filter
 * @name login.Filters.artworksize
 * @description artworksize filter
 */
angular
    .module("soundcloud")
    .filter("beautifyNumber", [

        function () {
            "use strict";
            return function (count) {
                var counts = "" + count;
                if (count === void 0) {
                    return void 0;
                }
                if (count > Math.pow(10, 6)) {
                        return counts.substring(0, counts.length-6) + "." + counts.substring(counts.length-5)[0] +  "M"
                } if (count > Math.pow(10, 3)) {
                    return counts.substring(0, counts.length-3)  +  "k"
                }
                return count;
            };
        }
    ]);