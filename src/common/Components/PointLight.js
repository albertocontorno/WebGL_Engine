import { Light } from "./Light";
/**
 * @author Alberto Contorno
 * @class
 * Components that represents a point light.
 */
export class PointLight extends Light{

    constant;
    linear;
    quadratic;

    constructor(diffuse, ambient, specular, constant, linear, quadratic){
        super();
        this.name = 'PointLight';
        this.constant = constant;
        this.linear = linear;
        this.quadratic = quadratic;
    }
}