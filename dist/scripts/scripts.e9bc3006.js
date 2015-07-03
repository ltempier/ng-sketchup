"use strict";angular.module("sketchupApp",["ngAnimate","ngCookies","ngResource","ngRoute","ngSanitize","ngTouch","leaflet-directive"]).config(["$routeProvider",function(a){a.when("/",{templateUrl:"views/main.html",controller:"MainCtrl"}).when("/buildings",{templateUrl:"views/buildings.html",controller:"BuildingsCtrl"}).otherwise({redirectTo:"/"})}]),angular.module("sketchupApp").controller("NavbarCtrl",["$scope","$location",function(a,b){a.menus=[{text:"Home",path:"/"},{text:"Buildings",path:"/buildings"}],a.getClass=function(a){return b.path()==a.path?"active":""}}]),angular.module("sketchupApp").controller("MainCtrl",["$scope",function(a){a.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"]}]),angular.module("sketchupApp").controller("BuildingsCtrl",["$scope","$http","$timeout","leafletData","buildings",function(a,b,c,d,e){a.map={center:{lat:48.859762,lng:2.3435408,zoom:15},tiles:{url:"http://api.tiles.mapbox.com/v4/{mapid}/{z}/{x}/{y}.png?access_token={apikey}",type:"xyz",options:{apikey:"pk.eyJ1IjoiYnVmYW51dm9scyIsImEiOiJLSURpX0pnIn0.2_9NrLz1U9bpwMQBhVk97Q",mapid:"ltempier.k4ppao03"}},paths:{}};var f=.003,g=.004;a.$watch("map.center",function(b){1!=a.loading&&(a.map.paths.p0={color:"#158CBA",weight:4,latlngs:[[b.lat+f,b.lng+g],[b.lat-f,b.lng+g],[b.lat-f,b.lng-g],[b.lat+f,b.lng-g],[b.lat+f,b.lng+g]]})},!0),a.start=function(){a.loading=!0,d.getMap().then(function(d){function h(b){var d=_.filter(b.elements,function(a){return"node"===a.type}),f=_.filter(b.elements,function(a){return"way"===a.type&&a.tags.building});_.each(f,function(a){var b=a.tags["building:levels"]||2,c=i(a,d),f=_.map(c,function(a){return j(a)});e.add(f,3.5*b)}),a.buildings=e.get(),a.sketchupScript=e.toSketchupScript(),c(function(){a.loading=!1})}function i(a,b){var c=_(b).chain().filter(function(b){return 0<=a.nodes.indexOf(b.id)}).sortBy(function(b){return a.nodes.indexOf(b.id)}).map(function(a){return[a.lon,a.lat]}).value();return c}function j(a){var b=256,c=l,d=d3.geo.mercator().center([k.lng,k.lat]).translate([0,0]).scale(b<<c),e=d(a);return[-1*e[1],-1*e[0]]}e.init();var k=d.getCenter(),l=d.getZoom(),m=[k.lat-f,k.lng-g,k.lat+f,k.lng+g],n="https://overpass-api.de/api/interpreter?data=[out:json];((way("+m.join(",")+")[%22building%22]);(._;node(w);););out;";b.get(n).success(h),a.map.center=_.extend(k,l)})},a.download=function(){if(e){var b=document.createElement("a");b.href=encodeURI(a.sketchupScript),b.target="_blank",b.download="sketchup_script.rb",b.click()}},a.copy=function(){window.clipboardData&&clipboardData.setData&&clipboardData.setData("text",a.sketchupScript)}}]),angular.module("sketchupApp").factory("buildings",function(){var a,b=function(a,b){this.points=a,this.level=_.clone(b)};return b.prototype.toSketchupScript=function(a){var b=["ent"+a+" = Sketchup.active_model.entities"];return b.push("main_face"+a+" = ent"+a+".add_face "+_.map(this.points,function(a){return"["+a.join(",")+"]"})),b.push("main_face"+a+".reverse!"),b.push("main_face"+a+".pushpull "+this.level),b.join("\n")},{init:function(){a=[]},add:function(c,d){var e=new b(c,d);a.push(e)},get:function(){return a},toSketchupScript:function(){var b=[];return _.each(a,function(a,c){b.push(a.toSketchupScript(c))}),b.join("\n")}}}),angular.module("sketchupApp").directive("threeScene",[function(){return{restrict:"E",replace:!0,template:'<div class="threeScene"></div>',scope:{blocks:"=blocks"},link:function(a,b,c){function d(){i=b.width(),j=b.height(),k=new THREE.WebGLRenderer({antialias:!0,alpha:!0}),k.setClearColor("#F5F5F5",1),k.setSize(i,j),l=new THREE.PerspectiveCamera(90,i/j,.1,1e4),l.position.x=10,l.position.y=10,l.position.z=10,m=new THREE.TrackballControls(l,k.domElement),m.minDistance=200,m.maxDistance=1e3,m.addEventListener("change",function(){h()}),b[0].appendChild(k.domElement),m.handleResize(),a.$watch("blocks",function(a){a&&(n=new THREE.Scene,n.add(l),_.each(a,e),h())},!0),a.$watch(function(){return[b[0].clientWidth,b[0].clientHeight].join("x")},f)}function e(a){var b=new THREE.Shape;b.moveTo(a.points[a.points.length-1][0],a.points[a.points.length-1][1]),_.each(a.points,function(a){b.lineTo(a[0],a[1])});var c=new THREE.ExtrudeGeometry(b,{amount:a.level,bevelEnabled:!1,material:0,extrudeMaterial:1}),d=new THREE.LineBasicMaterial({color:self.randomColor?randomColor():self.colors.building,linewidth:20,linecap:"round",linejoin:"round"}),e=new THREE.Mesh(c,d);c.computeFaceNormals(),e.rotation.x=-Math.PI/2,e.rotation.z=Math.PI/2,e.castShadow=!0,e.receiveShadow=!0,n.add(e)}function f(){i=b.width(),j=b.height(),l.aspect=i/j,l.updateProjectionMatrix(),k.setSize(i,j),m.handleResize(),h()}function g(){requestAnimationFrame(g),m.update()}function h(){n&&k.render(n,l)}b.css("width",c.width),b.css("height",c.height);var i,j,k,l,m,n;d(),g()}}}]);