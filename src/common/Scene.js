import { SceneObject } from "./Object";
import { Camera } from "./Camera";

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
    //this.setupDefaultShaders();
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
      obj.render(gl, this.mainCamera, this.lights, this.lightsTypes);
    }
  }


}