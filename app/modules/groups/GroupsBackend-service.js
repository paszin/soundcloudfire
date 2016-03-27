/*global angular, _*/
/*jshint nomen: true */

/**
 * @ngdoc service
 * @name core.Services.GroupsBackend
 * @description GroupsBackend Service
 */
function GroupsBackend($http, SoundcloudSessionManager) {

    "use strict";

    var baseUrl,
        cache;
    baseUrl = "http://ec2-54-201-43-157.us-west-2.compute.amazonaws.com:8000";
    //baseUrl = "http://localhost:8000";

    cache = {
        groups: []
    };

    /**
     * Get information
     * @returns {*} 
     */
    this.getGroups = function () {
        return $http({
            method: "GET",
            url: baseUrl + "/groups",
            params: {
                "user_id": SoundcloudSessionManager.getUserId()
            }
        }).then(function (resp) {
            cache.groups = resp.data.groups;
            return resp;
        });
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
                return resp.data.members.map(function (member) {
                    return member.sc;
                });
            }
        );
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

    this.hasTrack = function (group_id, track_id) {
        return !!(_.find(_.find(cache.groups, {
            id: group_id
        }).tracks, {
            id: track_id
        }));
    };

    this.deleteTrack = function (group_id, track_id) {
        return $http({
            method: "DELETE",
            url: baseUrl + "/groups/" + group_id + "/tracks/" + track_id
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

        return $http.get(baseUrl + "/invitations", {
            params: {
                code: code,
                user_id: SoundcloudSessionManager.getUserId()
            }
        });
    };

    this.inviteToGroup = function (group_id) {
        var code = "welcome" + group_id + Math.random().toString(36).substring(2, 10);
        return $http({
            method: "POST",
            url: baseUrl + "/invitations",
            data: {
                code: code,
                group_id: group_id,
                message: "say hi!",
                username: SoundcloudSessionManager.getMe().first_name
            }
        }).then(function () {
            return code;
        });
    };

    this.deleteMember = function (group_id) {
        return $http({
            method: "DELETE",
            url: baseUrl + "/groups/" + group_id + "/members/" + SoundcloudSessionManager.getUserId()
        });
    };
}


angular
    .module("groups")
    .service("GroupsBackend", GroupsBackend);