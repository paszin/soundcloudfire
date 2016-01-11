'use strict';

angular.module('core')
    .constant('SoundCloudPopupDefaults', {
        width: 456,
        height: 510,
        location: 1,
        left: 20,
        top: 20,
        toolbar: "no",
        scrollbars: "yes"
    })
    .constant('SoundCloudRedirectUri', window.location.origin)
    .service('SoundCloudUtil', function SoundCloudUtil() {

        function mapEntry(key) {
            return this[key] ? key + '=' + this[key] : undefined;
        };

        function mapAndEscape(key) {
            return this[key] ? key + '=' + encodeURIComponent(this[key]) : undefined;
        };

        /**
         * Convert an object to a string of parameters (separated by &).
         * @param obj Object to be mapped
         * @returns {string}
         */
        this.toParams = function (obj) {
            return Object.keys(obj)
                .map(mapAndEscape.bind(obj))
                .join('&');
        };

        /**
         * Convert an object to a string of options (separated by ,).
         * @param obj Object to be mapped
         * @returns {string}
         */
        this.toOptions = function (obj) {
            return Object.keys(obj)
                .map(mapEntry.bind(obj))
                .join(',');
        };

    })
    .config(function createListener() {

        var url = window.location.href;
        var queryParams = angular.extend.apply(null,
            url.split(/[#?&]+/g)
            .map(function (val) {
                var entry = val.split(/=/);
                var obj = {};
                if (entry.length === 2) {
                    obj[entry[0]] = entry[1];
                }
                return obj;
            }));

        if ('access_token' in queryParams) {
            window.opener._soundCloudCallback(queryParams.access_token);
            window.close();
        }

    })
    .constant('SoundCloudConnectParamBase', {
        scope: 'non-expiring',
        response_type: 'token',
        display: 'popup'
    })
    .constant('SoundCloudAPIBase', 'https://api.soundcloud.com')
    .service('SoundCloudSessionManager', function SoundCloudSessionManager() {

        var that = this;
        this.accessToken = null;

        /**
         * Get token.
         * @returns {string} the token.
         */
        this.getToken = function getToken() {
            return that.accessToken;
        };

        /**
         * Initialize a SoundCloud session.
         * @param token OAuth token
         */
        this.init = function init(token) {
            that.accessToken = token;
        };

        /**
         * Check if we are logged in to SoundCloud.
         * @returns {boolean}
         */
        this.isConnected = function isConnected() {
            return !!that.accessToken;
        };

        /**
         * Disconnect from SoundCloud.
         */
        this.disconnect = function disconnect() {
            that.accessToken = null;
        };

    })
    .service('SoundCloudLogin', ['$q', '$log', 'SoundCloudAPIBase', 'SoundCloudUtil', 'SoundCloudConnectParamBase',
     'credentials', 'SoundCloudRedirectUri', 'SoundCloudPopupDefaults', 'SoundCloudSessionManager',
     function SoundCloudLogin($q, $log, SoundCloudAPIBase, SoundCloudUtil, SoundCloudConnectParamBase,
            credentials, SoundCloudRedirectUri, SoundCloudPopupDefaults, SoundCloudSessionManager) {

            /**
             * Login to SoundCloud using a popup dialog.
             *
             * @returns {*} a promise
             */
            this.connect = function connect() {
                var params, url, options;

                params = angular.extend({}, SoundCloudConnectParamBase);
                params.client_id = credentials.client_id;
                params.redirect_uri = SoundCloudRedirectUri;

                options = angular.extend({}, SoundCloudPopupDefaults);
                options.left = window.screenX + (window.outerWidth - options.height) / 2;
                options.right = window.screenY + (window.outerHeight - options.width) / 2;

                $log.debug('Creating window with params %o and options %o', params, options);

                url = SoundCloudAPIBase + '/connect?' + SoundCloudUtil.toParams(params);
                window.open(url, 'SoundCloudPopup', SoundCloudUtil.toOptions(options));

                var connectPromise = $q.defer();
                window._soundCloudCallback = connectPromise.resolve;
                connectPromise.promise
                    .then(SoundCloudSessionManager.init);
                return connectPromise.promise;
            };

   }])
    .service('SoundCloudAPI', ['$http', 'SoundCloudAPIBase', 'credentials', 'SoundCloudSessionManager',
     function SoundCloudAPI($http, SoundCloudAPIBase, credentials, SoundCloudSessionManager) {

            function mapResponse(response) {
                console.log(response.data);
                return response.data;
            }

            /**
             * Get information about the logged in user.
             * @returns {*} metadata about the user
             */
            this.me = function me() {
                return $http.get(SoundCloudAPIBase + '/me.json', {
                        params: {
                            oauth_token: SoundCloudSessionManager.accessToken
                        }
                    })
                    .then(mapResponse, SoundCloudSessionManager.disconnect);
            };

            /**
             * Fetch metadata for a track that exists in SoundCloud.
             * @param trackId Track ID for the song
             * @returns {*} A promise for the song metadata
             */
            this.fetchMetadata = function fetchMetadata(trackId) {
                return $http.get(SoundCloudAPIBase + '/tracks/' + trackId, {
                    params: {
                        client_id: credentials.client_id
                    }
                }).then(mapResponse, $log.warn.bind($log, 'Unable to retrieve song %s (response: %o)', trackId));
            }

    }
   ]);