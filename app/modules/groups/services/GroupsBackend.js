/*global angular*/
/*jshint nomen: true */


/**
 * @ngdoc service
 * @name core.Services.GroupsBackend
 * @description GroupsBackend Service
 */
function GroupsBackend($http, $log, $httpParamSerializerJQLike) {

    "use strict";

    var baseUrl = "http://ec2-54-201-43-157.us-west-2.compute.amazonaws.com:8000";

    /**
     * Get information
     * @returns {*} 
     */
    this.getGroups = function () {
        return $http.get(baseUrl + "/groups");
    };

    this.newGroup = function (name, description, user_id) {
        return $http({
            method: "POST",
            url: baseUrl + "/groups",
            data: {
                name: name,
                description: description,
                user_id: user_id
            }
        });
    };

}


angular
    .module("groups")
    .service("GroupsBackend", GroupsBackend);