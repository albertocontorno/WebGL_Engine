import { Transform } from './Components/Transform';
import { registeredComponents } from './Component';

/**
 * @author Alberto Contorno
 * @class
 */
export class SceneObject{
  components = {};
  transform;
  meshes = []; //model
  children = [];
  parent;
  material;

  onStart = () => {};

  onUpdate = () => {};

  onDestroy = () => {};

  constructor(){
    this.onStart();
    this.transform =this.components['transform'] = new Transform();
  }
  
  addMesh(mesh){
    this.meshes.push(mesh);
  }

  addChild(child){
    this.children.push(child);
    child.parent = this;
  }

  render(gl, camera){
    //obj passa posizione, rotatione e scaling
    for(let mesh of this.meshes){
      let transformToRender;

      if(this.parent){
        transformToRender = Transform.summed(this.transform, this.parent.transform) 
      } else {
        transformToRender = this.transform;
      }

      mesh.render(gl, camera, transformToRender, this.type, this.material);
    }
  }

  addComponent(component){
    this.components[component.name] = component;
  }
}