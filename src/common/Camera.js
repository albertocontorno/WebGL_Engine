/**
 * @author Alberto Contorno
 * @class
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

  getProjectionMatrix(){
    return this.proj;
  }

  getViewMatrix(){
    this.front = vec3(
      this.position[0] + this.direction[0],
      this.position[1] + this.direction[1],
      this.position[2] + this.direction[2]
    );
    return lookAt(this.front, this.position, this.up);
  }

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

  _updateCameraPos(newPos){
    this.position = vec3(newPos[0], newPos[1], 0.0);
  }

  moveForward(deltaTime){
    this.position = subtract(
      this.position, scale(this.speed * deltaTime, this.direction)
    );
  }

  moveBackwards(deltaTime){
    this.position = add(
      this.position, scale(this.speed * deltaTime, this.direction)
    );
  }

  moveLeft(deltaTime){
    this.position = add(
      this.position, scale(this.speed * deltaTime, normalize(cross(this.direction, this.up)))
    );
  }

  moveRight(deltaTime){
    this.position = subtract(
      this.position, scale(this.speed * deltaTime, normalize(cross(this.direction, this.up)))
    );
  }

  moveUp(deltaTime){
    this.position =  add(
      this.position, scale(this.speed * deltaTime, vec3(0, 1, 0))
    );
  }

  moveDown(deltaTime){
    this.position = subtract(
      this.position, scale(this.speed * deltaTime, vec3(0, 1, 0))
      );

  }

  setZoomLevels(zooms){
    this.zooms = zooms;
  }

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