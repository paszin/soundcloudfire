/*global angular, createjs*/

angular
    .module("core")
    .directive("visualization", function () {
        "use strict";
        return {
            restrict: "A",
            link: function (scope, element) {

                var canvas = document.getElementById("canvas"),
                    stage = new createjs.Stage(canvas),
                    circle = new createjs.Shape();
                circle.graphics.beginFill("DeepSkyBlue").drawCircle(0, 0, 50);
                circle.x = 100;
                circle.y = 100;
                stage.addChild(circle);
                stage.update();

            }
        };
    });