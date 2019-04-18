import { vec2, vec3 } from "./Utils/Vector_Matrix";


/**
 * @author Alberto Contorno
 * @class
 * Class that represents a Material of a Mesh, that defines the differents components
 * of the Phong Lighting.
 */
export class Material{
    static nextId = 1;
    ambient;
    diffuse;
    specular;
    shininess;
    /**
     * Create a new Material to be used by a Mesh.
     * @param {vec3} ambient The ambient color of the object
     * @param {vec3} diffuse The diffuse color of the objcet
     * @param {vec3} diffuse The spcular color of the objcet
     * @param {float} diffuse The shininess level of the objcet (a power of 2 (eg. 32, 64 ...))
     */
    constructor(ambient, diffuse, specular, shininess){
        Material.nextId++;
        this.id = Material.nextId;
        this.ambient = ambient || vec3(0.5, 0.5, 0.5);
        this.diffuse = diffuse || vec3(0.5, 0.5, 0.5);
        this.specular = specular || vec3(0.5, 0.5, 0.5);
        this.shininess = shininess || 64;
    }
}