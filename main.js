import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 2, 5);

const orbit = new OrbitControls(camera, renderer.domElement);
orbit.update();

const axesHelper = new THREE.AxesHelper(5);
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
        0xffff00
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
