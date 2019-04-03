import { Light } from "./Light";
/**
 * @author Alberto Contorno
 * @class
 * Components that represents a spot light.
 */
export class SpotLight extends Light{

    constructor(diffuse, ambient, specular){
        super(diffuse, ambient, specular);
        this.name = 'SpotLight';
    }

}