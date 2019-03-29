export const vertexShader = `#version 300 es
in vec4 vPosition;
in vec2 textCoords;
in vec3 vNormal;

uniform mat4 model;
uniform mat4 view;
uniform mat4 projection;

out vec4 color;
out vec2 textCoord;
out vec3 fNormal;
out vec3 fragPos; 
void main(){
    gl_Position = projection * view * model * vPosition;
    color = vPosition;
    textCoord = textCoords;
    fNormal = mat3(transpose(inverse(model))) * vNormal;
    fragPos = vec3(model * vPosition);
}
`;

export const fragmentShader = `#version 300 es
precision mediump float;
struct Material {
    vec3 ambient;
    vec3 diffuse;
    vec3 specular;
    float shininess;
}; 

struct Light {
    vec3 position;
  
    vec3 ambient;
    vec3 diffuse;
    vec3 specular;
};
  
in vec4 color;
in vec2 textCoord;
in vec3 fNormal;
in vec3 fragPos;

uniform sampler2D texture0;
uniform vec3 viewPos;

uniform Material material;
uniform Light light; 

out vec4 fragColor;
void main(){
        // ambient
    vec3 ambient = light.ambient * material.ambient;
  	
    // diffuse 
    vec3 norm = normalize(fNormal);
    vec3 lightDir = normalize(light.position - fragPos);
    float diff = max(dot(norm, lightDir), 0.0);
    vec3 diffuse = light.diffuse * (diff * material.diffuse);
    
    // specular
    vec3 viewDir = normalize(viewPos - fragPos);
    vec3 reflectDir = reflect(-lightDir, norm);  
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), material.shininess);
    vec3 specular = light.specular * (spec * material.specular);  
        
    vec3 result = ambient + diffuse + specular;
    fragColor = /* texture(texture0, textCoord) * */ vec4(result, 1.0); 
}
`;