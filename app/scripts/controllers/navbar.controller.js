'use strict';

angular.module('sketchupApp')
    .controller('NavbarCtrl', ['$scope', '$location', function ($scope, $location) {
        $scope.menus = [
            {
                text: 'Home',
                path: '/'
            },
            {
                text: 'Buildings',
                path: '/buildings'
            },
            {
                text: 'Topography',
                path: '/topography'
            }
        ];

        $scope.getClass = function (menu) {
            if ($location.path() == menu.path) {
                return "active"
            } else {
                return ""
            }
        }
    }]);
