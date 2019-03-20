/**
 * @author Alberto Contorno
 * @class
 */
export class Scene{
  objects = [];
  objectsMap = {};
  cameras = [];
  mainCamera;

  addCamera(camera){
    this.cameras.push(camera);
    if(!this.mainCamera){
      this.mainCamera = camera;
    }
  }

  setMainCamera(camera){
    this.mainCamera = camera;
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