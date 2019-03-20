/**
 * @author Alberto Contorno
 * @class
 * It represents a Camera that can be used in a Scene. 
 * It provides methods to move and rotate the camera and 
 * default view matrices ('ortho', 'perspective').
 */
export class Camera{

  position = vec3(0, 0, 0);
  rotation = vec3(0, 0, 0);
  
  up = vec3(0,1,0);
  right;
  direction = vec3(0, 0, 0);
  front = vec3(0, 0, 0);
  
  proj;
  type = 'perspective';

  yaw = 0;
  pitch = 0;

  zoomLevel = 2;
  zooms;
  sensitivity = 1;
  speed = 1;

  currX; currY; lastX; lastY;
  
  moveKeys = {forward: 'w', backward: 's', right: 'd', left: 'a' };

  updateCameraDirection;
  updateCameraPos;
  inputs;
  time;
  //per ortho left = -1.0; right = 1.0; ytop = 1.0; bottom = -1.0;
  
  /**
   * 
   * @param {vec3} position The initial position of the camera.
   * @param {vec3} up The up vector of the camera
   * @param {number} speed The movement speed of the camera used if the camera is moved with the inner methods.
   * @param {string} type The type of the camera. Must be 'ortho' or 'perspective'.
   * @param {object} moveKeys TO BE DEFINED
   * @param {object} projOptions Options object for more configurations (TO BE DEFINED)
   * @param {number} sensitivity The turn speed used to update the direction of the camera by the inner method.
   * @param {object} zooms An object containing all the zoom levels in the form {0: fov0, 1: fov1} (only for 'perspective' cameras)
   */
  constructor(position, up, speed, type, moveKeys, projOptions, sensitivity, zooms){
    this.sensitivity = sensitivity;
    this.speed = speed;
    this.position = position;
    this.type = type;
    this.projOptions = projOptions;
    this.zooms = zooms;
    window.addEventListener("wheel", event => {
      this.zoomLevel += Math.sign(event.deltaY);
      this.zoomLevel = Math.clamp(this.zoomLevel, 0, this.zooms.maxLevel);
      console.log("zoom ", this.zoomLevel);
      this.setZoomLevel(this.zoomLevel);
    });
    if(type && type === 'perspective'){
      this.proj = perspective(this.projOptions.fov, this.projOptions.aspect, this.projOptions.near, this.projOptions.far);
      this.updateCameraDirection = this._updateCameraDirection;
      //this.updateCameraPos = this._updateCameraPos;
    } else if (type && type === 'orthographic'){
      this.proj = ortho(this.projOptions.left, this.projOptions.right, this.projOptions.bottom, this.projOptions.ytop, this.projOptions.near, this.projOptions.far);
      this.updateCameraDirection = () => {};
    }
  }

  /**
   * Return the Projection Matrix of the camera.
   */
  getProjectionMatrix(){
    return this.proj;
  }
/**
 * Return the View Matrix of the camera.
 */
  getViewMatrix(){
    this.front = vec3(
      this.position[0] + this.direction[0],
      this.position[1] + this.direction[1],
      this.position[2] + this.direction[2]
    );
    return lookAt(this.front, this.position, this.up);
  }
/**
 * It updates the direction of the camera.
 * @param {number} offsetX Offset on X direction to update the yaw of the camera (i.e. how much the camera must turn to the rigth/left)
 * @param {number} offsetY Offset on Y direction to update the pitch of the camera (i.e. how much the camera must turn up/down)
 * @param {number} deltaTime The delta time used to scale the quantities of the movements to make everything indipendent from the frame rate
 */
  _updateCameraDirection(offsetX, offsetY, deltaTime) {
    offsetX *= this.sensitivity * deltaTime;
    offsetY *= this.sensitivity * deltaTime;
    this.yaw += offsetX;
    this.pitch += offsetY;

    if (this.pitch > 89.0) { this.pitch = 89.0; }
    if (this.pitch < -89.0) { this.pitch = -89.0;}
    this.direction = vec3(
      Math.cos(Math.radians(this.pitch)) * Math.cos(Math.radians(this.yaw)),
      Math.sin(Math.radians(this.pitch)),
      Math.cos(Math.radians(this.pitch)) * Math.sin(Math.radians(this.yaw))
    );
  }

  /**
   * Set a new position for the camera.
   * @param {vec3} newPos A vector of 3 components (x,y,z) representing the new positon of the camera in the world
   */
  _updateCameraPos(newPos){
    this.position = vec3(newPos[0], newPos[1], 0.0);
  }
  /**
   * Move the camera forward with respect to the current looking direction, based on the camera speed,
   *  @param {number} deltaTime The delta time used to scale the quantity of the movement to make it indipendent from the frame rate
   */
  moveForward(deltaTime){
    this.position = subtract(
      this.position, scale(this.speed * deltaTime, this.direction)
    );
  }
  /**
   * Move the camera backwards with respect to the current looking direction, based on the camera speed,
   *  @param {number} deltaTime The delta time used to scale the quantity of the movement to make it indipendent from the frame rate
   */
  moveBackwards(deltaTime){
    this.position = add(
      this.position, scale(this.speed * deltaTime, this.direction)
    );
  }
  /**
   * Move the camera to the left with respect to the current looking direction, based on the camera speed,
   *  @param {number} deltaTime The delta time used to scale the quantity of the movement to make it indipendent from the frame rate
   */
  moveLeft(deltaTime){
    this.position = add(
      this.position, scale(this.speed * deltaTime, normalize(cross(this.direction, this.up)))
    );
  }
  /**
   * Move the camera to the left with respect to the current looking direction, based on the camera speed,
   *  @param {number} deltaTime The delta time used to scale the quantity of the movement to make it indipendent from the frame rate
   */
  moveRight(deltaTime){
    this.position = subtract(
      this.position, scale(this.speed * deltaTime, normalize(cross(this.direction, this.up)))
    );
  }
  /**
   * Move the camera up, based on the camera speed,
   *  @param {number} deltaTime The delta time used to scale the quantity of the movement to make it indipendent from the frame rate
   */
  moveUp(deltaTime){
    this.position =  add(
      this.position, scale(this.speed * deltaTime, vec3(0, 1, 0))
    );
  }
  /**
   * Move the camera down, based on the camera speed,
   *  @param {number} deltaTime The delta time used to scale the quantity of the movement to make it indipendent from the frame rate
   */
  moveDown(deltaTime){
    this.position = subtract(
      this.position, scale(this.speed * deltaTime, vec3(0, 1, 0))
      );

  }
  /**
   * Set the configuration of the levels of zooms. Only for perspective cameras.
   * @param {object} zooms - An object of configuration. It must contains a maxLevel zoom, and a key[int]-value[int] pair for every level of zoom, indicating
   * as a key the level (an integer starting from 0 and incremented by 1 for every zoom level) and as a value the fov associated.
   * @example
   * { maxLevel: 3, 0: 30, 1: 45, 2: 75, 3: 90 },
   */
  setZoomLevels(zooms){
    this.zooms = zooms;
  }
  /**
   * Set the current level of zoom to be used, if applicable on the base of the zooms configuration.
   * @param {*} level The chosen level of zoom.
   */
  setZoomLevel(level){
    this.zoomLevel = level;
    if(this.zooms){
      this.projOptions.fov = this.zooms[this.zoomLevel] || 45;
    } else {
      this.projOptions.fov = 45;
    }
    this.proj = perspective(this.projOptions.fov, this.projOptions.aspect, this.projOptions.near, this.projOptions.far);
  }
  
}