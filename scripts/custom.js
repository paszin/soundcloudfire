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
            "LocalStorageModule",
            "chart.js",
            "fullPage.js"
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
                .accentPalette("orange", {
                    "default": "400",
                    "hue-3": "A100"

                })
                .primaryPalette("indigo", {
                    "default": "500",
                    "hue-3": "A100"
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

ApplicationConfiguration
    .registerModule("groups");
ApplicationConfiguration
    .registerModule("history");
ApplicationConfiguration
    .registerModule("likes");
ApplicationConfiguration
    .registerModule("login");
ApplicationConfiguration
    .registerModule("next-tracks");
ApplicationConfiguration
    .registerModule("playlists");
ApplicationConfiguration
    .registerModule("search");
ApplicationConfiguration
    .registerModule("soundcloud");
ApplicationConfiguration
    .registerModule("visualization");


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
        if (track === void 0) {
            track = this.audio.info;
        }

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
        this.audio.stream.progress = pos;
    };
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
            content: "modules/groups/views/groups.tab.html",
            icon: "fa-users"
        },
        {
            title: "Analyze",
            content: "modules/core/views/visualization.tab.html",
            icon: "fa-magic"
        }

    ]);
function GroupDialog($log, $mdDialog, $mdMedia) {

    this.show = function (track_id) {
        var useFullScreen = ($mdMedia("sm") || $mdMedia("xs"));
        $mdDialog.show({
            controller: DialogController,
            locals: {
                track_id: track_id
            },
            templateUrl: "modules/groups/views/dialog.html",
            parent: angular.element(document.body),
            clickOutsideToClose: true,
            fullscreen: useFullScreen
        });
    };

}

angular
    .module("groups")
    .service("GroupDialog", GroupDialog);


function DialogController($scope, $mdDialog, GroupsBackend, track_id) {
    $scope.track_id = track_id;
    $scope.groups = [];
    GroupsBackend.getGroups().then(function (resp) {
        $scope.groups = resp.data.groups;
    });
    $scope.hide = function () {
        $mdDialog.hide();
    };
    $scope.cancel = function () {
        $mdDialog.cancel();
    };
    $scope.answer = function () {
        $scope.groups.forEach(function (group) {
            if (group.selected) {
                GroupsBackend.addTrack(group.id, $scope.track_id, 0).then($mdDialog.hide());
            }
        })


    };
}
function GroupsBackend($http, $log) {

    "use strict";

    var baseUrl;
    baseUrl = "http://ec2-54-201-43-157.us-west-2.compute.amazonaws.com:8000";
    this.getGroups = function () {
        return $http.get(baseUrl + "/groups");
    };

    this.getTracks = function (group_id) {
        return $http.get(baseUrl + "/groups/" + group_id + "/tracks").then(
            function (resp) {
                var joinedData = resp.data.tracks.map(function (track) {
                    var returnValue = {};
                    for (var property in track.sn) {
                        if (track.sn.hasOwnProperty(property)) {
                            returnValue[property] = track.sn[property];
                        }
                    }
                    for (var property in track.sc) {
                        if (track.sc.hasOwnProperty(property)) {
                            returnValue[property] = track.sc[property];
                        }
                    }
                    return returnValue;
                });
            return joinedData;
            });
    };

    this.addTrack = function (group_id, track_id, user_id, comment) {
        return $http({
            method: "POST",
            url: baseUrl + "/groups/" + group_id + "/tracks",
            data: {
                track_id: track_id,
                user_id: user_id,
                comment: comment
            }
        });
    };

    this.addCommentToTrack = function (group_id, track_id, user_id, comment) {};

    this.newGroup = function (name, description, user_id) {
        return $http({
            method: "POST",
            url: baseUrl + "/groups",
            data: {
                name: name,
                description: description,
                user_id: user_id
            }
        });
    };

}


angular
    .module("groups")
    .service("GroupsBackend", GroupsBackend);
function SoundcloudAPI($http, $log, $httpParamSerializerJQLike, SoundcloudCredentials, SoundcloudSessionManager) {

    "use strict";

    var baseUrl = "https://api.Soundcloud.com",
        meUrl = baseUrl + "/me",
        userUrl = baseUrl + "/users/#{user_id}/",
        playlistsUrl = baseUrl + "/users/#{user_id}/playlists",
        newPlaylistUrl = baseUrl + "/playlists",
        favoritesUrl = baseUrl + "/users/#{user_id}/favorites",
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
            }), "&");
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
            }) + "&" + idsSerie
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
function AnalyzerAPI($http) {

    "use strict";

    var uploadUrl = "http://ec2-54-201-43-157.us-west-2.compute.amazonaws.com:9088/upload?track_id=#{track_id}",
        profileUrl = "http://developer.echonest.com/api/v4/track/profile?api_key=E2X5BMEC5HNVZDTS1&format=json&id=#{upload_id}&bucket=audio_summary";


    this.getTrackUpload = function (track_id) {
        return $http({
            method: "GET",
            url: uploadUrl.format({
                track_id: track_id
            })
        });
    };


    this.getTrackProfile = function (upload_id) {
        return $http({
            method: "GET",
            url: profileUrl.format({
                upload_id: upload_id
            })
        });
    };

}


angular
    .module("core")
    .service("AnalyzerAPI", AnalyzerAPI);
angular
    .module("audioplayer")
    .directive("audioplayer", [
        function () {
            "use strict";
            return {
                scope: {
                    track: "=track"
                }, // {} = isolate, true = child, false/undefined = no change
                controller: function controller($rootScope, $scope, $element, $attrs, $transclude, playerService, SoundcloudNextTracks) {
                    $scope.full = {info: true};
                    $scope.playerService = playerService;
                    $scope.play = function (track) {
                        playerService.playPauseSound(track);
                    };

                    $scope.clickWaveform = function (event) {
                        var element = document.getElementById("waveformprogress");
                        playerService.goTo((event.offsetX) / element.clientWidth);

                    };

                },
                restrict: "E", // E = Element, A = Attribute, C = Class, M = Comment
                templateUrl: "modules/audioplayer/views/audioplayer.html"
            };
        }
    ]);

angular
    .module("core")
    .directive("visualization", function () {
        "use strict";
        return {
            restrict: "A",
            link: function (scope, element) {

                var canvas = document.getElementById("canvas"),
                    stage = new createjs.Stage(canvas),
                    circle = new createjs.Shape();
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
                controller: function controller($scope, $element, $attrs, $transclude, playerService, SoundcloudNextTracks, GroupDialog) {
                    $scope.play = function (track) {
                        playerService.playPauseSound(track);
                    };
                    $scope.addToPlayNext = function (track) {
                        SoundcloudNextTracks.addTrack(track);
                    };
                    
                    $scope.addToGroup = function (track) {
                        GroupDialog.show(track.id);
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
                if (title === void 0) {
                    return void 0;
                }
                return title.replace("Free Download", "").replace("OUT NOW !!!", "").replace("FREE DOWNLOAD", "").replace("[OUT NOW!]", "");
            };
        }
    ]);
angular
    .module("core")
    .controller("HomeController", ["$rootScope", "$scope", "$state", "$stateParams", "$log", "SoundcloudAPI", "GroupsBackend", "SoundcloudNextTracks", "Tabs", "playerService",
        function ($rootScope, $scope, $state, $stateParams, $log, SoundcloudAPI, GroupsBackend, SoundcloudNextTracks, Tabs, playerService) {

            "use strict";

            $scope.tabs = _.filter(Tabs, function (ta) {
                return ta.content !== "modules/core/views/empty.template.html";
            });


            $scope.selectedIndex = 2;
            $scope.$watch("selectedIndex", function (current) {
                $scope.$broadcast($scope.tabs[current].title)
            });

            $scope.playerService = playerService;

            $scope.$watch("playerService.audio.stream.progress", function (current) {
                if (current === 1) {
                    SoundcloudNextTracks.deleteTrack(playerService.audio.info.id);
                    var nextTrack = SoundcloudNextTracks.getNextTrack();
                    if (nextTrack) {
                        playerService.playPauseSound(nextTrack);
                    }
                }
            });

            
            $scope.addToGroup = function () {
                GroupsBackend.addTrack(5, playerService.audio.info.id, 1);
            }

            SoundcloudAPI.getMe().then(function (response) {
                $scope.me = response.data;
            });

        }]);

function VisualizationCtrl($scope, $timeout, $interval, playerService, AnalyzerAPI) {
    "use strict";


    $scope.result = {
        "status": {
            message: null
        },
        "track": {
            audio_summary: null
        }
    };
    $scope.loading = false;

    $scope.labels = ["danceability", "energy", "speechiness", "acousticness", "liveness"];

    $scope.data = [
        [0, 0, 0, 0, 0]
    ];

    $scope.analyzeTrack = function () {
        $scope.uploadTrack();
    };

    $scope.progress = {
        value: 0
    };

    $scope.getDownload = function () {
        if (playerService.audio.info) {
            return "http://ec2-54-201-43-157.us-west-2.compute.amazonaws.com:9088/download/" + playerService.audio.info.id + ".mp3";
        }
    };

    $scope.uploadTrack = function () {
        $scope.loading = true;
        var uploadRequest = AnalyzerAPI.getTrackUpload(playerService.audio.info.id);
        uploadRequest.then(function (response) {

            $timeout(function () {
                $scope.profileTrack(response.data.echonest_trackid);
            }, 10000);
        });
    };

    $scope.profileTrack = function (nest_id) {
        AnalyzerAPI.getTrackProfile(nest_id).then(function (resp) {
            $scope.loading = false;
            $scope.result = resp.data.response;
            var as = resp.data.response.track.audio_summary;
            $scope.data = [[as.danceability, as.energy, as.speechiness, as.acousticness, as.liveness]];
        });
    };
}

angular
    .module("core")
    .controller("VisualizationCtrl", VisualizationCtrl);
angular
    .module("groups")
    .controller("GroupsController", ["$scope", "$log", "$mdDialog", "$mdMedia", "GroupsBackend", "SoundcloudAPI",
        function ($scope, $log, $mdDialog, $mdMedia, GroupsBackend, SoundcloudAPI) {

            "use strict";
            $scope.groups = [];

            $scope.newGroup = function () {
                var useFullScreen = ($mdMedia("sm") || $mdMedia("xs"));
                $mdDialog.show({
                    controller: NewGroupDialogController,
                    templateUrl: "modules/groups/views/newGroup.dialog.html",
                    parent: angular.element(document.body),
                    clickOutsideToClose: true,
                    fullscreen: useFullScreen
                });
            };


            $scope.refresh = function () {
                GroupsBackend.getGroups().then(function (resp) {
                    $scope.groups = resp.data.groups;
                });
            };

            $scope.refresh();

            $scope.showTracks = function (group) {
                group.doShowTracks = !group.doShowTracks;
                if (group.sctracks) {
                    return true; //already loaded
                }
                GroupsBackend.getTracks(group.id).then(function (data) {
                    group.sctracks = data;
                });
            };

        }]);



function NewGroupDialogController($scope, $mdDialog, GroupsBackend) {
    "use strict";
    $scope.newgroup = {};

    $scope.hide = function () {
        $mdDialog.hide();
    };
    $scope.cancel = function () {
        $mdDialog.cancel();
    };
    $scope.answer = function () {
        GroupsBackend.newGroup($scope.newgroup.name, $scope.newgroup.description, 0).then($mdDialog.hide());
    };
}

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
    
    $scope.mainOptions = {
      sectionsColor: ["#100055"],
			anchors: ["WelcomePage"],
			menu: '#menu'
    };


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

    $scope.init = function () {
        console.log("load playlists");
        var playlists = SoundcloudAPI.getPlaylists();
        playlists.then($scope.savePlaylists);
    };
    
    $scope.$on("Playlists", $scope.init);
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