import {keys} from './keyCodes';
/**
 * @author Alberto Contorno
 * @class
 * Class used to manage the user inputs. It can manage keyboard and mouse.
 */
export class InputManager{
  keysPressed = {};
  mousePressed = {};
  mousePosition = {x: 0, y: 0, movX: 0, movY: 0};
  lastMousePosition = {x: 0, y: 0};

  keyCodes = keys;
  mouseLocked = false;
  mouseLockedEl = null;

  constructor(){
    this.start();
  }

  start(){
    window.onkeydown = ({ which }) => {
      this.updateKeyPressed(which);
    };
    window.onkeyup = ({ which }) => {
      this.updateKeyUnPressed(which);
    }
    window.onmousedown = ({ which }) => {
      this.updateMousePressed(which);
    }
    window.onmouseup = ({ which }) => {
      this.updateMouseUnPressed(which);
    }
    window.onmousemove = ({clientX, clientY, movementX, movementY}) => {
      this.updateMousePosition(clientX, clientY, movementX, movementY);
    }
  }

  stop(){
    window.onkeydown = null;
    window.onkeyup = null;
    window.onmousedown = null;
    window.onmouseup = null;
    window.onmousemove = null;
  }

  clearKeyPressed() {
    this.keysPressed = { };
  }

  clearMousePosition() {
    this.mousePosition = {x:0, y:0, movX: 0, movY: 0};
  }

  lockMouse(el){
    el.requestPointerLock = el.requestPointerLock ||
      el.mozRequestPointerLock;

    document.exitPointerLock = document.exitPointerLock ||
      document.mozExitPointerLock;
    
    el.onclick = () => {
      el.requestPointerLock();
      this.mouseLockedEl = el;
      this.mouseLocked = true;
    }
 
  }

  unlockMouse(){
    document.exitPointerLock();
    this.mouseLocked = false;
    this.mouseLockedEl.requestPointerLock = null;
    document.exitPointerLock = null;
    this.mouseLockedEl = null;
  }

  updateKeyPressed(keyCode){
    this.keysPressed[keys.KEYCODES[keyCode]] = true;
  }

  updateKeyUnPressed(keyCode) {
    this.keysPressed[keys.KEYCODES[keyCode]] = false;
  }

  updateMousePressed(code){
    this.mousePressed[keys.MOUSECODES[code]] = true;
  }

  updateMouseUnPressed(code) {
    this.mousePressed[keys.MOUSECODES[code]] = false;
  }

  updateMousePosition(x, y, movX, movY){
    this.lastMousePosition.x = this.mousePosition.x;
    this.lastMousePosition.y = this.mousePosition.y;
    this.lastMousePosition.movX = this.mousePosition.movX;
    this.lastMousePosition.movY = this.mousePosition.movY;

    this.mousePosition.x = x;
    this.mousePosition.y = y;
    this.mousePosition.movX = movX;
    this.mousePosition.movY = movY;
  }

  isKeyDown(keyCode){
    return this.keysPressed[keys.KEYCODES[keyCode]] || false;
  }

  isKeyUp(keyCode){
    return !this.keysPressed[keys.KEYCODES[keyCode]] || true
  }

  isMouseDown(code){
    return this.mousePressed[keys.MOUSECODES[code]] || false;
  }

  isMouseUp(code){
    return !this.mousePressed[keys.MOUSECODES[code]] || true;
  }

  getMousePosition(){
    return this.mousePosition;
  }

  getMouseX(){
    return this.mousePosition.x;
  }

  getMouseY(){
    return this.mousePosition.y;
  }

  getMouseLastX() {
    return this.lastMousePosition.x;
  }

  getMouseLastY() {
    return this.lastMousePosition.Y;
  }

  getMouseDeltaX(){
    return this.mousePosition.x - this.lastMousePosition.x;
  }

  getMouseDeltaY(){
    return this.mousePosition.y - this.lastMousePosition.y;
  }

  getMouseMovX(){
    return this.mousePosition.movX;
  }

  getMouseMovY() {
    return this.mousePosition.movY;
  }

  isMouseLocked(){
    return this.mouseLocked;
  }
  
}