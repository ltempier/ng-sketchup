'use strict';

angular.module('sketchupApp')
    .factory('topography', function () {

        var _points;
        var _blocks;

        function Point(array) {
            this.array = array;
            this.x = array[0];
            this.y = array[1];
            this.z = array[2]
        }

        function Block(points, level) {
            this.points = points;
            this.level = level;
        }

        return {
            init: function () {
                _points = [];
                _blocks = []
            },
            add: function (point) {
                var point = new Point(point);
                _points.push(point)
            }
        }
    });