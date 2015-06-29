'use strict';

/**
 * @ngdoc overview
 * @name sketchupApp
 * @description
 * # sketchupApp
 *
 * Main module of the application.
 */
angular
  .module('sketchupApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'leaflet-directive'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/buildings', {
        templateUrl: 'views/buildings.html',
        controller: 'BuildingsCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
