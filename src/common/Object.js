import { Transform } from './Components/Transform';
import { registeredComponents, Component } from './Component';
import { Camera } from './Camera';

/**
 * @author Alberto Contorno
 * @class
 */
export class SceneObject{
  static nextId = 1;
  id;
  scene;
  components = {};
  transform;
  meshes = []; //model
  children = [];
  parent;
  material;
  name;

  onStart = () => {};

  onUpdate = () => {};

  onDestroy = () => {};

  constructor(startCallback, name){ 
    this.name =name;
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

  getTransformToRender(){
    let transformToRender;
    if (this.parent) {
      transformToRender = Transform.summed(this.transform, this.parent.getTransformToRender())
    } else {
      transformToRender = this.transform;
    }

    return transformToRender;
  }

  /**
   * 
   * @param {GL_CONTEXT} gl 
   * @param {Camera} camera 
   * @param {*} lights 
   */
  render(gl, camera, lights, lightsTypes){
    //obj passes position, rotation and scaling
    for(let mesh of this.meshes){
      let transformToRender = this.getTransformToRender();
      mesh.render(gl, camera, this, this.type, this.material, lights, lightsTypes, this.name);
      //mesh.renderDefault(gl, camera, this, this.type, this.material, lights, defaultShader, locs)
    }
  }

  /**
   * 
   * @param {Component} component 
   */
  addComponent(component){
    if (!component) {
      console.warn('[WARNING - SCENE_OBJECT](addComponent) - Trying to add a component but no component provided.');
      return;
    }
    this.components[component.name] = component;
    component.parent = this;
    component.onAfterAdded(this, this.scene);
  }

  /**
   * 
   * @param {Component} component 
   */
  removeComponent(component){
    if(!component){
      console.warn('[WARNING - SCENE_OBJECT](addComponent) - Trying to add a component but no component provided.');
      return;
    }
    this.components[component.name] = null;
    component.parent = null;
    component.onAfterRemoved(this, this.scene);
  }

}