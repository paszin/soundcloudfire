/*global angular*/
/*jshint quotmark: double */

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
             *
             */


            $stateProvider
                .state("login", {
                    url: "/login?code",
                    templateUrl: "modules/login/login.html",
                    controller: "LoginCtrl"
                })
                .state("home", {
                    url: "/home",
                    templateUrl: "modules/core/home.html",
                    controller: "HomeController"
                });
        }
        ]);