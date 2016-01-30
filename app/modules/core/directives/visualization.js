/*global angular*/

angular
    .module("core")
    .directive("visualization", function () {
        return {
            restrict: "A",
            link: function (scope, element) {

                var canvas = document.getElementById("canvas");
                var stage = new createjs.Stage(canvas);
                var circle = new createjs.Shape();
                circle.graphics.beginFill("DeepSkyBlue").drawCircle(0, 0, 50);
                circle.x = 100;
                circle.y = 100;
                stage.addChild(circle);
                stage.update();

            }
        };
    });