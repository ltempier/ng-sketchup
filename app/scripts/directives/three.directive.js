'use strict';

angular.module('sketchupApp')
    .directive('threeScene', [function () {
        return {
            restrict: "E",
            scope: {
                blocks: "=blocks"
            },
            link: function (scope, elem) {

                var renderer, camera, controls, scene;

                init();

                function init() {

                    console.log(elem.width() + ' x ' + elem.height())


                    renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
                    renderer.setClearColor('#FFFFFF', 0);
                    renderer.setSize(elem.width(), elem.height());

                    camera = new THREE.PerspectiveCamera(90, elem.width() / elem.height(), 0.1, 10000);
                    camera.position.x = 10;
                    camera.position.y = 10;
                    camera.position.z = 10;

                    controls = new THREE.TrackballControls(camera, renderer.domElement);
                    controls.minDistance = 500;
                    controls.maxDistance = 5000;
                    controls.addEventListener('change', function () {
                        render()
                    });

                    scene = new THREE.Scene();
                    scene.add(camera);
                    elem[0].appendChild(renderer.domElement);
                }

                function render() {
                    renderer.render(scene, camera);
                }
            }
        }
    }]);