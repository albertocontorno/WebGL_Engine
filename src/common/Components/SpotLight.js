import { Light } from "./Light";
import { vec3 } from "../Utils/Vector_Matrix";
/**
 * @author Alberto Contorno
 * @class
 * Components that represents a spot light.
 */
export class SpotLight extends Light{
    position;
    cutOff;
    outerCutOff;
    constant;
    linear;
    quadratic;
    direction;

    constructor(diffuse, ambient, specular, position, constant, linear, quadratic, cutOff, outerCutOff, direction){
        super(diffuse, ambient, specular);
        this.name = 'SpotLight';
        this.constant = constant || 1.0;
        this.linear = linear || 0.09;
        this.quadratic = quadratic || 0.032;
        this.cutOff = cutOff || 0.4;
        this.outerCutOff = outerCutOff || 0.5;
        this.direction = direction || vec3(1, -1, 0);
        this.position = position || vec3(0,0,0);
    }

}