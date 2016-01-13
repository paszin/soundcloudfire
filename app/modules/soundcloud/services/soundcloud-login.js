/*global angular, console*/

/**
 * @ngdoc service
 * @name Soundcloud.Services.SoundcloudLogin
 * @description SoundcloudLogin Service
 */


function SoundcloudLogin($q, $log, SoundcloudAPIBase, SoundcloudUtil, SoundcloudConnectParamBase,
    SoundcloudCredentials, SoundcloudRedirectUri, SoundcloudPopupDefaults, SoundcloudSessionManager) {

    'use strict';

    /**
     * Login to Soundcloud using a popup dialog.
     *
     * @returns {*} a promise
     */
    this.connect = function connect() {
        var params, url, options, connectPromise;

        params = angular.extend({}, SoundcloudConnectParamBase);
        params.client_id = SoundcloudCredentials.client_id;
        params.redirect_uri = SoundcloudRedirectUri;

        options = angular.extend({}, SoundcloudPopupDefaults);
        options.left = window.screenX + (window.outerWidth - options.height) / 2;
        options.right = window.screenY + (window.outerHeight - options.width) / 2;

        $log.debug('Creating window with params %o and options %o', params, options);

        url = SoundcloudAPIBase + '/connect?' + SoundcloudUtil.toParams(params);
        window.open(url, 'SoundcloudPopup', SoundcloudUtil.toOptions(options));

        connectPromise = $q.defer();
        window._SoundcloudCallback = connectPromise.resolve;
        connectPromise.promise
            .then(SoundcloudSessionManager.init);
        return connectPromise.promise;
    };
}

angular
    .module('core')
    .service('SoundcloudLogin', SoundcloudLogin);