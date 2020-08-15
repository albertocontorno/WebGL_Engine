export const vColor_In = 'in vec4 vColor;\n';
export const vColor_Out = 'out vec4 fColor;\n';
export const vColor_Assign = 'fColor = vColor;\n';

export const vDiffuseCoords_In = 'in vec2 vDiffuseTextCoords;\n';
export const vSpecularCoords_In = 'in vec2 vSpecularTextCoords;\n';
export const vLightCoords_In = 'in vec2 vLightTextCoords;\n';
export const vBumpCoords_In = 'in vec2 vBumpTextCoords;\n';
export const vShadowCoords_In = 'in vec2 vShadowTextCoords;\n';
export const vNormalCoords_In = 'in vec2 vNormalTextCoords;\n';

export const vDiffuseCoords_Out = 'out vec2 fDiffuseTextCoords;\n';
export const vSpecularCoords_Out = 'out vec2 fSpecularTextCoords;\n';
export const vLightCoords_Out = 'out vec2 fLightTextCoords;\n';
export const vBumpCoords_Out = 'out vec2 fBumpTextCoords;\n';
export const vShadowCoords_Out = 'out vec2 fShadowTextCoords;\n';
export const vNormalCoords_Out = 'out vec2 fNormalTextCoords;\n';

export const vDiffuseCoords_Assign = '\tfDiffuseTextCoords = vDiffuseTextCoords;\n';
export const vSpecularCoords_Assign = '\tfDiffuseTextCoords = vDiffuseTextCoords;\n';
export const vLightCoords_Assign = '\tfDiffuseTextCoords = vDiffuseTextCoords;\n';
export const vBumpCoords_Assign = '\tfDiffuseTextCoords = vDiffuseTextCoords;\n';
export const vShadowCoords_Assign = '\tfDiffuseTextCoords = vDiffuseTextCoords;\n';
export const vNormalCoords_Assign = '\tfDiffuseTextCoords = vDiffuseTextCoords;\n';

export const vertexCompleteShaderObj = () =>({
  version: "#version 300 es\n",
  position: "in vec4 vPosition;\n",
  colorIn: '',
  diffuseCoordsIn: '',
  diffuseCoordsOut: '',
  specularCoordsIn: '',
  specularCoordsOut: '',
  normalCoordsIn: '',
  normalCoordsOut: '',
  normalIn: "in vec3 vNormal;\n",
  modelViewProj: "uniform mat4 model;\nuniform mat4 view;\nuniform mat4 projection;\n",
  colorOut: '',
  normalOut: "out vec3 fNormal;\n",
  fragPosOut: "out vec3 fPos;\n",
  mainStart: "void main(){\n",
  mainBody: "\tfNormal = mat3(transpose(inverse(model))) * vNormal;\n"+
  "\tfPos = vec3(model * vPosition);\n",
  diffuseAssign: '',
  specularAssign: '',
  normalAssign: '',
  colorAssign: '',
  mainBodyOutput: '\tgl_Position = projection * view * model * vPosition;\n}'
});


export const materialStruct = "struct Material {\n" +
"\tvec3 ambient;\n" +
"\tvec3 diffuse;\n" +
"\tvec3 specular;\n" +
"\tfloat shininess;\n" +
"};\n"

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

export const LightAmbientWithTexture_Diff_Spec = '\tvec3 ambient = light.ambient * vec3(texture(diffuseTexture, fDiffuseTextCoords));\n'
export const LightDiffuseWithTexture_Diff_Spec = '\tvec3 diffuse = light.diffuse * diff * vec3(texture(diffuseTexture, fDiffuseTextCoords));\n'
export const LightSpecularWithTexture_Diff_Spec = '\tvec3 specular = light.specular * spec * vec3(texture(specularTexture, fSpecularTextCoords));\n'

export const LightAmbientWithTexture_Diff = '\tvec3 ambient = light.ambient * vec3(texture(diffuseTexture, fDiffuseTextCoords));\n'
export const LightDiffuseWithTexture_Diff = '\tvec3 diffuse = light.diffuse * diff * vec3(texture(diffuseTexture, fDiffuseTextCoords));\n'
export const LightSpecularWithTexture_Diff = '\tvec3 specular = light.specular * spec * material.specular;\n'

export const LightAmbientWithTexture_Spec = '\tvec3 ambient = light.ambient * material.diffuse;\n'
export const LightDiffuseWithTexture_Spec = '\tvec3 diffuse = light.ambient * material.diffuse;\n'
export const LightSpecularWithTexture_Spec = '\tvec3 specular = light.specular * spec * vec3(texture(specularTexture, fSpecularTextCoords));\n'

/* export const DirLightFuncImpl = `vec3 CalcDirLight(DirectionalLight light, vec3 normal, vec3 viewDir)
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
}\n` */

export const DirLightFuncImplObj = () =>({
  signature: 'vec3 CalcDirLight(DirectionalLight light, vec3 normal, vec3 viewDir){\n',
  bodyStandandPart: `\tvec3 lightDir = normalize(-light.direction);
  \t// diffuse shading
  \tfloat diff = max(dot(normal, lightDir), 0.0);
  \t// specular shading
  \tvec3 reflectDir = reflect(-lightDir, normal);
  \tfloat spec = pow(max(dot(viewDir, reflectDir), 0.0), material.shininess);
  \t// combine results\n`,
  bodyAmbient: '\tvec3 ambient = light.ambient * material.diffuse;\n',
  bodyDiffuse: '\tvec3 diffuse = light.diffuse * diff * material.diffuse;\n',
  bodySpecular: '\tvec3 specular = light.specular * spec * material.specular;\n',
  bodyReturn: '\treturn (ambient + diffuse + specular);\n}\n'
});


/* export const PointLightFuncImpl = `vec3 CalcPointLight(PointLight light, vec3 normal, vec3 fragPos, vec3 viewDir)
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
}\n`; */

export const PointLightFuncImplObj = () =>({
  signature: 'vec3 CalcPointLight(PointLight light, vec3 normal, vec3 fragPos, vec3 viewDir){\n',
  bodyStandandPart: `\tvec3 lightDir = normalize(light.position - fragPos);
  \t// diffuse shading
  \tfloat diff = max(dot(normal, lightDir), 0.0);
  \t// specular shading
  \tvec3 reflectDir = reflect(-lightDir, normal);
  \tfloat spec = pow(max(dot(viewDir, reflectDir), 0.0), material.shininess);
  \t// attenuation
  \tfloat distance = length(light.position - fragPos);
  \tfloat attenuation = 1.0 / (light.constant + light.linear * distance + light.quadratic * (distance * distance));    
  \t// combine results\n`,
  bodyAmbient: '\tvec3 ambient = light.ambient * material.diffuse;\n',
  bodyDiffuse: '\tvec3 diffuse = light.diffuse * diff * material.diffuse;\n',
  bodySpecular: '\tvec3 specular = light.specular * spec * material.specular;\n',
  bodyAttenuation: `\tambient *= attenuation;
  \tdiffuse *= attenuation;
  \tspecular *= attenuation;\n`,
  bodyReturn: '\treturn (ambient + diffuse + specular);\n}\n'
});

/* export const SpotLightFuncImpl = `vec3 CalcSpotLight(SpotLight light, vec3 normal, vec3 fragPos, vec3 viewDir)
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
}\n`; */

export const SpotLightFuncImplObj = () =>({
  signature: 'vec3 CalcSpotLight(SpotLight light, vec3 normal, vec3 fragPos, vec3 viewDir){\n',
  bodyStandandPart: `\tvec3 lightDir = normalize(light.position - fragPos);
  \t// diffuse shading
  \tfloat diff = max(dot(normal, lightDir), 0.0);
  \t// specular shading
  \tvec3 reflectDir = reflect(-lightDir, normal);
  \tfloat spec = pow(max(dot(viewDir, reflectDir), 0.0), material.shininess);
  \t// attenuation
  \tfloat distance = length(light.position - fragPos);
  \tfloat attenuation = 1.0 / (light.constant + light.linear * distance + light.quadratic * (distance * distance));    
  \t// spotlight intensity
  \tfloat theta = dot(lightDir, normalize(-light.direction)); 
  \tfloat epsilon = light.cutOff - light.outerCutOff;
  \tfloat intensity = clamp((theta - light.outerCutOff) / epsilon, 0.0, 1.0);
  \t// combine results\n`,
  bodyAmbient: '\tvec3 ambient = light.ambient * material.diffuse;\n',
  bodyDiffuse: '\tvec3 diffuse = light.diffuse * diff * material.diffuse;\n',
  bodySpecular: '\tvec3 specular = light.specular * spec * material.specular;\n',
  bodyAttenuation: `\tambient *= attenuation * intensity;
  \tdiffuse *= attenuation * intensity;
  \tspecular *= attenuation * intensity;\n`,
  bodyReturn: '\treturn (ambient + diffuse + specular);\n}\n'
});

/* 
vec3 ambient = light.ambient * vec3(texture(material.diffuse, TexCoords));
    vec3 diffuse = light.diffuse * diff * vec3(texture(material.diffuse, TexCoords));
    vec3 specular = light.specular * spec * vec3(texture(material.specular, TexCoords)); */

export const materialVar = 'uniform Material material;\n';
export const fColorIn = 'in vec4 fColor;\n';

export const diffuseMapVar = 'uniform sampler2D diffuseTexture;\n';
export const specularMapVar = 'uniform sampler2D specularTexture;\n';
export const lightMapVar = 'uniform sampler2D lightTexture;\n';
export const bumbMapVar = 'uniform sampler2D bumpTexture;\n';
export const shadowMapVar = 'uniform sampler2D shadowTexture;\n';
export const normalMapVar = 'uniform sampler2D normalTexture;\n';

export const fDiffuseCoords = 'in vec2 fDiffuseTextCoords;\n';
export const fSpecularCoords = 'in vec2 fSpecularTextCoords;\n';
export const fLightCoords = 'in vec2 fLightTextCoords;\n';
export const fBumpCoords = 'in vec2 fBumpTextCoords;\n';
export const fShadowCoords = 'in vec2 fShadowTextCoords;\n';
export const fNormalCoords = 'in vec2 fNormalTextCoords;\n';

export const fOutput_Lights = '\tfragColor = vec4(lightColor, 1.0);\n'
export const fOutput_Lights_Color = '\tfragColor = vec4(lightColor, 1.0) * fColor;\n'

export var fragmentShaderCompleteObj = ()=>({
  version: '#version 300 es\n',
  precision: 'precision mediump float;\n',
  materialStruct: '',
  lightsStructs: '',
  lightsFuncDec: '',
  colorIn: '',
  normalIn: 'in vec3 fNormal;\n',
  fragPosIn: 'in vec3 fPos;\n',
  texturesCoords: '',
  samplers: '',
  viewPos: 'uniform vec3 viewPos;\n',
  material: '',
  lightsUniform: '',
  colorOut: 'out vec4 fragColor;\n',
  mainStart: 'void main(){\n',
  lightsCalc: '',
  textureCalc: '',
  fragOutput: '\tfragColor = vec4(0.0, 0.0, 1.0, 1.0);\n',
  mainEnd: '}\n',
  lightsFuncImpl: '',
  textureFuncImpl: ''
});

