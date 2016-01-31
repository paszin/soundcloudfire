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
        applicationModuleName: applicationModuleName,
        applicationModuleVendorDependencies: applicationModuleVendorDependencies,
        registerModule: registerModule
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

ApplicationConfiguration
    .registerModule("audioplayer");ApplicationConfiguration.registerModule("core");

'use strict';
ApplicationConfiguration
    .registerModule('groups');

'use strict';
ApplicationConfiguration
    .registerModule('history');
ApplicationConfiguration
    .registerModule("likes");
ApplicationConfiguration
    .registerModule("login");
ApplicationConfiguration
    .registerModule("next-tracks");
ApplicationConfiguration
    .registerModule("playlists");

'use strict';
ApplicationConfiguration
    .registerModule('search');
ApplicationConfiguration
    .registerModule("soundcloud");

'use strict';
ApplicationConfiguration
    .registerModule('visualization');


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
function playerService($log, ngAudio, SoundcloudSessionManager) {

    "use strict";
    this.audio = {
        "stream": null,
        "info": null,
        "isPlaying": false
    };

    this.playPauseSound = function (track) {

        track.isPlaying = !track.isPlaying;

        if (this.audio.info && track.stream_url !== this.audio.info.stream_url) {
            this.audio.stream.pause();
            this.audio.isPlaying = false;
            this.audio.stream = null;
            this.audio.info.isPlaying = false;
            $log.info("delete old track");
        }
        if (this.audio.isPlaying) {
            this.audio.stream.pause();
            this.audio.isPlaying = false;
            $log.info("pause");
        } else {
            if (this.audio.stream) {
                this.audio.stream.play();
                this.audio.isPlaying = true;
                $log.info("play");
            } else {
                this.audio.stream = ngAudio.load(track.stream_url + "?oauth_token=#{token}".format({
                    token: SoundcloudSessionManager.getToken()
                }));
                this.audio.stream.play();
                this.audio.info = track;
                this.audio.isPlaying = true;
                $log.info("play new track");
            }
        }
    };
    
    
    this.goTo = function (pos) { 
        this.audio.stream.progress =pos;
    }
}


angular.module("audioplayer")
       .service("playerService", playerService);

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
            content: "modules/core/views/empty.template.html",
            icon: "fa-magic"
        }

    ]);
function SoundcloudAPI($http, $log, $httpParamSerializerJQLike, SoundcloudCredentials, SoundcloudSessionManager) {

    "use strict";

    var baseUrl = "https://api.Soundcloud.com",
        meUrl = baseUrl + "/me",
        userUrl = baseUrl + "/users/#{user_id}/",
        playlistsUrl = baseUrl + "/users/#{user_id}/playlists",
        newPlaylistUrl = baseUrl + "/playlists",
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

    this.postPlaylist = function (title, isPrivate, track_ids) {
        var sharing = isPrivate ? "private" : "public",
            idsSerie = _.join(_.map(track_ids, function (id) {
                return "playlist%5Btracks%5D%5B%5D%5Bid%5D=" + id;
            }), '&');
        return $http({
            method: "POST",
            url: newPlaylistUrl,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            data: $httpParamSerializerJQLike({
                "oauth_token": SoundcloudSessionManager.getToken(),
                "playlist[title]": title,
                "playlist[sharing]": sharing,
                "playlist[_resource_id]": undefined,
                "playlist[_resource_type]": "playlist"
            }) + '&' + idsSerie
        });
    };


    this.putPlaylist = function (playlist_id, track_ids) {
       
        var ids = _.map(track_ids, function (id) {
            return {
                id: id
            };
        });
        return $http({
            method: "PUT",
            url: newPlaylistUrl + "/" + playlist_id,
            headers: {
                "Content-Type": "application/json"
            },
            data: {
                "oauth_token": "1-138878-12338076-4b43aa07814c42", //SoundcloudSessionManager.getToken(),
                "playlist": {
                    "tracks": ids
                }
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

    this.getUser = function (userId) {
        return $http({
            method: "GET",
            url: userUrl.format({
                "user_id": userId
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
    this.getNextTracksIds = function getNextTracksIds() {
        return _.map(this.nextTracks, function (obj) {
            return obj.id;
        });
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
        return this[key] ? key + "=" + this[key] : null;
    }

    function mapAndEscape(key) {
        return this[key] ? key + "=" + encodeURIComponent(this[key]) : null;
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
    .module("core")
    .directive("visualization", function () {
        return {
            restrict: "A",
            link: function (scope, element) {

                var canvas = document.getElementById("canvas");
                var stage = new createjs.Stage(canvas);
                var circle = new createjs.Shape();
                circle.graphics.beginFill("DeepSkyBlue").drawCircle(0, 0, 50);
                circle.x = 100;
                circle.y = 100;
                stage.addChild(circle);
                stage.update();

            }
        };
    });
angular
    .module("soundcloud")
    .directive("track", [
        function () {
            "use strict";
            return {
                scope: {
                    track: "=track"
                }, // {} = isolate, true = child, false/undefined = no change
                controller: function controller($rootScope, $scope, $element, $attrs, $transclude, playerService, SoundcloudNextTracks) {
                    $scope.play = function (track) {
                        playerService.playPauseSound(track);
                    };
                    $scope.addToPlayNext = function (track) {
                        SoundcloudNextTracks.addTrack(track);
                    };
                },
                restrict: "E", // E = Element, A = Attribute, C = Class, M = Comment
                templateUrl: "modules/soundcloud/views/track.html"
            };
        }
    ]);
angular
    .module("soundcloud")
    .filter("artworksize", [

        function () {
            "use strict";
            return function (url, size) {
                if (!url) {
                    return url;
                }
                return url.replace("-large.jpg", "-" + size + ".jpg");
            };
        }
    ]);
angular
    .module("soundcloud")
    .filter("beautifyTitle", [

        function () {
            "use strict";
            return function (title) {
                
                return title.replace("Free Download", "").replace("OUT NOW !!!", "").replace("FREE DOWNLOAD", "").replace("[OUT NOW!]", "");
            };
        }
    ]);
angular
    .module("core")
    .controller("HomeController", ["$rootScope", "$scope", "$http", "$state", "$stateParams", "$log", "$timeout", "$interval", "ngAudio", "SoundcloudAPI", "SoundcloudNextTracks", "SoundcloudSessionManager", "Tabs", "playerService",
        function ($rootScope, $scope, $http, $state, $stateParams, $log, $timeout, $interval, ngAudio, SoundcloudAPI, SoundcloudNextTracks, SoundcloudSessionManager, Tabs, playerService) {

            "use strict";

            $scope.tabs = _.filter(Tabs, function (ta) {
                return ta.content !== "modules/core/views/empty.template.html";
            });


            $scope.selectedIndex = 2;

            $rootScope.playerService = playerService;

            $scope.$watch("playerService.audio.stream.progress", function (current) {
                if (current === 1) {
                    var nextTrack = SoundcloudNextTracks.getNextTrack();
                    if (nextTrack) {
                        playerService.playPauseSound(nextTrack);
                    }
                }
            });

            $rootScope.clickWaveform = function (event) {
                $log.info(event);
                var element = document.getElementById("waveformprogress"); 
                playerService.goTo((event.offsetX)/element.clientWidth);
                
            };

            SoundcloudAPI.getMe().then(function (response) {
                $scope.me = response.data;
            });

        }]);

function FavoritesCtrl($scope, SoundcloudAPI) {
    "use strict";

    var favs = SoundcloudAPI.getFavorites();

    favs.then(function (response) {
        $scope.favorites = response.data;
    });
}

angular
    .module("core")
    .controller("FavoritesCtrl", FavoritesCtrl);

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
function NextTracksCtrl($scope, $log, $mdToast, SoundcloudNextTracks, SoundcloudAPI) {

    "use strict";

    $scope.editMode = false;
    $scope.playlist = {
        name: "Name",
        isPrivate: true
    };


    $scope.nextTracks = SoundcloudNextTracks.nextTracks;

    $scope.saveAsPlaylist = function () {
        SoundcloudAPI.postPlaylist($scope.playlist.name, $scope.playlist.isPrivate, SoundcloudNextTracks.getNextTracksIds())
            .then(
                function (resp) {
                    $scope.editMode = false;
                    $mdToast.show(
                        $mdToast.simple()
                            .textContent("Saved as playlist")
                            .position("top right")
                            .hideDelay(3000)
                    );
                },
                function (resp) {
                    $log.error(resp);
                    $mdToast.show(
                        $mdToast.simple()
                            .textContent("Fuck, Error, check console for further details")
                            .position("top right")
                            .hideDelay(3000)
                    );
                }
            );
    };

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