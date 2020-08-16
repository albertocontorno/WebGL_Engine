export class ShaderUtils {

    gl;

    constructor(gl) {
      this.gl = gl;
    }

    static setGlContext(gl){
      this.gl = gl;
    }

    static compileShadersAndcreateProgram(shaders) {
      const shaderProgram = this.gl.createProgram();
      shaders.forEach(shader => {
          let compiledShader = this.loadAndCompileShader(shaders.type, shaders.source);
          this.gl.attachShader(shaderProgram, compiledShader);
      });
      this.gl.linkProgram(shaderProgram);
      return shaderProgram;
    }

    static loadAndCompileShader(type, source) {
      console.log('[SHADER] Compiling ->', ' Type: ', type, '- Source: ', source)
      let shader = this.gl.createShader(type);
      this.gl.shaderSource(shader, source);
      this.gl.compileShader(shader);
      return shader;
    }

    /**
     * @param {[vertex, fragment]} shaders 
     */
    static createShaderProgramFromShaders(shaders) {
      console.log('[SHADER_PROGRAM] Creating ->', ' Shaders: ', shaders);
      const shaderProgram = this.gl.createProgram();
    
      shaders.forEach(shader => {
        this.gl.attachShader(shaderProgram, shader);
        this.gl.deleteShader(shader);
      });
      this.gl.linkProgram(shaderProgram);
      return shaderProgram;
    }

    static checkShaderCompilingErrors(shader) {
      if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
          return this.gl.getShaderInfoLog(shader);
      } else return null;
    }

    static checkShaderProgramLinkingErrors(program) {
      if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
          return this.gl.getProgramInfoLog(program);
      } else return null;
    }

    static destroyShaderProgram(program){
      this.gl.deleteProgram(program);
    }

    static destroyShader(shader){
      this.gl.deleteShader(shader);
    }

    static setFloat(name, value) {
      this.gl.glUniform1f(this.gl.getUniformLocation(name), value);
    }

    static setBool(name, value) {
      this.gl.glUniform1i(this.gl.getUniformLocation(name), value);
    }

    static setInt(name, value) {
      this.gl.glUniform1i(this.gl.getUniformLocation(name), value);
    }

    static setMatrix(name, value){
      this.gl.glUniform4fv(this.gl.getUniformLocation(name), value);
    }

}
