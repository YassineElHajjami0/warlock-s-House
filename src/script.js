import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Timer } from "three/addons/misc/Timer.js";
import GUI from "lil-gui";
import { Sky } from "three/addons/objects/Sky.js";
console.log("sky", Sky);

// Debug
const gui = new GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

//####################  ground #######################
const planeTextureLoader = new THREE.TextureLoader();
const planeAlphaTexture = planeTextureLoader.load("/floor/alpha.jpg");
const planeColorTexture = planeTextureLoader.load(
  "/ground/coast_sand_rocks_02_diff_1k.webp"
);
const planeNormalTexture = planeTextureLoader.load(
  "/ground/coast_sand_rocks_02_nor_gl_1k.jpg"
);
const planeDisplacementTexture = planeTextureLoader.load(
  "/ground/coast_sand_rocks_02_disp_1k.webp"
);
const planeArmTexture = planeTextureLoader.load(
  "/ground/coast_sand_rocks_02_arm_1k.webp"
);

planeColorTexture.colorSpace = THREE.SRGBColorSpace;

planeColorTexture.repeat.set(8, 8);
planeNormalTexture.repeat.set(8, 8);
planeDisplacementTexture.repeat.set(8, 8);
planeArmTexture.repeat.set(8, 8);

planeColorTexture.wrapS = THREE.RepeatWrapping;
planeColorTexture.wrapT = THREE.RepeatWrapping;
planeNormalTexture.wrapS = THREE.RepeatWrapping;
planeNormalTexture.wrapT = THREE.RepeatWrapping;
planeDisplacementTexture.wrapS = THREE.RepeatWrapping;
planeDisplacementTexture.wrapT = THREE.RepeatWrapping;
planeArmTexture.wrapS = THREE.RepeatWrapping;
planeArmTexture.wrapT = THREE.RepeatWrapping;

const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20, 100, 100),
  new THREE.MeshStandardMaterial({
    alphaMap: planeAlphaTexture,
    transparent: true,
    map: planeColorTexture,
    normalMap: planeNormalTexture,
    displacementMap: planeDisplacementTexture,
    displacementScale: 0.2,
    displacementBias: -0.14,
    aoMap: planeArmTexture,
    roughnessMap: planeArmTexture,
    metalnessMap: planeArmTexture,
  })
);
plane.rotation.x = -Math.PI * 0.5;
gui
  .add(plane.material, "displacementBias")
  .min(-1)
  .max(1)
  .step(0.01)
  .name("Displacement Bias");

/**
 * House
 */
//house group
const house = new THREE.Group();

//#################### walls ####################
const wallsTextureLoader = new THREE.TextureLoader();
const wallsColorTexture = wallsTextureLoader.load(
  "/walls/rock_wall_10_diff_1k.webp"
);
const wallsArmTexture = wallsTextureLoader.load(
  "/walls/rock_wall_10_arm_1k.webp"
);
const wallsNormalTexture = wallsTextureLoader.load(
  "/walls/rock_wall_10_nor_gl_1k.jpg"
);
const wallsDispTexture = wallsTextureLoader.load(
  "/walls/rock_wall_10_disp_1k.webp"
);

wallsColorTexture.repeat.set(3, 3);
wallsColorTexture.wrapS = THREE.RepeatWrapping;
wallsColorTexture.wrapT = THREE.RepeatWrapping;
wallsNormalTexture.repeat.set(3, 3);
wallsNormalTexture.wrapS = THREE.RepeatWrapping;
wallsNormalTexture.wrapT = THREE.RepeatWrapping;
wallsDispTexture.repeat.set(3, 3);
wallsDispTexture.wrapS = THREE.RepeatWrapping;
wallsDispTexture.wrapT = THREE.RepeatWrapping;
wallsArmTexture.repeat.set(3, 3);
wallsArmTexture.wrapS = THREE.RepeatWrapping;
wallsArmTexture.wrapT = THREE.RepeatWrapping;

wallsColorTexture.colorSpace = THREE.SRGBColorSpace;

const walls = new THREE.Mesh(
  new THREE.BoxGeometry(4, 2.5, 4, 100, 100),
  new THREE.MeshStandardMaterial({
    map: wallsColorTexture,
    normalMap: wallsNormalTexture,
    displacementMap: wallsDispTexture,
    displacementScale: 0.1,
    displacementBias: -0.08,
    aoMap: wallsArmTexture,
    roughnessMap: wallsArmTexture,
    metalnessMap: wallsArmTexture,
  })
);
walls.position.y = 1.25;
house.add(walls);

// walls.material.map = wallsColorTexture;
// walls.material.normalMap = wallsNormalTexture;
// walls.material.roughness = 0.4;
// walls.material.normalScale.set(0.5, 0.5);

//#################### roof ####################
const roofTextureLoader = new THREE.TextureLoader();
const roofColorTexture = roofTextureLoader.load(
  "/roof/roof_tiles_14_diff_1k.webp"
);
const roofArmTexture = roofTextureLoader.load(
  "/roof/roof_tiles_14_arm_1k.webp"
);
const roofNormalTexture = roofTextureLoader.load(
  "/roof/roof_tiles_14_nor_gl_1k.jpg"
);

roofColorTexture.repeat.set(9, 1);
roofColorTexture.wrapS = THREE.RepeatWrapping;
roofArmTexture.repeat.set(9, 1);
roofArmTexture.wrapS = THREE.RepeatWrapping;
roofNormalTexture.repeat.set(9, 1);
roofNormalTexture.wrapS = THREE.RepeatWrapping;
roofColorTexture.colorSpace = THREE.SRGBColorSpace;

const roof = new THREE.Mesh(
  new THREE.ConeGeometry(3.5, 1.5, 4),
  new THREE.MeshStandardMaterial({
    map: roofColorTexture,
    normalMap: roofNormalTexture,
    aoMap: roofArmTexture,
    roughnessMap: roofArmTexture,
    metalnessMap: roofArmTexture,
  })
);
roof.position.y = 3.25;
roof.rotation.y = Math.PI / 4;
house.add(roof);

//#################### door ####################
const doorTextureLoader = new THREE.TextureLoader();
const doorColorTexture = doorTextureLoader.load("/door/color.webp");
const doorAlphaTexture = doorTextureLoader.load("/door/alpha.webp");
const doorAmbientOcclusionTexture = doorTextureLoader.load(
  "/door/ambientOcclusion.webp"
);
const doorHeightTexture = doorTextureLoader.load("/door/height.webp");
const doorNormalTexture = doorTextureLoader.load("/door/normal.webp");
const doorMetalnessTexture = doorTextureLoader.load("/door/metalness.webp");
const doorRoughnessTexture = doorTextureLoader.load("/door/roughness.webp");
doorColorTexture.colorSpace = THREE.SRGBColorSpace;
const door = new THREE.Mesh(
  new THREE.PlaneGeometry(1.5, 2, 10, 10),
  new THREE.MeshStandardMaterial({
    map: doorColorTexture,
    transparent: true,
    alphaMap: doorAlphaTexture,
    aoMap: doorAmbientOcclusionTexture,
    displacementMap: doorHeightTexture,
    displacementScale: 0.05,
    normalMap: doorNormalTexture,
    metalnessMap: doorMetalnessTexture,
    roughnessMap: doorRoughnessTexture,
  })
);
// door.material.map.encoding = THREE.sRGBEncoding;
door.material.needsUpdate = true;
door.position.z = 2 + 0.01;
door.position.y = 0.9;
house.add(door);

//#################### Bushes ####################
const bushTextureLoader = new THREE.TextureLoader();
const bushColorTexture = bushTextureLoader.load(
  "/bush/forest_leaves_03_diff_1k.webp"
);
const bushArmTexture = bushTextureLoader.load(
  "/bush/forest_leaves_03_arm_1k.webp"
);
const bushNormalTexture = bushTextureLoader.load(
  "/bush/forest_leaves_03_nor_gl_1k.jpg"
);

bushColorTexture.repeat.set(3, 1);
bushColorTexture.wrapS = THREE.RepeatWrapping;
bushArmTexture.repeat.set(3, 1);
bushArmTexture.wrapS = THREE.RepeatWrapping;
bushNormalTexture.repeat.set(3, 1);
bushNormalTexture.wrapS = THREE.RepeatWrapping;
bushColorTexture.colorSpace = THREE.SRGBColorSpace;
const bushGeometry = new THREE.SphereGeometry(1, 16, 16);
const bushMaterial = new THREE.MeshStandardMaterial({
  color: "#ccffcc",
  map: bushColorTexture,
  normalMap: bushNormalTexture,
  aoMap: bushArmTexture,
  roughnessMap: bushArmTexture,
  metalnessMap: bushArmTexture,
});
const bush1 = new THREE.Mesh(bushGeometry, bushMaterial);
bush1.scale.set(0.4, 0.4, 0.4);
bush1.position.set(1, 0.2, 2.2);
bush1.rotation.x = -0.75;
const bush2 = new THREE.Mesh(bushGeometry, bushMaterial);
bush2.scale.set(0.6, 0.6, 0.6);
bush2.position.set(1.7, 0.1, 2.3);
bush2.rotation.x = -0.75;
const bush3 = new THREE.Mesh(bushGeometry, bushMaterial);
bush3.scale.set(0.3, 0.3, 0.3);
bush3.position.set(-0.8, 0.1, 2.1);
bush3.rotation.x = -0.75;
const bush4 = new THREE.Mesh(bushGeometry, bushMaterial);
bush4.scale.set(0.5, 0.5, 0.5);
bush4.position.set(-1.6, 0.1, 2.1);
bush4.rotation.x = -0.75;
house.add(bush1, bush2, bush3, bush4);

//#################### graves ####################
const graveTextureLoader = new THREE.TextureLoader();
const graveColorTexture = graveTextureLoader.load(
  "/grave/plastered_stone_wall_diff_1k.jpg"
);
const graveArmTexture = graveTextureLoader.load(
  "/grave/plastered_stone_wall_arm_1k.jpg"
);
const graveNormalTexture = graveTextureLoader.load(
  "/grave/plastered_stone_wall_nor_gl_1k.jpg"
);

graveColorTexture.repeat.set(1, 1);
graveColorTexture.wrapS = THREE.RepeatWrapping;
graveArmTexture.repeat.set(1, 1);
graveArmTexture.wrapS = THREE.RepeatWrapping;
graveNormalTexture.repeat.set(1, 1);
graveNormalTexture.wrapS = THREE.RepeatWrapping;
graveColorTexture.colorSpace = THREE.SRGBColorSpace;

const graveGeometry = new THREE.BoxGeometry(0.5, 0.6, 0.1);
const graveMaterial = new THREE.MeshStandardMaterial({
  map: graveColorTexture,
  normalMap: graveNormalTexture,
  aoMap: graveArmTexture,
  roughnessMap: graveArmTexture,
  metalnessMap: graveArmTexture,
});
const graves = new THREE.Group();
for (let i = 0; i < 50; i++) {
  const angle = Math.random() * Math.PI * 2;
  const radius = 3 + Math.random() * 4;
  const x = Math.sin(angle) * radius;
  const z = Math.cos(angle) * radius;
  const grave = new THREE.Mesh(graveGeometry, graveMaterial);
  grave.position.set(x, 0.25, z);
  grave.rotation.set(
    Math.random() * 0.4 - 0.2,
    Math.random() * 0.1,
    Math.random() * 0.3 - 0.15
  );
  graves.add(grave);
}

scene.add(plane, house, graves);

/**
 * Lights
 */
// #################### Ambient light ####################
const ambientLight = new THREE.AmbientLight("#86cdff", 0.5);
scene.add(ambientLight);

// #################### Directional light ####################
const directionalLight = new THREE.DirectionalLight("#86cdff", 0.6);
directionalLight.position.set(3, 2, -8);
scene.add(directionalLight);
// const directionalLightHelper = new THREE.DirectionalLightHelper(
//   directionalLight,
//   2
// );
// scene.add(directionalLightHelper);

// #################### Point light ####################
const pointLight = new THREE.PointLight("#ff7d46", 3.6);
pointLight.position.y = 2.3;
pointLight.position.z = 2.4;
scene.add(pointLight);

// #################### Point light ####################
const goast1 = new THREE.PointLight("#5E1916", 1.5);
goast1.position.y = 0.2;
goast1.position.z = 5.4;
scene.add(goast1);

const goast2 = new THREE.PointLight("#AC86DA", 1.5);
goast2.position.y = 0.2;
goast2.position.z = -5.4;
scene.add(goast2);

const goast3 = new THREE.PointLight("#363636", 1.5);
goast3.position.y = 0.2;
goast3.position.x = -5.4;
scene.add(goast3);

// #################### Casting Shadows ####################
directionalLight.castShadow = true;
goast1.castShadow = true;
goast2.castShadow = true;
goast3.castShadow = true;

walls.castShadow = true;
walls.receiveShadow = true;
plane.receiveShadow = true;
roof.castShadow = true;

graves.children.map((e) => {
  e.castShadow = true;
  e.receiveShadow = true;
});

//*************** Mapping ***********************
directionalLight.shadow.mapSize.width = 256;
directionalLight.shadow.mapSize.height = 256;
directionalLight.shadow.camera.near = 1;
directionalLight.shadow.camera.far = 20;
directionalLight.shadow.camera.top = 8;
directionalLight.shadow.camera.right = 8;
directionalLight.shadow.camera.bottom = -8;
directionalLight.shadow.camera.left = -8;

//*************** Helpers ***********************
// const houseHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
// scene.add(houseHelper);

//************************************sky*** **********************************/
const sky = new Sky();
sky.scale.setScalar(100);
scene.add(sky);
sky.material.uniforms["turbidity"].value = 10;
sky.material.uniforms["rayleigh"].value = 3;
sky.material.uniforms["mieCoefficient"].value = 0.1;
sky.material.uniforms["mieDirectionalG"].value = 0.95;
sky.material.uniforms["sunPosition"].value.set(0.3, -0.038, -0.95);

scene.fog = new THREE.Fog("#04343f", 1, 25);
/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 4;
camera.position.y = 2;
camera.position.z = 5;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);

controls.minDistance = 8; // Minimum zoom distance
controls.maxDistance = 30; // Maximum zoom distance
controls.enableDamping = true;
controls.maxPolarAngle = Math.PI / 2.06; // Locks vertical rotation at the horizon
// controls.minPolarAngle = Math.PI / 2; // Prevents tilting below the horizon
controls.enableDamping = true;
controls.dampingFactor = 0.05; // Adjust damping factor for smoothness

// Control zoom speed
controls.zoomSpeed = 0.5; // Adjust zoom speed

// Set initial camera position
camera.position.set(3, 2, 7);
/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
/**
 * Animate
 */
const timer = new Timer();

const tick = () => {
  // Timer
  timer.update();
  const elapsedTime = timer.getElapsed();

  // Animate goasts
  goast1.position.z = Math.sin(elapsedTime * 0.5) * 4.3;
  goast1.position.x = Math.cos(elapsedTime * 0.5) * 4.3;
  goast1.position.y =
    Math.sin(elapsedTime * 2) *
    Math.sin(elapsedTime) *
    Math.sin(elapsedTime + 3);
  goast2.position.z = Math.sin(-elapsedTime * 0.3) * 5.3;
  goast2.position.x = Math.cos(-elapsedTime * 0.3) * 5.3;
  goast2.position.y =
    Math.sin(elapsedTime * 2) *
    Math.sin(elapsedTime) *
    Math.sin(elapsedTime + 3);

  goast3.position.z = Math.sin(elapsedTime * 0.3) * 7.3;
  goast3.position.x = Math.cos(elapsedTime * 0.3) * 7.3;

  // goast2.position.z = Math.sin(elapsedTime * 0.5) * 0.3;
  // goast3.position.z = Math.sin(elapsedTime * 0.5) * 0.3;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
