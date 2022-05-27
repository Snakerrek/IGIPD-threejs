// Ustawianie sceny
var scene = new THREE.Scene();
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//Ładowanie tekstury
const textureLoader = new THREE.TextureLoader();
const lavaTexture = textureLoader.load("textures/lava.png");

// Kamera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 5;

// Generowanie sześcianów
class Cube {
  constructor(pos, scale, texture, rotationVector) {
    this.pos = pos;
    this.scale = scale;
    this.rotationVector = rotationVector;

    this.geometry = new THREE.BoxGeometry(
      this.scale.x,
      this.scale.y,
      this.scale.z
    );
    this.material = new THREE.MeshStandardMaterial({ map: texture });
    this.cube = new THREE.Mesh(this.geometry, this.material);
    scene.add(this.cube);
    this.cube.position.set(this.pos.x, this.pos.y, this.pos.z);
  }
  animateCubeRotation() {
    this.cube.rotation.x += this.rotationVector.x;
    this.cube.rotation.y += this.rotationVector.y;
    this.cube.rotation.z += this.rotationVector.z;
  }
  updatePosition(vector) {
    this.cube.position.x += vector.x;
    this.cube.position.y += vector.y;
  }
}

const cubesPositions = [
  { x: 1, y: -1, z: 0 },
  { x: -1, y: -1, z: 0 },
  { x: 0, y: 1, z: 0 },
  { x: 2, y: 1, z: -1 },
  { x: -2, y: 1, z: -1 },
];
const cubes = [];
for (let i = 0; i < 5; i++) {
  const randomScale = Math.random() * 0.8 + 0.3;
  cubes.push(
    new Cube(
      cubesPositions[i],
      { x: randomScale, y: randomScale, z: randomScale },
      lavaTexture,
      {
        x: Math.random() * 0.035,
        y: Math.random() * 0.035,
        z: Math.random() * 0.035,
      }
    )
  );
}

// Wybór sześcianu dla którego realizowany jest ruch
let selectedCube = cubes[4];
const selectCube = (id) => {
  selectedCube = cubes[id];
};
document
  .getElementById("button-0")
  .addEventListener("click", () => selectCube(4));
document
  .getElementById("button-1")
  .addEventListener("click", () => selectCube(2));
document
  .getElementById("button-2")
  .addEventListener("click", () => selectCube(3));
document
  .getElementById("button-3")
  .addEventListener("click", () => selectCube(1));
document
  .getElementById("button-4")
  .addEventListener("click", () => selectCube(0));

// Oświetlenie

//Oświetlenie otoczenia
const ambientLight = new THREE.AmbientLight(0x909090);
scene.add(ambientLight);

// Oświetlenie kierunkowe
directionalLights = [];
for (let i = 0; i < 4; i++) {
  directionalLights.push(new THREE.DirectionalLight(0x909090, 0.5));
  directionalLights[i].position.set(
    Math.random() * 10,
    Math.random() * 10,
    Math.random() * 10
  );
  scene.add(directionalLights[i]);
}

// Rotacja kamery dookoła sześcianów
const cameraRotation = new THREE.OrbitControls(camera, renderer.domElement);
cameraRotation.update();

// Sterowanie klawiaturą
const xSpeed = 0.1;
const ySpeed = 0.1;
const cubeSteering = (event) => {
  console.log(event.altKey);
  var keyCode = event.which;
  if (event.altKey) {
    // Sterowanie kamerą
    if (keyCode == 37) {
      camera.position.x -= xSpeed;
    } else if (keyCode == 38) {
      camera.position.y += ySpeed;
    } else if (keyCode == 39) {
      camera.position.x += xSpeed;
    } else if (keyCode == 40) {
      camera.position.y -= ySpeed;
    }
  } else {
    // Sterowanie sześcianem
    if (keyCode == 37) {
      selectedCube.updatePosition({ x: -xSpeed, y: 0 });
      console.log("W lewo");
    } else if (keyCode == 38) {
      console.log("W gore");
      selectedCube.updatePosition({ x: 0, y: ySpeed });
    } else if (keyCode == 39) {
      console.log("W prawo");
      selectedCube.updatePosition({ x: xSpeed, y: 0 });
    } else if (keyCode == 40) {
      console.log("W dol");
      selectedCube.updatePosition({ x: 0, y: -ySpeed });
    }
  }
};
document.addEventListener("keydown", cubeSteering, false);

// render
function render() {
  // Uzaleznienie animacji od czasu (120 klatek na sekundę)
  setTimeout(function () {
    requestAnimationFrame(render);
  }, 1000 / 120);

  renderer.render(scene, camera);
  cubes.forEach((cube) => {
    cube.animateCubeRotation();
  });
}

render();
