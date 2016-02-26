'use strict';

/**
 * @ngdoc function
 * @name sketchupApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the sketchupApp
 */
angular.module('sketchupApp')
  .controller('BuildingsCtrl', ['$scope', '$http', '$timeout', 'leafletData', 'buildings', 'FileSaver', 'Blob',
    function ($scope, $http, $timeout, leafletData, buildings, FileSaver, Blob) {
      $scope.map = {
        center: {
          lat: 48.859762,
          lng: 2.3435408,
          zoom: 15
        },
        tiles: {
          url: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
          type: 'xyz'
        },
        paths: {}
      };

      leafletData.getMap().then(function (map) {
        var rect = L.rectangle([
          [$scope.map.center.lat + 0.003, $scope.map.center.lng + 0.004],
          [$scope.map.center.lat - 0.003, $scope.map.center.lng - 0.004]], {
          color: '#158CBA',
          fill: false
        });
        map.addLayer(rect);
        rect.editing.enable();
        $scope.rect = rect
      });


      $scope.start = function () {
        $scope.loading = true;
        leafletData.getMap().then(function (map) {
          buildings.init();

          var bounds = $scope.rect.getBounds();
          var mapCenter = {
            lat: (bounds._northEast.lat + bounds._southWest.lat) / 2,
            lng: (bounds._northEast.lng + bounds._southWest.lng) / 2,
            zoom: map.getZoom()
          };

          var box = [bounds._southWest.lat, bounds._southWest.lng, bounds._northEast.lat, bounds._northEast.lng];

          var url = 'https://overpass-api.de/api/interpreter?data=[out:json];((way(' + box.join(',') + ')[%22building%22]);(._;node(w);););out;';
          $http.get(url)
            .success(filterData);

          $scope.map.center = _.extend(mapCenter);

          function filterData(data) {
            var nodes = _.filter(data.elements, function (item) {
              return 'node' === item.type;
            });
            var features = _.filter(data.elements, function (item) {
              return 'way' === item.type && item.tags.building;
            });

            _.each(features, function (feature) {
              var levels = feature.tags['building:levels'] || 2;
              var outlinePath = filterNodes(feature, nodes);
              var points = _.map(outlinePath, function (coord) {
                return convertProjection(coord)
              });
              buildings.add(points, levels * 3.5)
            });

            $scope.buildings = buildings.get();
            $scope.sketchupScript = buildings.toSketchupScript();

            $timeout(function () {
              $scope.loading = false
            });
          }

          function filterNodes(feature, nodes) {
            var path = _(nodes).chain().filter(function (node) {
              return 0 <= feature.nodes.indexOf(node.id);
            }).sortBy(function (node) {
              return feature.nodes.indexOf(node.id);
            }).map(function (node) {
              return [node.lon, node.lat];
            }).value();
            return path;
          }

          function convertProjection(coords) {
            var projection = d3.geo.mercator()
              .center([mapCenter.lng, mapCenter.lat]) // Geographic coordinates of map centre
              .translate([0, 0]) // Pixel coordinates of .center()
              .scale(2100000 * 2); // Scaling value

            var buffer = projection(coords);
            return [-buffer[0], buffer[1]]
          }
        })
      };

      $scope.download = function () {
        var data = new Blob([$scope.sketchupScript], {type: 'text/plain;charset=utf-8'});
        var config = {
          data: data,
          filename: 'sketchup_export.rb'
        };
        FileSaver.saveAs(config);
      };
      $scope.copy = function () {
        if (window.clipboardData && clipboardData.setData) {
          clipboardData.setData('text', $scope.sketchupScript);
        }
      }
    }]);
