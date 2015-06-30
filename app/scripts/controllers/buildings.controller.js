'use strict';

/**
 * @ngdoc function
 * @name sketchupApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the sketchupApp
 */
angular.module('sketchupApp')
    .controller('BuildingsCtrl', ['$scope', '$http', '$timeout', 'leafletData', 'buildings',
        function ($scope, $http, $timeout, leafletData, buildings) {
            $scope.map = {
                center: {
                    lat: 48.859762,
                    lng: 2.3435408,
                    zoom: 18
                },
                tiles: {
                    url: 'http://api.tiles.mapbox.com/v4/{mapid}/{z}/{x}/{y}.png?access_token={apikey}',
                    type: 'xyz',
                    options: {
                        apikey: 'pk.eyJ1IjoiYnVmYW51dm9scyIsImEiOiJLSURpX0pnIn0.2_9NrLz1U9bpwMQBhVk97Q',
                        mapid: 'ltempier.k4ppao03'
                    }
                }
            };

            $scope.start = function () {
                $scope.loading = true;
                leafletData.getMap().then(function (map) {
                    buildings.init();
                    var mapCenter = map.getCenter();
                    var mapZoom = map.getZoom();
                    var bounds = map.getBounds();
                    var box = [bounds.getSouth(), bounds.getWest(), bounds.getNorth(), bounds.getEast()];
                    var url = 'https://overpass-api.de/api/interpreter?data=[out:json];((way(' + box.join(',') + ')[%22building%22]);(._;node(w);););out;';
                    $http.get(url)
                        .success(filterData);

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
                            buildings.add(points, levels)
                        });

                        $scope.buildings = buildings.get();

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
                        var tileSize = 128; // Pixel size of a single map tile
                        var zoom = mapZoom; // Zoom level
                        var projection = d3.geo.mercator()
                            .center([mapCenter.lng, mapCenter.lat]) // Geographic coordinates of map centre
                            .translate([0, 0]) // Pixel coordinates of .center()
                            .scale(tileSize << zoom); // Scaling value
                        var pixelValue = projection(coords); // Returns [x, y]
                        return [pixelValue[1] * -1, pixelValue[0] * -1];
                    }
                })
            };

            $scope.download = function () {
                if (!buildings) return;
                var hiddenElement = document.createElement('a');
                hiddenElement.href = encodeURI(buildings.toSketchupScript());
                hiddenElement.target = '_blank';
                hiddenElement.download = 'sketchup_script';
                hiddenElement.click();
            }
        }]);
