import { Mesh } from '../common/Mesh';
import * as shaderDefault from './shaderDefaults';
/**
 * @author Alberto Contorno
 * @class
 * Class used to create Default Shaders according to Mesh properties.
 */
export class ShaderFactory{
    /**
    * @param {Mesh} mesh The Mesh from which the Shader is generated
    * @param {Object} sources Object that contains other external sources, such as the Lights
    * @returns {String} shaderSource
    */
    static CreateVertexShaderFromMesh(mesh, sources){
        let vertexShaderSource = '';
        let version = '#version 300 es\n';

        let vars = 
        'vec4 vPosition;\n' +
        (mesh.material ? 'vec4 vNormal\n' : '') +
        'uniform mat4 model;\n' +
        'uniform mat4 view;\n' +
        'uniform mat4 projection;\n';

        let t = this.getTextures(mesh);
        let m = this.getVertexLightStuff(mesh);
        //${mesh.texture.length > 0 ? 'textCoord = textCoords;' : '' }
        let main = 
        'void main(){\n' +
        '   gl_Position = projection * view * model * vPosition;\n' +
        (mesh.material ? '  fNormal = mat3(transpose(inverse(model))) * vNormal;\n' : '') +
        (mesh.material ? '  fragPos = vec3(model * vPosition);\n' : ''); 
        if(mesh.textures){
            for(let i = 0; i<mesh.textures.length; i++){
                main += '   textCoord' + i + ' = textCoords' + i + '\n';
            }
        }

        main += '}';

        vertexShaderSource = version + vars + m + t + main;
        return vertexShaderSource;
    }

    /**
    * @param {Mesh} mesh The Mesh from which the Shader is generated
    * @param {Object} sources Object that contains other external sources, such as the Lights
    * @returns {String} shaderSource
    */
    static CreateFragmentShaderFromMesh(mesh, sources){
        let fragmentShaderSource = '';
        let versionAndPrecision = 
            '#version 300 es\n' +
            'precision mediump float;\n';
        
        let material = this.getMaterial(mesh);
        let light = this.getLight(sources);
        let lights = this.getLights(sources);
        let lightsCalc = this.doLightCalc(sources)

        let main = 
            'void main(){\n' +
                lightsCalc + '\n' +
            '   fragColor = vec4(result, 1.0); \n' +
            '}'

        fragmentShaderSource = versionAndPrecision + material + light + lights + main;
        
        return fragmentShaderSource;
    }

    /* static getVertexDefault(){
        return shaderDefault.vertexShaderObj;
    } */

    //===================UTILS===================
    static getTextures(mesh){
        let t = '';
        if (mesh.textures) {
            for (let i = 0; i < mesh.textures.length; i++) {
                t +='in vec2 textCoords'+ i + ';\n' +
                    'out vec2 textCoord' + i + ';\n' +
                    'uniform sampler2D texture' + i + ';\n';
            }
        }
        return t;
    }

    static getMaterial(mesh){
        let m = ``;
        if (mesh && mesh.material) {
            m ='struct Material {\n' +
            '   vec3 ambient;\n' +
            '   vec3 diffuse;\n' +
            '   vec3 specular;\n' +
            '   float shininess;\n' +
            '}\n';
        }
        return m;
    }

    static getVertexLightStuff(mesh){
        let stuff = ``;
        if(mesh && mesh.material){
            stuff = 'out vec3 fNormal;\n' +
                    'out vec3 fragPos;\n';
        } 
        return stuff;
    }

    static getLight(sources){
        let light = ``;
        if(sources && sources.lights){
            light =
            'struct Light {\n' +
            '   vec3 position;\n' +
            '   vec3 ambient;\n' +
            '   vec3 diffuse;\n' +
            '   vec3 specular;\n' +
            '}\n' +
            'in vec3 fNormal;\n' +
            'in vec3 fragPos;\n'
        }
        return light;
    }

    static getLights(sources){
        let lights = '';
        if (sources && sources.lights){
            for (let i = 0; i < sources.lights.length; i++) {
                lights +='uniform Light light'+i+';\n';
            }
        }
        return lights;
    }

    static doLightCalc(sources){
        let lightsCalc = '';
        let lightsAmbient = '', lightsDiffuse = '', lightsSpecular = '', result = '';
        if(sources && sources.lights){
        lightsCalc +=
        '   vec3 viewDir = normalize(viewPos - fragPos);\n' +
        '   vec3 norm = normalize(fNormal);\n'
        for(let i=0; i<sources.lights.length; i++){
            lightsAmbient += `light${i}.ambient * `;
            lightsDiffuse += 
            '   // diffuse' + i + '\n' +
            '   vec3 lightDir' + i + ' = normalize(light ' + i + '.position - fragPos);\n' +
            '   float diff' + i + ' = max(dot(norm, lightDir' + i + '), 0.0);\n' +
            '   vec3 diffuse' + i + ' = light' + i + '.diffuse * (diff' + i + ' * material.diffuse);\n'

            lightsSpecular += 
                '   // specular' + i + '\n' +
                '   vec3 reflectDir' + i + ' = reflect(-lightDir' + i + ', norm);\n' +
                '   float spec' + i + ' = pow(max(dot(viewDir, reflectDir' + i + '), 0.0), material.shininess);\n' +
                '   vec3 specular' + i + ' = light' + i + '.specular * (spec' + i + ' * material.specular);\n';
            
            result += ' ambient' + i + ' + diffuse' + i + ' + specular' + i;
            if(i !== sources.lights.length - 1){
                result += ' +'
            }
        }
        lightsCalc += 
        '   vec3 ambient =' + lightsAmbient + 'material.ambient;\n' +
        lightsDiffuse +
        lightsSpecular +
        '   vec3 result =' + result + ';';

        }

        return lightsCalc;
        
    }
}