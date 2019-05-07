import { SceneObject } from "./Object";
import { Camera } from "./Camera";
import { ShaderFactory } from "../shaders/ShaderFactory";
import { Shader } from "./Shader";
import { ShaderProgram } from "./ShaderProgram";
import { EmptyTexture, LightTypes } from "./Utils/constants";
import { Texture } from "./Texture";
/**
 * @author Alberto Contorno
 * @class
 * Class that represents a Scene. 
 * A Scene is a container to render and manage objects.
 * Moreover it has an array of cameras that can be used, of which, one is the main camera used to render.
 */
export class Scene{
  static nextId = 1;
  id;
  objects = [];
  objectsMap = {};
  cameras = [];
  mainCamera;
  lights = [];
  lightsTypes = {};
  defaultShaders = {vertex: null, fragment: null, program: null};
  defaultLocations = {};
  emptyTextures;
  engine;

  constructor(){
    Scene.nextId++;
    this.id = Scene.nextId;
  }

  onAfterSceneAdded(engine){
    this.engine = engine;
    this.setupDefaultShaders();
  }

  /**
   * 
   * @param {Camera} camera 
   */
  addCamera(camera){
    for(let cam of this.cameras){
      if(cam.id === camera.id){
        console.warn('[WARNING - SCENE](addCamera) - Added camera is already present.');
        return;
      }
    }
    this.cameras.push(camera);
    if(!this.mainCamera){
      this.mainCamera = camera;
    }
  }

  /**
   * 
   * @param {Camera} camera 
   */
  setMainCamera(camera){
    this.mainCamera = camera;
    let alreadyPresent = false;
    for (let cam of this.cameras) {
      if (cam.id === camera.id) {
        alreadyPresent = true;
        break;
      }
    }
    if(!alreadyPresent){
      this.cameras.push(camera);
    }
  }

  /**
   * 
   * @param {SceneObject} obj 
   */
  addObject(obj){
    this.objects.push(obj);
    obj.scene = this;
    this.objectsMap[obj.id] = this.objects.length - 1;
  }

  /**
   * 
   * @param {SceneObject} obj 
   */
  removeObject(obj){
    if(typeof obj === 'object'){
      if (this.objectsMap[this.objectsMap[obj.id]] != null){
        this.objects[this.objectsMap[obj.id]] = null;
        this.objectsMap[this.objectsMap[obj.id]] = null;
      }
    } else if (typeof obj === 'number'){
      if (this.objects[obj] != null){
        this.objects[obj] = null;
      }
    }
  }

  registerLight(type, light){
    this.lights.push({ parentObj: light.parent, type, light });
    this.lightsTypes[type] = this.lightsTypes[type] ? this.lightsTypes[type] + 1 : 1;
    // TODO Recompute shader
  }

  unregisterLight(type, light){
    if (!light){
      console.warn('[WARNING - SCENE](unregisterLight) - Trying to unregister a light but no light is provided.')
    }
    let lightIndex = this.lights.findIndex( el => el.id = light.id);
    if (lightIndex >= 0){
      this.lights[lightIndex].parentObj = null;
      this.lights[lightIndex].light = null;
      this.lightsTypes[type] = this.lightsTypes[type] ? this.lightsTypes[type] - 1 : 0;
      this.lights.splice(lightIndex, 1);
      //TODO Recompute shader
    } else {
      console.warn('[WARNING - SCENE](unregisterLight) - Trying to unregister a light that is not registered into the scene.');
    }
  }

  renderScene(gl){
    for (let obj of this.objects) {
      obj.onUpdate();
      obj.render(gl, this.mainCamera, this.lights, this.defaultShaders, this.defaultLocations);
    }
  }

  setupDefaultShaders(){
    let gl = this.engine.gl;
    let et = EmptyTexture;
    this.emptyTextures = {};
    this.emptyTextures[0] = new Texture(0, null, null, gl[et.srcFormat], gl[et.internalFormat]);
    this.emptyTextures[0].CreateTextureFromArray(gl);
    this.emptyTextures[1] = new Texture(1, null, null, gl[et.srcFormat], gl[et.internalFormat]);
    this.emptyTextures[1].CreateTextureFromArray(gl);
    this.emptyTextures[2] = new Texture(2, null, null, gl[et.srcFormat], gl[et.internalFormat]);
    this.emptyTextures[2].CreateTextureFromArray(gl);

    let shaders = {};
    shaders.vertex = new Shader(gl, 'vertex', 
      ShaderFactory.CreateVertexShaderFromSources({lights: this.lights, lightsTypes: this.lightsTypes}));
    if (shaders.vertex.errors.lenght > 0) {
      //this.destroyShader(this.shaders.fragment, gl);
      console.error('error vertex', shaders.vertex.errors);
      return;
    }
    

    shaders.fragment = new Shader(gl, 'fragment',
      ShaderFactory.CreateFragmentShaderFromSources({ lights: this.lights, lightsTypes: this.lightsTypes }));
    if (shaders.fragment.errors.lenght > 0) {
      //this.destroyShader(this.shaders.fragment);
      console.error("error fragment", shaders.fragment.errors);
      return;
    }

    let shadersArr = [];
    for (let key in shaders) {
      if (key !== 'program') { shadersArr.push(shaders[key].shader); }
    }

    shaders.program = new ShaderProgram(gl, shadersArr);
    if (shaders.program.errors.length > 0) {
      //this.destroyProgram(this.shaders.program, this.engine.gl);
      console.error('error in linking program', shaders.program.errors);
      //return;
    }

    this.defaultShaders = shaders;
    this.setupLocations(gl);
    console.log("SCENE DEFAULT SHADERS", this.defaultShaders, this.emptyTextures);
  }

  setupLocations(gl){
    //vertex
    this.defaultLocations.modelLoc = gl.getUniformLocation(this.defaultShaders.program.program, 'model');
    this.defaultLocations.viewLoc = gl.getUniformLocation(this.defaultShaders.program.program, 'view');
    this.defaultLocations.projLoc = gl.getUniformLocation(this.defaultShaders.program.program, 'projection');
    //fragment

    //uniform sampler2D mainTexture;
    this.defaultLocations.viewPosLoc = gl.getUniformLocation(this.defaultShaders.program.program, 'viewPos');
    this.defaultLocations.materialLocs = {};
    this.defaultLocations.materialLocs.ambient = gl.getUniformLocation(this.defaultShaders.program.program, 'material.ambient');
    this.defaultLocations.materialLocs.diffuse = gl.getUniformLocation(this.defaultShaders.program.program, 'material.diffuse');
    this.defaultLocations.materialLocs.specular = gl.getUniformLocation(this.defaultShaders.program.program, 'material.specular');
    this.defaultLocations.materialLocs.shininess = gl.getUniformLocation(this.defaultShaders.program.program, 'material.shininess');
    if(this.lights && this.lights.length > 0){
      this.defaultLocations.lights = [];
      for (let i = 0; i < this.lights.length; i++) {
        if (this.lights[i].type == LightTypes.DirectionalLight) {
          this.defaultLocations.lights.push(this.getDirectionalLightLocations(gl, 'light' + i));
        } else if (this.lights[i].type == LightTypes.PointLight) {
          this.defaultLocations.lights.push(this.getPointLightLocations(gl, 'light' + i));
        } else if (this.lights[i].type == LightTypes.SpotLight) {
          this.defaultLocations.lights.push(this.getSpotLightLocations(gl, 'light' + i));
        }
      }
    }
    
    console.log("LOCATIONS", this.defaultLocations);
  }

  getDirectionalLightLocations(gl, lightName){
    let lightLocs = {type: LightTypes.DirectionalLight};
    lightLocs.ambient = gl.getUniformLocation(this.defaultShaders.program.program, lightName+'.ambient');
    lightLocs.diffuse = gl.getUniformLocation(this.defaultShaders.program.program, lightName +'.diffuse');
    lightLocs.specular = gl.getUniformLocation(this.defaultShaders.program.program, lightName +'.specular');
    lightLocs.direction = gl.getUniformLocation(this.defaultShaders.program.program, lightName +'.direction');
    return lightLocs;
  }

  getPointLightLocations(gl, lightName){
    let lightLocs = { type: LightTypes.PointLight };
    lightLocs.position = gl.getUniformLocation(this.defaultShaders.program.program, lightName + '.position');
    lightLocs.ambient = gl.getUniformLocation(this.defaultShaders.program.program, lightName + '.ambient');
    lightLocs.diffuse = gl.getUniformLocation(this.defaultShaders.program.program, lightName + '.diffuse');
    lightLocs.specular = gl.getUniformLocation(this.defaultShaders.program.program, lightName + '.specular');
    lightLocs.constant = gl.getUniformLocation(this.defaultShaders.program.program, lightName + '.constant');
    lightLocs.linear = gl.getUniformLocation(this.defaultShaders.program.program, lightName + '.linear');
    lightLocs.quadratic = gl.getUniformLocation(this.defaultShaders.program.program, lightName + '.quadratic');
    return lightLocs;
  }

  getSpotLightLocations(gl, lightName){
    let lightLocs = { type: LightTypes.SpotLight };
    lightLocs.position = gl.getUniformLocation(this.defaultShaders.program.program, lightName + '.position');
    lightLocs.ambient = gl.getUniformLocation(this.defaultShaders.program.program, lightName + '.ambient');
    lightLocs.diffuse = gl.getUniformLocation(this.defaultShaders.program.program, lightName + '.diffuse');
    lightLocs.specular = gl.getUniformLocation(this.defaultShaders.program.program, lightName + '.specular');
    lightLocs.constant = gl.getUniformLocation(this.defaultShaders.program.program, lightName + '.constant');
    lightLocs.linear = gl.getUniformLocation(this.defaultShaders.program.program, lightName + '.linear');
    lightLocs.quadratic = gl.getUniformLocation(this.defaultShaders.program.program, lightName + '.quadratic');
    lightLocs.cutOff = gl.getUniformLocation(this.defaultShaders.program.program, lightName + '.cutOff');
    lightLocs.outerCutOff = gl.getUniformLocation(this.defaultShaders.program.program, lightName + '.outerCutOff');
    lightLocs.direction = gl.getUniformLocation(this.defaultShaders.program.program, lightName + '.direction');
    return lightLocs;
  }

}