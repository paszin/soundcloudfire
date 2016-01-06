/*global angular*/

'use strict';

/**
 * @ngdoc object
 * @name core.Values.Credentials
 * @description Define a value
 */
angular
    .module('core')
    .value('credentials_template', { //replace with credentials
    //replace the following with your real credentials for soundcloud
        "username": "username@soundcloud.com",
        "password": "verlongstringinnodictonary",
        "client_id": '460ff7887b7fb982e27d8b44697d644b',
        "client_secret": 'fe9f4bd70d1c7d749709da3a52d9f761'
    });