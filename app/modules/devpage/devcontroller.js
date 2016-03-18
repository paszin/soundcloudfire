/*global ApplicationConfiguration, angular*/

ApplicationConfiguration
    .registerModule("dev");

function DevController($scope, $http, playerService) {

    var vm = this,
        streamUrl = "https://api.soundcloud.com/tracks/97097113/stream";

    $http.get("modules/devpage/flicflachome.json").then(function (resp) {
        vm.data = resp.data;
    });
    
    $http.get("modules/devpage/flicflactrack.json").then(function (resp) {
        vm.track = resp.data;
    });

    vm.loop = function () {
        //find current beat
        //wait until end and then go back
        var currentTime = playerService.audio.stream.progress * vm.data.track.duration;
    };

    playerService.playPauseSound({
        stream_url: streamUrl
    });
    vm.goto = function (pos) {
        playerService.goTo(pos);
    };


}

angular.module("dev").controller("DevController", DevController);