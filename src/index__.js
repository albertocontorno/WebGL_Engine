import {Request} from './common/Utils/Request'
import * as Mesh from './common/Loaders/webgl-obj-loader-master/mesh'
import {initMeshBuffers} from './common/Loaders/webgl-obj-loader-master/utils'
import { WebGLUtils } from "./common/webgl-utils";
console.log(Mesh.default)
//const req = new Request('http://localhost:1234/assets/test.json');

const req = new Request('http://localhost:1234/assets/obj_mat.obj');


req.send().then( res => {
    console.log('???', res);
    let m = new Mesh.default(res);
    //initMeshBuffers(gl, m);
    console.log(m);
}) 



/* function* triangulate(elements){
    if(elements.length <= 3){ yield elements; }
    else if (elements.length == 4) {
        yield [elements[0], elements[1], elements[2]];
        yield [elements[2], elements[3], elements[0]];
    } else {
        for(let i = 0;  i<elements.length-1; i++){
            yield [elements[0], elements[i], elements[i + 1]];
        }
    }
}

let t = triangulate(['1/1/1', '2/2/2', '3/3/3', '4/4/4'])
for(let tri of t) console.log(tri) */

/* let m = new Mesh(null); */