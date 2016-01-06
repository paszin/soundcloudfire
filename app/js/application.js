'use strict';

angular
    .module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

angular
    .module(ApplicationConfiguration.applicationModuleName)
    .config(['$locationProvider',
        function($locationProvider) {
            $locationProvider.hashPrefix('!');
        }
    ]);

angular
    .module(ApplicationConfiguration.applicationModuleName)
    .config(['$locationProvider', '$mdThemingProvider',
        function ($locationProvider, $mdThemingProvider) {
            $locationProvider.hashPrefix('!');
            $mdThemingProvider.theme('default')
                .accentPalette('deep-purple', {
                    'default': '400',
                    'hue-3': 'A100'

                })
                .primaryPalette('deep-orange', {
                    'default': '300'
                });
        }
        ]);

//Then define the init function for starting up the application
angular
    .element(document)
    .ready(function() {
        if (window.location.hash === '#_=_') {
            window.location.hash = '#!';
        }
        angular
            .bootstrap(document,
                [ApplicationConfiguration.applicationModuleName]);
    });
