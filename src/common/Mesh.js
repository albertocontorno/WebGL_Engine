import {Shader} from './Shader';
import {ShaderProgram} from './ShaderProgram';

/**
 * @author Alberto Contorno
 * @class
 */
export class Mesh{
  static nextId = 0;
  vertices;
  indices;
  shaders = {vertex: null, fragment: null, program: null}
  id;
  VAO;
  VBO;
  EBO;
  type;
  locations = {};
  textures = [];
  normals;
  material;
  textCoords;
  constructor(gl, vertices, indices, shaders, opt, textures, textCoords){
    Mesh.nextId++;
    this.id = Mesh.nextId;
    this.vertices = vertices;
    this.indices = indices;
    this.shaders = shaders;
    this.opt = opt || { keepData: true };
    this.type = this.opt.type || gl.TRIANGLES;
    this.textures = textures || [];
    this.textCoords = textCoords;
    this.setupShadersAndProgram(gl);
    this.createAndLoadBuffers(gl);
    console.log('MESH CREATED_'+this.id, this);
  }

  createAndLoadBuffers(gl){
    this.VAO = gl.createVertexArray();
    gl.bindVertexArray(this.VAO);

    this.VBO = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.VBO);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(this.vertices), gl.STATIC_DRAW);
    
    if (this.indices) {
      this.EBO = gl.createBuffer();
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.EBO);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), gl.STATIC_DRAW);
    }

    let positionLoc = gl.getAttribLocation(this.shaders.program.program, 'vPosition');
    gl.vertexAttribPointer(positionLoc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLoc);
    
    if (this.textCoords){
      this.textCoordBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, this.textCoordBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, flatten(this.textCoords), gl.STATIC_DRAW);
      let textCoordLoc = gl.getAttribLocation(this.shaders.program.program, 'textCoords');
      gl.vertexAttribPointer(textCoordLoc, 2, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(textCoordLoc);
    }

    /* let normalLoc = gl.getAttribLocation(this.shaders.program.program, 'vNormal');
    gl.vertexAttribPointer(normalLoc, 3, gl.FLOAT, false, 32, 12);
    gl.enableVertexAttribArray(normalLoc);

    let textCoordLoc = gl.getAttribLocation(this.shaders.program.program, 'vTextCoord');
    gl.vertexAttribPointer(textCoordLoc, 3, gl.FLOAT, false, 32, 12);
    gl.enableVertexAttribArray(textCoordLoc); */

    //questa parte la fara l'engine
    this.locations.modelLoc = gl.getUniformLocation(this.shaders.program.program, 'model');
    this.locations.viewLoc = gl.getUniformLocation(this.shaders.program.program, 'view');
    this.locations.projLoc = gl.getUniformLocation(this.shaders.program.program, 'projection');

    gl.bindVertexArray(null);
    //TODO
    //in teoria this.vertices, e this.indices non serve più e possiamo tenerci solo la this.indices.lenght
    //se servono usiamo un flag per decidere di tenerli
    if(this.opt && !this.opt.keepData){
      this.vertices = null;
      this.indices = null;
    }

  }

  setupShadersAndProgram(gl){
    this.shaders.vertex = new Shader(gl, 'vertex', this.shaders.vertex);
    if (this.shaders.vertex.errors.lenght > 0){
      this.destroyShader(this.shaders.fragment, gl);
      console.error('error vertex', this.shaders.vertex.errors);
      return;
    }
    this.shaders.fragment = new Shader(gl, 'fragment', this.shaders.fragment);
    if (this.shaders.fragment.errors.lenght > 0) {
      this.destroyShader(this.shaders.fragment);
      console.error("error fragment", this.shaders.fragment.errors);
      return;
    }

    let shaders = [];
    for( let key in this.shaders){
      if (key != 'program'){
        shaders.push(this.shaders[key].shader);
      }
    }

    this.shaders.program = new ShaderProgram(gl, shaders);
    if (this.shaders.program.errors.length > 0) {
      this.destroyProgram(this.shaders.program, gl);
      console.error('error in linking program', this.shaders.program.errors);
      return;
    }

    //TODO
    //gli shader source non servono più, eliminabili
    if (this.opt && !this.opt.keepData) {
      this.shaders.vertex= null;
      this.shaders.fragment = null;
    }
    //se qualcosa non va bene distruggere shaders e program
  }

  getModelMatrix(transform){
    let position = transform.position || [0, 0, 0];
    let rotation = transform.rotation || [0, 0, 0];
    let scale = transform.scale || [1, 1, 1];

    let modelMatrix = mat4();
    // da costruire a partire dalla posizione dell'oggetto
    let traslationMatrix = translate(position[0], position[1], position[2]);
    //da costruire a partire dalla rotazione dell'oggetto
    let rotationMatrixX = rotateX(rotation[0]);
    let rotationMatrixY = rotateY(rotation[1]);
    let rotationMatrixZ = rotateZ(rotation[2]);

    let scaleMatrix = scalem(scale[0], scale[1], scale[2]);

    //translate * rotate * scale
    modelMatrix = mult(traslationMatrix, rotationMatrixX);
    modelMatrix = mult(modelMatrix, rotationMatrixY);
    modelMatrix = mult(modelMatrix, rotationMatrixZ);
    modelMatrix = mult(modelMatrix, scaleMatrix);

    return modelMatrix;
  }

  render(gl, camera, transform = {}, type, material) {

    gl.useProgram(this.shaders.program.program);
    gl.bindVertexArray(this.VAO);

    let modelMatrix = this.getModelMatrix(transform);
    let projMatrix = camera.getProjectionMatrix(); //TODO lo fara l'engine
    let viewMatrix = camera.getViewMatrix();

    if (this.locations.modelLoc) {
      gl.uniformMatrix4fv(this.locations.modelLoc, false, flatten(modelMatrix));
    }
    if (this.locations.viewLoc) {
      gl.uniformMatrix4fv(this.locations.viewLoc, false, flatten(viewMatrix));
    }
    if (this.locations.projLoc) {
      gl.uniformMatrix4fv(this.locations.projLoc, false, flatten(projMatrix));
    }

    this.textures.forEach(texture => {
      if (texture) texture.UseTexture(gl);
    });

    if (this.indices) {//draw elements
      gl.drawElements(type || gl.TRIANGLES, this.indices.length, gl.UNSIGNED_SHORT, 0);
    } else { //draw arrays
      gl.drawArrays(type || gl.TRIANGLES, 0, this.vertices.length/4);
    }

    gl.bindVertexArray(null);
    gl.useProgram(null);
  }

  destroyShader(shader, gl){

  }

  destroyShaders(gl){

  }

  destroyProgram(program, gl){

  }

  destroy(gl){
    this.destroyProgram(gl);
    this.destroyShaders(gl);
  }
}