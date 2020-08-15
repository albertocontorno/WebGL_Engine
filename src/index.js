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
import { Time } from "./common/Time";

var inputs = new InputManager();

const up = vec3(0.0, 1.0, 0.0);

const canvas = document.getElementById("app");
inputs.lockMouse(canvas);
const gl = WebGLUtils.setupWebGL(canvas);
var aspect = gl.drawingBufferWidth / gl.drawingBufferHeight;
var camera = new Camera(vec3(0, 0, 0), up, 5, "perspective", {},
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
gl.clearColor(0.0, 0.0, 0.0, 1.0);
var engine = new Engine(gl, {showFps: true});
var scene = new Scene();

const req = new Request('http://localhost:1234/assets/windmill.obj');
const reqMtl = new Request('http://localhost:1234/assets/windmill.mtl');

Promise.all([req.send(), reqMtl.send()]).then( res => {
  const obj = res[0];
  const mat = res[1];
  
  const loader = new ObjLoader();
  let m = loader.parse(obj);
  console.log(m);
  let o = new SceneObject(null, 'test load');
  const mtl = loader.parseMTL(mat);
  console.log(mtl);
  m.geometries.forEach( g => {
    let oo = new SceneObject(null, 'test load');
    
    let verts = [];
    let verts_n = [];
    let colors;
    let data = g.data;
    for(let i = 0; i<data.position.length-2; i+=3){
      verts.push(vec4(data.position[i], data.position[i+1], data.position[i+2], 1.0));
      verts_n.push(vec3(data.normal[i], data.normal[i+1], data.normal[i+2]));
    }
    if(data.color){
      colors = [];
      for(let i = 0; i<data.color.length-2; i+=3){
        colors.push(vec4(data.color[i], data.color[i+1], data.color[i+2], 1.0));
      }
    }

    oo.addMesh(new Mesh(gl, verts, null, null, null, null, null, verts_n, colors));
    oo.parent = o;
    scene.addObject(oo);
    let ooMat = mtl[g.material]

    oo.material = new Material(ooMat.ambient, ooMat.diffuse, ooMat.specular, ooMat.shininess);
  });


  o.transform.position = [-2,3,0];
  //o.transform.scale = [.5,.5,.5]
  scene.addObject(o);
  //initMeshBuffers(gl, m);


})



let vertices = [
  vec4(-0.5, -0.5, 0.5, 1.0), //l b 0 0
  vec4(-0.5, 0.5, 0.5, 1.0), //l t  0 1
  vec4(0.5, -0.5, 0.5, 1.0), //r b 1 0
  vec4(0.5, 0.5, 0.5, 1.0), //r t 1 1

  vec4(-0.5, -0.5, -0.5, 1.0), //4 l b 
  vec4(-0.5, 0.5, -0.5, 1.0), //5 l t
  vec4(0.5, -0.5, -0.5, 1.0), //6 r b
  vec4(0.5, 0.5, -0.5, 1.0) //7 r t
];

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

var normals1 = [
  vec3(0.0, 0.0, 1.0),
  vec3(0.0, 0.0, 1.0),
  vec3(0.0, 0.0, 1.0),
  vec3(0.0, 0.0, 1.0),
  vec3(0.0, 0.0, 1.0),
  vec3(0.0, 0.0, 1.0),

  vec3(0.0, 0.0, -1.0),
  vec3(0.0, 0.0, -1.0),
  vec3(0.0, 0.0, -1.0),
  vec3(0.0, 0.0, -1.0),
  vec3(0.0, 0.0, -1.0),
  vec3(0.0, 0.0, -1.0),

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

  vec3(0.0, 1.0, 0.0),
  vec3(0.0, 1.0, 0.0),
  vec3(0.0, 1.0, 0.0),
  vec3(0.0, 1.0, 0.0),
  vec3(0.0, 1.0, 0.0),
  vec3(0.0, 1.0, 0.0),

  vec3(0.0, -1.0, 0.0),
  vec3(0.0, -1.0, 0.0),
  vec3(0.0, -1.0, 0.0),
  vec3(0.0, -1.0, 0.0),
  vec3(0.0, -1.0, 0.0),
  vec3(0.0, -1.0, 0.0)
]

var floorTextCoords = [
  vec2(0, 0),
  vec2(1, 0),
  vec2(1,1),//
  vec2(1, 1),
  vec2(0, 1),
  vec2(0, 0),//

  vec2(0, 0),
  vec2(1, 0),
  vec2(1, 1),//
  vec2(1, 1),
  vec2(0, 1),
  vec2(0, 0),//

  vec2(0, 0),
  vec2(1, 0),
  vec2(1, 1),//
  vec2(1, 1),
  vec2(0, 1),
  vec2(0, 0),//

  vec2(0, 0),
  vec2(1, 0),
  vec2(1, 1),//
  vec2(1, 1),
  vec2(0, 1),
  vec2(0, 0),//

  vec2(0, 0),
  vec2(1, 0),
  vec2(1, 1),//
  vec2(1, 1),
  vec2(0, 1),
  vec2(0, 0),//
  
  vec2(0, 0),
  vec2(1, 0),
  vec2(1, 1),//
  vec2(1, 1),
  vec2(0, 1),
  vec2(0, 0),//
];

let indices = [
  //front
  0,  2,  1,
  2,  3,  1,  
  //back
  4,  5,  6,
  6,  5,  7,
  //left
  0,  1,  4,
  4,  1,  5,
    //right
  2,  6,  3,  
  6,  7,  3,
  //top
  3,  7,  1,
  7,  5,  1,
  //bottom
  2,  0,  6,
  6,  0,  4
];

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
      pointLight.position[0] = 4 * Math.sin(engine.time.time);

      pointLight_obj.transform.position[2] = 4 * Math.cos(engine.time.time);
      pointLight.position[2] = 4 * Math.cos(engine.time.time);
    } 
  }

  camera.updateCameraDirection(
    inputs.getMouseMovX(),
    inputs.getMouseMovY(),
    engine.time.deltaTime
  );
}

var obj = new SceneObject(null, 'obj');
var obj2 = new SceneObject(null, 'obj2');
var obj3 = new SceneObject(null, 'obj3');
var lightsObj = new SceneObject(null, 'lights');
var robotBody = new SceneObject(null, 'robotBody');
var robotUpperArm = new SceneObject(null, 'robotUpperArm');
var robotLowerArm = new SceneObject(null, 'robotLowerArm');

var mat = new Material(vec3(0.0, 0.0,0.1), vec3(0.1, 0.0, 0.7));
mat.shininess = 256;
obj.material = mat;
obj2.material = mat;
obj3.material = mat;

robotBody.material = new Material(vec3(0.2, 0.0,0.0), vec3(0.9, 0.1, 0.2));
robotUpperArm.material = mat;
robotLowerArm.material = mat;

var floor = new SceneObject(null, 'floor');
floor.material = new Material(vec3(0.2, 0.0,0.0), vec3(0.9, 0.1, 0.2));
floor.transform.position = [0, -0.75, 0];
floor.transform.scale = [5, 0.5, 5];
let floorMesh = new Mesh(gl, vertices1, null, null, null, null,  floorTextCoords, normals);
var textureFloor = new Texture(0, null, 'assets/download.jpg', gl.RGB, gl.RGB);
textureFloor.LoadTexture(gl);
floorMesh.textures.DIFFUSE_MAP = textureFloor;
floor.addMesh(floorMesh);

scene.addObject(floor);
scene.addObject(obj);
scene.addObject(obj2);
scene.addObject(obj3);
scene.addObject(robotBody);
scene.addObject(robotUpperArm);
scene.addObject(robotLowerArm);
scene.addObject(lightsObj);

let cube = new Mesh(gl, vertices1, null, null, null, null, null, normals);
let cube2 = new Mesh(gl, vertices1, null, null, null, null, null, normals);
let cube3 = new Mesh(gl, vertices1, null, null, null, null, null, normals);

obj.addMesh(cube);
obj.transform.rotation = [0, 0, 0];

obj2.addMesh(cube2);
obj2.transform.position = [2, 0, 0];
obj2.transform.rotation = [0, 50, 0];
obj3.addMesh(cube3);

obj2.addChild(obj3);
obj3.transform.position = [-1, 0, -3];
obj3.transform.scale = [1, 1, 2];
//obj.addMesh(cube3);

robotBody.addMesh(cube3);
robotBody.addChild(robotLowerArm);
robotBody.transform.position = [1, 2, 0];
robotBody.transform.rotation = [0, 30, 0];
robotLowerArm.addMesh(cube3);
robotLowerArm.addChild(robotUpperArm);
robotLowerArm.transform.position = [0, 1, 0];
robotLowerArm.transform.scale = [0.5, 1, 0.5];
robotLowerArm.transform.rotation = [0, 30, 0];
robotUpperArm.addMesh(cube3);
robotUpperArm.transform.position = [0, 1, 0];
robotUpperArm.transform.scale = [0.3, 1, 0.3];

let dirLight = new DirectionalLight();
dirLight.ambient = vec3(0.1, 0.1, 0.1);
dirLight.diffuse = vec3(1.0, 1.0, 1.0);

var pointLight_obj = new SceneObject(null, 'dirLight');
pointLight_obj.material = new Material(vec3(1.0, 1.0, 1.0), vec3(1.0, 1.0, 1.0));
scene.addObject(pointLight_obj);
pointLight_obj.addMesh(cube);
pointLight_obj.transform.position = [0.0, 4.0, -7.0];
pointLight_obj.transform.scale = [.2, .2, .2];

let pointLight = new PointLight();
pointLight.position = vec3(0.0, 4.0, -7.0);
pointLight.diffuse = vec3(1.0, 1.0, 1.0);

var pointLight_obj2 = new SceneObject(null, 'dirLight');
pointLight_obj2.material = new Material(vec3(1.0, 1.0, 1.0), vec3(1.0, 1.0, 1.0));
scene.addObject(pointLight_obj2);
pointLight_obj2.addMesh(cube);
pointLight_obj2.transform.position = [0.0, -3.0, 0.0];
pointLight_obj2.transform.scale = [.2, .2, .2];

let pointLight2 = new PointLight();
pointLight2.position = vec3(0.0, -3.0, 0.0);
pointLight2.diffuse = vec3(1.0, 1.0, 1.0);

let spotLight = new SpotLight();
spotLight.direction = vec3(0, 1.0, 0.0);
spotLight.position = vec3(0.0, 2.0, -3.0);
spotLight.cutOff = 0.011;
spotLight.outerCutOff = 0.512;
spotLight.ambient = vec3(1.0, 0.1, 0.1);
lightsObj.addComponent(dirLight);
lightsObj.addComponent(pointLight);
lightsObj.addComponent(pointLight2);
//obj3.addComponent(spotLight);
var gameManager = new SceneObject(null, 'gm');
console.log(engine);
gameManager.onUpdate =  function(){
  handleInputs();
  inputs.clearMousePosition();
  //obj.transform.rotation[1] += 0.1;
}
scene.addObject(gameManager);
scene.addCamera(camera);
engine.addScene(scene);


function main() {
  engine.doRendering(); 
}

main();
