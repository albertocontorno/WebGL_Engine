import {Component} from '../Component';
import { SceneObject } from '../Object';
import { Scene } from '../Scene';
import { LightTypes } from '../Utils/constants';
import { vec3 } from "../Utils/Vector_Matrix";
const lightTypes = LightTypes;
/**
 * @author Alberto Contorno
 * @class
 * Components that makes the object to which it is attached a source light.
 */
export class Light extends Component{
    static nextId = 1;
    id;
    diffuse = vec3(1.0, 1.0, 1.0);
    ambient = vec3(0.1, 0.1, 0.1);
    specular = vec3(1.0, 1.0, 1.0);
    /**
     * 
     * @param {vec3} diffuse Diffuse component of the light
     * @param {vec3} ambient Ambient component of the light
     * @param {vec3} specular Specular component of the light
     */
    constructon(diffuse, ambient, specular){
        this.id = Light.nextId;
        Light.nextId++;
        this.name = 'Light';
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

    onAfterRemoved(parent, scene){
        scene.unregisterLight(lightTypes[this.constructor.name], this);
    }
}