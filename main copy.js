import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Hintergrundfarbe des Renderers auf weiss setzen
renderer.setClearColor(0xfefefe);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const orbit = new OrbitControls(camera, renderer.domElement);

camera.position.set(0, 8, 14);
orbit.update();

const gridHelper = new THREE.GridHelper(10, 10);
scene.add(gridHelper);

const axesHelper = new THREE.AxesHelper(2);
scene.add(axesHelper);

// Laden der Daten aus der Datei
fetch("data.csv")
  .then((response) => response.text())
  .then((data) => {
    const lines = data.split("\n").slice(1); // Erste Zeile überspringen (Header)
    lines.forEach((line) => {
      const [id, x1, y1, z1, x2, y2, z2] = line.split(",").map(Number);

      const startPoint = new THREE.Vector3(x1, y1, z1);
      const endPoint = new THREE.Vector3(x2, y2, z2);
      const direction = endPoint.clone().sub(startPoint);

      const arrowHelper = new THREE.ArrowHelper(
        direction.normalize(),
        startPoint,
        direction.length(),
        0xffa500
      );
      scene.add(arrowHelper);
    });
  })
  .catch((error) => {
    console.error("Error loading the file:", error);
  });

function animate() {
  requestAnimationFrame(animate);

  // Aktualisieren der OrbitControls in der Animationsschleife
  orbit.update();

  renderer.render(scene, camera);
}

// Reagieren auf Größenänderungen des Fensters
window.addEventListener("resize", () => {
  const width = window.innerWidth;
  const height = window.innerHeight;

  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  // Aufrufen der resize Methode von OrbitControls
  orbit.handleResize();
});

animate();
