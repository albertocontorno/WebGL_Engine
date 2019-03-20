import "./styles.css";
import {WebGLUtils} from './common/webgl-utils';
import {ShaderUtils} from './common/shadersUtils';
import * as triangleShaders from './shaders/triangleShader';
import { InputManager} from './common/inputManager';
import { Time } from './common/Time';
import { Camera } from './common/Camera';
import { Mesh } from './common/Mesh';

var inputs = new InputManager();
var time = new Time();
const at = vec3(0.0, 0.0, 0.0);
const up = vec3(0.0, 1.0, 0.0);
var errors = [];
var stop = false;

var fpsText = document.getElementById('fps');
var angleSlider = document.getElementById('angle');

const canvas = document.getElementById("app");
inputs.lockMouse(canvas);
const gl = WebGLUtils.setupWebGL(canvas);
var aspect = gl.drawingBufferWidth / gl.drawingBufferHeight;
var camera = new Camera(vec3(0, 0, 0), up, aspect, 'perspective', {}, { fov: 45, aspect: aspect, near: 0.1,  far: 100}, 25, {maxLevel:3, 0: 30, 1: 45, 2: 75, 3: 90}, 1);
ShaderUtils.setGlContext(gl);
gl.enable(gl.DEPTH_TEST);
gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
gl.clearColor(0.0, 0.0, 0.0, 1.0);

let vertices = [
  vec4(-0.5, -0.5, 0.5, 1.0),//l b 
  vec4(-0.5, 0.5, 0.5, 1.0),//l t
  vec4(0.5, -0.5, 0.5, 1.0),//r b
  vec4(0.5, 0.5, 0.5, 1.0),//r t

  vec4(-0.5, -0.5, -0.5, 1.0),//4 l b
  vec4(-0.5, 0.5, -0.5, 1.0),//5 l t
  vec4(0.5, -0.5, -0.5, 1.0),//6 r b
  vec4(0.5, 0.5, -0.5, 1.0),//7 r t
];

let indices = [
  //front
  0, 1, 2,
  2, 1, 3,
  //back
  4, 5, 6,
  6, 5, 7,
  //left
  0, 1, 4,
  4, 1, 5,
  //right
  2, 3, 6,
  6, 3, 7,
  //top
  3, 1, 7,
  7, 1, 5,
  //bottom
  2, 0, 6,
  6, 0, 4
];


//compiling vertex shader
const triangleVertexShader = ShaderUtils.loadAndCompileShader(gl.VERTEX_SHADER, triangleShaders.vertexShader);
let shaderError = ShaderUtils.checkShaderCompilingErrors(triangleVertexShader);
if (shaderError) { errors.push(shaderError)}
//compiling fragment shader
const triangleFragShader = ShaderUtils.loadAndCompileShader(gl.FRAGMENT_SHADER, triangleShaders.fragmentShader);
shaderError = ShaderUtils.checkShaderCompilingErrors(triangleFragShader);
if (shaderError) { errors.push(shaderError) }
//creating and linkng the shader program
const shaderProgram = ShaderUtils.createShaderProgramFromShaders([triangleVertexShader, triangleFragShader]);
shaderError = ShaderUtils.checkShaderProgramLinkingErrors(shaderProgram);
if (shaderError) { errors.push(shaderError) }
gl.useProgram(shaderProgram);
errors.forEach(error => console.log(error));

let VAO = gl.createVertexArray();
gl.bindVertexArray(VAO);

let VBO = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, VBO);
gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

let EBO = gl.createBuffer();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, EBO);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

let positionLoc = gl.getAttribLocation(shaderProgram, 'vPosition');
gl.vertexAttribPointer(positionLoc, 4, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(positionLoc);

let modelLoc = gl.getUniformLocation(shaderProgram, 'model');
let viewLoc = gl.getUniformLocation(shaderProgram, 'view');
let projLoc = gl.getUniformLocation(shaderProgram, 'projection');


function handleInputs(){
  if (inputs.isKeyDown(inputs.keyCodes.KEYNAMES.shift) && inputs.isKeyDown(inputs.keyCodes.KEYNAMES.w)) {
    camera.moveUp(time.deltaTime);
  } else if (inputs.isKeyDown(inputs.keyCodes.KEYNAMES.shift) && inputs.isKeyDown(inputs.keyCodes.KEYNAMES.s)){
    camera.moveDown(time.deltaTime);
  } else {
    if (inputs.isKeyDown(inputs.keyCodes.KEYNAMES.a)) {
      camera.moveLeft(time.deltaTime);
    }
    if (inputs.isKeyDown(inputs.keyCodes.KEYNAMES.s)) {
      camera.moveBackwards(time.deltaTime);
    }
    if (inputs.isKeyDown(inputs.keyCodes.KEYNAMES.d)) {
      camera.moveRight(time.deltaTime);
    }
    if (inputs.isKeyDown(inputs.keyCodes.KEYNAMES.w)) {
      camera.moveForward(time.deltaTime);
    }
  }

  if (inputs.isKeyDown(inputs.keyCodes.KEYNAMES.left_arrow)){
    angleSlider.value--;
  } else if(inputs.isKeyDown(inputs.keyCodes.KEYNAMES.right_arrow)){
    angleSlider.value++;
  }
  camera.updateCameraDirection(inputs.getMouseMovX(), inputs.getMouseMovY(), time.deltaTime);
}

function render(){

  handleInputs();
  inputs.clearMousePosition();

  let modelMatrix;
  let projMatrix = camera.getProjectionMatrix();
  //let projMatrix =  ortho(left, right, bottom, ytop, 0.1, 100);
  let traslationMatrix = translate(0.0,0, -2);
  let rotationMatrix = rotate(angleSlider.value, vec3(0,1,0));
  let viewMatrix = camera.getViewMatrix();
  modelMatrix = mult(traslationMatrix, rotationMatrix);
  gl.uniformMatrix4fv(projLoc, false, flatten(projMatrix));
  gl.uniformMatrix4fv(viewLoc, false, flatten(viewMatrix));
  gl.uniformMatrix4fv(modelLoc, false, flatten(modelMatrix));
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);
  time.subscribeFps(() => {fpsText.innerHTML = 'FPS: ' + time.frames;})
  
  if (!stop) window.requestAnimFrame(render);
}

function cleanUp(){
  gl.bindVertexArray(0);
  gl.bindBuffer(gl.ARRAY_BUFFER, 0);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, 0);
}

function main(){
  Math.radians = (degrees) => {
    var pi = Math.PI;
    return degrees * (pi / 180);
  };

  Math.clamp = function (number, min, max) {
    return Math.max(min, Math.min(number, max));
  }

  window.requestAnimFrame(render);
}

main();
