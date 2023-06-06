var scene, camera, renderer, controls;
var sphere;

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    document.getElementById("webgl").appendChild(renderer.domElement);

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    //Creamos la luz ambiental
    var ambientLight;
    ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Color and intensity parameters
    //
    var spotLight_01 = getSpotlight("rgb(145, 200, 255)", 1);
    spotLight_01.name = "spotLight_01";
    var spotLight_02 = getSpotlight("rgb(255, 220, 180)", 1);
    spotLight_02.name = "spotLight_02";

    var plane = getPlane(50, 50);
    sphere = getSphere(1);
    sphere.name = "sphere";

    scene.add(sphere);
    scene.add(plane);
    scene.add(spotLight_01);
    scene.add(spotLight_02);
    //Añadimos la luz ambiental a la escena
    scene.add(ambientLight);

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

    var textureLoader = new THREE.TextureLoader();
    var texture = textureLoader.load('rock.jpg');
    var metalTexture = textureLoader.load('shrek.jpg');

    var planeMaterial = plane.material;
    var sphereMaterial = sphere.material;

    planeMaterial.map = texture;
    planeMaterial.roughness = 0.65;
    planeMaterial.metalness = 0.75;
    
    sphereMaterial.map = metalTexture;
    sphereMaterial.roughness = 0.75;
    sphereMaterial.metalness = 0.25;

    var repetition = 6;
    var textures = ["map"];
    textures.forEach((mapName) => {
        planeMaterial[mapName].wrapS = THREE.RepeatWrapping;
        planeMaterial[mapName].wrapT = THREE.RepeatWrapping;
        planeMaterial[mapName].repeat.set(repetition, repetition);
    });

    update();
}

function getSphere(radius) {
    var geometry = new THREE.SphereGeometry(radius, 24, 24);
    var material = new THREE.MeshStandardMaterial({ color: 0xffffff });
    var mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    return mesh;
}

function getPlane(width, height) {
    var geometry = new THREE.PlaneGeometry(width, height);
    var material = new THREE.MeshStandardMaterial({ color: 0xffffff, side: THREE.DoubleSide });
    var mesh = new THREE.Mesh(geometry, material);
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

function update() {
    requestAnimationFrame(update);

    var spotLight_01 = scene.getObjectByName("spotLight_01");
    spotLight_01.intensity += (Math.random() - 0.5) * 0.15;
    spotLight_01.intensity = Math.abs(spotLight_01.intensity);

    var spotLight_02 = scene.getObjectByName("spotLight_02");
    spotLight_02.intensity += (Math.random() - 0.5) * 0.05;
    spotLight_02.intensity = Math.abs(spotLight_02.intensity);

    // Animate the sphere's motion here
    sphere.position.y = Math.sin(Date.now() * 0.002) + (sphere.geometry.parameters.radius * 2);
    //rotamos la esfera
    sphere.rotation.y += 0.01;

    renderer.render(scene, camera);
    controls.update();
}

window.addEventListener('resize', function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}, false);

init();