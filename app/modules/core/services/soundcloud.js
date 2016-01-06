

/**
 * @ngdoc service
 * @name core.Services.Soundcloud
 * @description Soundcloud Factory
 */
angular
    .module('core')
    .factory('Soundcloud', ['$http', 'credentials',
        function ($http, credentials) {
            
            'use strict';

            //credentials
            var baseUrl = 'https://api.soundcloud.com',
                client_id = credentials.client_id,
                client_secret = credentials.client_secret,
                username = credentials.username,
                password = credentials.password,
                //endpoints
                authUrl = baseUrl + "/oauth2/token?client_id=#{client_id}&client_secret=#{client_secret}&grant_type=password&username=#{username}&password=#{password}".format({
                    "client_id": client_id,
                    "client_secret": client_secret,
                    "username": username,
                    "password": password
                }),
                meUrl = baseUrl + "/me?oauth_token=#{token}",
                playlistsUrl = baseUrl + "/users/#{user_id}/playlists?oauth_token=#{token}",
                //data
                me_data,
                playlists_data,
                oauth_token;

            var glob = {

                /**
                 * @ngdoc function
                 * @name core.Services.Soundcloud#getAuth
                 * @methodOf core.Services.Soundcloud
                 * @return {json} Returns auth data
                 */
                getAuth: function (callback) {
                    $http({
                        method: 'POST',
                        url: authUrl
                    }).then(function successCallback(response) {
                        console.log("success auth")
                        oauth_token = response['data']['access_token'];
                        callback(response['data']);

                    }, function errorCallback(response) {
                        console.log("error auth");
                    });
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
                            method: 'GET',
                            url: meUrl.format({
                                "token": oauth_token
                            })
                        }).then(function successCallback(response) {
                            console.log("success me")
                            me_data = response['data'];
                            callback(response['data']);
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
                        method: 'GET',
                        url: playlistsUrl.format({
                            "token": oauth_token,
                            "user_id": me_data.id
                        })
                    }).then(function successCallback(response) {
                        console.log("success playlists");
                        playlists_data = response['data'];
                        callback(response['data']);
                    }, function errorCallback(response) {
                        console.log("error playlists");
                    });
                },

                getOauth_token: function () {
                    return oauth_token;
                },
                getUrlWithToken: function (url) {
                    return url + "?oauth_token=#{token}".format({
                        token: oauth_token()
                    });
                }
            };


            return glob;
                }]);