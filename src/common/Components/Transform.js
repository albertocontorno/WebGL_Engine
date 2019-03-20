import { Component} from '../Component';

/**
 * @author Alberto Contorno
 * @class
 */
export class Transform extends Component{
    position;
    rotation;
    scale;

    constructor(position, rotation, scale){
        super();
        this.name = 'transform';
        this.position = position || [0, 0, 0];
        this.rotation = rotation || [0, 0, 0];
        this.scale = scale || [1, 1, 1];
    }

    static summed(t1, t2){
        if(t1 == null || t2 == null){ return null; }
        let transform = new Transform();

        transform.position[0] = t1.position[0] + t2.position[0];
        transform.position[1] = t1.position[1] + t2.position[1];
        transform.position[2] = t1.position[2] + t2.position[2];

        transform.rotation[0] = t1.rotation[0] + t2.rotation[0];
        transform.rotation[1] = t1.position[1] + t2.rotation[1];
        transform.rotation[2] = t1.position[2] + t2.rotation[2];

        transform.scale[0] = t1.scale[0] * t2.scale[0];
        transform.scale[1] = t1.scale[1] * t2.scale[1];
        transform.scale[2] = t1.scale[2] * t2.scale[2];

        return transform;
    }
}