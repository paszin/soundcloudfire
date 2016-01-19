/*global angular*/
/*jshint quotmark: double */

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function () {
    "use strict";
    // Init module configuration options
    var applicationModuleName = "Soundcloudfire",
        applicationModuleVendorDependencies = [
            "ngResource",
            "ngCookies",
            "ngAnimate",
            "ngTouch",
            "ngSanitize",
            "ui.router",
            "ui.bootstrap",
            "ui.utils",
            "ngAudio",
            "ngMaterial",
            "LocalStorageModule"
        ],

        // Add a new vertical module
        registerModule = function (moduleName) {
            // Create angular module
            angular
                .module(moduleName, []);

            // Add the module to the AngularJS configuration file
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