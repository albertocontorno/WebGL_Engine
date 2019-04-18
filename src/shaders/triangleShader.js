export const vertexShader = `#version 300 es
in vec4 vPosition;
in vec2 textCoords;

uniform mat4 view;
uniform mat4 model;
uniform mat4 projection;

out vec4 color;
out vec2 textCoord;
void main(){
    gl_Position = projection * view * model * vPosition;
    vec4 newPosition = vPosition;
    if(vPosition.x <= 0.0 && vPosition.y <= 0.0 && vPosition.z <=0.0){
        newPosition = vec4(1.0,1.0,1.0,1.0);
    }
    color = newPosition;
    textCoord = textCoords;
}
`;

export const fragmentShader = `#version 300 es
precision mediump float;
in vec4 color;
in vec3 fNormal;
in vec2 textCoord;
out vec4 fragColor;
uniform sampler2D texture0;
void main(){
    vec4 tColor = texture(texture0, textCoord);
    /*if(tColor.x == 0.0 && tColor.y == 0.0 && tColor.z == 0.0){
        tColor.x = 1.0;
        tColor.y = 1.0;
        tColor.z = 1.0;
    }*/
    tColor.a = 1.0;
    
    fragColor = tColor  * color;
}
`;
