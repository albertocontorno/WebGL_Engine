import {Component} from '../Component';
import { SceneObject } from '../Object';
import { Scene } from '../Scene';

const lightTypes = {
    DirectionalLight: 'DIRECTIONAL_LIGHT',
    PointLight: 'POINTLIGHT',
    SpotLight: 'SPOTLIGHT'
}
/**
 * @author Alberto Contorno
 * @class
 * Components that makes the object to which it is attached a source light.
 */
export class Light extends Component{

    

    diffuse = [1, 1, 1];
    ambient = [0.5, 0.5, 0.5];
    specular = [0.5, 0.5, 0.5];
    /**
     * 
     * @param {vec3} diffuse Diffuse component of the light
     * @param {vec3} ambient Ambient component of the light
     * @param {vec3} specular Specular component of the light
     */
    constructon(diffuse, ambient, specular){
        this.name = 'Light';
        console.log("DIFFUSEE?? ", diffuse)
        this.diffuse = diffuse;
        this.ambient = ambient;
        this.specular = specular;
    }

    /**
     * 
     * @param {SceneObject} parent 
     * @param {Scene} scene 
     */
    onAfterAdded(parent, scene){
        scene.registerLight(lightTypes[this.constructor.name], this);
    }
}