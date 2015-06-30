'use strict';

angular.module('sketchupApp')
    .directive('threeScene', [function () {
        return {
            restrict: "E",
            replace: true,
            template: '<div class="threeScene"></div>',
            scope: {
                blocks: "=blocks"
            },
            link: function (scope, element, attrs) {

                element.css('width', attrs.width);
                element.css('height', attrs.height);

                var width, height, renderer, camera, controls, scene;

                init();
                animate();

                function init() {
                    width = element.width();
                    height = element.height();
                    renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
                    renderer.setClearColor('#FFFFFF', 0);
                    renderer.setSize(width, height);

                    camera = new THREE.PerspectiveCamera(90, width / height, 0.1, 10000);
                    camera.position.x = 10;
                    camera.position.y = 10;
                    camera.position.z = 10;

                    controls = new THREE.TrackballControls(camera, renderer.domElement);
                    controls.minDistance = 500;
                    controls.maxDistance = 5000;
                    controls.addEventListener('change', function () {
                        render()
                    });

                    element[0].appendChild(renderer.domElement);

                    controls.handleResize();

                    scope.$watch('blocks', function (blocks) {
                        if (!blocks) return;
                        scene = new THREE.Scene();
                        scene.add(camera);
                        _.each(blocks, addBlock);
                        render()
                    }, true);

                    scope.$watch(function () {
                        return [element[0].clientWidth, element[0].clientHeight].join('x');
                    }, resize)

                }

                function addBlock(block) {
                    var shape = new THREE.Shape();
                    shape.moveTo(block.points[block.points.length - 1][0], block.points[block.points.length - 1][1]);
                    _.each(block.points, function (xy) {
                        shape.lineTo(xy[0], xy[1]);
                    });
                    var geom = new THREE.ExtrudeGeometry(shape, {
                        amount: block.level,
                        bevelEnabled: false,
                        material: 0,
                        extrudeMaterial: 1
                    });
                    var material = new THREE.LineBasicMaterial({
                        color: self.randomColor ? randomColor() : self.colors.building,
                        linewidth: 20,
                        linecap: 'round',
                        linejoin: 'round'
                    });
                    var mesh = new THREE.Mesh(geom, material);
                    geom.computeFaceNormals();
                    mesh.rotation.x = -Math.PI / 2;
                    mesh.rotation.z = Math.PI / 2;
                    mesh.castShadow = true;
                    mesh.receiveShadow = true;
                    scene.add(mesh);
                }

                function resize() {
                    width = element.width();
                    height = element.height();
                    camera.aspect = width / height;
                    camera.updateProjectionMatrix();
                    renderer.setSize(width, height);
                    controls.handleResize();
                    render();
                }


                function animate() {
                    requestAnimationFrame(animate);
                    controls.update();
                }

                function render() {
                    if (!scene) return;
                    renderer.render(scene, camera);
                }
            }
        }
    }]);