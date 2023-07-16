import './style.css';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as THREE from 'three';
import gsap from 'gsap';
// import { skybox } from './skybox.js';

//SCENE AND CAMERA 
const scene = new THREE.Scene();
const aspectRatio = window.innerWidth / window.innerHeight;
const camera = new THREE.PerspectiveCamera(50, aspectRatio,0.1,20000);
camera.position.set(0,0,20);
scene.add(camera);

//RENDERER
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector(".webgl"),
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

//MOUSE CONTROL 
const controls = new OrbitControls(camera,renderer.domElement);
controls.enableDamping = true;
controls.enablePan = false;
controls.enableZoom = false;
controls.autoRotate = true;
controls.autoRotateSpeed = 1;

//LIGHTS
const pointLight = new THREE.PointLight(0xffffff,1,100);
pointLight.position.set(0,10,10);
scene.add(pointLight);

//SKYBOX
function skyboxPathStrings() {
  const basePath = './static/skybox/';
  const fileType = '.png';
  const sides = ['front', 'back', 'top', 'bottom', 'left', 'right'];
  const pathStings = sides.map(side => {
      return basePath + side + fileType;
  });
  
  return pathStings;
}

function createMaterialArray() {
const skyboxImagepaths = skyboxPathStrings();
const materialArray = skyboxImagepaths.map(image => {
  let texture = new THREE.TextureLoader().load(image);

  return new THREE.MeshBasicMaterial({ color: 0x435d6d, map: texture, side: THREE.BackSide });
});
return materialArray;
}

const materialArray = createMaterialArray();
const skyboxGeo = new THREE.BoxGeometry(10000, 10000, 10000);
const skybox = new THREE.Mesh(skyboxGeo, materialArray);
scene.add(skybox);

//EARTH GEOMETRY
const earthTexture = new THREE.TextureLoader().load('./static/planetearth.png');
const earthGeometry = new THREE.SphereGeometry(3,64,64);
const earthMaterial = new THREE.MeshStandardMaterial({
  color: 0xcacaca,
  map: earthTexture,
  roughness: 1,
  metalness: 0.6,
});
const earth = new THREE.Mesh(earthGeometry, earthMaterial);
scene.add(earth);

//RESIZING CANVAS WITH WINDOW
let sizeWidth, sizeHeight;
sizeWidth = window.innerWidth;
sizeHeight = window.innerHeight;

window.addEventListener('resize', ()=>{
  sizeWidth = window.innerWidth;
  sizeHeight = window.innerHeight;
  camera.aspect = sizeWidth/sizeHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(sizeWidth,sizeHeight);
});

//STARTING SCALE SPHERE, NAV TRANSLATION AND TITLE OPACITY ANIMATION
const t1 = new gsap.timeline({defaults: {duration: 2}});
t1.fromTo(earth.scale, {z:0, x:0, y:0},{z:1, x:1, y:1});
t1.fromTo("nav", {y:"-100%"},{y:"0%"});
t1.fromTo(".title", {opacity: 0},{opacity:1});

//COLOR CHANGE UPON USER SPIN
// let mouseDown = false;
// let rgb = [];
// window.addEventListener('mousedown', ()=>{mouseDown = true});
// window.addEventListener('mouseup', ()=>{mouseDown = false});
// window.addEventListener('mousemove', (e)=>{
//   if(mouseDown){
//     rgb = [
//       Math.round((e.pageX/sizeWidth) * 255),
//       Math.round((e.pageY/sizeHeight) * 255),
//       150,
//     ];
//     let rgbColor = new THREE.Color(`rgb(${rgb.join(",")})`);
//     gsap.to(earth.material.color, {
//       r: rgbColor.r, 
//       g: rgbColor.g, 
//       b: rgbColor.b
//     })
//   }
// })



//ANIMATION LOOP
function animate() {
  window.requestAnimationFrame(animate);

  controls.update();
  renderer.render(scene, camera);

}

animate();
