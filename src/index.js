/**
 * @author Alberto Contorno
 */

import "./styles.css";
import { WebGLUtils } from "./common/webgl-utils";
import * as triangleShaders from "./shaders/triangleShader";
import { InputManager } from "./common/inputManager";
import { Camera } from "./common/Camera";
import { Mesh } from "./common/Mesh";
import { Engine } from "./common/Engine";
import { SceneObject } from "./common/Object";
import { Scene } from "./common/Scene";
import { Texture } from "./common/Texture";

var inputs = new InputManager();
//var time = new Time();
const up = vec3(0.0, 1.0, 0.0);

const canvas = document.getElementById("app");
inputs.lockMouse(canvas);
const gl = WebGLUtils.setupWebGL(canvas);
var aspect = gl.drawingBufferWidth / gl.drawingBufferHeight;
var camera = new Camera(vec3(0, 0, 0), up, 5, "perspective", {},
  { fov: 45, aspect: aspect, near: 0.1, far: 100 },
  25, { maxLevel: 3, 0: 30, 1: 45, 2: 75, 3: 90 }, 1
);
gl.enable(gl.DEPTH_TEST);
gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
gl.clearColor(0.0, 0.0, 0.0, 1.0);
var engine = new Engine(gl, {showFps: true});
var scene = new Scene();
engine.addScene(scene);
scene.addCamera(camera);

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

/* var floorTextCoords = [
  vec2(0, 0),
  vec2(0, 1),
  vec2(1, 0),
  vec2(1, 1),
  vec2(0, 0),
  vec2(0, 1),
  vec2(1, 0),
  vec2(1, 1)
]; */

var floorTextCoords = [
  vec2(0, 0),
  vec2(0, 0),//
  vec2(1,0),
  vec2(1, 0),//
  vec2(0, 1),
  vec2(0, 1),//
  vec2(1, 1),
  vec2(1, 1)//
];

let indices = [
  //front
  0,  1,  2,
  2,  1,  3,  
  //back
  4,  5,  6,
  6,  5,  7,
  //left
  0,  1,  4,
  4,  1,  5,
    //right
  2,  3,  6,  
  6,  3,  7,
  //top
  3,  1,  7,
  7,  1,  5,
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
  }

  camera.updateCameraDirection(
    inputs.getMouseMovX(),
    inputs.getMouseMovY(),
    engine.time.deltaTime
  );
}

var obj = new SceneObject();
var obj2 = new SceneObject();
var obj3 = new SceneObject();

var floor = new SceneObject();
floor.transform.position = [0, -0.75, 0];
floor.transform.scale = [5, 0.5, 5];
let floorMesh = new Mesh(gl, vertices, indices,
  { vertex: triangleShaders.vertexShader, fragment: triangleShaders.fragmentShader }, null, null,
  floorTextCoords
);
var textureFloor = new Texture(0, null, 'src/shaders/download.jpg', gl.RGB, gl.RGB);
textureFloor.LoadTexture(gl);
floorMesh.textures.push(textureFloor);
floor.addMesh(floorMesh);


scene.addObject(floor);
scene.addObject(obj);
scene.addObject(obj2);
scene.addObject(obj3);
let cube = new Mesh(gl, vertices, indices,
  { vertex: triangleShaders.vertexShader, fragment: triangleShaders.fragmentShader },
);
let cube2 = new Mesh(gl, vertices, indices,
   { vertex: triangleShaders.vertexShader, fragment: triangleShaders.fragmentShader },
);
let cube3 = new Mesh(gl, vertices, indices,
  { vertex: triangleShaders.vertexShader, fragment: triangleShaders.fragmentShader }
);

obj.addMesh(cube);
obj.transform.rotation = [0, 0, 0];

obj2.addMesh(cube2);
obj2.transform.position = [2, 0, 0];
obj2.transform.rotation = [0, 50, 0];
obj3.addMesh(cube3);

obj2.addChild(obj3);
obj3.transform.position = [-1, 0, -2];
obj3.transform.scale = [1, 1, 2];
//obj.addMesh(cube3);
console.log(engine);

var gameManager = new SceneObject();
gameManager.onUpdate =  function(){
  handleInputs();
  inputs.clearMousePosition();
  obj.transform.rotation[1] += 0.1;
}
scene.addObject(gameManager);


function main() {
  engine.doRendering(); 
}

main();
