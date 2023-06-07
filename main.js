function init() {
  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );
  var spotLight_01 = getSpotlight("rgb(145, 200, 255)", 1);
  spotLight_01.name = "spotLight_01";
  var spotLight_02 = getSpotlight("rgb(255, 220, 180)", 1);
  spotLight_02.name = "spotLight_02";

  var plane = getPlane(50, 50);
  var sphere = getSphere(1);
  sphere.name = "sphere";

  scene.add(sphere);
  scene.add(plane);
  scene.add(spotLight_01);
  scene.add(spotLight_02);

  camera.position.x = 0;
  camera.position.y = 6;
  camera.position.z = 6;
  camera.lookAt(new THREE.Vector3(0, 0, 0));

  spotLight_01.position.x = 6;
  spotLight_01.position.y = 8;
  spotLight_01.position.z = -20;

  spotLight_02.position.x = -12;
  spotLight_02.position.y = 6;
  spotLight_02.position.z = -10;

  plane.rotation.x = Math.PI / 2;
  sphere.position.y = sphere.geometry.parameters.radius;

  // material adjustments
  var planeMaterial = plane.material;
  var sphereMaterial = sphere.material;

  var textureLoader = new THREE.TextureLoader();
  var texture = textureLoader.load('rock.jpg');
  var metalTexture = textureLoader.load('metal.jpg');

  planeMaterial.map = texture;
  planeMaterial.bumpMap = texture;
  planeMaterial.roughnessMap = texture;
  planeMaterial.roughness = 0.65;
  planeMaterial.metalness = 0.75;
  planeMaterial.bumpScale = 0.01;

  sphereMaterial.bumpMap = metalTexture;
  sphereMaterial.roughnessMap = metalTexture;
  sphereMaterial.bumpScale = 0.01;
  sphereMaterial.roughness = 0.75;
  sphereMaterial.metalness = 0.25;

  var repetition = 6;
  var textures = ["map", "bumpMap", "roughnessMap"];
  textures.forEach((mapName) => {
    planeMaterial[mapName].wrapS = THREE.RepeatWrapping;
    planeMaterial[mapName].wrapT = THREE.RepeatWrapping;
    planeMaterial[mapName].repeat.set(repetition, repetition);
  });

  var renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.shadowMap.enabled = true;
  document.getElementById("webgl").appendChild(renderer.domElement);
  renderer.setSize(window.innerWidth, window.innerHeight);

  var controls = new THREE.OrbitControls(camera, renderer.domElement);

  var winResize = new THREEx.WindowResize(renderer, camera);

  update(renderer, scene, camera, controls);
}

function getSphere(radius) {
  var geo = new THREE.SphereGeometry(radius, 24, 24);
  var material = new THREE.MeshStandardMaterial({
    color: 0xffffff,
  });
  var mesh = new THREE.Mesh(geo, material);
  mesh.castShadow = true;

  return mesh;
}

function getPlane(w, h) {
  var geo = new THREE.PlaneGeometry(w, h);
  var material = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    side: THREE.DoubleSide,
  });
  var mesh = new THREE.Mesh(geo, material);
  mesh.receiveShadow = true;

  return mesh;
}

function getSpotlight(color, intensity) {
  var light = new THREE.SpotLight(color, intensity);
  light.castShadow = true;

  light.shadow.mapSize.x = 4096;
  light.shadow.mapSize.y = 4096;

  return light;
}

function update(renderer, scene, camera, controls) {
  renderer.render(scene, camera);
  controls.update();

  var spotLight_01 = scene.getObjectByName("spotLight_01");
  spotLight_01.intensity += (Math.random() - 0.5) * 0.15;
  spotLight_01.intensity = Math.abs(spotLight_01.intensity);

  var spotLight_02 = scene.getObjectByName("spotLight_02");
  spotLight_02.intensity += (Math.random() - 0.5) * 0.05;
  spotLight_02.intensity = Math.abs(spotLight_02.intensity);

  requestAnimationFrame(function () {
    update(renderer, scene, camera, controls);
  });
}

init();

