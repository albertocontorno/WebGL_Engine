
import {ShaderUtils} from './shadersUtils';

/**
 * @author Alberto Contorno
 * @class
 */
export class Shader{
    static nextId = 1;

    type;
    source;
    id;
    errors = [];
    shader;
    constructor(gl, type, source){
      Shader.nextId++;
      this.id = Shader.nextId;
      this.type = (type === 'vertex') ? gl.VERTEX_SHADER : gl.FRAGMENT_SHADER;
      this.shader = ShaderUtils.loadAndCompileShader(this.type, source);
      this.source = source;
      let shaderError = ShaderUtils.checkShaderCompilingErrors(this.shader);
      if (shaderError) { 
        console.log("err",shaderError);
        this.errors.push(shaderError); 
        }
    }

    equals(other){
      return this.id === other.id;
    }
    
}