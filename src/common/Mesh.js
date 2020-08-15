import {Shader} from './Shader';
import {ShaderProgram} from './ShaderProgram';
import {ShaderFactory} from '../shaders/ShaderFactory';
import { vec3, flatten, mat4, translate, rotate, rotateX, rotateY, rotateZ, scalem, mult } from './Utils/Vector_Matrix';
import { Material } from './Material';
import { LightTypes } from "./Utils/constants";
/**
 * @author Alberto Contorno
 * @class
 */
export class Mesh{
  static nextId = 1;
  vertices;
  indices;
  shaders = {vertex: null, fragment: null, program: null, set: false}
  id;
  VAO;
  VBO;
  EBO;
  NBO;
  type;
  locations = {};
  textures = {}; // {diffuseMap, specularMap, normalMap, BumbpMap, shadowMap}
  normals;
  material;
  textCoords;
  shaderUpdated = false;
  /*
    opt : keepData, autoUpdateShaders, shadersShouldUpdate
  */
  /**
   * 
   * @param {*} gl 
   * @param {*} vertices 
   * @param {*} indices 
   * @param {{ vertex: string, fragment: string }} shaders
   * @param {*} opt 
   * @param {*} textures // props.material.textures = {  DIFFUSE_MAP: 1, SPECULAR_MAP: 1, NORMAL_MAP: 1, LIGHT_MAP: 1, BUMP_MAP: 1, SHADOW_MAP: 1 };
   * @param {*} textCoords 
   */
  constructor(gl, vertices, indices, shaders, opt, textures, textCoords, normals, colors){
    Mesh.nextId++;
    this.gl = gl;
    this.id = Mesh.nextId;
    this.vertices = vertices;
    this.colors = colors;
    this.indices = indices;
    this.opt = opt || { keepData: true };
    this.type = this.opt.type || gl.TRIANGLES;
    this.textures = Object.assign({ DIFFUSE_MAP: null, SPECULAR_MAP: null, NORMAL_MAP: null, LIGHT_MAP: null, BUMP_MAP: null, SHADOW_MAP: null}, textures);;
    this.textCoords = textCoords;
    this.normals = normals;

    this.shaders = {};
    //Create shader if passed else do it automatically from info
    // TODO create shader from object properties, update when properties change (eg. a component in the object is removed)
    console.log('MESH CREATED_'+this.id, this);
  }

  createAndLoadBuffers(gl){
    this.VAO = gl.createVertexArray();
    gl.bindVertexArray(this.VAO);

    this.VBO = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.VBO);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(this.vertices), gl.STATIC_DRAW);

    let positionLoc = gl.getAttribLocation(this.shaders.program.program, 'vPosition');
    gl.vertexAttribPointer(positionLoc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLoc);

    if (this.normals) {
      this.NBO = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, this.NBO);
      gl.bufferData(gl.ARRAY_BUFFER, flatten(this.normals), gl.STATIC_DRAW);
      let normalLoc = gl.getAttribLocation(this.shaders.program.program, 'vNormal');
      gl.vertexAttribPointer(normalLoc, 3, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(normalLoc);
    }

    this.locations.textures = {};
    if(this.textures.DIFFUSE_MAP){
      if (this.textCoords){
        this.textCoordBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.textCoordBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(this.textCoords), gl.STATIC_DRAW);
        let textCoordLoc = gl.getAttribLocation(this.shaders.program.program, 'vDiffuseTextCoords');
        gl.vertexAttribPointer(textCoordLoc, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(textCoordLoc);
      }
    }

    if (this.indices) {
      this.EBO = gl.createBuffer();
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.EBO);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), gl.STATIC_DRAW);
    }

    if(this.colors){
      this.CBO = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, this.CBO);
      gl.bufferData(gl.ARRAY_BUFFER, flatten(this.colors), gl.STATIC_DRAW);
      let colorsLoc = gl.getAttribLocation(this.shaders.program.program, 'vColor');
      gl.vertexAttribPointer(colorsLoc, 4, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(colorsLoc);
    }
    
    /* let textCoordLoc = gl.getAttribLocation(this.shaders.program.program, 'vTextCoord');
    gl.vertexAttribPointer(textCoordLoc, 3, gl.FLOAT, false, 32, 12);
    gl.enableVertexAttribArray(textCoordLoc); */

    //questa parte la fara l'engine
    this.locations.modelLoc = gl.getUniformLocation(this.shaders.program.program, 'model');
    this.locations.viewLoc = gl.getUniformLocation(this.shaders.program.program, 'view');
    this.locations.projLoc = gl.getUniformLocation(this.shaders.program.program, 'projection');

    this.unbindVAO(gl);
    //TODO
    //in teoria this.vertices, e this.indices non serve più e possiamo tenerci solo la this.indices.lenght
    //se servono usiamo un flag per decidere di tenerli
    if(this.opt && !this.opt.keepData){
      this.vertices = null;
      this.indices = null;
      this.textCoords = null;
    }

  }

  unbindVAO(gl){
    gl.bindVertexArray(null);
  }

  getModelMatrix(object){
    let transform = object.transform;
    
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

    if (object.parent) {
      modelMatrix = mult(this.getModelMatrix(object.parent), modelMatrix);
    }

    return modelMatrix;
  }

  getDirectionalLightLocations(gl, lightName){
    let lightLocs = {type: LightTypes.DirectionalLight};
    lightLocs.ambient = gl.getUniformLocation(this.shaders.program.program, lightName+'.ambient');
    lightLocs.diffuse = gl.getUniformLocation(this.shaders.program.program, lightName +'.diffuse');
    lightLocs.specular = gl.getUniformLocation(this.shaders.program.program, lightName +'.specular');
    lightLocs.direction = gl.getUniformLocation(this.shaders.program.program, lightName +'.direction');
    return lightLocs;
  }

  getPointLightLocations(gl, lightName){
    let lightLocs = { type: LightTypes.PointLight };
    lightLocs.position = gl.getUniformLocation(this.shaders.program.program, lightName + '.position');
    lightLocs.ambient = gl.getUniformLocation(this.shaders.program.program, lightName + '.ambient');
    lightLocs.diffuse = gl.getUniformLocation(this.shaders.program.program, lightName + '.diffuse');
    lightLocs.specular = gl.getUniformLocation(this.shaders.program.program, lightName + '.specular');
    lightLocs.constant = gl.getUniformLocation(this.shaders.program.program, lightName + '.constant');
    lightLocs.linear = gl.getUniformLocation(this.shaders.program.program, lightName + '.linear');
    lightLocs.quadratic = gl.getUniformLocation(this.shaders.program.program, lightName + '.quadratic');
    return lightLocs;
  }

  getSpotLightLocations(lightName){
    const gl = this.gl;
    let lightLocs = { type: LightTypes.SpotLight };
    lightLocs.position = gl.getUniformLocation(this.shaders.program.program, lightName + '.position');
    lightLocs.ambient = gl.getUniformLocation(this.shaders.program.program, lightName + '.ambient');
    lightLocs.diffuse = gl.getUniformLocation(this.shaders.program.program, lightName + '.diffuse');
    lightLocs.specular = gl.getUniformLocation(this.shaders.program.program, lightName + '.specular');
    lightLocs.constant = gl.getUniformLocation(this.shaders.program.program, lightName + '.constant');
    lightLocs.linear = gl.getUniformLocation(this.shaders.program.program, lightName + '.linear');
    lightLocs.quadratic = gl.getUniformLocation(this.shaders.program.program, lightName + '.quadratic');
    lightLocs.cutOff = gl.getUniformLocation(this.shaders.program.program, lightName + '.cutOff');
    lightLocs.outerCutOff = gl.getUniformLocation(this.shaders.program.program, lightName + '.outerCutOff');
    lightLocs.direction = gl.getUniformLocation(this.shaders.program.program, lightName + '.direction');
    return lightLocs;
  }

  getLocations(lights){
    const gl = this.gl;
    //vertex
    this.locations.modelLoc = gl.getUniformLocation(this.shaders.program.program, 'model');
    this.locations.viewLoc = gl.getUniformLocation(this.shaders.program.program, 'view');
    this.locations.projLoc = gl.getUniformLocation(this.shaders.program.program, 'projection');
    //fragment
    this.locations.viewPosLoc = gl.getUniformLocation(this.shaders.program.program, 'viewPos');
    this.locations.materialLocs = {};
    this.locations.materialLocs.ambient = gl.getUniformLocation(this.shaders.program.program, 'material.ambient');
    this.locations.materialLocs.diffuse = gl.getUniformLocation(this.shaders.program.program, 'material.diffuse');
    this.locations.materialLocs.specular = gl.getUniformLocation(this.shaders.program.program, 'material.specular');
    this.locations.materialLocs.shininess = gl.getUniformLocation(this.shaders.program.program, 'material.shininess');

    if(lights && lights.length > 0){
      this.locations.lights = [];
      for (let i = 0; i < lights.length; i++) {
        if (lights[i].type == LightTypes.DirectionalLight) {
          this.locations.lights.push(this.getDirectionalLightLocations(gl, 'light' + i));
        } else if (lights[i].type == LightTypes.PointLight) {
          this.locations.lights.push(this.getPointLightLocations(gl, 'light' + i));
        } else if (lights[i].type == LightTypes.SpotLight) {
          this.locations.lights.push(this.getSpotLightLocations(gl, 'light' + i));
        }
      }
    }
  }

  updateShadersAndProgram(material, lights, lightsTypes, name){
    this.shaderUpdated = true;
      const props = { id: name,
        material: {
          ...material,
          textures:  this.textures,
          vertexColoring: !!this.colors
        },
        lights: {
          lights: lights,
          lightsTypes: lightsTypes
        }
      }
      
      let v = ShaderFactory.CreateVertexShaderFromProperties(props);
      let f = ShaderFactory.CreateFragmentShaderFromProperties(props, name);
      this.shaders.vertex = new Shader(this.gl, 'vertex', v);;
      this.shaders.fragment = new Shader(this.gl, 'fragment', f);

      console.log(this.id, name, this.textures, props);

      let shaders = [];
      for(let key in this.shaders){
        if (key != 'program' && key != 'set'){
          shaders.push(this.shaders[key].shader);
        }
      }

      this.shaders.program = new ShaderProgram(this.gl, shaders);
      if (this.opt && !this.opt.keepData) {
        this.shaders.vertex= null;
        this.shaders.fragment = null;
      }

      this.getLocations(lights);
      this.createAndLoadBuffers(this.gl);
  }

  render(gl, camera, transform = {}, type, material, lights, lightsTypes, n) {
    //Update shader
    if(!this.shaderUpdated) this.updateShadersAndProgram(material, lights, lightsTypes, n);
    
    gl.useProgram(this.shaders.program.program); 
    gl.bindVertexArray(this.VAO);

    let modelMatrix = this.getModelMatrix(transform);
    let projMatrix = camera.getProjectionMatrix();
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
    if (this.locations.viewPosLoc) {
      gl.uniform3fv(this.locations.viewPosLoc, camera.getFrontVector());
    }

    if (this.locations.materialLocs){
      if (!material){ material = new Material(); }
      gl.uniform3fv(this.locations.materialLocs.ambient, flatten(material.ambient));
      gl.uniform3fv(this.locations.materialLocs.diffuse, material.diffuse);
      gl.uniform3fv(this.locations.materialLocs.specular, material.specular);
      gl.uniform1f(this.locations.materialLocs.shininess, material.shininess);
    }

    if (this.locations.lights){
      for (let i = 0; i < this.locations.lights.length; i++){
        if (this.locations.lights[i].type === LightTypes.DirectionalLight) {
          this.setupDirectionalLight(gl, this.locations.lights[i], lights[i]);
        } else if (this.locations.lights[i].type === LightTypes.PointLight) {
          this.setupPointLight(gl, this.locations.lights[i], lights[i]);
        } else if (this.locations.lights[i].type === LightTypes.SpotLight) {
          this.setupSpotLight(gl, this.locations.lights[i], lights[i]);
        }
      }
    }

    Object.values(this.textures).forEach(texture => {
      //load texture path
      if (texture) texture.ActiveTexture(gl);
    });

    if (this.indices) {//draw elements
      gl.drawElements(type || gl.TRIANGLES, this.indices.length, gl.UNSIGNED_SHORT, 0);
    } else { //draw arrays
      gl.drawArrays(type || gl.TRIANGLES, 0, this.vertices.length);
    }

    Object.values(this.textures).forEach(texture => {
      if (texture) texture.DisactiveTexture(gl);
    });
    
    gl.bindVertexArray(null);
    gl.useProgram(null);
  }

  destroyShader(shader, gl){
    gl.deleteShader(shader);
  }

  destroyShaders(gl){

  }

  destroyProgram(program, gl){

  }

  destroy(gl){
    this.destroyProgram(gl);
    this.destroyShaders(gl);
  }

  setupDirectionalLight(gl, lightLocs, light){
    gl.uniform3fv(lightLocs.ambient, light.light.ambient);
    gl.uniform3fv(lightLocs.diffuse, light.light.diffuse);
    gl.uniform3fv(lightLocs.specular, light.light.specular);
    gl.uniform3fv(lightLocs.direction, light.light.direction);
  }

  setupPointLight(gl, lightLocs, light) {
    gl.uniform3fv(lightLocs.position, light.light.position);
    gl.uniform3fv(lightLocs.ambient, light.light.ambient);
    gl.uniform3fv(lightLocs.diffuse, light.light.diffuse);
    gl.uniform3fv(lightLocs.specular, light.light.specular);
    gl.uniform1f(lightLocs.constant, light.light.constant);
    gl.uniform1f(lightLocs.linear, light.light.linear);
    gl.uniform1f(lightLocs.quadratic, light.light.quadratic);
  }

  setupSpotLight(gl, lightLocs, light) {
    gl.uniform3fv(lightLocs.position, light.light.position);
    gl.uniform3fv(lightLocs.ambient, light.light.ambient);
    gl.uniform3fv(lightLocs.diffuse, light.light.diffuse);
    gl.uniform3fv(lightLocs.specular, light.light.specular);
    gl.uniform1f(lightLocs.constant, light.light.constant);
    gl.uniform1f(lightLocs.linear, light.light.linear);
    gl.uniform1f(lightLocs.quadratic, light.light.quadratic);
    gl.uniform1f(lightLocs.cutOff, light.light.cutOff);
    gl.uniform1f(lightLocs.outerCutOff, light.light.outerCutOff);
    gl.uniform3fv(lightLocs.direction, light.light.direction);
  }
}