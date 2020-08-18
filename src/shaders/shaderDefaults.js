export const vMainBody_fPos_Calc = '\tfPos = vec3(model * vPosition);\n';
export const vMainBody_fPos_Calc_TBN = '\tfPos = vec3(model * vPosition) * TBN;\n';
export const vColor_In = 'in vec4 vColor;\n';
export const vColor_Out = 'out vec4 fColor;\n';
export const vColor_Assign = 'fColor = vColor;\n';

export const vTextureCoords_In = 'in vec2 vTextureCoords;\n';
export const vTextureCoords_Out = 'out vec2 fTextureCoords;\n';
export const vTextureCoords_Assign = '\tfTextureCoords = vTextureCoords;\n';

export const vTangent_In = 'in vec3 vTangent;\n';
export const vTangent_Out = 'out vec3 fTangent;\n';
export const vTangent_Assign = '\tfTangent = normalize(normalMatrix * vTangent);\n';
export const vTangentCalc = `
    vec3 T = normalize(normalMatrix * vTangent);
    vec3 N = normalize(fNormal);
    T = normalize(T - dot(T, N) * N);
    vec3 B = cross(N, T);
    mat3 TBN = mat3(T, B, N);\n`;
export const vTbn_Out = 'out mat3 fTBN;\n';
export const vTbn_Assing = '\tfTBN = TBN;\n';

export const vertexCompleteShaderObj = () =>({
  version: '#version 300 es\n',
  position: 'in vec4 vPosition;\n',
  lightsPosUniform: '',
  lightsPosOut: '',
  colorIn: '',
  textureCoordsIn: '',
  textureCoordsOut: '',
  normalIn: 'in vec3 vNormal;\n',
  tangentIn: '',
  tangentOut: '',
  modelViewProj: 'uniform mat4 model;\nuniform mat4 view;\nuniform mat4 projection;\n',
  colorOut: '',
  normalOut: 'out vec3 fNormal;\n',
  tbnOut: '',
  fragPosOut: 'out vec3 fPos;\n',
  mainStart: 'void main(){\n',
  mainBodyNormalCalc: '\tmat3 normalMatrix = mat3(transpose(inverse(model)));\n\tfNormal = normalMatrix * vNormal;\n',
  textureCoordsAssign: '',
  tangentAssign: '',
  tbnCalc: '',
  tbnAssign: '',
  mainBodyFPos: '',
  colorAssign: '',
  mainBodyOutput: '\n\tgl_Position = projection * view * model * vPosition;\n}'
});


export const materialStruct = 'struct Material {\n' +
'\tvec3 ambient;\n' +
'\tvec3 diffuse;\n' +
'\tvec3 specular;\n' +
'\tfloat shininess;\n' +
'};\n'

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

export const PointLightShader_NoPos = `struct PointLight {
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

export const SpotLightShader_NoPos = `
struct SpotLight {
    vec3 direction;
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

export const LightAmbientWithTexture_Diff_Spec = '\tvec3 ambient = light.ambient * vec3(texture(diffuseTexture, fTextureCoords));\n'
export const LightDiffuseWithTexture_Diff_Spec = '\tvec3 diffuse = light.diffuse * diff * vec3(texture(diffuseTexture, fTextureCoords));\n'
export const LightSpecularWithTexture_Diff_Spec = '\tvec3 specular = light.specular * spec * vec3(texture(specularTexture, fTextureCoords));\n'

export const LightAmbientWithTexture_Diff = '\tvec3 ambient = light.ambient * vec3(texture(diffuseTexture, fTextureCoords));\n'
export const LightDiffuseWithTexture_Diff = '\tvec3 diffuse = light.diffuse * diff * vec3(texture(diffuseTexture, fTextureCoords));\n'
export const LightSpecularWithTexture_Diff = '\tvec3 specular = light.specular * spec * material.specular;\n'

export const LightAmbientWithTexture_Spec = '\tvec3 ambient = light.ambient * material.diffuse;\n'
export const LightDiffuseWithTexture_Spec = '\tvec3 diffuse = light.ambient * material.diffuse;\n'
export const LightSpecularWithTexture_Spec = '\tvec3 specular = light.specular * spec * vec3(texture(specularTexture, fTextureCoords));\n'

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

export const materialVar = 'uniform Material material;\n';
export const fColorIn = 'in vec4 fColor;\n';

export const diffuseMapVar = 'uniform sampler2D diffuseTexture;\n';
export const specularMapVar = 'uniform sampler2D specularTexture;\n';
export const lightMapVar = 'uniform sampler2D lightTexture;\n';
export const bumbMapVar = 'uniform sampler2D bumpTexture;\n';
export const shadowMapVar = 'uniform sampler2D shadowTexture;\n';
export const normalMapVar = 'uniform sampler2D normalTexture;\n';

export const fTextureCoords = 'in vec2 fTextureCoords;\n';
export const fDiffuseCoords = 'in vec2 fDiffuseTextCoords;\n';

export const fOutput_Lights = '\tfragColor = vec4(lightColor, 1.0);\n';
export const fOutput_Lights_Color = '\tfragColor = vec4(lightColor, 1.0) * fColor;\n';

export const fNormalCalc_noTangents = `\tvec3 norm = texture(normalTexture, fTextureCoords).rgb;
\tnorm = normalize(norm * 2.0 - 1.0);\n`;
export const fNormalCalc_Tangents = `vec3 norm = texture(normalTexture, fTextureCoords).rgb;
norm = norm * 2.0 - 1.0;   
norm = normalize(fTBN * norm);`;
export const fTBN_In = 'in mat3 fTBN;\n';

export const fTangent_In = 'in vec3 fTangent;\n';
export const fTbn_Calc = `\tvec3 norm = normalize(fNormal) * ( float( gl_FrontFacing ) * 2.0 - 1.0 );
\tvec3 tangent = normalize(fTangent) * ( float( gl_FrontFacing ) * 2.0 - 1.0 );
\tvec3 bitangent = normalize(cross(norm, tangent));
\tmat3 tbn = mat3(tangent, bitangent, norm);
\tnorm = texture(normalTexture, fTextureCoords).rgb * 2. - 1.;
\tnorm = normalize(tbn * norm);\n`;


export var fragmentShaderCompleteObj = ()=>({
  version: '#version 300 es\n',
  precision: 'precision mediump float;\n',
  materialStruct: '',
  lightsStructs: '',
  lightsFuncDec: '',
  colorIn: '',
  normalIn: 'in vec3 fNormal;\n',
  tangentIn: '',
  tbnIn: '',
  fragPosIn: 'in vec3 fPos;\n',
  texturesCoords: '',
  samplers: '',
  viewPos: 'uniform vec3 viewPos;\n',
  material: '',
  lightsUniform: '',
  colorOut: 'out vec4 fragColor;\n',
  mainStart: 'void main(){\n',
  normalCalc: '',
  lightsCalc: '',
  textureCalc: '',
  fragOutput: '\tfragColor = vec4(0.0, 0.0, 1.0, 1.0);\n',
  mainEnd: '}\n',
  lightsFuncImpl: '',
  textureFuncImpl: ''
});

