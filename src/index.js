/**
 * @author Alberto Contorno
 */
import "./styles.css";
import { WebGLUtils } from "./common/webgl-utils";
import { Engine } from "./common/Engine";
import * as triangleShaders from "./shaders/triangleShader";
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
gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
gl.clearColor(0.0, 0.0, 0.0, 1.0);
var engine = new Engine(gl, {showFps: true});
var scene = new Scene();

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

    if(inputs.isKeyDown(inputs.keyCodes.KEYNAMES.q)){
      obj3.transform.rotation[0] +=4;
      obj3.transform.rotation[1] += 5;
      obj3.transform.rotation[2] += 4;
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
var mat = new Material(vec3(0.0, 0.0,0.1), vec3(0.1, 0.0, 0.7));
mat.shininess = 256;
obj.material = mat;
obj2.material = mat;
obj3.material = mat;

var floor = new SceneObject(null, 'floor');
floor.material = new Material(vec3(0.1, 0.0,0.0), vec3(0.9, 0.1, 0.2));
floor.transform.position = [0, -0.75, 0];
floor.transform.scale = [5, 0.5, 5];
let floorMesh = new Mesh(gl, vertices1, null,
  { vertex: triangleShaders.vertexShader, fragment: triangleShaders.fragmentShader, set: false }, null, null,
  floorTextCoords, normals
);
var textureFloor = new Texture(0, null, 'src/shaders/download.jpg', gl.RGB, gl.RGB);
textureFloor.LoadTexture(gl);
floorMesh.textures.push(textureFloor);
floor.addMesh(floorMesh);


scene.addObject(floor);
scene.addObject(obj);
scene.addObject(obj2);
scene.addObject(obj3);
let cube = new Mesh(gl, vertices1, null,
  { vertex: triangleShaders.vertexShader, fragment: triangleShaders.fragmentShader, set: false }, null, null, null, normals
);
let cube2 = new Mesh(gl, vertices1, null,
  { vertex: triangleShaders.vertexShader, fragment: triangleShaders.fragmentShader, set: false }, null, null, null, normals
);
let cube3 = new Mesh(gl, vertices1, null,
  { vertex: triangleShaders.vertexShader, fragment: triangleShaders.fragmentShader, set: false }, null, null, null, normals
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

let dirLight = new DirectionalLight();
dirLight.ambient = vec3(0.0, 0.0, 0.0);
dirLight.diffuse = vec3(1.0, 1.0, 1.0);

let pointLight = new PointLight();
pointLight.position = vec3(0.0, 4.0, -7.0);
pointLight.diffuse = vec3(0.0, 0.6, 0.0);

let spotLight = new SpotLight();
spotLight.direction = vec3(0, 1.0, 0.0);
spotLight.position = vec3(0.0, 2.0, -3.0);
spotLight.cutOff = 0.011;
spotLight.outerCutOff = 0.512;
spotLight.ambient = vec3(1.0, 0.1, 0.1);
obj3.addComponent(dirLight);
obj3.addComponent(pointLight);
//obj3.addComponent(spotLight);
var gameManager = new SceneObject();
console.log(engine);
gameManager.onUpdate =  function(){
  handleInputs();
  inputs.clearMousePosition();
  obj.transform.rotation[1] += 0.1;
  obj3.transform.rotation[1] += 0.1;
}
scene.addObject(gameManager);
scene.addCamera(camera);
engine.addScene(scene);


function main() {
  engine.doRendering(); 
}

main();
