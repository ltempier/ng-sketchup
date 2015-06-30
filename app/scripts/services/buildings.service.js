'use strict';

angular.module('sketchupApp')
    .factory('buildings', function () {
        var _blocks;

        var Block = function (points, level) {
            this.points = points;
            this.level = _.clone(level);
        };
        Block.prototype.toSketchupScript = function (index) {
            var script = ["ent" + index + " = Sketchup.active_model.entities"];
            script.push("main_face" + index + " = ent" + index + ".add_face " + _.map(this.points, function (point) {
                return "[" + point + "]"
            }));
            script.push("main_face" + index + ".reverse!");
            script.push("main_face" + index + ".pushpull " + this.level);
            return script.join('\n')
        };

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
