import { Light } from "./Light";
import { vec3 } from "../Utils/Vector_Matrix";
/**
 * @author Alberto Contorno
 * @class
 * Components that represents a point light.
 */
export class PointLight extends Light{
    position
    constant;
    linear;
    quadratic;

    constructor(diffuse, ambient, specular, position, constant, linear, quadratic){
        super();
        this.name = 'PointLight';
        this.constant = constant || 1.0;
        this.linear = linear || 0.09;
        this.quadratic = quadratic || 0.032;
        this.position = position || vec3(0, 5, 0);
    }

}