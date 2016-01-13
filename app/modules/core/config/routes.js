/*global angular*/
/**
 * @ngdoc object
 * @name core.config
 * @requires ng.$stateProvider
 * @requires ng.$urlRouterProvider
 * @description Defines the routes and other config within the core module
 */



angular
    .module("core")
    .config(["$stateProvider",
        "$urlRouterProvider",
        function ($stateProvider, $urlRouterProvider) {
            
            "use strict";

            $urlRouterProvider.otherwise("/login");

            /**
             * @ngdoc event
             * @name core.config.route
             * @eventOf core.config
             * @description
             *
             * Define routes and the associated paths
             *
             * - When the path is `"/"`, route to home
             * */

            /**
             * @ngdoc event
             * @name core.config.route
             * @eventOf core.config
             * @description
             *
             * Define routes and the associated paths
             *
             * - When the state is `"login"`, route to login
             *
             */


            $stateProvider
                .state("login", {
                    url: "/login",
                    templateUrl: "modules/core/views/login.html",
                    controller: "LoginController"
                })
                .state("home", {
                    url: "/home",
                    templateUrl: "modules/core/views/home.html",
                    controller: "HomeController"
                });
        }
        ]);