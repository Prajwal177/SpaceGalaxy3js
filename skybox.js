function skyboxPathStrings() {
    const basePath = './static/skybox/';
    const fileType = '.png';
    const sides = ['front', 'back', 'top', 'bottom', 'right', 'left'];
    const pathStings = sides.map(side => {
        return basePath + side + fileType;
    });
    
    return pathStings;
}

function createMaterialArray() {
  const skyboxImagepaths = skyboxPathStrings();
  const materialArray = skyboxImagepaths.map(image => {
    let texture = new THREE.TextureLoader().load(image);

    return new THREE.MeshBasicMaterial({ map: texture, side: THREE.BackSide });
  });
  return materialArray;
}

const materialArray = createMaterialArray();
const skyboxGeo = new THREE.BoxGeometry(10000, 10000, 10000);
const skybox = new THREE.Mesh(skyboxGeo, materialArray);

export {skybox}