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
    constructor(gl){
      Math.radians = degrees => {
        var pi = Math.PI;
        return degrees * (pi / 180);
      };

      Math.clamp = function (number, min, max) {
        return Math.max(min, Math.min(number, max));
      };
      this.gl = gl;
      this.time = new Time();
      ShaderUtils.setGlContext(this.gl);
    }

    addScene(scene){
      this.scenes.push(scene);
      if (!this.activeScene){
        this.activeScene = this.scenes.length - 1;
      }
    }

    doRendering() {
      //scena passa camera
      this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
      this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
      if (this.scenes[this.activeScene] && this.scenes[this.activeScene].mainCamera){
          for (let obj of this.scenes[this.activeScene].objects){
              obj.onUpdate();
              obj.render(this.gl, this.scenes[this.activeScene].mainCamera);
          }
      }
      this.time.updateTime();
      window.requestAnimationFrame(this.doRendering.bind(this));
    }
}