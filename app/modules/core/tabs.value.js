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
            content:  "modules/search/search.html",
            icon: "fa-search"
        },
        {
            title: "Stream",
            content: "modules/core/empty.template.html",
            icon: "fa-music"
        },
        {
            title: "Playlists",
            content: "modules/playlists/playlists.html",
            icon: "fa-th-list"
        },
        {
            title: "Likes",
            content: "modules/likes/likes.html",
            icon: "fa-heart"
        },
        {
            title: "History",
            content: "modules/core/empty.template.html",
            icon: "fa-clock-o"
        },
        {
            title: "Next Tracks",
            content: "modules/next-tracks/nextTracks.html",
            icon: "fa-hourglass-start" //"fa-headphones"
        },
        {
            title: "Groups",
            content: "modules/groups/groups.html",
            icon: "fa-users"
        },
        {
            title: "Analyze",
            content: "modules/visualization/visualization.html",
            icon: "fa-magic"
        }

    ]);