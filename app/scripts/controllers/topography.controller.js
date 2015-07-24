'use strict';


angular.module('sketchupApp')
    .controller('TopographyCtrl', ['$scope', '$http', 'leafletData', 'topography',
        function ($scope, $http, leafletData, topography) {
            $scope.map = {
                center: {
                    lat: 48.859762,
                    lng: 2.3435408,
                    zoom: 15
                },
                tiles: {
                    url: 'http://api.tiles.mapbox.com/v4/{mapid}/{z}/{x}/{y}.png?access_token={apikey}',
                    type: 'xyz',
                    options: {
                        apikey: 'pk.eyJ1IjoiYnVmYW51dm9scyIsImEiOiJLSURpX0pnIn0.2_9NrLz1U9bpwMQBhVk97Q',
                        mapid: 'ltempier.k4ppao03'
                    }
                },
                paths: {}
            };

            var renderHeight = 0.003;
            var renderWidth = 0.004;

            $scope.$watch('map.center', function (center) {
                if ($scope.loading == true) return;
                $scope.map.paths.p0 = {
                    color: '#158CBA',
                    weight: 4,
                    latlngs: [
                        [center.lat + renderHeight, center.lng + renderWidth],
                        [center.lat - renderHeight, center.lng + renderWidth],
                        [center.lat - renderHeight, center.lng - renderWidth],
                        [center.lat + renderHeight, center.lng - renderWidth],
                        [center.lat + renderHeight, center.lng + renderWidth]
                    ]
                };
            }, true);

            $scope.start = function () {
                leafletData.getMap().then(function (map) {

                    topography.init();

                    var samples = 50;
                    var mapCenter = map.getCenter();
                    var mapZoom = map.getZoom();
                    var latBottom = mapCenter.lat - renderHeight;
                    var latTop = mapCenter.lat + renderHeight;
                    var lngLeft = mapCenter.lng - renderWidth;
                    var lngDelta = renderWidth / samples;

                    var elevator = new google.maps.ElevationService();

                    async.eachSeries(_.range(samples + 1), function (count, cb) {
                        var lng = lngLeft + count * lngDelta;
                        var pathRequest = {
                            'path': [
                                new google.maps.LatLng(latBottom, lng),
                                new google.maps.LatLng(latTop, lng)
                            ],
                            'samples': samples
                        };
                        getElevationAlongPath(200);
                        function getElevationAlongPath(timeout) {
                            elevator.getElevationAlongPath(pathRequest, function (datas, status) {

                                console.log("Google data " + Math.round(count / samples * 100) + '%');

                                if (status == "OK") {
                                    _.each(datas, function (data) {
                                        topography.add(convertProjection(data))
                                    });
                                    setTimeout(cb, timeout);
                                }
                                else if (status == "OVER_QUERY_LIMIT")
                                    setTimeout(function () {
                                        getElevationAlongPath(timeout);
                                    }, 10);
                                else
                                    cb(new Error(status))
                            });
                        }
                    }, function (err) {

                        if (err) return;


                    });

                    function convertProjection(data) {
                        var coords = [data.location.F, data.location.A]; // [lng, lat]
                        var tileSize = 256; // Pixel size of a single map tile
                        var zoom = mapZoom; // Zoom level
                        var projection = d3.geo.mercator()
                            .center([mapCenter.lng, mapCenter.lat]) // Geographic coordinates of map centre
                            .translate([0, 0]) // Pixel coordinates of .center()
                            .scale(tileSize << zoom); // Scaling value
                        var pixelValue = projection(coords); // Returns [x, y]
                        return [pixelValue[0] , pixelValue[1], Math.round(data.elevation * 10) / 10 ];
                    }
                });
            };
        }]);