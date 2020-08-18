/**
 * @author Alberto Contorno
 */
import "./styles.css";
import { WebGLUtils } from "./common/webgl-utils";
import { Engine } from "./common/Engine";
import { InputManager } from "./common/inputManager";
import { Scene } from "./common/Scene";
import { Camera } from "./common/Camera";
import { SceneObject } from "./common/Object";
import { Mesh } from "./common/Mesh";
import { Texture } from "./common/Texture";
import { DirectionalLight } from "./common/Components/DirectionalLight";
import { PointLight } from './common/Components/PointLight';
import { SpotLight } from './common/Components/SpotLight';
import { vec2, vec3, vec4, perspective, lookAt, scale, add, subtract,  } from "./common/Utils/Vector_Matrix";
import { Material } from "./common/Material";
import { Request } from './common/Utils/Request';
import { ObjLoader } from './common/Loaders/ObjLoader';
import { generateTangents } from './common/Utils/NormalsGenerator';

var inputs = new InputManager();

const up = vec3(0.0, 1.0, 0.0);

const canvas = document.getElementById("app");
inputs.lockMouse(canvas);
const gl = WebGLUtils.setupWebGL(canvas);
var aspect = gl.drawingBufferWidth / gl.drawingBufferHeight;
var camera = new Camera(vec3(0, 0, 5), up, 5, "perspective", {},
  { fov: 45, aspect: aspect, near: 0.1, far: 100 },
  25, { maxLevel: 3, 0: 30, 1: 45, 2: 75, 3: 90 }, 1
);
/* var camera = new Camera(vec3(0, 0, 0), up, 5, "orthographic", {},
  { left: -1, right: 1, up: 1, bottom: -1, near: 0.1, far: 100 },
  25, { maxLevel: 3, 0: 30, 1: 45, 2: 75, 3: 90 }, 1
); */
gl.enable(gl.DEPTH_TEST);
//gl.enable(gl.CULL_FACE);
gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
var engine = new Engine(gl, {showFps: true, clearColor: [0.0, 0.0, 0.0, 0.0]});
var scene = new Scene();
const req = new Request('http://localhost:1234/assets/windmill.obj');
const reqMtl = new Request('http://localhost:1234/assets/windmill.mtl');

Promise.all([req.send(), reqMtl.send()]).then( res => {
  const obj = res[0];
  const mat = res[1];
  
  const loader = new ObjLoader();
  let m = loader.parse(obj);
  console.log(m);
  let o = new SceneObject(null, 'holder');
  scene.addObject(o);
  const mtl = loader.parseMTL(mat);
  console.log(mtl);
  o.onUpdate = () => {
     o.transform.rotation[1] += 25 * engine.time.deltaTime; 
     //o.transform.rotation[0] += 5 * engine.time.deltaTime; 
  }

  m.geometries.forEach( g => {
    let oo = new SceneObject(null, 'sub');
    
    let verts = [];
    let verts_n = [];
    let text_coords = [];
    let colors;
    let data = g.data;
    let tangents;
    for(let i = 0; i<data.position.length-2; i+=3){
      verts.push(vec4(data.position[i], data.position[i+1], data.position[i+2], 1.0));
      verts_n.push(vec3(data.normal[i], data.normal[i+1], data.normal[i+2]));
    }
    for(let i = 0; i<data.texcoord.length-1; i+=2){
      text_coords.push(vec2(data.texcoord[i], data.texcoord[i+1], 1.0));
    }
    if(data.color){
      colors = [];
      for(let i = 0; i<data.color.length-2; i+=3){
        colors.push(vec4(data.color[i], data.color[i+1], data.color[i+2], 1.0));
      }
    }

    let ooMat = mtl[g.material]
    if (data.texcoord && data.normal && ooMat['normalMap']) {
      let tangents_ = generateTangents(verts, text_coords);
      tangents = [];
      for(let i = 0; i<tangents_.length-2; i+=3){
        tangents.push(vec3(tangents_[i], tangents_[i+1], tangents_[i+2]));
      }
    }

    let ooMesh = new Mesh(gl, verts, null, null, null, null, text_coords, verts_n, tangents);
    oo.addMesh(ooMesh);
    oo.parent = o;
    scene.addObject(oo);
    
    if(ooMat['diffuseMap']){
      let diffuseMap = new Texture(0, null, 'assets/'+ooMat['diffuseMap'], gl.RGB, gl.RGB, {flipY: true});
      diffuseMap.LoadTexture(gl);
      ooMesh.textures.DIFFUSE_MAP = diffuseMap;
    }
    if(ooMat['normalMap']){
      console.log('NORMAL MAP ' + ooMat['normalMap'])
      let normalMap = new Texture(2, null, 'assets/'+ooMat['normalMap'], gl.RGB, gl.RGB, {flipY: true});
      normalMap.LoadTexture(gl);
      ooMesh.textures.NORMAL_MAP = normalMap;
    }
    if(ooMat['specularMap']){
      let specularMap = new Texture(1, null, 'assets/'+ooMat['specularMap'], gl.RGB, gl.RGB, {flipY: true});
      specularMap.LoadTexture(gl);
      ooMesh.textures.SPECULAR_MAP = specularMap;
    }
    oo.material = new Material(ooMat.ambient, ooMat.diffuse, ooMat.specular, ooMat.shininess);
  });


  o.transform.position = [0, 0, -3];
  o.transform.rotation = [0, -90, 0];
  o.transform.scale = [.1,.1,.1]
  scene.addObject(o);
});


function handleInputs() {
  if (
    inputs.isKeyDown(inputs.keyCodes.KEYNAMES.shift) &&
    inputs.isKeyDown(inputs.keyCodes.KEYNAMES.w)
  ) {
    camera.moveUp(engine.time.deltaTime);
  } else if (
    inputs.isKeyDown(inputs.keyCodes.KEYNAMES.shift) &&
    inputs.isKeyDown(inputs.keyCodes.KEYNAMES.s)
  ) {
    camera.moveDown(engine.time.deltaTime);
  } else {
    if (inputs.isKeyDown(inputs.keyCodes.KEYNAMES.a)) {
      camera.moveLeft(engine.time.deltaTime);
    }
    if (inputs.isKeyDown(inputs.keyCodes.KEYNAMES.s)) {
      camera.moveBackwards(engine.time.deltaTime);
    }
    if (inputs.isKeyDown(inputs.keyCodes.KEYNAMES.d)) {
      camera.moveRight(engine.time.deltaTime);
    }
    if (inputs.isKeyDown(inputs.keyCodes.KEYNAMES.w)) {
      camera.moveForward(engine.time.deltaTime);
    }

    if(inputs.isKeyDown(inputs.keyCodes.KEYNAMES.q)){
      obj3.transform.rotation[0] +=4;
      obj3.transform.rotation[1] += 5;
      obj3.transform.rotation[2] += 4;
    }

    if (inputs.isKeyDown(inputs.keyCodes.KEYNAMES.r)) {
      robotLowerArm.transform.rotation[0] += 4;
    }

    if (inputs.isKeyDown(inputs.keyCodes.KEYNAMES.t) ) {
      robotBody.transform.rotation[1] += 4;
    }

    if(inputs.isKeyDown(inputs.keyCodes.KEYNAMES.o)) {
      pointLight_obj.transform.position[0] = 4 * Math.sin(engine.time.time);
      pointLight_obj.transform.position[2] = 4 * Math.cos(engine.time.time);
      pointLight.position = pointLight_obj.transform.position;
    } 
  }

  camera.updateCameraDirection(
    inputs.getMouseMovX(),
    inputs.getMouseMovY(),
    engine.time.deltaTime
  );

}


let vertices1 = [
  vec4(-0.5, -0.5, -0.5, 1.0),
  vec4(0.5, -0.5, -0.5, 1.0),
  vec4(0.5, 0.5, -0.5, 1.0),
  vec4(0.5, 0.5, -0.5, 1.0),
  vec4(-0.5, 0.5, -0.5, 1.0),
  vec4(-0.5, -0.5, -0.5, 1.0),

  vec4(-0.5, -0.5, 0.5, 1.0),
  vec4(0.5, -0.5, 0.5, 1.0),
  vec4(0.5, 0.5, 0.5, 1.0),
  vec4(0.5, 0.5, 0.5, 1.0),
  vec4(-0.5, 0.5, 0.5, 1.0),
  vec4(-0.5, -0.5, 0.5, 1.0),

  vec4(-0.5, 0.5, 0.5, 1.0),
  vec4(-0.5, 0.5, -0.5, 1.0),
  vec4(-0.5, -0.5, -0.5, 1.0),
  vec4(-0.5, -0.5, -0.5, 1.0),
  vec4(-0.5, -0.5, 0.5, 1.0),
  vec4(-0.5, 0.5, 0.5, 1.0),

  vec4(0.5, 0.5, 0.5, 1.0),
  vec4(0.5, 0.5, -0.5, 1.0),
  vec4(0.5, -0.5, -0.5, 1.0),
  vec4(0.5, -0.5, -0.5, 1.0),
  vec4(0.5, -0.5, 0.5, 1.0),
  vec4(0.5, 0.5, 0.5, 1.0),

  vec4(-0.5, -0.5, -0.5, 1.0),
  vec4(0.5, -0.5, -0.5, 1.0),
  vec4(0.5, -0.5, 0.5, 1.0),
  vec4(0.5, -0.5, 0.5, 1.0),
  vec4(-0.5, -0.5, 0.5, 1.0),
  vec4(-0.5, -0.5, -0.5, 1.0),

  vec4(-0.5, 0.5, -0.5, 1.0),
  vec4(0.5, 0.5, -0.5, 1.0),
  vec4(0.5, 0.5, 0.5, 1.0),
  vec4(0.5, 0.5, 0.5, 1.0),
  vec4(-0.5, 0.5, 0.5, 1.0),
  vec4(-0.5, 0.5, -0.5, 1.0)
];
var normals = [
  vec3(0.0, 0.0, -1.0),
  vec3(0.0, 0.0, -1.0),
  vec3(0.0, 0.0, -1.0),
  vec3(0.0, 0.0, -1.0),
  vec3(0.0, 0.0, -1.0),
  vec3(0.0, 0.0, -1.0),

  vec3(0.0, 0.0, 1.0),
  vec3(0.0, 0.0, 1.0),
  vec3(0.0, 0.0, 1.0),
  vec3(0.0, 0.0, 1.0),
  vec3(0.0, 0.0, 1.0),
  vec3(0.0, 0.0, 1.0),

  vec3(-1.0, 0.0, 0.0),
  vec3(-1.0, 0.0, 0.0),
  vec3(-1.0, 0.0, 0.0),
  vec3(-1.0, 0.0, 0.0),
  vec3(-1.0, 0.0, 0.0),
  vec3(-1.0, 0.0, 0.0),

  vec3(1.0, 0.0, 0.0),
  vec3(1.0, 0.0, 0.0),
  vec3(1.0, 0.0, 0.0),
  vec3(1.0, 0.0, 0.0),
  vec3(1.0, 0.0, 0.0),
  vec3(1.0, 0.0, 0.0),

  vec3(0.0, -1.0, 0.0),
  vec3(0.0, -1.0, 0.0),
  vec3(0.0, -1.0, 0.0),
  vec3(0.0, -1.0, 0.0),
  vec3(0.0, -1.0, 0.0),
  vec3(0.0, -1.0, 0.0),

  vec3(0.0, 1.0, 0.0),
  vec3(0.0, 1.0, 0.0),
  vec3(0.0, 1.0, 0.0),
  vec3(0.0, 1.0, 0.0),
  vec3(0.0, 1.0, 0.0),
  vec3(0.0, 1.0, 0.0)
]
let cube = new Mesh(gl, vertices1, null, null, null, null, null, normals);
var lightsObj = new SceneObject(null, 'lights');

scene.addObject(lightsObj);

let dirLight = new DirectionalLight();
dirLight.ambient = vec3(0.1, 0.1, 0.1);
dirLight.diffuse = vec3(1.0, 1.0, 1.0);
dirLight.direction = vec3(-1, -1, 5);
dirLight.specular = vec3(1, 1, 1);

var pointLight_obj = new SceneObject(null, 'dirLight');
pointLight_obj.addMesh(cube);
pointLight_obj.material = new Material(vec3(0.0, 1.0, 0.0), vec3(0.0, 1.0, 0.0));
scene.addObject(pointLight_obj);

pointLight_obj.transform.position = [0.0, 0, -2.0];
pointLight_obj.transform.scale = [.1, .1, .1];

let pointLight = new PointLight();
pointLight.position = vec3(0.0, 0, -2.0);
pointLight.diffuse = vec3(1.0, 1.0, 1.0);

/* var pointLight_obj2 = new SceneObject(null, 'dirLight');
pointLight_obj2.addMesh(cube);
pointLight_obj2.material = new Material(vec3(1.0, 1.0, 1.0), vec3(1.0, 1.0, 1.0));
scene.addObject(pointLight_obj2);

pointLight_obj2.transform.position = [0.0, -3.0, 0.0];
pointLight_obj2.transform.scale = [.2, .2, .2];

let pointLight2 = new PointLight();
pointLight2.position = vec3(0.0, -3.0, 0.0);
pointLight2.diffuse = vec3(1.0, 1.0, 1.0); */

let spotLight = new SpotLight();
spotLight.direction = vec3(0, 1.0, 0.0);
spotLight.position = vec3(0.0, 2.0, -3.0);
spotLight.cutOff = 0.011;
spotLight.outerCutOff = 0.512;
spotLight.ambient = vec3(1.0, 0.1, 0.1);
lightsObj.addComponent(dirLight);
/* lightsObj.addComponent(pointLight); */
/* lightsObj.addComponent(pointLight2); */

var gameManager = new SceneObject(null, 'gm');
console.log(engine);
gameManager.onUpdate =  function(){
  handleInputs();
  inputs.clearMousePosition();
}
scene.addObject(gameManager);
scene.addCamera(camera);
engine.addScene(scene);


function main() {
  engine.doRendering(); 
}

main();
