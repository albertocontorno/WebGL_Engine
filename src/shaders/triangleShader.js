export const vertexShader = `#version 300 es
in vec4 vPosition;
uniform mat4 view;
uniform mat4 model;
uniform mat4 projection;
out vec4 color;
void main(){
    gl_Position = projection * view * model * vPosition;
    vec4 newPosition = vPosition;
    if(vPosition.x <= 0.0 && vPosition.y <= 0.0 && vPosition.z <=0.0){
        newPosition = vec4(1.0,1.0,1.0,1.0);
    }
    color = newPosition;
}
`;

export const fragmentShader = `#version 300 es
precision mediump float;
in vec4 color;
out vec4 fragColor;

void main(){

    fragColor = color;
}
`;
