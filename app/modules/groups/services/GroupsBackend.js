/*global angular*/
/*jshint nomen: true */


/**
 * @ngdoc service
 * @name core.Services.GroupsBackend
 * @description GroupsBackend Service
 */
function GroupsBackend($http, $log) {

    "use strict";

    var baseUrl;
    baseUrl = "http://ec2-54-201-43-157.us-west-2.compute.amazonaws.com:8000";
    //baseUrl = "http://localhost:8000";

    /**
     * Get information
     * @returns {*} 
     */
    this.getGroups = function () {
        return $http.get(baseUrl + "/groups");
    };

    this.getTracks = function (group_id) {
        return $http.get(baseUrl + "/groups/" + group_id + "/tracks");
    };
    
    this.addTrack = function (group_id, track_id, user_id) {
      return $http({
            method: "POST",
            url: baseUrl + "/groups/" + group_id + "/tracks",
            data: {
                track_id: track_id,
                user_id: user_id
            }
        }); 
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