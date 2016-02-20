/*global angular, moment*/

/**
 * @ngdoc filter
 * @name login.Filters.artworksize
 * @description artworksize filter
 */
angular
    .module("soundcloud")
    .filter("beautifyDate", [

        function () {
            "use strict";
            return function (date) {
                if (date === void 0) {
                    return void 0;
                }
                return moment(date).fromNow();
            };
        }
    ]);