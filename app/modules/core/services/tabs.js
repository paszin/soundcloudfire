/*global angular */

/**
 * @ngdoc object
 * @name Soundcloud.Constants.SoundcloudConstants
 * @description Define a constant
 */
var viewsFolder = "modules/core/views/";
angular
    .module("soundcloud")
    .value("Tabs", [
        {
            title: "Search",
            content: viewsFolder + "search.tab.html",
            icon: "fa-search"
        },
        {
            title: "Stream",
            content: viewsFolder + "following.template.html",
            icon: "fa-music"
        },
        {
            title: "Playlists",
            content: viewsFolder + "playlists.tab.html",
            icon: "fa-th-list"
        },
        {
            title: "Likes",
            content: viewsFolder + "favorites.tab.html",
            icon: "fa-heart"
        },
        {
            title: "History",
            content: viewsFolder + "following.template.html",
            icon: "fa-clock-o"
        },
        {
            title: "Next Tracks",
            content: viewsFolder + "nextTracks.tab.html",
            icon: "fa-headphones"
        },
        {
            title: "Groups",
            content: viewsFolder + "following.template.html",
            icon: "fa-users"
        }
    ]
        );