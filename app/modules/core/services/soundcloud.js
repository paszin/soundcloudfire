/*global angular, console */
/*jshint quotmark: double */


/**
 * @ngdoc service
 * @name core.Services.Soundcloud
 * @description Soundcloud Factory
 */
angular
    .module("core")
    .factory("Soundcloud", ["$http", "SoundcloudCredentials", "SoundcloudSessionManager",
        function ($http, SoundcloudCredentials, SoundcloudSessionManager) {

            "use strict";

            //credentials
            var baseUrl = "https://api.Soundcloud.com",
                client_id = SoundcloudCredentials.client_id,
                client_secret = SoundcloudCredentials.client_secret,
                //endpoints
                /*authUrl = baseUrl + "/oauth2/token?client_id=#{client_id}&client_secret=#{client_secret}&grant_type=password&username=#{username}&password=#{password}".format({
                    "client_id": client_id,
                    "client_secret": client_secret,
                    "username": username,
                    "password": password
                }),*/
                meUrl = baseUrl + "/me?oauth_token=#{token}",
                playlistsUrl = baseUrl + "/users/#{user_id}/playlists?oauth_token=#{token}",
                favoritesUrl = baseUrl + "/users/#{user_id}/favorites?oauth_token=#{token}",
                trackUrl = baseUrl + "/tracks/#{track_id}?oauth_token=#{token}",
                //data
                me_data,
                playlists_data,
                oauth_token,

                api = {
                    
                    setToken: function () {
                        
                        oauth_token = SoundcloudSessionManager.getToken();
                        
                    },
                    
                    /**
                     * @ngdoc function
                     * @name core.Services.Soundcloud#getMe
                     * @methodOf core.Services.Soundcloud
                     * @return {json} Returns me data
                     */
                    getMe: function (callback) {
                        if (oauth_token === undefined) {
                            return;
                        }
                        if (me_data) {
                            console.log("found me data in cache");
                            callback(me_data);
                        } else {
                            console.log(meUrl.format({
                                "token": oauth_token
                            }));
                            $http({
                                method: "GET",
                                url: meUrl.format({
                                    "token": oauth_token
                                })
                            }).then(function successCallback(response) {
                                console.log("success me");
                                me_data = response.data;
                                callback(response.data);
                            }, function errorCallback(response) {
                                console.log("error me");

                            });
                        }
                    },
                    /**
                     * @ngdoc function
                     * @name core.Services.Soundcloud#getPlaylists
                     * @methodOf core.Services.Soundcloud
                     * @return {json} Returns playlists data
                     */
                    getPlaylists: function (callback) {
                        if (me_data === undefined) {
                            console.log("missing me data");
                            //glob.getMeData();
                            return;
                        }
                        console.log(playlistsUrl.format({
                            "token": oauth_token,
                            "user_id": me_data.id
                        }));
                        $http({
                            method: "GET",
                            url: playlistsUrl.format({
                                "token": oauth_token,
                                "user_id": me_data.id
                            })
                        }).then(function successCallback(response) {
                            console.log("success playlists");
                            playlists_data = response.data;
                            callback(response.data);
                        }, function errorCallback(response) {
                            console.log("error playlists");
                        });
                    },
                    
                    /**
                     * @ngdoc function
                     * @name core.Services.Soundcloud#getFavorites
                     * @methodOf core.Services.Soundcloud
                     * @return {json} Returns auth data
                     */
                    getFavorites: function (callback) {
                        if (me_data === undefined) {
                            console.log("missing me data");
                            //glob.getMeData();
                            return;
                        }
                        console.log(favoritesUrl.format({
                            "token": oauth_token,
                            "user_id": me_data.id
                        }));
                        $http({
                            method: "GET",
                            url: favoritesUrl.format({
                                "token": oauth_token,
                                "user_id": me_data.id
                            })
                        }).then(function successCallback(response) {
                            console.log("success playlists");
                            //favorites_data = response.data;
                            callback(response.data);
                        }, function errorCallback(response) {
                            console.log("error favorites");
                        });


                    },
                    /**
                     * @ngdoc function
                     * @name core.Services.Soundcloud#getTrack
                     * @methodOf core.Services.Soundcloud
                     * @return {json} Returns auth data
                     */
                    getTrack: function (track_id, callback) {
                        if (me_data === undefined) {
                            console.log("missing me data");
                            //glob.getMeData();
                            return;
                        }
                        console.log(trackUrl.format({
                            "token": oauth_token,
                            "track_id": track_id
                        }));
                        $http({
                            method: "GET",
                            url: trackUrl.format({
                                "token": oauth_token,
                                "track_id": track_id
                            })
                        }).then(function successCallback(response) {
                            console.log("success track");
                            //favorites_data = response.data;
                            callback(response.data);
                        }, function errorCallback(response) {
                            console.log("error track");
                        });


                    },
                    /**
                     * @ngdoc function
                     * @name core.Services.Soundcloud#getAuth
                     * @methodOf core.Services.Soundcloud
                     * @return {json} Returns auth data
                     */
                    getOauth_token: function () {
                        return oauth_token;
                    },
                    /**
                     * @ngdoc function
                     * @name core.Services.Soundcloud#getAuth
                     * @methodOf core.Services.Soundcloud
                     * @return {json} Returns auth data
                     */
                    getUrlWithToken: function (url) {
                        return url + "?oauth_token=#{token}".format({
                            token: oauth_token()
                        });
                    },
                    /**
                     * @ngdoc function
                     * @name core.Services.Soundcloud#getAuth
                     * @methodOf core.Services.Soundcloud
                     * @return {json} Returns auth data
                     */
                    getUri: function (url) {
                        
                    }
                };


            return api;
        }]);