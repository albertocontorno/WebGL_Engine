/**
 * @author Alberto Contorno
 * @class
 * Class that represents a Scene. 
 * A Scene is a container to render and manage objects.
 * Moreover it has an array of cameras that can be used, of which, one is the main camera used to render.
 */
export class Scene{
  static nextId = 0;
  id;
  objects = [];
  objectsMap = {};
  cameras = [];
  mainCamera;

  constructor(){
    Scene.nextId++;
    this.id = Scene.nextId;
  }

  addCamera(camera){
    for(let cam of this.cameras){
      if(cam.id === camera.id){
        console.warning('[WARNING - SCENE](addCamera) - Added camera is already present.');
        return;
      }
    }
    this.cameras.push(camera);
    if(!this.mainCamera){
      this.mainCamera = camera;
    }
  }

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

  addObject(obj){
    this.objects.push(obj);
    this.objectsMap[obj.id] = this.objects.length - 1;
  }

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

}