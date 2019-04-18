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

//Complete Shader
export const vertexCompleteShader = `#version 300 es
in vec4 vPosition;
in vec2 vMainTextCoords;
//in vec2 vLightTextCoords;
//in vec2 vBumpTextCoords;
in vec3 vNormal;

uniform mat4 model;
uniform mat4 view;
uniform mat4 projection;

out vec4 fColor;
out vec2 fMainTextCoords;
//out vec2 fLightTextCoords;
//out vec2 fBumpTextCoords;
out vec3 fNormal;
out vec3 fPos; 
void main(){
  fColor = vPosition;
  fMainTextCoords = vMainTextCoords;
  //fLightTextCoords = vLightTextCoords;
  //fBumpTextCoords = vBumpTextCoords;
  fNormal = mat3(transpose(inverse(model))) * vNormal;
  fPos = vec3(model * vPosition);
  gl_Position = projection * view * model * vPosition;
}
`;

export const vertexCompleteShaderObj = {
  version: "#version 300 es\n",
  position: "in vec4 vPosition;\n",
  texturesIn: "in vec2 vMainTextCoords;\n" +
    "//in vec2 vLightTextCoords;\n" +
    "//in vec2 vBumpTextCoords;\n",
  normalIn: "in vec3 vNormal;\n",
  modelViewProj: "uniform mat4 model;\nuniform mat4 view;\nuniform mat4 projection;\n",
  texturesOut: "out vec2 fMainTextCoords;\n" +
    "//out vec2 fLightTextCoords;\n" +
    "//out vec2 fBumpTextCoords;\n",
  colorOut: "out vec4 fColor;\n",
  normalOut: "out vec3 fNormal;\n",
  fragPosOut: "out vec3 fPos;\n",
  mainStart: "void main(){\n",
  mainBody: "\tfColor = vPosition;\n"+
  "\tfMainTextCoords = vMainTextCoords;\n"+
  "\t//fLightTextCoords = vLightTextCoords;\n"+
  "\t//fBumpTextCoords = vBumpTextCoords;\n"+
  "\tfNormal = mat3(transpose(inverse(model))) * vNormal;\n"+
  "\tfPos = vec3(model * vPosition);\n"+
  "\tgl_Position = projection * view * model * vPosition;\n}"
};

export const fragmentCompleteShader = `#version 300 es
precision mediump float;

struct Material {
  vec3 ambient;
  vec3 diffuse;
  vec3 specular;
  float shininess;
}; 

//LIGHTS
  
in vec4 fColor;
in vec2 fMainTextCoords;
//in vec2 fLightTextCoords;
//in vec2 fBumpTextCoords;
in vec3 fNormal;
in vec3 fPos;

uniform sampler2D mainTexture;
//uniform sampler2D lightMap;
//uniform sampler2D bumbMap;

uniform vec3 viewPos;
uniform Material material;
//LIGHTS_UNIFORM

out vec4 fragColor;
void main(){
  //LIGHTS_CALC
  if(mainTexture != null){
    fColor = texture(mainTexture, fMainTextCoords) * fColor;
  }
  fragColor = fColor; 
}
`;

export const fragmentCompleteShaderObj =  {
  version: "#version 300 es\n",
  precision: "precision mediump float;\n",
  materialStruct: "struct Material {\n" +
  "\tvec3 ambient;\n" +
  "\tvec3 diffuse;\n" +
  "\tvec3 specular;\n" +
  "\tfloat shininess;\n" +
  "};\n",
  lightsStructs: "",
  lightsFuncDec: "",
  colorIn: "in vec4 fColor;\n",
  normalIn: "in vec3 fNormal;\n",
  fragPosIn: "in vec3 fPos;\n",
  texturesIn: "in vec2 fMainTextCoords;\n" +
  "//in vec2 fLightTextCoords;\n" +
  "//in vec2 fBumpTextCoords;\n",
  samplers: "uniform sampler2D mainTexture;\n",
  viewPos: "",
  matarial: "uniform Material material;\n",
  lightsUniform: "",
  colorOut: "out vec4 fragColor;\n",
  mainStart: "void main(){\n",
  lightsCalc: "",
  //textureCalc: "\tvec4 texturedColor = texture(mainTexture, fMainTextCoords) * fColor;\n",
  mainBody: "\n}\n", //\tfragColor = fragColor;
  lightsFuncImpl: ""
};
//fragColor * vec4
//mix(fragColor, texturedColor, 0.4)
let lightsCalcDef = `// ambient
  vec3 ambient = light.ambient * material.ambient;
  
  // diffuse 
  vec3 norm = normalize(fNormal);
  vec3 lightDir = normalize(light.position - fTextCoords);
  float diff = max(dot(norm, lightDir), 0.0);
  vec3 diffuse = light.diffuse * (diff * material.diffuse);
  
  // specular
  vec3 viewDir = normalize(viewPos - fTextCoords);
  vec3 reflectDir = reflect(-lightDir, norm);  
  float spec = pow(max(dot(viewDir, reflectDir), 0.0), material.shininess);
  vec3 specular = light.specular * (spec * material.specular);  
      
  vec3 result = ambient + diffuse + specular;`

export const DirectionalLightShader = `struct DirectionalLight {
    vec3 direction;
    vec3 ambient;
    vec3 diffuse;
    vec3 specular;
};
`;

export const PointLightShader = `struct PointLight {
    vec3 position;
    vec3 ambient;
    vec3 diffuse;
    vec3 specular;
    float constant;
    float linear;
    float quadratic;
};
`;

export const SpotLightShader = `
struct SpotLight {
    vec3 direction;
    vec3 position;
    vec3 ambient;
    vec3 diffuse;
    vec3 specular;
    float constant;
    float linear;
    float quadratic;
    float cutOff;
    float outerCutOff;
};
`;

export const DirLightFuncDec = 'vec3 CalcDirLight(DirectionalLight light, vec3 normal, vec3 viewDir);\n';
export const PointLightFuncDec = 'vec3 CalcPointLight(PointLight light, vec3 normal, vec3 fragPos, vec3 viewDir);\n';
export const SpotLightFuncDec = 'vec3 CalcSpotLight(SpotLight light, vec3 normal, vec3 fragPos, vec3 viewDir);\n';

export const DirLightFuncImpl = `vec3 CalcDirLight(DirectionalLight light, vec3 normal, vec3 viewDir)
{
    vec3 lightDir = normalize(-light.direction);
    // diffuse shading
    float diff = max(dot(normal, lightDir), 0.0);
    // specular shading
    vec3 reflectDir = reflect(-lightDir, normal);
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), material.shininess);
    // combine results
    vec3 ambient = light.ambient * material.diffuse;
    vec3 diffuse = light.diffuse * diff * material.diffuse;
    vec3 specular = light.specular * spec * material.specular;
    return (ambient + diffuse + specular);
}\n`

/* vec3 ambient = light.ambient * vec3(texture(material.diffuse, TexCoords));
    vec3 diffuse = light.diffuse * diff * vec3(texture(material.diffuse, TexCoords));
    vec3 specular = light.specular * spec * vec3(texture(material.specular, TexCoords)); */

export const PointLightFuncImpl = `vec3 CalcPointLight(PointLight light, vec3 normal, vec3 fragPos, vec3 viewDir)
{
    vec3 lightDir = normalize(light.position - fragPos);
    // diffuse shading
    float diff = max(dot(normal, lightDir), 0.0);
    // specular shading
    vec3 reflectDir = reflect(-lightDir, normal);
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), material.shininess);
    // attenuation
    float distance = length(light.position - fragPos);
    float attenuation = 1.0 / (light.constant + light.linear * distance + light.quadratic * (distance * distance));    
    // combine results
    vec3 ambient = light.ambient * material.diffuse;
    vec3 diffuse = light.diffuse * diff * material.diffuse;
    vec3 specular = light.specular * spec * material.specular;
    ambient *= attenuation;
    diffuse *= attenuation;
    specular *= attenuation;
    return (ambient + diffuse + specular);
}\n`;

/*vec3 ambient = light.ambient * vec3(texture(material.diffuse, TexCoords));
vec3 diffuse = light.diffuse * diff * vec3(texture(material.diffuse, TexCoords));
vec3 specular = light.specular * spec * vec3(texture(material.specular, TexCoords));
*/

export const SpotLightFuncImpl = `vec3 CalcSpotLight(SpotLight light, vec3 normal, vec3 fragPos, vec3 viewDir)
{
    vec3 lightDir = normalize(light.position - fragPos);
    // diffuse shading
    float diff = max(dot(normal, lightDir), 0.0);
    // specular shading
    vec3 reflectDir = reflect(-lightDir, normal);
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), material.shininess);
    // attenuation
    float distance = length(light.position - fragPos);
    float attenuation = 1.0 / (light.constant + light.linear * distance + light.quadratic * (distance * distance));    
    // spotlight intensity
    float theta = dot(lightDir, normalize(-light.direction)); 
    float epsilon = light.cutOff - light.outerCutOff;
    float intensity = clamp((theta - light.outerCutOff) / epsilon, 0.0, 1.0);
    // combine results
    vec3 ambient = light.ambient * material.ambient;
    vec3 diffuse = light.diffuse * diff * material.diffuse;
    vec3 specular = light.specular * spec * material.specular;
    ambient *= attenuation * intensity;
    diffuse *= attenuation * intensity;
    specular *= attenuation * intensity;
    return (ambient + diffuse + specular);
}\n`;

/* 
vec3 ambient = light.ambient * vec3(texture(material.diffuse, TexCoords));
    vec3 diffuse = light.diffuse * diff * vec3(texture(material.diffuse, TexCoords));
    vec3 specular = light.specular * spec * vec3(texture(material.specular, TexCoords)); */

export const textureScheme = `
mainTexture;
bumpMap;
lightMap;
shadowMap;
`