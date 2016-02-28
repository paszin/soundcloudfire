

// Karma configuration
module.exports = function(config) {
    "use strict";
    config.set({
        // base path, that will be used to resolve files and exclude
        basePath: "",

        // Frameworks to use
        frameworks: ["jasmine"],

        // 'ngResource', 'ngCookies', 'ngAnimate', 'ngTouch', 'ngSanitize', 'ui.router', 'ui.bootstrap', 'ui.utils'

        // List of files / patterns to load in the browser
        files: [
            <!-- injector:bowerjs -->
            "app/lib/jquery/dist/jquery.js",
            "app/lib/bootstrap/dist/js/bootstrap.js",
            "app/lib/angular/angular.js",
            "app/lib/angular-mocks/angular-mocks.js",
            "app/lib/angular-cookies/angular-cookies.js",
            "app/lib/angular-ui-scroll/dist/ui-scroll.js",
            "app/lib/angular-ui-scrollpoint/dist/scrollpoint.js",
            "app/lib/angular-ui-event/dist/event.js",
            "app/lib/angular-ui-mask/dist/mask.js",
            "app/lib/angular-ui-validate/dist/validate.js",
            "app/lib/angular-ui-indeterminate/dist/indeterminate.js",
            "app/lib/angular-ui-uploader/dist/uploader.js",
            "app/lib/angular-ui-utils/index.js",
            "app/lib/angular-ui-router/release/angular-ui-router.js",
            "app/lib/angular-audio/app/angular.audio.js",
            "app/lib/angular-animate/angular-animate.js",
            "app/lib/angular-aria/angular-aria.js",
            "app/lib/angular-messages/angular-messages.js",
            "app/lib/angular-material/angular-material.js",
            "app/lib/string-format-js/format.js",
            "app/lib/moment/moment.js",
            "app/lib/angular-bootstrap/ui-bootstrap-tpls.js",
            "app/lib/angular-route/angular-route.js",
            "app/lib/angular-local-storage/dist/angular-local-storage.js",
            "app/lib/lodash/lodash.js",
            "app/lib/EaselJS/lib/easeljs-0.8.2.combined.js",
            "app/lib/Chart.js/Chart.js",
            "app/lib/angular-chart.js/dist/angular-chart.js",
            "app/lib/angular-resource/angular-resource.js",
            "app/lib/fullpage.js/jquery.fullPage.js",
            "app/lib/fullpage.js/vendors/jquery.easings.min.js",
            "app/lib/fullpage.js/vendors/jquery.slimscroll.min.js",
            "app/lib/angular-fullpage.js/angular-fullpage.js",
            "app/lib/angular-fullpage.js/angular-fullpage.min.js",
            "app/lib/clipboard/dist/clipboard.js",
            "app/lib/angular-drag-and-drop-lists/angular-drag-and-drop-lists.js",
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
        browsers: ["PhantomJS"],

        // If browser does not capture in given timeout [ms], kill it
        captureTimeout: 60000,

        // Continuous Integration mode
        // If true, it capture browsers, run tests and exit
        singleRun: true
    });
};
