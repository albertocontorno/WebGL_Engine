/** 
 * @author Alberto Contorno
 * @class
 * Class representing the time. 
 * It provides the current time (in ms from the start of the Engine)
 * a deltaTime between frames 
 * and a FPS counter service to which something can subscribe
 */
export class Time{
    /**
     * @property {number} deltaTime- The time passed between the last frame (in ms) and the current one. Use it to make things indipendent from the frame rate.
     * @property {number} time- The time passed since the start (in ms).
     * @property {number} frames- The current number of frames passed since last second (not precise).
     */
    deltaTime = 0;
    
    time = 0;
    currentTime = 0;
    lastTime = 0;
    secondsCounter = 0;
    frames = 0;
    fpsFnSub = null;
    constructor() {
        /**
         * someProperty is an example property that is set to `true`
         * @type {boolean}
         * @public
         */
        this.currentTime = this.lastTime = (performance ? performance : Date).now();
        this.updateTime();
    }
    /**
     * Function that update the time
     */
    updateTime(){
        this.frames++;
        if(this.secondsCounter>=1){
            this.notifyFps();
            this.secondsCounter=0;
            this.frames = 0;
        }
        this.currentTime = (performance ? performance : Date).now();
        this.deltaTime = (this.currentTime - this.lastTime) * 0.001;
        this.lastTime = this.currentTime;
        this.time += this.deltaTime;
        this.secondsCounter += this.deltaTime;
        //window.requestAnimationFrame(this.updateTime.bind(this));
    }

    notifyFps(){ //subscribe
        if (this.fpsFnSub){this.fpsFnSub();}
    }

    subscribeFps(fn){
        this.fpsFnSub = fn;
    }

}
