/*global angular */

/**
 * @ngdoc object
 * @name Soundcloud.Value.Tabs
 * @description List of visible tabs
 */

angular
    .module("soundcloud")
    .value("Tabs", [
        {
            title: "Search",
            content:  "modules/search/views/search.tab.html",
            icon: "fa-search"
        },
        {
            title: "Stream",
            content: "modules/core/views/empty.template.html",
            icon: "fa-music"
        },
        {
            title: "Playlists",
            content: "modules/playlists/views/playlists.tab.html",
            icon: "fa-th-list"
        },
        {
            title: "Likes",
            content: "modules/likes/views/likes.tab.html",
            icon: "fa-heart"
        },
        {
            title: "History",
            content: "modules/core/views/empty.template.html",
            icon: "fa-clock-o"
        },
        {
            title: "Next Tracks",
            content: "modules/next-tracks/views/nextTracks.tab.html",
            icon: "fa-hourglass-start" //"fa-headphones"
        },
        {
            title: "Groups",
            content: "modules/core/views/empty.template.html",
            icon: "fa-users"
        },
        {
            title: "Analyze",
            content: "modules/core/views/visualization.tab.html",
            icon: "fa-magic"
        }

    ]);