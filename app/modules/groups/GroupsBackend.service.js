/*global angular*/
/*jshint nomen: true */


/**
 * @ngdoc service
 * @name core.Services.GroupsBackend
 * @description GroupsBackend Service
 */
function GroupsBackend($http) {

    "use strict";

    var baseUrl;
    baseUrl = "http://ec2-54-201-43-157.us-west-2.compute.amazonaws.com:8000";
    baseUrl = "http://localhost:8000";

    /**
     * Get information
     * @returns {*} 
     */
    this.getGroups = function () {
        return $http.get(baseUrl + "/groups");
    };

    this.getTracks = function (group_id) {
        return $http.get(baseUrl + "/groups/" + group_id + "/tracks").then(
            function (resp) {
                var joinedData = resp.data.tracks.map(function (track) {
                    var property, returnValue = {};
                    for (property in track.sn) {
                        if (track.sn.hasOwnProperty(property)) {
                            returnValue[property] = track.sn[property];
                        }
                    }
                    for (property in track.sc) {
                        if (track.sc.hasOwnProperty(property)) {
                            returnValue[property] = track.sc[property];
                        }
                    }
                    return returnValue;
                });
                return joinedData;
            }
        );
    };

    this.getMembers = function (group_id) {
        return $http.get(baseUrl + "/groups/" + group_id + "/members").then(
            function (resp) {
                return resp.data.members.map(member => member.sc);
            })
        };

        this.addTrack = function (group_id, track_id, user_id, comment) {
            return $http({
                method: "POST",
                url: baseUrl + "/groups/" + group_id + "/tracks",
                data: {
                    track_id: track_id,
                    user_id: user_id,
                    comment: comment
                }
            });
        };

        this.addCommentToTrack = function (group_id, track_id, user_id, comment) {
            return $http({
                method: "POST",
                url: baseUrl + "/groups/" + group_id + "/tracks/" + track_id + "/comments",
                data: {
                    user_id: user_id,
                    text: comment
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

        this.invitationCheck = function (code) {
            return $http.get(baseUrl + "/invitation?code=" + code);
        };

        this.addMemberByCode = function (user_id, code) {
            return $http({
                method: "POST",
                url: baseUrl + "/invitation/" + code,
                data: {
                    user_id: user_id
                }
            });
        };
    }


    angular
        .module("groups")
        .service("GroupsBackend", GroupsBackend);