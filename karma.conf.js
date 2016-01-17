'use strict';

// Karma configuration
module.exports = function(config) {
    config.set({
        // base path, that will be used to resolve files and exclude
        basePath: '',

        // Frameworks to use
        frameworks: ['jasmine'],

        // 'ngResource', 'ngCookies', 'ngAnimate', 'ngTouch', 'ngSanitize', 'ui.router', 'ui.bootstrap', 'ui.utils'

        // List of files / patterns to load in the browser
        files: [
            <!-- injector:bowerjs -->
            'app/lib/jquery/dist/jquery.js',
            'app/lib/bootstrap/dist/js/bootstrap.js',
            'app/lib/angular/angular.js',
            'app/lib/angular-resource/angular-resource.js',
            'app/lib/angular-mocks/angular-mocks.js',
            'app/lib/angular-cookies/angular-cookies.js',
            'app/lib/angular-animate/angular-animate.js',
            'app/lib/angular-touch/angular-touch.js',
            'app/lib/angular-sanitize/angular-sanitize.js',
            'app/lib/angular-ui-utils/ui-utils.js',
            'app/lib/angular-ui-router/release/angular-ui-router.js',
            'app/lib/angular-audio/app/angular.audio.js',
            'app/lib/angular-aria/angular-aria.js',
            'app/lib/angular-material/angular-material.js',
            'app/lib/string-format-js/format.js',
            'app/lib/moment/moment.js',
            'app/lib/angular-fontawesome/dist/angular-fontawesome.js',
            'app/lib/angular-bootstrap/ui-bootstrap-tpls.js',
            'app/lib/angular-route/angular-route.js',
            'app/lib/angular-local-storage/dist/angular-local-storage.js',
            <!-- endinjector -->

            'app/js/config.js',
            'app/js/application.js',

            'app/modules/*/*.js',
            'app/modules/*/config/*.js',
            'app/modules/*/services/*.js',
            'app/modules/*/controllers/*.js',
            'app/modules/*/directives/*.js',
            'app/modules/*/filters/*.js',

            'app/modules/*/tests/unit/**/*.js'
        ],

        // Test results reporter to use
        // Possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
        //reporters: ['progress'],
        reporters: ['progress'],

        // Web server port
        port: 9876,

        // Enable / disable colors in the output (reporters and logs)
        colors: true,

        // Level of logging
        // Possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,

        // Enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,

        // Start these browsers, currently available:
        // - Chrome
        // - ChromeCanary
        // - Firefox
        // - Opera
        // - Safari (only Mac)
        // - PhantomJS
        // - IE (only Windows)
        browsers: ['PhantomJS'],

        // If browser does not capture in given timeout [ms], kill it
        captureTimeout: 60000,

        // Continuous Integration mode
        // If true, it capture browsers, run tests and exit
        singleRun: true
    });
};
