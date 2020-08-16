import {subtract, scale, normalize, vec3} from './Vector_Matrix';

const toVec3 = (v) => {return vec3(v[0], v[1], v[2])}

export function generateTangents(verteces, texcoords, indices) {

    const numFaces = verteces.length / 3;
    const tangents = [];
    for (let i = 0; i < numFaces; i++) {

        const p1 = toVec3(verteces[i]);
        const p2 = toVec3(verteces[i+1]);
        const p3 = toVec3(verteces[i+2]);

        const uv1 = texcoords[i];
        const uv2 = texcoords[i+1];
        const uv3 = texcoords[i+2];

        const edge1  = subtract(p2, p1);
        const edge2 = subtract(p3, p1);

        const deltaUV1 = subtract(uv2, uv1);
        const deltaUV2 = subtract(uv3, uv1);


        const f = 1.0 / (deltaUV1[0] * deltaUV2[1] - deltaUV2[0] * deltaUV1[1]);
        const tangent = Number.isFinite(f)
        ? normalize(scale(f, subtract(
            scale(deltaUV2[1], edge1),
            scale(deltaUV1[1], edge2),
            )))
        : [1, 0, 0];

        tangents.push(...tangent, ...tangent, ...tangent);
    }

    return tangents;
}