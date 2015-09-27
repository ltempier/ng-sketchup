'use strict';

angular.module('sketchupApp')
  .factory('topography', function () {

    var _points;
    var _blocks;

    function Point(array) {
      //this.array = array;
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
      },
      add: function (point) {
        var point = new Point(point);
        _points.push(point)
      },
      generateBlocks: function () {
        var blocks = {};
        _.each(_points, function (point) {
          if (blocks[point.z]) {
            blocks[point.z].push(point)
          } else
            blocks[point.z] = [point]
        });
        _blocks = _.map(blocks, function (points, level) {

          orderPoints(points);

          var blockPoints = _.map(points, function (point) {
            return [point.x, point.y]
          });
          return new Block(blockPoints, level)
        });

        return _blocks
      }
    };

    function orderPoints(points) {
      var orderPoints = [];
      var oldPoint;

      _.each(points, function (point) {
        if (!oldPoint) {
          orderPoints.push(point)
        } else {

          for (var test = 0; test < 4; test++) {
            var minDist;
            var bestPoint;

            _.each(points, function (p) {
              if (p == point || orderPoints.indexOf(p) > 0) return;
              var dX = point.x - p.x;
              var dY = point.y - p.y;

              if (test == 0 && dX < 0 && dY > 0) testDistance();
              if (test == 1 && dX > 0 && dY > 0) testDistance();
              if (test == 2 && dX > 0 && dY < 0) testDistance();
              if (test == 3 && dX < 0 && dY < 0) testDistance();

              function testDistance() {
                var dist = Math.sqrt(Math.pow(dX, 2) + Math.pow(dY, 2));
                if (!minDist || minDist > dist) {
                  minDist = dist;
                  bestPoint = p
                }
              }
            });

            if (bestPoint) {
              orderPoints.push(bestPoint);
              break;
            }
          }
        }
        oldPoint = point
      });
      return orderPoints
    }
  });
