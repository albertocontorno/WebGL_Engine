/**
 * @author Alberto Contorno
 * @class
 */
import { ShaderUtils } from './shadersUtils';

export class ShaderProgram{
  program;
  errors = [];
  constructor(gl, shaders){
    this.program = ShaderUtils.createShaderProgramFromShaders(shaders);
    let shaderError = ShaderUtils.checkShaderProgramLinkingErrors(this.program);
    if (shaderError) { 
      console.log('err prog',shaderError);
      this.errors.push(shaderError) 
    }
  }
}