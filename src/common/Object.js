import { Transform } from './Components/Transform';
import { registeredComponents, Component } from './Component';

/**
 * @author Alberto Contorno
 * @class
 */
export class SceneObject{
  static nextId = 0;
  id;
  scene;
  components = {};
  transform;
  meshes = []; //model
  children = [];
  parent;
  material;

  onStart = () => {};

  onUpdate = () => {};

  onDestroy = () => {};

  constructor(startCallback){
    SceneObject.nextId++;
    this.id = SceneObject.nextId;
    this.onStart = startCallback;
    this.transform = this.components['transform'] = new Transform(this);
  }
  
  addMesh(mesh){
    for (let m of this.meshes) {
      if (m.id === mesh.id) {
        console.warning('[WARNING - Object](addMesh) - Added mesh is already present.');
        return;
      }
    }
    this.meshes.push(mesh);
  }

  addChild(child){
    this.children.push(child);
    child.parent = this;
  }

  render(gl, camera){
    //obj passes position, rotation and scaling
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

  /**
   * 
   * @param {Component} component 
   */
  addComponent(component){
    this.components[component.name] = component;
    component.parent = this;
    component.onAfterAdded(this, this.scene);
  }
}