import {vec2, vec3, vec4} from "./Vector_Matrix";

export const LightTypes = {
    DirectionalLight: 'DIRECTIONAL_LIGHT',
    PointLight: 'POINTLIGHT',
    SpotLight: 'SPOTLIGHT'
}

export const EmptyTexture = {
    level: 0,
    width:1,
    height: 1,
    border: 0,
    srcFormat: 'RGBA',
    internalFormat: 'RGBA',
    srcType: 'UNSIGNED_BYTE',
    pixels: new Uint8Array([255, 255, 255, 255])
}
export const DefTextCoords = vec2(0,0);
