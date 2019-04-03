import {ShaderUtils} from './shadersUtils'
import { Time } from './Time';
/**
 * @author Alberto Contorno
 * @class
 * class that represent the entire Engine.
 * It takes care of the main loop fo the rendering and of the updating of the time
 * It initialize the GL context, and maintains the list of scenes, of which only one is the active (rendered) one.
 */
export class Engine{ //TODO SCENE MANAGER
    scenes = [];
    activeScene;
    gl;
    time;
    opt;
    /**
     * Create a new Engine and do the setup of all the environment.
     * @param {WebGL_Context} gl The WebGl context obtained from a canvas. This will be the context of the entire Engine.
     * used as the context of every Shader.
     */
    constructor(gl, opt){
      Math.radians = degrees => {
        var pi = Math.PI;
        return degrees * (pi / 180);
      };

      Math.clamp = function (number, min, max) {
        return Math.max(min, Math.min(number, max));
      };
      this.gl = gl;
      this.time = new Time();
      this.opt = opt;
      ShaderUtils.setGlContext(this.gl);

      if(this.opt){
        if(this.opt.showFps){
          this.setFpsCounter();
        }
      }
    }

    /**
     * 
     * @param {Scene} scene add a scene to the list of scenes that the Engine manages.
     * If there is no active scene, the added scene is set as the active one.
     */
    addScene(scene){
      this.scenes.push(scene);
      if (!this.activeScene){
        this.activeScene = this.scenes.length - 1;
      }
    }

    /**
     * Starts the rendering and the update of the time at every frame.
     */
    doRendering() {
      //scena passa camera
      this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
      this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
      if (this.scenes[this.activeScene] && this.scenes[this.activeScene].mainCamera){
        this.scenes[this.activeScene].renderScene(this.gl);
      }
      this.time.updateTime();
      window.requestAnimationFrame(this.doRendering.bind(this));
    }

    setFpsCounter(){
      let container = document.createElement('div');
      let idNum = Math.round(Math.random(0, 1) * 100);
      container.setAttribute("style",
      `position: absolute;
      top: 10px;
      left: 20px;
      color: yellow;`);
      container.id = 'glFpsCounterContainer_' + idNum;
      let text = document.createElement('p');
      text.id = 'glFpsCounterText_'+ idNum;
      container.appendChild(text);
      document.body.appendChild(container);
      this.time.subscribeFps(() => { text.innerHTML = 'FPS: ' + this.time.frames; })
    }
}