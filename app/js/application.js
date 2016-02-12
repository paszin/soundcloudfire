/*global angular, ApplicationConfiguration*/
/*jshint quotmark: double */


angular
    .module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

angular
    .module(ApplicationConfiguration.applicationModuleName)
    .config(["$locationProvider",
        function ($locationProvider) {
            "use strict";
            $locationProvider.hashPrefix("!");
        }
        ]);

angular
    .module(ApplicationConfiguration.applicationModuleName)
    .config(["$locationProvider", "$mdThemingProvider",
        function ($locationProvider, $mdThemingProvider) {
            "use strict";
            $locationProvider.hashPrefix("!");
            $mdThemingProvider.theme("default")
                .accentPalette("blue-grey", {
                    "default": "400",
                    "hue-3": "A100"

                })
                .primaryPalette("deep-orange", {
                    "default": "300"
                });
        }
        ]);

//Then define the init function for starting up the application
angular
    .element(document)
    .ready(function () {
        "use strict";
        if (window.location.hash === "#_=_") {
            window.location.hash = "#!";
        }
        angular
            .bootstrap(document,
                [ApplicationConfiguration.applicationModuleName]);
    });
