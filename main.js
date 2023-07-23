import './style.css';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Lensflare, LensflareElement} from 'three/examples/jsm/objects/Lensflare';
import { GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';
import * as THREE from 'three';
import gsap from 'gsap';
// import { skybox } from './skybox.js';

//importing assets
import spacefront from './static/skybox/front.png';
import spaceback from './static/skybox/back.png';
import spaceleft from './static/skybox/left.png';
import spaceright from './static/skybox/right.png';
import spacetop from './static/skybox/top.png';
import spacebottom from './static/skybox/bottom.png';
import planetearth from './static/planetearth.png';
import lensflare0 from './static/lensflare/lensflare0.png';
import lensflare1 from './static/lensflare/lensflare1.png';
import lensflare2 from './static/lensflare/lensflare2.png';
import lensflare3 from './static/lensflare/lensflare3.png';

//SCENE AND CAMERA 
const scene = new THREE.Scene();
const aspectRatio = window.innerWidth / window.innerHeight;
const camera = new THREE.PerspectiveCamera(50, aspectRatio,0.1,20000);
camera.position.set(0,0,20);
scene.add(camera);

//RENDERER
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector(".webgl"),
  alpha: true,
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
const pointLight = new THREE.PointLight(0xfef6ce,1,100);
const ambientLight = new THREE.AmbientLight(0xfef6ce,0.06);
pointLight.position.set(10,3,0);
scene.add(pointLight,ambientLight);

//SKYBOX
// function skyboxPathStrings() {
//   const basePath = './static/skybox/';
//   const fileType = '.png';
//   const sides = ['front', 'back', 'top', 'bottom', 'left', 'right'];
//   const pathStings = sides.map(side => {
//       return basePath + side + fileType;
//   });
  
//   return pathStings;
// }

function createMaterialArray() {
const skyboxImagepaths = [spacefront,spaceback,spacetop,spacebottom,spaceleft,spaceright];
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
const earthTexture = new THREE.TextureLoader().load(planetearth);
const earthGeometry = new THREE.SphereGeometry(3,64,64);
const earthMaterial = new THREE.MeshStandardMaterial({
  color: 0xcacaca,
  map: earthTexture,
  roughness: 1,
  metalness: 0.6,
});
const earth = new THREE.Mesh(earthGeometry, earthMaterial);
scene.add(earth);

//SUN LIGHT FLARE
const sunPointLight = new THREE.PointLight(0xfef6ce,1);
sunPointLight.position.set(970,15,0);
scene.add(sunPointLight);
const textureLoader = new THREE.TextureLoader();

const textureFlare0 = textureLoader.load(lensflare0);
const textureFlare1 = textureLoader.load( lensflare1 );
const textureFlare2 = textureLoader.load( lensflare2 );
const textureFlare3 = textureLoader.load(lensflare3);

const lensflare = new Lensflare();

lensflare.addElement( new LensflareElement( textureFlare0, 500, 0 ) );
lensflare.addElement( new LensflareElement( textureFlare3, 60, 0.2 ) );
lensflare.addElement( new LensflareElement( textureFlare3, 70, 0.14 ) );
lensflare.addElement( new LensflareElement( textureFlare3, 80, 0.06 ) );
// lensflare.addElement( new LensflareElement( textureFlare3, 70, 0.7 ) );

sunPointLight.add( lensflare );

//SUN GEOMETRY
const gltfLoader = new GLTFLoader();
gltfLoader.load( './static/sungltf/scene.gltf', function ( gltf ) {
  gltf.scene.position.set(1000,10,0);
  gltf.scene.scale.set(2,2,2);
	scene.add( gltf.scene );

});

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

  earth.rotation.y += 0.001;

  controls.update();
  renderer.render(scene, camera);

}

animate();
