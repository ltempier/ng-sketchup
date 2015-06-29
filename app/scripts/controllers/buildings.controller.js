'use strict';

/**
 * @ngdoc function
 * @name sketchupApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the sketchupApp
 */
angular.module('sketchupApp')
  .controller('BuildingsCtrl', function ($scope) {


    $scope.map = {
      center: {
        lat: 48.8597625,
        lng: 2.3435408,
        zoom: 12
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
  });
