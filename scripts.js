const init = () => {
  let clock = new THREE.Clock();
  let gui = new dat.GUI();

  // SCENE
  let scene = new THREE.Scene();

  let isFog = false;
  if (isFog) scene.fog = new THREE.FogExp2("#fff", 0.011);

  // __materials
  let planeMaterial = getMaterial("standard", "#fff");
  let boxesMaterial = getMaterial("standard", "#7F7D7F");

  // let texture = new THREE.TextureLoader()
  // planeMaterial.map = texture.load('/assets/texture/concrete.JPG')
  // planeMaterial.bumpMap = texture.load('/assets/texture/concrete.JPG')
  // planeMaterial.bumpScale = .05

  // planeMaterial.map.wrapS = THREE.RepeatWrapping;
  // planeMaterial.map.wrapT = THREE.RepeatWrapping;
  // planeMaterial.map.repeat.set(1.4, 1.4);

  // planeMaterial.bumpMap.wrapS = THREE.RepeatWrapping;
  // planeMaterial.bumpMap.wrapT = THREE.RepeatWrapping;
  // planeMaterial.bumpMap.repeat.set(1.4, 1.4);

  // let reflectionCube = new THREE.CubeTextureLoader()
  //     .setPath('/assets/texture/MilkyWay_CUBE/')
  //     .load([
  //         'px.jpg',
  //         'nx.jpg',
  //         'py.jpg',
  //         'ny.jpg',
  //         'pz.jpg',
  //         'nz.jpg'
  //     ]);
  // boxesMaterial.roughnessMap = texture.load('/assets/texture/fingerprints.jpg')
  // boxesMaterial.envMap = reflectionCube
  // planeMaterial.envMap = reflectionCube
  // scene.background = reflectionCube

  // textures
  const loader = new THREE.TextureLoader();
  const loaderCube = new THREE.CubeTextureLoader();

  const textureConcrete = loader.load("./assets/texture/concrete.JPG");
  const textureFinger = loader.load("./assets/texture/scratch.jpg");
  const textureMilkWay = loaderCube
    .setPath("/assets/texture/MilkyWay_CUBE/")
    .load(["px1.jpg", "nx1.jpg", "py1.jpg", "ny1.jpg", "pz1.jpg", "nz1.jpg"]);
  textureMilkWay.format = THREE.RGBFormat;
  let plane = getPlane(60, planeMaterial);
  plane.name = "main-plane";
  let boxes = getBoxGroup(12, 1, 2, boxesMaterial);
  boxes.name = "main-boxes";

  planeMaterial.map = textureConcrete;
  planeMaterial.bumpMap = textureConcrete;
  planeMaterial.bumpScale = 0.05;
  boxesMaterial.bumpMap = textureFinger;
  boxesMaterial.bumpScale = 0.0005;
  boxesMaterial.roughnessMap = textureFinger;

  // boxesMaterial.roughness = 0.5;
  // boxesMaterial.metalness = 0.7;

  boxesMaterial.envMap = textureMilkWay;
  planeMaterial.envMap = textureMilkWay;
  // boxesMaterial.roughness = .7
  // boxesMaterial.metalness = 1
  scene.background = textureMilkWay;

  textureConcrete.wrapS = THREE.RepeatWrapping;
  textureConcrete.wrapT = THREE.RepeatWrapping;
  textureConcrete.repeat.set(1.5, 1.5);

  textureFinger.wrapS = THREE.RepeatWrapping;
  textureFinger.wrapT = THREE.RepeatWrapping;
  textureFinger.repeat.set(1, 1);

  // __objs
  let light = getDirectionalLight(1);
  let sphere = getSphere(0.05);
  // let helper = new THREE.CameraHelper(light.shadow.camera)

  // __positions
  plane.rotation.x = Math.PI / 2;
  light.position.y = 20;
  light.position.x = 10;
  light.position.z = 30;

  light.add(sphere);
  scene.add(boxes);
  scene.add(plane);
  scene.add(light);
  // scene.add(helper)

  // __dat.GUI
  let folder0 = gui.addFolder("light");
  folder0.add(light, "intensity", 0, 5);
  folder0.add(light.position, "y", 0, 20);
  folder0.add(light.position, "x", 0, 20);
  folder0.add(light.position, "z", 0, 20);
  // folder0.add(light, 'penumbra', 0, 1)

  // CAMERA
  let camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );
  // camera.position.z = 5
  // camera.position.x = 2;
  // camera.position.y = 2;

  // camera.lookAt(new THREE.Vector3(0, 0, 0))

  let cameraZRotation = new THREE.Group();
  let cameraYPosition = new THREE.Group();
  let cameraZPosition = new THREE.Group();
  let cameraXRotation = new THREE.Group();
  let cameraYRotation = new THREE.Group();

  cameraZRotation.name = "cameraZRotation";
  cameraYPosition.name = "cameraYPosition";
  cameraZPosition.name = "cameraZPosition";
  cameraXRotation.name = "cameraXRotation";

  cameraYPosition.position.y = 1;
  cameraXRotation.rotation.x = -Math.PI / 2;

  new TWEEN.Tween({ val: 0 })
    .to({ val: Math.PI / 2 }, 4000)
    .delay(3000)
    .onUpdate(function () {
      cameraYRotation.rotation.y = this.val;
    })
    // .repeat(Infinity)
    .start();

  new TWEEN.Tween({ val: 100 })
    .to({ val: -25 }, 10000)
    .onUpdate(function () {
      cameraZPosition.position.z = this.val;
    })
    // .repeat(Infinity)
    .start();

  new TWEEN.Tween({ val: -Math.PI / 2 })
    .to({ val: 0 }, 6000)
    .delay(1000)
    .onUpdate(function () {
      cameraXRotation.rotation.x = this.val;
    })
    // .repeat(Infinity)
    .start();

  cameraZRotation.add(camera);
  cameraYPosition.add(cameraZRotation);
  cameraZPosition.add(cameraYPosition);
  cameraXRotation.add(cameraZPosition);
  cameraYRotation.add(cameraXRotation);
  scene.add(cameraYRotation);

  let folder1 = gui.addFolder("camera");
  folder1.add(cameraZPosition.position, "z", 0, 100);
  folder1.add(cameraXRotation.rotation, "x", -Math.PI, Math.PI);
  folder1.add(cameraYRotation.rotation, "y", -Math.PI, Math.PI);

  //     let helper = new THREE.CameraHelper(camera)
  // scene.add(helper)

  // RENDERER
  let renderer = new THREE.WebGLRenderer();

  renderer.shadowMap.enabled = true;
  renderer.setSize(innerWidth, innerHeight);
  renderer.setClearColor("#7F7D7F");

  let controls = new THREE.OrbitControls(camera, renderer.domElement);

  update(renderer, scene, camera, controls, clock);

  //
  document.querySelector("#webgl").appendChild(renderer.domElement);
  return scene;
};

// functions
const update = (renderer, scene, camera, controls, clock) => {
  renderer.render(scene, camera);

  controls.update();
  TWEEN.update();

  let timeElapsed = clock.getElapsedTime();

  // boxes movement
  let boxes = scene.getObjectByName("main-boxes");
  boxes.children.forEach((child, index) => {
    child.scale.y =
      Math.abs(
        noise.simplex2(timeElapsed * 0.65 + index, timeElapsed * 0.5 + index)
      ) + 0.001;
    child.position.y = child.scale.y;
  });

  // camera movement
  let cameraZPosition = scene.getObjectByName("cameraZPosition");
  // cameraZPosition.position.z -= 0.5

  let cameraXRotation = scene.getObjectByName("cameraXRotation");
  // if (cameraXRotation.rotation.x < 0) cameraXRotation.rotation.x += .01

  let cameraZRotation = scene.getObjectByName("cameraZRotation");
  cameraZRotation.rotation.z =
    noise.simplex2(timeElapsed * 1.5, timeElapsed * 1.5) * 0.02;

  // if (cameraZPosition.position.z < -20) {
  //     cameraZPosition.position.z = 20

  //     cameraZPosition.position.z = 100
  //     cameraXRotation.rotation.x = -Math.PI / 2
  // }

  requestAnimationFrame(() => update(renderer, scene, camera, controls, clock));
};

// lights
const getPointLight = (intensity) => {
  let pointLight = new THREE.PointLight("#fff", intensity);
  pointLight.castShadow = true;
  return pointLight;
};

const getSpotLight = (intensity) => {
  let spotLight = new THREE.SpotLight("#fff", intensity);
  spotLight.castShadow = true;
  spotLight.shadow.bias = 0.001;
  spotLight.shadow.mapSize.width = 2048;
  spotLight.shadow.mapSize.height = 2048;
  spotLight.penumbra = 0.5;
  return spotLight;
};

const getDirectionalLight = (intensity) => {
  let directionalLight = new THREE.DirectionalLight("#fff", intensity);
  directionalLight.castShadow = true;

  directionalLight.shadow.camera.left = -15;
  directionalLight.shadow.camera.bottom = -15;
  directionalLight.shadow.camera.right = 15;
  directionalLight.shadow.camera.top = 15;

  return directionalLight;
};

const getAmbientLight = (intensity) => {
  let ambientLight = new THREE.AmbientLight("#fff", intensity);
  return ambientLight;
};

const getRectAreaLight = (intensity, width, height) => {
  let rectAreaLight = new THREE.RectAreaLight("#fff", intensity, width, height);
  rectAreaLight.lookAt(0, 0, 0);
  rectAreaLight.position.set(5, 5, 0);
  return rectAreaLight;
};

const getSphere = (size) => {
  let geometry = new THREE.SphereGeometry(size, 20, 20);
  let material = new THREE.MeshBasicMaterial({ color: "#fff" });

  let sphere = new THREE.Mesh(geometry, material);

  return sphere;
};

// objs matterial
const getMaterial = (materialType, color) => {
  let material;
  switch (materialType) {
    case "basic":
      material = new THREE.MeshBasicMaterial({ color: color });
      break;
    case "phong":
      material = new THREE.MeshPhongMaterial({ color: color });
      break;
    case "lambert":
      material = new THREE.MeshLambertMaterial({ color: color });
      break;
    case "standard":
      material = new THREE.MeshStandardMaterial({ color: color });
      break;
    default:
      material = new THREE.MeshBasicMaterial({ color: color });
  }

  return material;
};

// objs mesh
const getBox = (w, h, d, materialType) => {
  console.log("getBox");

  let geometry = new THREE.BoxGeometry(w, h, d);
  let material = materialType;

  let mesh = new THREE.Mesh(geometry, material);

  mesh.castShadow = true;

  return mesh;
};

const getPlane = (size, materialType) => {
  let geometry = new THREE.PlaneGeometry(size, size);
  let material = materialType;
  material.side = THREE.DoubleSide;

  let mesh = new THREE.Mesh(geometry, material);

  mesh.receiveShadow = true;

  return mesh;
};

const getBoxGroup = (number, size, distance, materialType) => {
  let boxGroup = new THREE.Group();

  for (let i = 0; i < number; ++i) {
    let box = getBox(size, size * 2, size, materialType);
    box.position.y = box.geometry.parameters.height / 2;
    box.position.x = distance * i;
    boxGroup.add(box);

    for (let j = 0; j < number; ++j) {
      let box = getBox(size, size * 2, size, materialType);
      box.position.x = distance * i;
      box.position.y = box.geometry.parameters.height / 2;
      box.position.z = j * distance;
      boxGroup.add(box);
    }
  }

  boxGroup.position.z = (-distance * (number - 1)) / 2;
  boxGroup.position.x = (-distance * (number - 1)) / 2;

  return boxGroup;
};

// run
let scene = init();
