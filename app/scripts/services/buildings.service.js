'use strict';

angular.module('sketchupApp')
  .factory('buildings', function () {
    var _blocks;

    function Block(points, level) {
      this.points = points;
      this.level = _.clone(level);
    }

    Block.prototype.toSketchupScript = function (index) {
      var script = ["ent" + index + " = Sketchup.active_model.entities"];
      script.push("main_face" + index + " = ent" + index + ".add_face " + _.map(this.points, function (point) {
        return "[" + roundPoint(point).join(',') + "]"
      }));

      script.push("main_face" + index + ".reverse! if main_face" + index + ".normal.z < 0");
      script.push("main_face" + index + ".pushpull " + Math.abs(this.level));
      return script.join(' ;\n')
    };

    function roundPoint(points) {
      var coef = 100;
      return _.map(points, function (point) {
        return Math.round(point * coef) / coef
      })
    }

    return {
      init: function () {
        _blocks = []
      },
      add: function (points, level) {
        var block = new Block(points, level);
        _blocks.push(block)
      },
      get: function () {
        return _blocks
      },
      toSketchupScript: function () {
        var script = [];
        _.each(_blocks, function (block, index) {
          script.push(block.toSketchupScript(index))
        });
        return script.join('\n')
      }
    }
  });
