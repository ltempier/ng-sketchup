'use strict';

/**
 * @ngdoc function
 * @name sketchupApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sketchupApp
 */
angular.module('sketchupApp')
  .controller('MainCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
