/*global angular*/


// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function () {
    "use strict";
    // Init module configuration options
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
        applicationModuleName: applicationModuleName,
        applicationModuleVendorDependencies: applicationModuleVendorDependencies,
        registerModule: registerModule
    };
}());