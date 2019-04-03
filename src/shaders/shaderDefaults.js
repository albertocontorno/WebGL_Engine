export const vertexShader = `#version 300 es
in vec4 vPosition;

uniform mat4 model;
uniform mat4 view;
uniform mat4 projection;

out vec4 color;

void main(){
    gl_Position = projection * view * model * vPosition;
    color = gl_Position;
}
`;

export const vertexShaderObj = {
    version: "#version 300 es\n",
    position: "in vec4 vPosition;\n",
    modelViewProj: "uniform mat4 model;\nuniform mat4 view;\nuniform mat4 projection;\n",
    colorOut: "out vec4 color;\n",
    mainStart: "void main(){\n",
    mainBody: "gl_Position = projection * view * model * vPosition;\ncolor = gl_Position;\n}"
}

export const fragmentShader = `#version 300 es
precision mediump float;
in vec4 color;
out vec4 fragColor;
void main(){
    fragColor =  color;
}
`;

export const fragmentShaderObj = {
    version: "#version 300 es\n",
    precision: "precision mediump float;\n",
    colorIn: "in vec4 color;\n",
    colorOut: "out vec4 fragColor;\n",
    mainStart: "void main(){\n",
    mainBody: "fragColor =  color;\n}"
}