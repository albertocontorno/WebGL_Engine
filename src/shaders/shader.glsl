#version 300 es
precision mediump float;
struct Material {
	vec3 ambient;
	vec3 diffuse;
	vec3 specular;
	float shininess;
};
struct DirectionalLight {
    vec3 direction;
    vec3 ambient;
    vec3 diffuse;
    vec3 specular;
};
struct PointLight {
    vec3 position;
    vec3 ambient;
    vec3 diffuse;
    vec3 specular;
    float constant;
    float linear;
    float quadratic;
};
vec3 CalcDirLight(DirectionalLight light, vec3 normal, vec3 viewDir);
vec3 CalcPointLight(PointLight light, vec3 normal, vec3 fragPos, vec3 viewDir);
in vec4 fColor;
in vec3 fNormal;
in vec3 fPos;
in vec2 fDiffuseTextCoords;
in vec2 fSpecularTextCoords;
in vec2 fLightTextCoords;
in vec2 fBumpTextCoords;
in vec2 fShadowTextCoords;
uniform sampler2D diffuseTexture;
uniform sampler2D specularTexture;
uniform sampler2D lightTexture;
uniform sampler2D bumpTexture;
uniform sampler2D shadowTexture;
uniform vec3 viewPos;
uniform Material material;
uniform DirectionalLight light0;
uniform PointLight light1;
uniform PointLight light2;
out vec4 fragColor;
void main(){
	vec3 viewDir = normalize(viewPos - fPos);
	vec3 norm = normalize(fNormal);
	vec3 result = CalcDirLight(light0, norm, viewDir);
	result += CalcPointLight(light1, norm, fPos, viewDir);
	result += CalcPointLight(light2, norm, fPos, viewDir);
	vec4 diffuseTextColor = texture(diffuseTexture, fMainTextCoords) * vec4(material.diffuse, 1.0);
	vec4 specularTextColor = texture(specularTexture, fMainTextCoords) * vec4(material.diffuse, 1.0);
	vec4 lightTextColor = texture(lightTexture, fMainTextCoords) * vec4(material.diffuse, 1.0);
	vec4 bumpTextColor = texture(bumpTexture, fMainTextCoords) * vec4(material.diffuse, 1.0);
	vec4 shadowTextColor = texture(shadowTexture, fMainTextCoords) * vec4(material.diffuse, 1.0);
    vec4 textureColor = diffuseTextColor * specularTextColor * lightTextColor * bumpTextColor * shadowTextColor;
	fragColor = vec4(result, 1.0) * shadowTextColor;
}
vec3 CalcDirLight(DirectionalLight light, vec3 normal, vec3 viewDir)
{
    vec3 lightDir = normalize(-light.direction);
    // diffuse shading
    float diff = max(dot(normal, lightDir), 0.0);
    // specular shading
    vec3 reflectDir = reflect(-lightDir, normal);
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), material.shininess);
    // combine results
    vec3 ambient = light.ambient * material.diffuse; //material.diffuse changes to diffuseTextColor if present
    vec3 diffuse = light.diffuse * diff * material.diffuse;
    vec3 specular = light.specular * spec * material.specular;
    return (ambient + diffuse + specular);
}
vec3 CalcPointLight(PointLight light, vec3 normal, vec3 fragPos, vec3 viewDir)
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
}