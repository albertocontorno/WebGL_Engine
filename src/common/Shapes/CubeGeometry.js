import { Geometry } from "./Geometry";
import { vec4 } from "../Utils/Vector_Matrix";

export class CubeGeometry extends Geometry{

    vertices = [
        vec4(-0.5, -0.5, 0.5, 1.0), //l b 0 0
        vec4(-0.5, 0.5, 0.5, 1.0), //l t  0 1
        vec4(0.5, -0.5, 0.5, 1.0), //r b 1 0
        vec4(0.5, 0.5, 0.5, 1.0), //r t 1 1

        vec4(-0.5, -0.5, -0.5, 1.0), //4 l b 
        vec4(-0.5, 0.5, -0.5, 1.0), //5 l t
        vec4(0.5, -0.5, -0.5, 1.0), //6 r b
        vec4(0.5, 0.5, -0.5, 1.0) //7 r t
    ];

    verticesComplete = [
        vec4(-0.5, -0.5, -0.5, 1.0),
        vec4(0.5, -0.5, -0.5, 1.0),
        vec4(0.5, 0.5, -0.5, 1.0),
        vec4(0.5, 0.5, -0.5, 1.0),
        vec4(-0.5, 0.5, -0.5, 1.0),
        vec4(-0.5, -0.5, -0.5, 1.0),

        vec4(-0.5, -0.5, 0.5, 1.0),
        vec4(0.5, -0.5, 0.5, 1.0),
        vec4(0.5, 0.5, 0.5, 1.0),
        vec4(0.5, 0.5, 0.5, 1.0),
        vec4(-0.5, 0.5, 0.5, 1.0),
        vec4(-0.5, -0.5, 0.5, 1.0),

        vec4(-0.5, 0.5, 0.5, 1.0),
        vec4(-0.5, 0.5, -0.5, 1.0),
        vec4(-0.5, -0.5, -0.5, 1.0),
        vec4(-0.5, -0.5, -0.5, 1.0),
        vec4(-0.5, -0.5, 0.5, 1.0),
        vec4(-0.5, 0.5, 0.5, 1.0),

        vec4(0.5, 0.5, 0.5, 1.0),
        vec4(0.5, 0.5, -0.5, 1.0),
        vec4(0.5, -0.5, -0.5, 1.0),
        vec4(0.5, -0.5, -0.5, 1.0),
        vec4(0.5, -0.5, 0.5, 1.0),
        vec4(0.5, 0.5, 0.5, 1.0),

        vec4(-0.5, -0.5, -0.5, 1.0),
        vec4(0.5, -0.5, -0.5, 1.0),
        vec4(0.5, -0.5, 0.5, 1.0),
        vec4(0.5, -0.5, 0.5, 1.0),
        vec4(-0.5, -0.5, 0.5, 1.0),
        vec4(-0.5, -0.5, -0.5, 1.0),

        vec4(-0.5, 0.5, -0.5, 1.0),
        vec4(0.5, 0.5, -0.5, 1.0),
        vec4(0.5, 0.5, 0.5, 1.0),
        vec4(0.5, 0.5, 0.5, 1.0),
        vec4(-0.5, 0.5, 0.5, 1.0),
        vec4(-0.5, 0.5, -0.5, 1.0)
    ];

    normalsComplete = [
        vec4(0.0, 0.0, -1.0),
        vec4(0.0, 0.0, -1.0),
        vec4(0.0, 0.0, -1.0),
        vec4(0.0, 0.0, -1.0),
        vec4(0.0, 0.0, -1.0),
        vec4(0.0, 0.0, -1.0),

        vec4(0.0, 0.0, 1.0),
        vec4(0.0, 0.0, 1.0),
        vec4(0.0, 0.0, 1.0),
        vec4(0.0, 0.0, 1.0),
        vec4(0.0, 0.0, 1.0),
        vec4(0.0, 0.0, 1.0),

        vec4(-1.0, 0.0, 0.0),
        vec4(-1.0, 0.0, 0.0),
        vec4(-1.0, 0.0, 0.0),
        vec4(-1.0, 0.0, 0.0),
        vec4(-1.0, 0.0, 0.0),
        vec4(-1.0, 0.0, 0.0),

        vec4(1.0, 0.0, 0.0),
        vec4(1.0, 0.0, 0.0),
        vec4(1.0, 0.0, 0.0),
        vec4(1.0, 0.0, 0.0),
        vec4(1.0, 0.0, 0.0),
        vec4(1.0, 0.0, 0.0),

        vec4(0.0, -1.0, 0.0),
        vec4(0.0, -1.0, 0.0),
        vec4(0.0, -1.0, 0.0),
        vec4(0.0, -1.0, 0.0),
        vec4(0.0, -1.0, 0.0),
        vec4(0.0, -1.0, 0.0),

        vec4(0.0, 1.0, 0.0),
        vec4(0.0, 1.0, 0.0),
        vec4(0.0, 1.0, 0.0),
        vec4(0.0, 1.0, 0.0),
        vec4(0.0, 1.0, 0.0),
        vec4(0.0, 1.0, 0.0)
    ];

    indices = [
        //front
        0, 1, 2,
        2, 1, 3,
        //back
        4, 5, 6,
        6, 5, 7,
        //left
        0, 1, 4,
        4, 1, 5,
        //right
        2, 3, 6,
        6, 3, 7,
        //top
        3, 1, 7,
        7, 1, 5,
        //bottom
        2, 0, 6,
        6, 0, 4
    ];
}