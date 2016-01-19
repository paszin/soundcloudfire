var ApplicationConfiguration = (function () {
    "use strict";
    var applicationModuleName = "Soundcloudfire",
        applicationModuleVendorDependencies = [
            "ngCookies",
            "ngAnimate",
            "ui.router",
            "ui.bootstrap",
            "ui.utils",
            "ngAudio",
            "ngMaterial",
            "LocalStorageModule"
        ],
        registerModule = function (moduleName) {
            angular
                .module(moduleName, []);
            angular
                .module(applicationModuleName)
                .requires
                .push(moduleName);
        };

    return {
        applicationModuleName,
        applicationModuleVendorDependencies,
        registerModule
    };
}());

angular
    .module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

angular
    .module(ApplicationConfiguration.applicationModuleName)
    .config(["$locationProvider",
        function ($locationProvider) {
            "use strict";
            $locationProvider.hashPrefix("!");
        }
        ]);

angular
    .module(ApplicationConfiguration.applicationModuleName)
    .config(["$locationProvider", "$mdThemingProvider",
        function ($locationProvider, $mdThemingProvider) {
            "use strict";
            $locationProvider.hashPrefix("!");
            $mdThemingProvider.theme("default")
                .accentPalette("deep-purple", {
                    "default": "400",
                    "hue-3": "A100"

                })
                .primaryPalette("deep-orange", {
                    "default": "300"
                });
        }
        ]);
angular
    .element(document)
    .ready(function () {
        "use strict";
        if (window.location.hash === "#_=_") {
            window.location.hash = "#!";
        }
        angular
            .bootstrap(document,
                [ApplicationConfiguration.applicationModuleName]);
    });
ApplicationConfiguration.registerModule("core");

ApplicationConfiguration
    .registerModule("login");
ApplicationConfiguration
    .registerModule("soundcloud");


angular
    .module("core")
    .config(["$stateProvider",
        "$urlRouterProvider",
        function ($stateProvider, $urlRouterProvider) {

            "use strict";

            $urlRouterProvider.otherwise("/login");


            $stateProvider
                .state("login", {
                    url: "/login",
                    templateUrl: "modules/login/views/login.html",
                    controller: "LoginCtrl"
                })
                .state("home", {
                    url: "/home",
                    templateUrl: "modules/core/views/home.html",
                    controller: "HomeController"
                });
        }
        ]);

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
        window.opener._SoundcloudCallback(queryParams.access_token);
        window.close();
    }

}

angular
    .module("core")
    .config(createListener);
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
function SoundcloudAPI($http, $log, SoundcloudCredentials, SoundcloudSessionManager) {

    "use strict";

    var baseUrl = "https://api.Soundcloud.com",
        meUrl = baseUrl + "/me",
        playlistsUrl = baseUrl + "/users/#{user_id}/playlists",
        favoritesUrl = baseUrl + "/users/#{user_id}/favorites",
        trackUrl = baseUrl + "/tracks/#{track_id}",
        trackSearchUrl = baseUrl + "/tracks",
        followingsUrl = baseUrl + "/users/#{user_id}/followings";
    this.getMe = function () {
        return $http.get(meUrl, {
            params: {
                oauth_token: SoundcloudSessionManager.getToken()
            }
        });
    };


    this.getPlaylists = function () {
        return $http({
            method: "GET",
            url: playlistsUrl.format({
                "user_id": SoundcloudSessionManager.getUserId()
            }),
            params: {
                oauth_token: SoundcloudSessionManager.getToken()
            }
        });
    };

    this.getFavorites = function () {
        return $http({
            method: "GET",
            url: favoritesUrl.format({
                "user_id": SoundcloudSessionManager.getUserId()
            }),
            params: {
                oauth_token: SoundcloudSessionManager.getToken()
            }
        });
    };
    
    this.getFollowings = function () {
        return $http({
            method: "GET",
            url: followingsUrl.format({
                "user_id": SoundcloudSessionManager.getUserId()
            }),
            params: {
                oauth_token: SoundcloudSessionManager.getToken()
            }
        });
    };
    
    this.getTrackSearch = function (searchterm) {
        return $http({
            method: "GET",
            url: trackSearchUrl,
            params: {
                oauth_token: SoundcloudSessionManager.getToken(),
                q: searchterm
            }
        });
    };

}


angular
    .module("soundcloud")
    .service("SoundcloudAPI", SoundcloudAPI);
angular
    .module("soundcloud")
    .constant("SoundcloudPopupDefaults", {
        width: 456,
        height: 510,
        location: 1,
        left: 20,
        top: 20,
        toolbar: "no",
        scrollbars: "yes"
    })
    .constant("SoundcloudRedirectUri", window.location.origin + window.location.pathname)
    .constant("SoundcloudConnectParamBase", {
        scope: "non-expiring",
        response_type: "token",
        display: "popup"
    })
    .constant("SoundcloudAPIBase", "https://api.Soundcloud.com");

function SoundcloudCredentials(SoundcloudRedirectUri) {
    "use strict";
    
    var clientIdLocal = "460ffd8b4467887b82e277fb997d644b",
        clientIdGithub = "8cc5ee91d9e6015109dc93302c43e99c";
    this.getClientId = function getClientId() {
        if (SoundcloudRedirectUri.indexOf("paszin.github.io") > -1) {
            return clientIdGithub;
        } else {
            return clientIdLocal;
        }
    };
}

angular.module("soundcloud")
    .service("SoundcloudCredentials", SoundcloudCredentials);


function SoundcloudLogin($q, $log, SoundcloudAPIBase, SoundcloudUtil, SoundcloudConnectParamBase,
    SoundcloudCredentials, SoundcloudRedirectUri, SoundcloudPopupDefaults, SoundcloudSessionManager) {

    "use strict";
    this.connect = function connect() {
        var params, url, options, connectPromise;

        params = angular.extend({}, SoundcloudConnectParamBase);
        params.client_id = SoundcloudCredentials.getClientId();
        params.redirect_uri = SoundcloudRedirectUri;

        options = angular.extend({}, SoundcloudPopupDefaults);
        options.left = window.screenX + (window.outerWidth - options.height) / 2;
        options.right = window.screenY + (window.outerHeight - options.width) / 2;

        $log.debug("Creating window with params %o and options %o", params, options);

        url = SoundcloudAPIBase + "/connect?" + SoundcloudUtil.toParams(params);
        window.open(url, "SoundcloudPopup", SoundcloudUtil.toOptions(options));

        connectPromise = $q.defer();
        window._SoundcloudCallback = connectPromise.resolve;
        connectPromise.promise
            .then(SoundcloudSessionManager.init);
        return connectPromise.promise;
    };
}

angular
    .module("soundcloud")
    .service("SoundcloudLogin", SoundcloudLogin);


function SoundcloudNextTracks() {

    "use strict";
    this.nextTracks = [];
    this.currentTrackId = null;
    this.addTrack = function addTrack(track) {
        if (_.findIndex(this.nextTracks, ["id", track.id]) < 0) {
            this.nextTracks.push(track);
        }
    };
    this.deleteTrack = function deleteTrack(track_id) {
        _.remove(this.nextTracks, function (o) {
            return o.id === track_id;
        });
    };
    this.getNextTrack = function getNextTrack() {
        var currentIndex = _.findIndex(this.nextTracks, ["id", this.currentTrackId]),
            nextTrack = this.nextTracks[currentIndex + 1];
        this.currentTrackId = nextTrack.id;
        return nextTrack;
    };
    this.getNextTracks = function getNextTracks() {
        return this.nextTracks;
    };
}

angular
    .module("soundcloud")
    .service("SoundcloudNextTracks", SoundcloudNextTracks);


function SoundcloudSessionManager($http, $log, localStorageService, SoundcloudAPIBase) {

    "use strict";
    this.init = function init(token) {
        $http.get(SoundcloudAPIBase + "/me", {
            params: {
                oauth_token: token
            }
        })
            .then(function (response) {
                localStorageService.set("user_id", response.data.id);
            }, angular.noop);
        localStorageService.set("ouath_token", token);
    };
    this.getToken = function getToken() {
        return localStorageService.get("ouath_token");
    };
    this.getUserId = function getUserId() {
        return localStorageService.get("user_id");
    };
    this.isConnected = function isConnected() {
        return !!localStorageService.get("ouath_token");
    };
    this.disconnect = function disconnect() {
        $log.error("disconnected");
        localStorageService.set("ouath_token", null);
    };

    

}

angular
    .module("soundcloud")
    .service("SoundcloudSessionManager", SoundcloudSessionManager);

function SoundcloudUtil() {
    
    "use strict";

    function mapEntry(key) {
        return this[key] ? key + "=" + this[key] : undefined;
    }

    function mapAndEscape(key) {
        return this[key] ? key + "=" + encodeURIComponent(this[key]) : undefined;
    }
    this.toParams = function (obj) {
        return Object.keys(obj)
            .map(mapAndEscape.bind(obj))
            .join("&");
    };
    this.toOptions = function (obj) {
        return Object.keys(obj)
            .map(mapEntry.bind(obj))
            .join(",");
    };

}


angular
    .module("core")
    .service("SoundcloudUtil", SoundcloudUtil);
angular
    .module("soundcloud")
    .directive("track", [
        function () {
            "use strict";
            return {
                scope: {
                    track: "=track"
                }, // {} = isolate, true = child, false/undefined = no change
                controller ($rootScope, $scope, $element, $attrs, $transclude, SoundcloudNextTracks) {
                    $scope.play = function (track) {
                        $rootScope.playPauseSound(track);
                    };
                    $scope.addToPlayNext = function (track) {
                        SoundcloudNextTracks.addTrack(track);
                    };
                },
                restrict: "E", // E = Element, A = Attribute, C = Class, M = Comment
                templateUrl: "soundcloudfire/modules/soundcloud/views/track.html",
                link ($scope, iElm, iAttrs, controller) {

                }
            };
        }
    ]);

function FavoritesCtrl($scope, SoundcloudAPI, SoundcloudNextTracks) {
    "use strict";
    
    var favs = SoundcloudAPI.getFavorites();
    favs.then(function (response) {
        $scope.favorites = response.data;
    });
}

angular
    .module("core")
    .controller("FavoritesCtrl", FavoritesCtrl);
angular
    .module("core")
    .controller("HomeController", ["$rootScope", "$scope", "$http", "$state", "$stateParams", "$log", "$timeout", "$interval", "ngAudio", "SoundcloudAPI", "SoundcloudNextTracks", "SoundcloudSessionManager", "Tabs",
        function ($rootScope, $scope, $http, $state, $stateParams, $log, $timeout, $interval, ngAudio, SoundcloudAPI, SoundcloudNextTracks, SoundcloudSessionManager, Tabs) {

            "use strict";

            $scope.tabs = Tabs;

            $scope.info = {
                "me": {},
                "playlists": []
            };


            $rootScope.audio = {
                "stream": null,
                "info": null,
                "isPlaying": false
            };

            $rootScope.playPauseSound = function (track) {

                track.isPlaying = !track.isPlaying;

                if ($rootScope.audio.info && track.stream_url !== $rootScope.audio.info.stream_url) {
                    $rootScope.audio.stream.pause();
                    $rootScope.audio.isPlaying = false;
                    $rootScope.audio.stream = null;
                    $rootScope.audio.info.isPlaying = false;
                    $log.info("delete old track");
                }
                if ($rootScope.audio.isPlaying) {
                    $rootScope.audio.stream.pause();
                    $rootScope.audio.isPlaying = false;
                    $log.info("pause");
                } else {
                    if ($rootScope.audio.stream) {
                        $rootScope.audio.stream.play();
                        $rootScope.audio.isPlaying = true;
                        $log.info("play");
                    } else {
                        $rootScope.audio.stream = ngAudio.load(track.stream_url + "?oauth_token=#{token}".format({
                            token: SoundcloudSessionManager.getToken()
                        }));
                        $rootScope.audio.stream.play();
                        $rootScope.audio.info = track;
                        $rootScope.audio.isPlaying = true;
                        $log.info("play new track");
                    }
                }

            };

            $scope.selectedIndex = 1;
            
            $scope.$watch("audio.stream.progress", function (current) {
                if (current === 1) {
                    var nextTrack = SoundcloudNextTracks.getNextTrack();
                    if (nextTrack) {
                        $rootScope.playPauseSound(nextTrack);
                    }
                }
            });
            
            SoundcloudAPI.getMe().then(function (response) {
                $scope.me = response.data;
            });

        }]);
function NextTracksCtrl($scope, SoundcloudNextTracks) {

    "use strict";
    $scope.playlist = SoundcloudNextTracks.nextTracks;

    $scope.refresh = function () {
        $scope.playlist = SoundcloudNextTracks.getNextTracks();
    };

}

angular
    .module("core")
    .controller("NextTracksCtrl", NextTracksCtrl);

function PlaylistsCtrl($scope, SoundcloudAPI) {
    "use strict";
    $scope.playlists = [];
    $scope.savePlaylists = function (response) {
       
        var i, j,
            data = response.data;
        for (i = 0; i < data.length; i++) {
            $scope.playlists[i] = data[i];
            $scope.playlists[i].track_count_readable = (data[i].track_count === 1) ? "1 Track" : data[i].track_count + "Tracks";
            $scope.playlists[i].duration_readable = moment.duration(data[i].duration, "milliseconds").humanize();
            $scope.playlists[i].index = i;
            $scope.playlists[i].showTracks = false;
            for (j = 0; j < data[i].length; j++) {
                $scope.playlists[i].tracks[j].isPlaying = false;
            }
        }
    };


    $scope.getPlaylist = function (index) {

        $scope.playlists[index].showTracks = !$scope.playlists[index].showTracks;
    };

    var playlists = SoundcloudAPI.getPlaylists();
    playlists.then($scope.savePlaylists);
}

angular
    .module("core")
    .controller("PlaylistsCtrl", PlaylistsCtrl);

function SearchCtrl($scope, SoundcloudAPI) {
    "use strict";
    $scope.search = {
        input: ""
    };

    $scope.searchTrack = function () {
        var searchrequest = SoundcloudAPI.getTrackSearch($scope.search.input);
        searchrequest.then(function (response) {
            $scope.results = response.data;
        });
    };
}

angular
    .module("core")
    .controller("SearchCtrl", SearchCtrl);

function LoginCtrl($scope, $state, SoundcloudLogin) {

    "use strict";

    $scope.entrykey = "domo44";
    $scope.loginWithSoundcloud = function () {
        SoundcloudLogin.connect().then(function () {
            $state.go("home");

        });
    };
}

angular
    .module("login")
    .controller("LoginCtrl", LoginCtrl);