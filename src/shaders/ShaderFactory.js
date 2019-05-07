import { Mesh } from '../common/Mesh';
import { LightTypes } from '../common/Utils/constants';
import * as shaderDefault from './shaderDefaults';
/**
 * @author Alberto Contorno
 * @class
 * Class used to create Default Shaders according to Mesh properties.
 */
export class ShaderFactory{

    static CreateVertexShaderFromSources(sources){
        let vertexShaderSource = '';
        vertexShaderSource = shaderDefault.vertexCompleteShader;
        return vertexShaderSource;
    }

    static CreateFragmentShaderFromSources(sources) {
        let fragmentShaderSource = '';
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

    static getTextureDefault() {
        return 'uniform sampler2D mainTexture;\n' +
            'in vec2 fTextCoordsMain;\n' +
            'uniform sampler2D lightMap;\n' +
            'in vec2 fTextCoordsLight;\n' +
            'uniform sampler2D bumpMap;\n' +
            'in vec2 fTextCoordsBumb;\n' +
            'uniform sampler2D shadowMap;\n' +
            'in vec2 fTextCoordsShadow;\n' 
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

    static doLightCalcs({lights}) {
        let lightsCalc =
            '\tvec3 viewDir = normalize(viewPos - fPos);\n' +
            '\tvec3 norm = normalize(fNormal);\n'// +

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
