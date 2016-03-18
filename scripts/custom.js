
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
            "fullPage.js",
            "dndLists",
            "ngclipboard"
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
    .registerModule("audioplayer");
ApplicationConfiguration.registerModule("core");



angular
    .module("core")
    .config(["$stateProvider",
        "$urlRouterProvider",
        function ($stateProvider, $urlRouterProvider) {

            "use strict";

            $urlRouterProvider.otherwise("/login");


            $stateProvider
                .state("login", {
                    url: "/login?code",
                    templateUrl: "modules/login/login.html",
                    controller: "LoginCtrl"
                })
                .state("home", {
                    url: "/home",
                    templateUrl: "modules/core/home.html",
                    controller: "HomeController"
                })
            .state("dev", {
                    url: "/dev",
                    templateUrl: "modules/devpage/devpage.html"
                });
        }
        ]);
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
    .module("soundcloud")
    .config(createListener);
ApplicationConfiguration
    .registerModule("visualization");
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



function DialogController($scope, $mdDialog, GroupsBackend, SoundcloudSessionManager, track_id) {
    $scope.track_id = track_id;
    $scope.groups = [];
    GroupsBackend.getGroups().then(function (resp) {
        $scope.groups = resp.data.groups;
        $scope.groups.map(function(group) {
            group.preSelected = GroupsBackend.hasTrack(group.id, $scope.track_id);
            group.selected = group.preSelected;
            return group;
        });
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
                GroupsBackend.addTrack(group.id, $scope.track_id, SoundcloudSessionManager.getUserId(), $scope.comment).then($mdDialog.hide());
            }
        });


    };
}
function GroupDialog($log, $mdDialog, $mdMedia) {

    this.show = function (track_id) {
        var useFullScreen = ($mdMedia("sm") || $mdMedia("xs"));
        $mdDialog.show({
            controller: DialogController,
            locals: {
                track_id: track_id
            },
            templateUrl: "modules/groups/dialog.html",
            parent: angular.element(document.body),
            clickOutsideToClose: true,
            fullscreen: useFullScreen
        });
    };

}

angular
    .module("groups")
    .service("GroupDialog", GroupDialog);
function GroupsBackend($http, SoundcloudSessionManager) {

    "use strict";

    var baseUrl,
        cache;
    baseUrl = "http://ec2-54-201-43-157.us-west-2.compute.amazonaws.com:8000";

    cache = {
        groups: []
    };
    this.getGroups = function () {
        return $http({
            method: "GET",
            url: baseUrl + "/groups",
            params: {
                "user_id": SoundcloudSessionManager.getUserId()
            }
        }).then(function (resp) {
            cache.groups = resp.data.groups;
            return resp;
        });
    };

    this.getTracks = function (group_id) {
        return $http.get(baseUrl + "/groups/" + group_id + "/tracks").then(
            function (resp) {
                var joinedData = resp.data.tracks.map(function (track) {
                    var property, returnValue = {};
                    for (property in track.sn) {
                        if (track.sn.hasOwnProperty(property)) {
                            returnValue[property] = track.sn[property];
                        }
                    }
                    for (property in track.sc) {
                        if (track.sc.hasOwnProperty(property)) {
                            returnValue[property] = track.sc[property];
                        }
                    }
                    return returnValue;
                });
                return joinedData;
            }
        );
    };

    this.getMembers = function (group_id) {
        return $http.get(baseUrl + "/groups/" + group_id + "/members").then(
            function (resp) {
                return resp.data.members.map(function (member) {
                    return member.sc;
                });
            }
        );
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

    this.hasTrack = function (group_id, track_id) {
        debugger;
        return !!(_.find(_.find(cache.groups, {id: group_id}).tracks, {id: track_id}));
    };

    this.deleteTrack = function (group_id, track_id) {
        return $http({
            method: "DELETE",
            url: baseUrl + "/groups/" + group_id + "/tracks/" + track_id
        });
    };

    this.addCommentToTrack = function (group_id, track_id, user_id, comment) {
        return $http({
            method: "POST",
            url: baseUrl + "/groups/" + group_id + "/tracks/" + track_id + "/comments",
            data: {
                user_id: user_id,
                text: comment
            }
        });
    };

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

    this.invitationCheck = function (code) {

        return $http.get(baseUrl + "/invitations", {
            params: {
                code: code,
                user_id: SoundcloudSessionManager.getUserId()
            }
        });
    };

    this.inviteToGroup = function (group_id) {
        var code = "welcome" + group_id + Math.random().toString(36).substring(2, 10);
        return $http({
            method: "POST",
            url: baseUrl + "/invitations",
            data: {
                code: code,
                group_id: group_id,
                message: "say hi!",
                username: SoundcloudSessionManager.getMe().first_name
            }
        }).then(function () {
            return code;
        });
    };
}


angular
    .module("groups")
    .service("GroupsBackend", GroupsBackend);
function HistoryBackend($http, SoundcloudSessionManager) {

    "use strict";

    var baseUrl;
    baseUrl = "http://ec2-54-201-43-157.us-west-2.compute.amazonaws.com:8000";
    this.getTracks = function () {
        return $http({
            method: "GET",
            url: baseUrl + "/history",
            params: {
                "user_id": SoundcloudSessionManager.getUserId()
            }
        });
    };


    this.addTrack = function (track) {
        var statistics = {
            comment_count: track.comment_count,
            playback_count: track.playback_count,
            favoritings_count: track.favoritings_count
        };
        return $http({
            method: "POST",
            url: baseUrl + "/history",
            data: {
                track_id: track.id,
                user_id: SoundcloudSessionManager.getUserId(),
                statistics: statistics
            }
        });
    };

}


angular
    .module("history")
    .service("HistoryBackend", HistoryBackend);


function NextTracks() {

    "use strict";
    this.nextTracks = [];
    this.currentTrackId = null;
    this.loop = false;
    this.addTrack = function addTrack(track) {
        if (_.findIndex(this.nextTracks, ["id", track.id]) < 0) {
            this.nextTracks.push(track);
        }
    };
    this.deleteTrack = function deleteTrack(track_id, force) {
        if (force || !this.loop) {
            _.remove(this.nextTracks, function (o) {
                return o.id === track_id;
            });
        } else {
            var element = _.find(this.nextTracks, {
                    id: track_id
                }),
                fromIndex = this.nextTracks.indexOf(element);
            this.nextTracks.splice(fromIndex, 1);
            this.nextTracks.splice(this.nextTracks.length, 0, element);
        }
    };
    this.getNextTrack = function getNextTrack() {
        if (this.nextTracks.length) {
            var nextTrack = this.nextTracks[0];
            this.currentTrackId = nextTrack.id;
            return nextTrack;
        }
        return null;
    };
    this.getNextTracks = function getNextTracks() {
        return this.nextTracks;
    };
    this.getNextTracksIds = function getNextTracksIds() {
        return _.map(this.nextTracks, function (obj) {
            return obj.id;
        });
    };

    this.setLoopMode = function setLoopMode(on) {
        this.loop = on;
    };
    
    this.isInNextTracks = function isInNextTracks(track_id) {
        return _.find(this.nextTracks, {id: track_id});
    }
}

angular
    .module("next-tracks")
    .service("NextTracks", NextTracks);
function PlaylistService($q, SoundcloudAPI) {

    "use strict";
    var self = {
        playlists: [],
        isLoaded: false
    };


    this.mapPlaylist = function (response) {

        var i, j,
            playlists = [],
            data = response.data;
        for (i = 0; i < data.length; i++) {
            playlists.push(data[i]);
            playlists[i].track_count_readable = (data[i].track_count === 1) ? "1 Track" : data[i].track_count + "Tracks";
            playlists[i].duration_readable = moment.duration(data[i].duration, "milliseconds").humanize();
            playlists[i].index = i;
            playlists[i].showTracks = false;
            for (j = 0; j < data[i].length; j++) {
                playlists[i].tracks[j].isPlaying = false;
            }
        }
        self.playlists = playlists;
        self.isLoaded = true;
        return playlists;
    };

    this.getPlaylists = function (reload) {
        if (reload || !self.isLoaded) {
            return SoundcloudAPI.getPlaylists().then(this.mapPlaylist);
        }
        return $q(function (resolve, reject) {
            return resolve(self.playlists);
        });
    };
}



angular.module("playlists").service("PlaylistService", PlaylistService);
function SoundcloudAPI($http, $log, $httpParamSerializerJQLike, SoundcloudCredentials, SoundcloudSessionManager) {

    "use strict";

    var baseUrl = "https://api.Soundcloud.com",
        meUrl = baseUrl + "/me",
        userUrl = baseUrl + "/users/#{user_id}/",
        playlistsUrl = baseUrl + "/users/#{user_id}/playlists",
        newPlaylistUrl = baseUrl + "/playlists",
        favoritesUrl = baseUrl + "/users/#{user_id}/favorites",
        trackSearchUrl = baseUrl + "/tracks",
        resolveUrl = baseUrl + "/resolve",
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
                "playlist[_resource_id]": null,
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
                "oauth_token": SoundcloudSessionManager.getToken(),
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

    this.getTrackFromUrl = function (url) {
        return $http({
            method: "GET",
            url: resolveUrl,
            params: {
                url: url,
                client_id: SoundcloudCredentials.getClientId()
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
        params.state = "code";

        options = angular.extend({}, SoundcloudPopupDefaults);
        options.left = window.screenX + (window.outerWidth - options.height) / 2;
        options.right = window.screenY + (window.outerHeight - options.width) / 2;

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
                localStorageService.set("me", response.data);
            }, angular.noop);
        
        localStorageService.set("ouath_token", token);
    };
    
    this.getMe = function getMe() {
        return localStorageService.get("me");
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
    
    this.setInvitationCode = function(code) {
        localStorageService.set("invitationcode", code);
    };
    
    this.getInvitationCode = function() {
        return localStorageService.get("invitationcode");
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
            content: "modules/history/history.html",
            icon: "fa-clock-o"
        },
        {
            title: "Next Tracks",
            content: "modules/next-tracks/next-tracks.html",
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
angular
    .module("audioplayer")
    .directive("audioplayer", [
        function () {
            "use strict";
            return {
                scope: {
                    track: "=track"
                }, // {} = isolate, true = child, false/undefined = no change
                controller: function controller($rootScope, $scope, $element, $attrs, $transclude, playerService) {
                    $scope.full = {info: false};
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
                templateUrl: "modules/audioplayer/audioplayer.html"
            };
        }
    ]);
angular
    .module("soundcloud")
    .directive("track", [
        function () {
            "use strict";
            return {
                scope: {
                    track: "=track",
                    group: "=group"
                }, // {} = isolate, true = child, false/undefined = no change
                controller: function controller($scope, $element, $attrs, $transclude, playerService, SoundcloudSessionManager, NextTracks, GroupsBackend, GroupDialog) {
                    $scope.play = function (track) {
                        playerService.playPauseSound(track);
                    };
                    $scope.addToPlayNext = function (track) {
                        NextTracks.addTrack(track);
                    };
                    if ($scope.group && $scope.track) {
                        $scope.track.showComments = false;
                        $scope.addComment = function () {
                        $scope.track.comments.push({text: $scope.track.newcomment, author_id: SoundcloudSessionManager.getUserId(), added_at: moment()});
                        GroupsBackend.addCommentToTrack($scope.group.id,
                                                        $scope.track.id,
                                                        SoundcloudSessionManager.getUserId(),
                                                        $scope.track.newcomment);
                        $scope.track.newcomment = "";
                    }
                   
                    $scope.addToGroup = function () {
                        GroupDialog.show($scope.track.id);
                    };
                    
                    $scope.findMember = function (id) {
                        return _.find($scope.group.members, {id: id});
                    };
                    
                   
                    };
                },
                restrict: "E", // E = Element, A = Attribute, C = Class, M = Comment
                templateUrl: "modules/soundcloud/track.html"
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
                        return counts.substring(0, counts.length-6) + "." + counts.substring(counts.length-5)[0] +  "M";
                } if (count > Math.pow(10, 3)) {
                    return counts.substring(0, counts.length-3)  +  "k";
                }
                return count;
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
    .controller("HomeController", ["$rootScope", "$scope", "$state", "$stateParams", "$log", "SoundcloudSessionManager", "SoundcloudAPI", "GroupsBackend", "NextTracks", "Tabs", "playerService", "HistoryBackend",
        function ($rootScope, $scope, $state, $stateParams, $log, SoundcloudSessionManager, SoundcloudAPI, GroupsBackend, NextTracks, Tabs, playerService, HistoryBackend) {

            "use strict";

            $scope.tabs = _.filter(Tabs, function (ta) {
                return ta.content !== "modules/core/empty.template.html";
            });


            $scope.selectedIndex = 2;
            $scope.$watch("selectedIndex", function (current) {
                $scope.$broadcast($scope.tabs[current].title);
            });

            $scope.playerService = playerService;

            $scope.$watch("playerService.audio.stream.progress", function (current) {
                if (current === 1) {
                    HistoryBackend.addTrack(playerService.audio.info);
                    NextTracks.deleteTrack(playerService.audio.info.id);
                    var nextTrack = NextTracks.getNextTrack();
                    if (nextTrack) {
                        playerService.playPauseSound(nextTrack);
                    }
                }
            });

            $scope.addMeToGroup = function () {

                GroupsBackend.invitationCheck(SoundcloudSessionManager.getInvitationCode())
                    .then(
                        function (resp) {
                        }
                    );
            };

            SoundcloudAPI.getMe().then(function (response) {
                $scope.me = response.data;

                if (SoundcloudSessionManager.getInvitationCode()) {

                    $scope.addMeToGroup();

                }

            });





        }]);

ApplicationConfiguration
    .registerModule("dev");

function DevController($scope, $http, playerService) {

    var vm = this,
        streamUrl = "https://api.soundcloud.com/tracks/97097113/stream";

    $http.get("modules/devpage/flicflachome.json").then(function (resp) {
        vm.data = resp.data;
    });
    
    $http.get("modules/devpage/flicflactrack.json").then(function (resp) {
        vm.track = resp.data;
    });

    vm.loop = function () {
        var currentTime = playerService.audio.stream.progress * vm.data.track.duration;
    };

    playerService.playPauseSound({
        stream_url: streamUrl
    });
    vm.goto = function (pos) {
        playerService.goTo(pos);
    };


}

angular.module("dev").controller("DevController", DevController);



function NewGroupDialogController($scope, $mdDialog, GroupsBackend, SoundcloudSessionManager) {
    "use strict";
    $scope.newgroup = {};

    $scope.hide = function () {
        $mdDialog.hide();
    };
    $scope.cancel = function () {
        $mdDialog.cancel();
    };
    $scope.answer = function () {
        GroupsBackend.newGroup($scope.newgroup.name, $scope.newgroup.description, SoundcloudSessionManager.getUserId())
            .then($mdDialog.hide());
    };
}


function AddMembersDialogController($scope, $mdDialog, GroupsBackend, SoundcloudRedirectUri, group_id) {
    "use strict";
    $scope.url = "";
    GroupsBackend.inviteToGroup(group_id).then(function (code) {
        $scope.url = SoundcloudRedirectUri + "#!/login?code=" + code;
    });

    $scope.hide = function () {
        $mdDialog.hide();
    };
    $scope.cancel = function () {
        $mdDialog.cancel();
    };
}
angular
    .module("groups")
    .controller("GroupsController", ["$scope", "$log", "$mdDialog", "$mdMedia", "GroupsBackend", "SoundcloudAPI",
        function ($scope, $log, $mdDialog, $mdMedia, GroupsBackend) {

            "use strict";
            $scope.groups = [];

            $scope.newGroup = function () {
                var useFullScreen = ($mdMedia("sm") || $mdMedia("xs"));
                $mdDialog.show({
                    controller: NewGroupDialogController,
                    templateUrl: "modules/groups/newGroup-dialog.html",
                    parent: angular.element(document.body),
                    clickOutsideToClose: true,
                    fullscreen: useFullScreen
                });
            };

            $scope.inviteToGroup = function (group_id) {
                $mdDialog.show({
                    controller: AddMembersDialogController,
                    locals: {
                        group_id: group_id
                    },
                    templateUrl: "modules/groups/addMembers-dialog.html",
                    parent: angular.element(document.body),
                    clickOutsideToClose: true
                });
            };


            $scope.refresh = function () {
                GroupsBackend.getGroups().then(function (resp) {
                    $scope.groups = resp.data.groups;
                });
            };


            $scope.showTracks = function (group) {
                group.moreInfos = !group.moreInfos;
                if (group.sctracks) {
                    return true; //already loaded
                }
                GroupsBackend.getTracks(group.id).then(function (data) {
                    group.sctracks = data;
                });

                GroupsBackend.getMembers(group.id)
                    .then(function (data) {
                        group.members = data;
                    });
            };
            
            $scope.$on("Groups", $scope.refresh);

        }]);

function HistoryController($scope, HistoryBackend) {
    "use strict";

    var history;

    $scope.refresh = function refresh() {
        history = HistoryBackend.getTracks();

        history.then(function (response) {
            $scope.tracks = response.data.tracks;
        });
    };
    
    $scope.$on("History", $scope.refresh);

}

angular
    .module("history")
    .controller("HistoryController", HistoryController);

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

function LoginCtrl($scope, $state, SoundcloudSessionManager, SoundcloudLogin) {

    "use strict";

    $scope.mainOptions = {
        sectionsColor: ["#100055"],
        anchors: ["WelcomePage"]
    };
    if ($state.params.code) {
        SoundcloudSessionManager.setInvitationCode($state.params.code);
    }



    $scope.loginWithSoundcloud = function () {
        SoundcloudLogin.connect().then(function () {
            $state.go("home");

        });
    };
}

angular
    .module("login")
    .controller("LoginCtrl", LoginCtrl);
function NextTracksCtrl($scope, $log, $mdToast, NextTracks, SoundcloudAPI) {

    "use strict";

    $scope.editMode = false;
    $scope.playlist = {
        name: "Name",
        isPrivate: true
    };
    $scope.loop = false;

    $scope.nextTracks = NextTracks.nextTracks;

    $scope.saveAsPlaylist = function () {
        SoundcloudAPI.postPlaylist($scope.playlist.name, $scope.playlist.isPrivate, NextTracks.getNextTracksIds())
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
        $scope.playlist = NextTracks.getNextTracks();
    };
    
    $scope.$watch("loop", function(current) {
        NextTracks.setLoopMode(current);
    });

}

angular
    .module("core")
    .controller("NextTracksCtrl", NextTracksCtrl);

function PlaylistsController($scope, $log, PlaylistService) {
    "use strict";
    $scope.playlists = [];

    $scope.getPlaylist = function (index) {
        $scope.playlists[index].showTracks = !$scope.playlists[index].showTracks;
    };

    function loadPlaylists() {
        $log.info("load playlists");
        PlaylistService.getPlaylists().then(function (data) {
            $scope.playlists = data;
        });
    }
    
    $scope.$on("Playlists", loadPlaylists);

}

angular
    .module("core")
    .controller("PlaylistsController", PlaylistsController);

function SearchCtrl($scope, SoundcloudAPI) {
    "use strict";
    $scope.search = {
        input: ""
    };

    $scope.searchUrl = function () {
        SoundcloudAPI.getTrackFromUrl($scope.search.input).then(
            function (response) {
                if (response.data.kind === "track") {
                    $scope.results = [response.data];
                }
            });
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