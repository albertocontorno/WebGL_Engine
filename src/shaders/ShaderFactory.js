import { Mesh } from '../common/Mesh';
import { LightTypes, TextureTypes } from '../common/Utils/constants';
import * as shaderDefault from './shaderDefaults';
import { Material } from '../common/Material';
/**
 * @author Alberto Contorno
 * @class
 * Class used to create Default Shaders according to Mesh properties.
 */
export class ShaderFactory{
    

    // ==============================================================================================================================
    /**
     * 
     * @param {{
        *  material : { diffuse, specular, specular, shininess, 
        *      textures: { diffuseMap, specularMap, lightMap, bumpMap, shadowMap}
        *  },
        *  lights : {lights, lightsValues: []},
        * }} props 
    */
    static CreateVertexShaderFromProperties(props) {
        let vertexSource = shaderDefault.vertexCompleteShaderObj();
        if(props.material){
            const textures = props.material.textures
            if(textures){
                if(textures[TextureTypes.DiffuseMap]){
                    vertexSource.diffuseCoordsIn = shaderDefault.vDiffuseCoords_In;
                    vertexSource.diffuseCoordsOut = shaderDefault.vDiffuseCoords_Out;
                    vertexSource.diffuseAssign = shaderDefault.vDiffuseCoords_Assign;
                } 
                if(textures[TextureTypes.SpecularMap]){
                    vertexSource.specularCoordsIn = shaderDefault.vSpecularCoords_In;
                    vertexSource.specularCoordsOut = shaderDefault.vSpecularCoords_Out;
                    vertexSource.specularAssign = shaderDefault.vSpecularCoords_Assign;
                } 
                /* if(textures[TextureTypes.LightMap]){
                    vertexSource.specularCoordsIn = shaderDefault.vSpecularCoords_In;
                    vertexSource.specularCoordsOut = shaderDefault.vSpecularCoords_Out;
                    vertexSource.specularAssign = shaderDefault.vSpecularCoords_Assign;
                } 
                if(textures[TextureTypes.BumpMap]){
                    vertexSource.specularCoordsIn = shaderDefault.vSpecularCoords_In;
                    vertexSource.specularCoordsOut = shaderDefault.vSpecularCoords_Out;
                    vertexSource.specularAssign = shaderDefault.vSpecularCoords_Assign;
                } 
                if(textures[TextureTypes.ShadowMap]){
                    vertexSource.specularCoordsIn = shaderDefault.vSpecularCoords_In;
                    vertexSource.specularCoordsOut = shaderDefault.vSpecularCoords_Out;
                    vertexSource.specularAssign = shaderDefault.vSpecularCoords_Assign;
                } */
            }
        }

        vertexSource = Object.values(vertexSource).join('');
        return vertexSource;
    }

    /**
     * 
     * @param {{
        *  material : { diffuse, specular, specular, shininess, 
        *      textures: { diffuseMap, specularMap, lightMap, bumpMap, shadowMap}
        *  },
        *  lights : {lights, lightsValues: []},
        * }} props
     */
    static CreateFragmentShaderFromProperties(props, n) {
        let fragmentSource = shaderDefault.fragmentShaderCompleteObj();
        console.log(JSON.parse(JSON.stringify(fragmentSource)))
        let hasLights = false;
        let hasTexture ={  hasDiffuseTexture: false };

        if(props.material){
            fragmentSource.materialStruct = shaderDefault.materialStruct;
            fragmentSource.material = shaderDefault.materialVar;
            const textures = props.material.textures
            if(textures){
                if(textures[TextureTypes.DiffuseMap]){
                    
                    fragmentSource.samplers += shaderDefault.diffuseMapVar;
                    fragmentSource.texturesCoords += shaderDefault.fDiffuseCoords;
                    hasTexture.hasDiffuseTexture = true;
                } 
                if(textures[TextureTypes.SpecularMap]){
                    fragmentSource.samplers += shaderDefault.specularMapVar;
                    fragmentSource.texturesCoords += shaderDefault.fSpecularCoords;
                } 
                if(textures[TextureTypes.LightMap]){
                    fragmentSource.samplers += shaderDefault.lightMapVar;
                    fragmentSource.texturesCoords += shaderDefault.fLightCoords;
                } 
                if(textures[TextureTypes.BumpMap]){
                    fragmentSource.samplers += shaderDefault.bumbMapVar;
                    fragmentSource.texturesCoords += shaderDefault.fBumpCoords;
                } 
                if(textures[TextureTypes.ShadowMap]){
                    fragmentSource.samplers += shaderDefault.shadowMapVar;
                    fragmentSource.texturesCoords += shaderDefault.fShadowCoords;
                }
                fragmentSource.textureCalc = this.getTexturesCalc(props.material.textures);
            }
        }

        if(props.lights){
            hasLights = true;
            fragmentSource.lightsStructs = this.getLightsStructsFromLights(props.lights.lightsTypes);
            fragmentSource.lightsFuncDec = this.getLightsFuncDec(props.lights.lightsTypes);
            fragmentSource.lightsUniform = this.getLightsVarsFromLights(props.lights.lights);
            fragmentSource.lightsCalc = this.doLightCalcs(props.lights.lights, props.material.textures);
            fragmentSource.lightsFuncImpl = this.getLightsFuncImpl(props.lights.lightsTypes, props.material.textures);
            fragmentSource.fragOutput = shaderDefault.fOutput_Lights;
        }

        fragmentSource = Object.values(fragmentSource).join('');
        return fragmentSource;
    }


    //===================UTILS===================
    static getLights(sources){
        let lights = '';
        if (sources && sources.lights){
            for (let i = 0; i < sources.lights.length; i++) {
                lights +='uniform Light light'+i+';\n';
            }
        }
        return lights;
    }

    static doLightCalcs(lights, textureTypes) {
        let lightsCalc =
            '\tvec3 viewDir = normalize(viewPos - fPos);\n' +
            '\tvec3 norm = normalize(fNormal);\n'// se c'è normal map usare quella

        for(let i=0; i<lights.length; i++){
            if( i == 0){
                lightsCalc += '\tvec3 lightColor = '; 
            } else {
                lightsCalc += '\tlightColor += ';
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

    static getLightsFuncImpl(lightsTypes, textures){
        let r = '';

        if (lightsTypes[LightTypes.DirectionalLight]){
            const lightSource = shaderDefault.DirLightFuncImplObj();
            if(textures){ this.setLightSourceTextures(lightSource, textures); }
            r += Object.values(lightSource).join('');
        }
        if(lightsTypes[LightTypes.PointLight]){
            const lightSource = shaderDefault.PointLightFuncImplObj();
            if(textures){ this.setLightSourceTextures(lightSource, textures); }
            r += Object.values(lightSource).join('');
        }
        if (lightsTypes[LightTypes.SpotLight]){
            const lightSource = shaderDefault.SpotLightFuncImplObj();
            if(textures){ this.setLightSourceTextures(lightSource, textures); }
            r += Object.values(lightSource).join('');
        }

        return r;
    }

    static setLightSourceTextures(lightSource, textures){
        if(textures[TextureTypes.DiffuseMap] && textures[TextureTypes.SpecularMap]){
            lightSource.bodyAmbient = shaderDefault.LightAmbientWithTexture_Diff_Spec;
            lightSource.bodyDiffuse = shaderDefault.LightDiffuseWithTexture_Diff_Spec;
            lightSource.bodySpecular = shaderDefault.LightSpecularWithTexture_Diff_Spec;
        } else if(textures[TextureTypes.DiffuseMap] && !textures[TextureTypes.SpecularMap]){
            lightSource.bodyAmbient = shaderDefault.LightAmbientWithTexture_Diff;
            lightSource.bodyDiffuse = shaderDefault.LightDiffuseWithTexture_Diff;
            lightSource.bodySpecular = shaderDefault.LightSpecularWithTexture_Diff;
        } else if(!textures[TextureTypes.DiffuseMap] && textures[TextureTypes.SpecularMap]){
            lightSource.bodyAmbient = shaderDefault.LightAmbientWithTexture_Spec;
            lightSource.bodyDiffuse = shaderDefault.LightDiffuseWithTexture_Spec;
            lightSource.bodySpecular = shaderDefault.LightSpecularWithTexture_Spec;
        }
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

    //FOR FUTURE
    static getTexturesCalc(textures){
        let r = '';
        return r;
    }

}
