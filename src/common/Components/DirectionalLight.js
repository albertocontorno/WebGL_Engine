import { Light } from "./Light";
import { vec3 } from "../Utils/Vector_Matrix";
/**
 * @author Alberto Contorno
 * @class
 * Components that represents a directional global light.
 */
export class DirectionalLight extends Light{

    direction;

    constructor(diffuse, ambient, specular, direction){
        super(diffuse, ambient, specular);
        this.name = 'DirectionalLight';
        this.direction = direction || vec3(1,-1,0);
    }

    static getDirectionForShader(){
        return 'vec3 lightDir = normalize(-light.direction);';
    }

}