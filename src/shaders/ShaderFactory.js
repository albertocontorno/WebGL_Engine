import { Mesh } from '../common/Mesh';
import { LightTypes } from '../common/Utils/constants';

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
        'in vec4 vPosition;\n' +
        (mesh.material ? 'in vec4 vNormal\n' : '') +
        'uniform mat4 model;\n' +
        'uniform mat4 view;\n' +
        'uniform mat4 projection;\n';

        let t = this.getTextures(mesh.textures);
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

    //TODO
    static CreateVertexShaderFromSources(sources){
        let vertexShaderSource = '';
        vertexShaderSource = shaderDefault.vertexCompleteShader;
        return vertexShaderSource;
    }

    static CreateFragmentShaderFromSources(sources) {
        let fragmentShaderSource = '';
        console.log("CREATING FRAGMENT")
        fragmentShaderSource = shaderDefault.fragmentCompleteShaderObj;
        fragmentShaderSource.lightsStructs = this.getLightsStructsFromLights(sources.lightsTypes);
        fragmentShaderSource.viewPos = "uniform vec3 viewPos;\n";
        fragmentShaderSource.lightsUniform = this.getLightsVarsFromLights(sources.lights);
        fragmentShaderSource.lightsCalc = this.doLightCalcs(sources);
        fragmentShaderSource.lightsFuncDec = this.getLightsFuncDec(sources.lightsTypes);
        fragmentShaderSource.lightsFuncImpl = this.getLightsFuncImpl(sources.lightsTypes);
        fragmentShaderSource = Object.values(fragmentShaderSource).join('');
        
        return fragmentShaderSource;
    }

    //===================UTILS===================
    static getTextures(textures){
        let t = '';
        if (textures) {
            for (let i = 0; i < textures.length; i++) {
                t +='in vec2 vTextCoords'+ i + ';\n' +
                    'out vec2 fTextCoords' + i + ';\n' +
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
            'in vec3 fPos;\n'
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

    //REMOVE?
    static doLightCalc(sources){
        let lightsCalc = '';
        let lightsAmbient = '', lightsDiffuse = '', lightsSpecular = '', result = '';
        if(sources && sources.lights){
        lightsCalc +=
        '   vec3 viewDir = normalize(viewPos - fPos);\n' +
        '   vec3 norm = normalize(fNormal);\n'
        for(let i=0; i<sources.lights.length; i++){
            lightsAmbient += `light${i}.ambient * `;
            lightsDiffuse += 
            '   // diffuse' + i + '\n' +
            '   vec3 lightDir' + i + ' = normalize(light' + i + '.position - fPos);\n' +
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
        '   vec3 result =' + result + ';\n';

        }

        return lightsCalc;
        
    }

    static doLightCalcs({lights}) {
        let lightsCalc =
            '\tvec3 viewDir = normalize(viewPos - fPos);\n' +
            '\tvec3 norm = normalize(fNormal);\n'// +
            //'\tvec3 result = vec3(0,0,0);\n';
        let lightsAmbient = '', lightsDiffuse = '', lightsSpecular = '';
        
        /**
         * NELLO SHADER HO vec3 CalcDirLight e vec3 CalcPointLight e vec3 CalcSpotLight
         * Qua nel js loop tra le luci e faccio inserisco 'result += CalcDirLight(light0)' o
         * 'result += CalcPointLight(light0)' o result += CalcSpotLight(light0)' a seconda del tipo di luce
         * (result all'inizio è vec4(0,0,0,0) )
         * VANNO INSERITE LE FUNZIONI E LE DICHIARAZIONI DELLE FUNZIONI NELLO SHADER!
         */
        for(let i=0; i<lights.length; i++){
            if( i == 0){
                lightsCalc += '\tvec3 result = '; 
            } else {
                lightsCalc += '\tresult += ';
            }
            if (lights[i].type == LightTypes.DirectionalLight){
                lightsCalc += 'CalcDirLight(light' + i + ', norm, viewDir);\n';
            }
            if (lights[i].type == LightTypes.PointLight){
                lightsCalc += 'CalcPointLight(light' + i + ', norm, fPos, viewDir);\n';
            }
            if (lights[i].type == LightTypes.SpotLight){
                lightsCalc += 'CalcSpotLight(light' + i + ', norm, fPos, viewDir);\n';
            }
        }
        
        lightsCalc += '\tfragColor = vec4(result, 1.0);\n';
        return lightsCalc;
    }

    static getLightsStructsFromLights(lightsTypes) {
        let r = '';

        if (lightsTypes[LightTypes.DirectionalLight]) r += shaderDefault.DirectionalLightShader;
        if (lightsTypes[LightTypes.PointLight]) r += shaderDefault.PointLightShader;
        if (lightsTypes[LightTypes.SpotLight]) r += shaderDefault.SpotLightShader;
        
        return r;
    }

    static getLightsFuncDec(lightsTypes){
        let r = '';

        if (lightsTypes[LightTypes.DirectionalLight]) r += shaderDefault.DirLightFuncDec;
        if (lightsTypes[LightTypes.PointLight]) r += shaderDefault.PointLightFuncDec;
        if (lightsTypes[LightTypes.SpotLight]) r += shaderDefault.SpotLightFuncDec;

        return r;
    }

    static getLightsFuncImpl(lightsTypes){
        let r = '';

        if (lightsTypes[LightTypes.DirectionalLight]) r += shaderDefault.DirLightFuncImpl;
        if (lightsTypes[LightTypes.PointLight]) r += shaderDefault.PointLightFuncImpl;
        if (lightsTypes[LightTypes.SpotLight]) r += shaderDefault.SpotLightFuncImpl;

        return r;
    }

    static getLightsVarsFromLights (lights){
        let r = '';

        for(let i=0; i<lights.length; i++){
            if (lights[i].type === LightTypes.DirectionalLight) r += 'uniform DirectionalLight light' + i + ';\n';
            if (lights[i].type === LightTypes.PointLight) r += 'uniform PointLight light' + i + ';\n';
            if (lights[i].type === LightTypes.SpotLight) r += 'uniform SpotLight light' + i + ';\n';
        }

        return r;
    }
}
