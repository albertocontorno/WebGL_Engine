/**
 * @author Alberto Contorno
 * @class
 */
import { ShaderUtils } from './shadersUtils';

export class ShaderProgram{
  static nextId = 1;
  program;
  errors = [];
  constructor(gl, shaders){
    ShaderProgram.nextId++;
    this.id = ShaderProgram.nextId;
    this.program = ShaderUtils.createShaderProgramFromShaders(shaders);
    let shaderError = ShaderUtils.checkShaderProgramLinkingErrors(this.program);
    if (shaderError) { 
      console.log('err prog',shaderError);
      this.errors.push(shaderError) 
    }
  }
}