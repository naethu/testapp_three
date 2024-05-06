import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

let scene, camera, renderer, controls;

// Initialize scene, camera, and renderer
scene = new THREE.Scene();
camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 5, 10);

renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// OrbitControls for camera movement
controls = new OrbitControls(camera, renderer.domElement);

// GLTF Loader
const loader = new GLTFLoader();

// Optional: Provide a DRACOLoader instance to decode compressed mesh data
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("/node_modules/three/examples/js/libs/draco/");
loader.setDRACOLoader(dracoLoader);

// Set background color of the renderer to white
renderer.setClearColor(0x888888);

// Load a glTF resource
loader.load(
  "3d-ansicht.gltf",
  function (gltf) {
    // Add loaded scene to our scene
    scene.add(gltf.scene);

    // Reset scale and position of the model
    gltf.scene.scale.set(1, 1, 1);
    gltf.scene.position.set(0, 0, 0);

    // Adjust camera position to view the model
    camera.lookAt(0, 0, 0);

    gltf.animations; // Array<THREE.AnimationClip>
    gltf.scene; // THREE.Group
    gltf.scenes; // Array<THREE.Group>
    gltf.cameras; // Array<THREE.Camera>
    gltf.asset; // Object
  },
  function (xhr) {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  },
  function (error) {
    console.log("An error happened", error);
  }
);

// Animate function
function animate() {
  requestAnimationFrame(animate);
  controls.update(); // Update OrbitControls
  renderer.render(scene, camera);
}

// Resize event
window.addEventListener("resize", function () {
  let width = window.innerWidth;
  let height = window.innerHeight;
  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
});

// Start animation
animate();
