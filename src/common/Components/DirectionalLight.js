import { Light } from "./Light";
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
        this.direction = direction;
    }

    getDirectionForShader(){
        return 'vec3 lightDir = normalize(-light.direction);';
    }
}