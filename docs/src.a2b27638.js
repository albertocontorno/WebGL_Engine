// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"node_modules/parcel-bundler/src/builtins/bundle-url.js":[function(require,module,exports) {
var bundleURL = null;

function getBundleURLCached() {
  if (!bundleURL) {
    bundleURL = getBundleURL();
  }

  return bundleURL;
}

function getBundleURL() {
  // Attempt to find the URL of the current script and use that as the base URL
  try {
    throw new Error();
  } catch (err) {
    var matches = ('' + err.stack).match(/(https?|file|ftp|chrome-extension|moz-extension):\/\/[^)\n]+/g);

    if (matches) {
      return getBaseURL(matches[0]);
    }
  }

  return '/';
}

function getBaseURL(url) {
  return ('' + url).replace(/^((?:https?|file|ftp|chrome-extension|moz-extension):\/\/.+)\/[^/]+$/, '$1') + '/';
}

exports.getBundleURL = getBundleURLCached;
exports.getBaseURL = getBaseURL;
},{}],"node_modules/parcel-bundler/src/builtins/css-loader.js":[function(require,module,exports) {
var bundle = require('./bundle-url');

function updateLink(link) {
  var newLink = link.cloneNode();

  newLink.onload = function () {
    link.remove();
  };

  newLink.href = link.href.split('?')[0] + '?' + Date.now();
  link.parentNode.insertBefore(newLink, link.nextSibling);
}

var cssTimeout = null;

function reloadCSS() {
  if (cssTimeout) {
    return;
  }

  cssTimeout = setTimeout(function () {
    var links = document.querySelectorAll('link[rel="stylesheet"]');

    for (var i = 0; i < links.length; i++) {
      if (bundle.getBaseURL(links[i].href) === bundle.getBundleURL()) {
        updateLink(links[i]);
      }
    }

    cssTimeout = null;
  }, 50);
}

module.exports = reloadCSS;
},{"./bundle-url":"node_modules/parcel-bundler/src/builtins/bundle-url.js"}],"src/styles.css":[function(require,module,exports) {
var reloadCSS = require('_css_loader');

module.hot.dispose(reloadCSS);
module.hot.accept(reloadCSS);
},{"_css_loader":"node_modules/parcel-bundler/src/builtins/css-loader.js"}],"src/common/webgl-utils.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WebGLUtils = void 0;

/*
 * Copyright 2010, Google Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are
 * met:
 *
 *     * Redistributions of source code must retain the above copyright
 * notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above
 * copyright notice, this list of conditions and the following disclaimer
 * in the documentation and/or other materials provided with the
 * distribution.
 *     * Neither the name of Google Inc. nor the names of its
 * contributors may be used to endorse or promote products derived from
 * this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

/**
 * @fileoverview This file contains functions every webgl program will need
 * a version of one way or another.
 *
 * Instead of setting up a context manually it is recommended to
 * use. This will check for success or failure. On failure it
 * will attempt to present an approriate message to the user.
 *
 *       gl = WebGLUtils.setupWebGL(canvas);
 *
 * For animated WebGL apps use of setTimeout or setInterval are
 * discouraged. It is recommended you structure your rendering
 * loop like this.
 *
 *       function render() {
 *         window.requestAnimFrame(render, canvas);
 *
 *         // do rendering
 *         ...
 *       }
 *       render();
 *
 * This will call your rendering function up to the refresh rate
 * of your display but will stop rendering if your app is not
 * visible.
 */
var WebGLUtils = function () {
  /**
   * Creates the HTLM for a failure message
   * @param {string} canvasContainerId id of container of th
   *        canvas.
   * @return {string} The html.
   */
  var makeFailHTML = function makeFailHTML(msg) {
    return '' + '<table style="background-color: #8CE; width: 100%; height: 100%;"><tr>' + '<td align="center">' + '<div style="display: table-cell; vertical-align: middle;">' + '<div style="">' + msg + '</div>' + '</div>' + '</td></tr></table>';
  };
  /**
   * Mesasge for getting a webgl browser
   * @type {string}
   */


  var GET_A_WEBGL_BROWSER = '' + 'This page requires a browser that supports WebGL.<br/>' + '<a href="http://get.webgl.org">Click here to upgrade your browser.</a>';
  /**
   * Mesasge for need better hardware
   * @type {string}
   */

  var OTHER_PROBLEM = '' + "It doesn't appear your computer can support WebGL.<br/>" + '<a href="http://get.webgl.org/troubleshooting/">Click here for more information.</a>';
  /**
   * Creates a webgl context. If creation fails it will
   * change the contents of the container of the <canvas>
   * tag to an error message with the correct links for WebGL.
   * @param {Element} canvas. The canvas element to create a
   *     context from.
   * @param {WebGLContextCreationAttirbutes} opt_attribs Any
   *     creation attributes you want to pass in.
   * @return {WebGLRenderingContext} The created context.
   */

  var setupWebGL = function setupWebGL(canvas, opt_attribs) {
    function showLink(str) {
      var container = canvas.parentNode;

      if (container) {
        container.innerHTML = makeFailHTML(str);
      }
    }

    ;

    if (!window.WebGLRenderingContext) {
      showLink(GET_A_WEBGL_BROWSER);
      return null;
    }

    var context = create3DContext(canvas, opt_attribs);

    if (!context) {
      showLink(OTHER_PROBLEM);
    }

    return context;
  };
  /**
   * Creates a webgl context.
   * @param {!Canvas} canvas The canvas tag to get context
   *     from. If one is not passed in one will be created.
   * @return {!WebGLContext} The created context.
   */


  var create3DContext = function create3DContext(canvas, opt_attribs) {
    var names = ["webgl2", "webgl", "experimental-webgl", "webkit-3d", "moz-webgl"];
    var context = null;

    for (var ii = 0; ii < names.length; ++ii) {
      try {
        context = canvas.getContext(names[ii], opt_attribs);
      } catch (e) {}

      if (context) {
        console.log(context);
        break;
      }
    }

    return context;
  };

  return {
    create3DContext: create3DContext,
    setupWebGL: setupWebGL
  };
}();
/**
 * Provides requestAnimationFrame in a cross browser way.
 */


exports.WebGLUtils = WebGLUtils;

window.requestAnimFrame = function () {
  return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (
  /* function FrameRequestCallback */
  callback,
  /* DOMElement Element */
  element) {
    window.setTimeout(callback, 1000 / 60);
  };
}();
},{}],"node_modules/@babel/runtime/helpers/arrayLikeToArray.js":[function(require,module,exports) {
function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }

  return arr2;
}

module.exports = _arrayLikeToArray;
},{}],"node_modules/@babel/runtime/helpers/arrayWithoutHoles.js":[function(require,module,exports) {
var arrayLikeToArray = require("./arrayLikeToArray");

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return arrayLikeToArray(arr);
}

module.exports = _arrayWithoutHoles;
},{"./arrayLikeToArray":"node_modules/@babel/runtime/helpers/arrayLikeToArray.js"}],"node_modules/@babel/runtime/helpers/iterableToArray.js":[function(require,module,exports) {
function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
}

module.exports = _iterableToArray;
},{}],"node_modules/@babel/runtime/helpers/unsupportedIterableToArray.js":[function(require,module,exports) {
var arrayLikeToArray = require("./arrayLikeToArray");

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return arrayLikeToArray(o, minLen);
}

module.exports = _unsupportedIterableToArray;
},{"./arrayLikeToArray":"node_modules/@babel/runtime/helpers/arrayLikeToArray.js"}],"node_modules/@babel/runtime/helpers/nonIterableSpread.js":[function(require,module,exports) {
function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

module.exports = _nonIterableSpread;
},{}],"node_modules/@babel/runtime/helpers/toConsumableArray.js":[function(require,module,exports) {
var arrayWithoutHoles = require("./arrayWithoutHoles");

var iterableToArray = require("./iterableToArray");

var unsupportedIterableToArray = require("./unsupportedIterableToArray");

var nonIterableSpread = require("./nonIterableSpread");

function _toConsumableArray(arr) {
  return arrayWithoutHoles(arr) || iterableToArray(arr) || unsupportedIterableToArray(arr) || nonIterableSpread();
}

module.exports = _toConsumableArray;
},{"./arrayWithoutHoles":"node_modules/@babel/runtime/helpers/arrayWithoutHoles.js","./iterableToArray":"node_modules/@babel/runtime/helpers/iterableToArray.js","./unsupportedIterableToArray":"node_modules/@babel/runtime/helpers/unsupportedIterableToArray.js","./nonIterableSpread":"node_modules/@babel/runtime/helpers/nonIterableSpread.js"}],"node_modules/@babel/runtime/helpers/classCallCheck.js":[function(require,module,exports) {
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

module.exports = _classCallCheck;
},{}],"node_modules/@babel/runtime/helpers/createClass.js":[function(require,module,exports) {
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

module.exports = _createClass;
},{}],"node_modules/@babel/runtime/helpers/defineProperty.js":[function(require,module,exports) {
function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

module.exports = _defineProperty;
},{}],"src/common/shadersUtils.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ShaderUtils = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ShaderUtils = /*#__PURE__*/function () {
  function ShaderUtils(gl) {
    (0, _classCallCheck2.default)(this, ShaderUtils);
    (0, _defineProperty2.default)(this, "gl", void 0);
    this.gl = gl;
  }

  (0, _createClass2.default)(ShaderUtils, null, [{
    key: "setGlContext",
    value: function setGlContext(gl) {
      this.gl = gl;
    }
  }, {
    key: "compileShadersAndcreateProgram",
    value: function compileShadersAndcreateProgram(shaders) {
      var _this = this;

      var shaderProgram = this.gl.createProgram();
      shaders.forEach(function (shader) {
        var compiledShader = _this.loadAndCompileShader(shaders.type, shaders.source);

        _this.gl.attachShader(shaderProgram, compiledShader);
      });
      this.gl.linkProgram(shaderProgram);
      return shaderProgram;
    }
  }, {
    key: "loadAndCompileShader",
    value: function loadAndCompileShader(type, source) {
      console.log('[SHADER] Compiling ->', ' Type: ', type, '- Source: '
      /* , source */
      );
      var shader = this.gl.createShader(type);
      this.gl.shaderSource(shader, source);
      this.gl.compileShader(shader);
      return shader;
    }
    /**
     * @param {[vertex, fragment]} shaders 
     */

  }, {
    key: "createShaderProgramFromShaders",
    value: function createShaderProgramFromShaders(shaders) {
      var _this2 = this;

      console.log('[SHADER_PROGRAM] Creating ->', ' Shaders: ', shaders);
      var shaderProgram = this.gl.createProgram();
      shaders.forEach(function (shader) {
        _this2.gl.attachShader(shaderProgram, shader);

        _this2.gl.deleteShader(shader);
      });
      this.gl.linkProgram(shaderProgram);
      return shaderProgram;
    }
  }, {
    key: "checkShaderCompilingErrors",
    value: function checkShaderCompilingErrors(shader) {
      if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
        return this.gl.getShaderInfoLog(shader);
      } else return null;
    }
  }, {
    key: "checkShaderProgramLinkingErrors",
    value: function checkShaderProgramLinkingErrors(program) {
      if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
        return this.gl.getProgramInfoLog(program);
      } else return null;
    }
  }, {
    key: "destroyShaderProgram",
    value: function destroyShaderProgram(program) {
      this.gl.deleteProgram(program);
    }
  }, {
    key: "destroyShader",
    value: function destroyShader(shader) {
      this.gl.deleteShader(shader);
    }
  }, {
    key: "setFloat",
    value: function setFloat(name, value) {
      this.gl.glUniform1f(this.gl.getUniformLocation(name), value);
    }
  }, {
    key: "setBool",
    value: function setBool(name, value) {
      this.gl.glUniform1i(this.gl.getUniformLocation(name), value);
    }
  }, {
    key: "setInt",
    value: function setInt(name, value) {
      this.gl.glUniform1i(this.gl.getUniformLocation(name), value);
    }
  }, {
    key: "setMatrix",
    value: function setMatrix(name, value) {
      this.gl.glUniform4fv(this.gl.getUniformLocation(name), value);
    }
  }]);
  return ShaderUtils;
}();

exports.ShaderUtils = ShaderUtils;
},{"@babel/runtime/helpers/classCallCheck":"node_modules/@babel/runtime/helpers/classCallCheck.js","@babel/runtime/helpers/createClass":"node_modules/@babel/runtime/helpers/createClass.js","@babel/runtime/helpers/defineProperty":"node_modules/@babel/runtime/helpers/defineProperty.js"}],"src/common/Time.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Time = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/** 
 * @author Alberto Contorno
 * @class
 * Class representing the time. 
 * It provides the current time (in ms from the start of the Engine)
 * a deltaTime between frames 
 * and a FPS counter service to which something can subscribe
 */
var Time = /*#__PURE__*/function () {
  /**
   * @property {number} deltaTime- The time passed between the last frame (in ms) and the current one. Use it to make things indipendent from the frame rate.
   * @property {number} time- The time passed since the start (in ms).
   * @property {number} frames- The current number of frames passed since last second (not precise).
   */
  function Time() {
    (0, _classCallCheck2.default)(this, Time);
    (0, _defineProperty2.default)(this, "deltaTime", 0);
    (0, _defineProperty2.default)(this, "time", 0);
    (0, _defineProperty2.default)(this, "currentTime", 0);
    (0, _defineProperty2.default)(this, "lastTime", 0);
    (0, _defineProperty2.default)(this, "secondsCounter", 0);
    (0, _defineProperty2.default)(this, "frames", 0);
    (0, _defineProperty2.default)(this, "fpsFnSub", null);

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


  (0, _createClass2.default)(Time, [{
    key: "updateTime",
    value: function updateTime() {
      this.frames++;

      if (this.secondsCounter >= 1) {
        this.notifyFps();
        this.secondsCounter = 0;
        this.frames = 0;
      }

      this.currentTime = (performance ? performance : Date).now();
      this.deltaTime = (this.currentTime - this.lastTime) * 0.001;
      this.lastTime = this.currentTime;
      this.time += this.deltaTime;
      this.secondsCounter += this.deltaTime; //window.requestAnimationFrame(this.updateTime.bind(this));
    }
  }, {
    key: "notifyFps",
    value: function notifyFps() {
      //subscribe
      if (this.fpsFnSub) {
        this.fpsFnSub();
      }
    }
  }, {
    key: "subscribeFps",
    value: function subscribeFps(fn) {
      this.fpsFnSub = fn;
    }
  }]);
  return Time;
}();

exports.Time = Time;
},{"@babel/runtime/helpers/classCallCheck":"node_modules/@babel/runtime/helpers/classCallCheck.js","@babel/runtime/helpers/createClass":"node_modules/@babel/runtime/helpers/createClass.js","@babel/runtime/helpers/defineProperty":"node_modules/@babel/runtime/helpers/defineProperty.js"}],"src/common/Engine.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Engine = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _shadersUtils = require("./shadersUtils");

var _Time = require("./Time");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @author Alberto Contorno
 * @class
 * class that represent the entire Engine.
 * It takes care of the main loop fo the rendering and of the updating of the time
 * It initialize the GL context, and maintains the list of scenes, of which only one is the active (rendered) one.
 */
var Engine = /*#__PURE__*/function () {
  //TODO SCENE MANAGER

  /**
   * Create a new Engine and do the setup of all the environment.
   * @param {WebGL_Context} gl The WebGl context obtained from a canvas. This will be the context of the entire Engine.
   * used as the context of every Shader.
   */
  function Engine(gl) {
    var opt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
      clearColor: [0.0, 0.0, 0.0, 1.0]
    };
    (0, _classCallCheck2.default)(this, Engine);
    (0, _defineProperty2.default)(this, "scenes", []);
    (0, _defineProperty2.default)(this, "activeScene", void 0);
    (0, _defineProperty2.default)(this, "gl", void 0);
    (0, _defineProperty2.default)(this, "time", void 0);
    (0, _defineProperty2.default)(this, "opt", void 0);

    Math.radians = function (degrees) {
      var pi = Math.PI;
      return degrees * (pi / 180);
    };

    Math.clamp = function (number, min, max) {
      return Math.max(min, Math.min(number, max));
    };

    this.gl = gl;
    this.time = new _Time.Time();
    this.opt = opt;

    _shadersUtils.ShaderUtils.setGlContext(this.gl);

    if (this.opt) {
      if (this.opt.showFps) {
        this.setFpsCounter();
      }

      if (!this.opt.clearColor) {
        this.opt.clearColor = [0.0, 0.0, 0.0, 1.0];
      }
    }
  }
  /**
   * 
   * @param {Scene} scene add a scene to the list of scenes that the Engine manages.
   * If there is no active scene, the added scene is set as the active one.
   */


  (0, _createClass2.default)(Engine, [{
    key: "addScene",
    value: function addScene(scene) {
      this.scenes.push(scene);
      scene.onAfterSceneAdded(this);

      if (!this.activeScene) {
        this.activeScene = this.scenes.length - 1;
      }
    }
    /**
     * Starts the rendering and the update of the time at every frame.
     */

  }, {
    key: "doRendering",
    value: function doRendering() {
      var _this$gl;

      (_this$gl = this.gl).clearColor.apply(_this$gl, (0, _toConsumableArray2.default)(this.opt.clearColor));

      this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

      if (this.scenes[this.activeScene] && this.scenes[this.activeScene].mainCamera) {
        this.scenes[this.activeScene].renderScene(this.gl);
      }

      this.time.updateTime();
      window.requestAnimationFrame(this.doRendering.bind(this));
    }
  }, {
    key: "setFpsCounter",
    value: function setFpsCounter() {
      var _this = this;

      var container = document.createElement('div');
      var idNum = Math.round(Math.random(0, 1) * 100);
      container.setAttribute("style", "position: absolute;\n      top: 10px;\n      left: 20px;\n      color: lime;");
      container.id = 'glFpsCounterContainer_' + idNum;
      var text = document.createElement('p');
      text.id = 'glFpsCounterText_' + idNum;
      container.appendChild(text);
      document.body.appendChild(container);
      this.time.subscribeFps(function () {
        text.innerHTML = 'FPS: ' + _this.time.frames;
      });
    }
  }]);
  return Engine;
}();

exports.Engine = Engine;
},{"@babel/runtime/helpers/toConsumableArray":"node_modules/@babel/runtime/helpers/toConsumableArray.js","@babel/runtime/helpers/classCallCheck":"node_modules/@babel/runtime/helpers/classCallCheck.js","@babel/runtime/helpers/createClass":"node_modules/@babel/runtime/helpers/createClass.js","@babel/runtime/helpers/defineProperty":"node_modules/@babel/runtime/helpers/defineProperty.js","./shadersUtils":"src/common/shadersUtils.js","./Time":"src/common/Time.js"}],"src/common/keyCodes.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.keys = void 0;
var keys = {
  KEYMAP: {
    STRG: 17,
    CTRL: 17,
    CTRLRIGHT: 18,
    CTRLR: 18,
    SHIFT: 16,
    RETURN: 13,
    ENTER: 13,
    BACKSPACE: 8,
    BCKSP: 8,
    ALT: 18,
    ALTR: 17,
    ALTRIGHT: 17,
    SPACE: 32,
    WIN: 91,
    MAC: 91,
    FN: null,
    UP: 38,
    DOWN: 40,
    LEFT: 37,
    RIGHT: 39,
    ESC: 27,
    DEL: 46,
    F1: 112,
    F2: 113,
    F3: 114,
    F4: 115,
    F5: 116,
    F6: 117,
    F7: 118,
    F8: 119,
    F9: 120,
    F10: 121,
    F11: 122,
    F12: 123
  },
  KEYNAMES: {
    backspace: '8',
    tab: '9',
    enter: '13',
    shift: '16',
    ctrl: '17',
    alt: '18',
    pause_break: '19',
    caps_lock: '20',
    escape: '27',
    page_up: '33',
    'page down': '34',
    end: '35',
    home: '36',
    left_arrow: '37',
    up_arrow: '38',
    right_arrow: '39',
    down_arrow: '40',
    insert: '45',
    delete: '46',
    '0': '48',
    '1': '49',
    '2': '50',
    '3': '51',
    '4': '52',
    '5': '53',
    '6': '54',
    '7': '55',
    '8': '56',
    '9': '57',
    a: '65',
    b: '66',
    c: '67',
    d: '68',
    e: '69',
    f: '70',
    g: '71',
    h: '72',
    i: '73',
    j: '74',
    k: '75',
    l: '76',
    m: '77',
    n: '78',
    o: '79',
    p: '80',
    q: '81',
    r: '82',
    s: '83',
    t: '84',
    u: '85',
    v: '86',
    w: '87',
    x: '88',
    y: '89',
    z: '90',
    'left_window key': '91',
    'right_window key': '92',
    select_key: '93',
    'numpad 0': '96',
    'numpad 1': '97',
    'numpad 2': '98',
    'numpad 3': '99',
    'numpad 4': '100',
    'numpad 5': '101',
    'numpad 6': '102',
    'numpad 7': '103',
    'numpad 8': '104',
    'numpad 9': '105',
    multiply: '106',
    add: '107',
    subtract: '109',
    'decimal point': '110',
    divide: '111',
    f1: '112',
    f2: '113',
    f3: '114',
    f4: '115',
    f5: '116',
    f6: '117',
    f7: '118',
    f8: '119',
    f9: '120',
    f10: '121',
    f11: '122',
    f12: '123',
    num_lock: '144',
    scroll_lock: '145',
    semi_colon: '186',
    equal_sign: '187',
    comma: '188',
    dash: '189',
    period: '190',
    forward_slash: '191',
    grave_accent: '192',
    open_bracket: '219',
    backslash: '220',
    closebracket: '221',
    single_quote: '222'
  },
  KEYCODES: {
    8: 'backspace',
    9: 'tab',
    13: 'enter',
    16: 'shift',
    17: 'ctrl',
    18: 'alt',
    19: 'pause_break',
    20: 'caps_lock',
    27: 'escape',
    33: 'page_up',
    34: 'page down',
    35: 'end',
    36: 'home',
    37: 'left_arrow',
    38: 'up_arrow',
    39: 'right_arrow',
    40: 'down_arrow',
    45: 'insert',
    46: 'delete',
    48: '0',
    49: '1',
    50: '2',
    51: '3',
    52: '4',
    53: '5',
    54: '6',
    55: '7',
    56: '8',
    57: '9',
    65: 'a',
    66: 'b',
    67: 'c',
    68: 'd',
    69: 'e',
    70: 'f',
    71: 'g',
    72: 'h',
    73: 'i',
    74: 'j',
    75: 'k',
    76: 'l',
    77: 'm',
    78: 'n',
    79: 'o',
    80: 'p',
    81: 'q',
    82: 'r',
    83: 's',
    84: 't',
    85: 'u',
    86: 'v',
    87: 'w',
    88: 'x',
    89: 'y',
    90: 'z',
    91: 'left_window key',
    92: 'right_window key',
    93: 'select_key',
    96: 'numpad 0',
    97: 'numpad 1',
    98: 'numpad 2',
    99: 'numpad 3',
    100: 'numpad 4',
    101: 'numpad 5',
    102: 'numpad 6',
    103: 'numpad 7',
    104: 'numpad 8',
    105: 'numpad 9',
    106: 'multiply',
    107: 'add',
    109: 'subtract',
    110: 'decimal point',
    111: 'divide',
    112: 'f1',
    113: 'f2',
    114: 'f3',
    115: 'f4',
    116: 'f5',
    117: 'f6',
    118: 'f7',
    119: 'f8',
    120: 'f9',
    121: 'f10',
    122: 'f11',
    123: 'f12',
    144: 'num_lock',
    145: 'scroll_lock',
    186: 'semi_colon',
    187: 'equal_sign',
    188: 'comma',
    189: 'dash',
    190: 'period',
    191: 'forward_slash',
    192: 'grave_accent',
    219: 'open_bracket',
    220: 'backslash',
    221: 'closebracket',
    222: 'single_quote'
  },
  MOUSECODES: {
    0: 'left',
    1: 'center',
    2: 'right'
  },
  MOUSENAMES: {
    left: 0,
    center: 1,
    right: 2
  }
};
exports.keys = keys;
},{}],"src/common/inputManager.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.InputManager = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _keyCodes = require("./keyCodes");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @author Alberto Contorno
 * @class
 * Class used to manage the user inputs. It can manage keyboard and mouse.
 */
var InputManager = /*#__PURE__*/function () {
  function InputManager() {
    (0, _classCallCheck2.default)(this, InputManager);
    (0, _defineProperty2.default)(this, "keysPressed", {});
    (0, _defineProperty2.default)(this, "mousePressed", {});
    (0, _defineProperty2.default)(this, "mousePosition", {
      x: 0,
      y: 0,
      movX: 0,
      movY: 0
    });
    (0, _defineProperty2.default)(this, "lastMousePosition", {
      x: 0,
      y: 0
    });
    (0, _defineProperty2.default)(this, "keyCodes", _keyCodes.keys);
    (0, _defineProperty2.default)(this, "mouseLocked", false);
    (0, _defineProperty2.default)(this, "mouseLockedEl", null);
    this.start();
  }

  (0, _createClass2.default)(InputManager, [{
    key: "start",
    value: function start() {
      var _this = this;

      window.onkeydown = function (_ref) {
        var which = _ref.which;

        _this.updateKeyPressed(which);
      };

      window.onkeyup = function (_ref2) {
        var which = _ref2.which;

        _this.updateKeyUnPressed(which);
      };

      window.onmousedown = function (_ref3) {
        var which = _ref3.which;

        _this.updateMousePressed(which);
      };

      window.onmouseup = function (_ref4) {
        var which = _ref4.which;

        _this.updateMouseUnPressed(which);
      };

      window.onmousemove = function (_ref5) {
        var clientX = _ref5.clientX,
            clientY = _ref5.clientY,
            movementX = _ref5.movementX,
            movementY = _ref5.movementY;

        _this.updateMousePosition(clientX, clientY, movementX, movementY);
      };
    }
  }, {
    key: "stop",
    value: function stop() {
      window.onkeydown = null;
      window.onkeyup = null;
      window.onmousedown = null;
      window.onmouseup = null;
      window.onmousemove = null;
    }
  }, {
    key: "clearKeyPressed",
    value: function clearKeyPressed() {
      this.keysPressed = {};
    }
  }, {
    key: "clearMousePosition",
    value: function clearMousePosition() {
      this.mousePosition = {
        x: 0,
        y: 0,
        movX: 0,
        movY: 0
      };
    }
  }, {
    key: "lockMouse",
    value: function lockMouse(el) {
      var _this2 = this;

      el.requestPointerLock = el.requestPointerLock || el.mozRequestPointerLock;
      document.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock;

      el.onclick = function () {
        el.requestPointerLock();
        _this2.mouseLockedEl = el;
        _this2.mouseLocked = true;
      };
    }
  }, {
    key: "unlockMouse",
    value: function unlockMouse() {
      document.exitPointerLock();
      this.mouseLocked = false;
      this.mouseLockedEl.requestPointerLock = null;
      document.exitPointerLock = null;
      this.mouseLockedEl = null;
    }
  }, {
    key: "updateKeyPressed",
    value: function updateKeyPressed(keyCode) {
      this.keysPressed[_keyCodes.keys.KEYCODES[keyCode]] = true;
    }
  }, {
    key: "updateKeyUnPressed",
    value: function updateKeyUnPressed(keyCode) {
      this.keysPressed[_keyCodes.keys.KEYCODES[keyCode]] = false;
    }
  }, {
    key: "updateMousePressed",
    value: function updateMousePressed(code) {
      this.mousePressed[_keyCodes.keys.MOUSECODES[code]] = true;
    }
  }, {
    key: "updateMouseUnPressed",
    value: function updateMouseUnPressed(code) {
      this.mousePressed[_keyCodes.keys.MOUSECODES[code]] = false;
    }
  }, {
    key: "updateMousePosition",
    value: function updateMousePosition(x, y, movX, movY) {
      this.lastMousePosition.x = this.mousePosition.x;
      this.lastMousePosition.y = this.mousePosition.y;
      this.lastMousePosition.movX = this.mousePosition.movX;
      this.lastMousePosition.movY = this.mousePosition.movY;
      this.mousePosition.x = x;
      this.mousePosition.y = y;
      this.mousePosition.movX = movX;
      this.mousePosition.movY = movY;
    }
  }, {
    key: "isKeyDown",
    value: function isKeyDown(keyCode) {
      return this.keysPressed[_keyCodes.keys.KEYCODES[keyCode]] || false;
    }
  }, {
    key: "isKeyUp",
    value: function isKeyUp(keyCode) {
      return !this.keysPressed[_keyCodes.keys.KEYCODES[keyCode]] || true;
    }
  }, {
    key: "isMouseDown",
    value: function isMouseDown(code) {
      return this.mousePressed[_keyCodes.keys.MOUSECODES[code]] || false;
    }
  }, {
    key: "isMouseUp",
    value: function isMouseUp(code) {
      return !this.mousePressed[_keyCodes.keys.MOUSECODES[code]] || true;
    }
  }, {
    key: "getMousePosition",
    value: function getMousePosition() {
      return this.mousePosition;
    }
  }, {
    key: "getMouseX",
    value: function getMouseX() {
      return this.mousePosition.x;
    }
  }, {
    key: "getMouseY",
    value: function getMouseY() {
      return this.mousePosition.y;
    }
  }, {
    key: "getMouseLastX",
    value: function getMouseLastX() {
      return this.lastMousePosition.x;
    }
  }, {
    key: "getMouseLastY",
    value: function getMouseLastY() {
      return this.lastMousePosition.Y;
    }
  }, {
    key: "getMouseDeltaX",
    value: function getMouseDeltaX() {
      return this.mousePosition.x - this.lastMousePosition.x;
    }
  }, {
    key: "getMouseDeltaY",
    value: function getMouseDeltaY() {
      return this.mousePosition.y - this.lastMousePosition.y;
    }
  }, {
    key: "getMouseMovX",
    value: function getMouseMovX() {
      return this.mousePosition.movX;
    }
  }, {
    key: "getMouseMovY",
    value: function getMouseMovY() {
      return this.mousePosition.movY;
    }
  }, {
    key: "isMouseLocked",
    value: function isMouseLocked() {
      return this.mouseLocked;
    }
  }]);
  return InputManager;
}();

exports.InputManager = InputManager;
},{"@babel/runtime/helpers/classCallCheck":"node_modules/@babel/runtime/helpers/classCallCheck.js","@babel/runtime/helpers/createClass":"node_modules/@babel/runtime/helpers/createClass.js","@babel/runtime/helpers/defineProperty":"node_modules/@babel/runtime/helpers/defineProperty.js","./keyCodes":"src/common/keyCodes.js"}],"node_modules/@babel/runtime/helpers/typeof.js":[function(require,module,exports) {
function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    module.exports = _typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    module.exports = _typeof = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

module.exports = _typeof;
},{}],"node_modules/@babel/runtime/helpers/assertThisInitialized.js":[function(require,module,exports) {
function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

module.exports = _assertThisInitialized;
},{}],"node_modules/@babel/runtime/helpers/setPrototypeOf.js":[function(require,module,exports) {
function _setPrototypeOf(o, p) {
  module.exports = _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

module.exports = _setPrototypeOf;
},{}],"node_modules/@babel/runtime/helpers/inherits.js":[function(require,module,exports) {
var setPrototypeOf = require("./setPrototypeOf");

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) setPrototypeOf(subClass, superClass);
}

module.exports = _inherits;
},{"./setPrototypeOf":"node_modules/@babel/runtime/helpers/setPrototypeOf.js"}],"node_modules/@babel/runtime/helpers/possibleConstructorReturn.js":[function(require,module,exports) {
var _typeof = require("../helpers/typeof");

var assertThisInitialized = require("./assertThisInitialized");

function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === "object" || typeof call === "function")) {
    return call;
  }

  return assertThisInitialized(self);
}

module.exports = _possibleConstructorReturn;
},{"../helpers/typeof":"node_modules/@babel/runtime/helpers/typeof.js","./assertThisInitialized":"node_modules/@babel/runtime/helpers/assertThisInitialized.js"}],"node_modules/@babel/runtime/helpers/getPrototypeOf.js":[function(require,module,exports) {
function _getPrototypeOf(o) {
  module.exports = _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

module.exports = _getPrototypeOf;
},{}],"src/common/Component.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registeredComponents = exports.Component = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @author Alberto Contorno
 * @class
 */
var Component = /*#__PURE__*/function () {
  function Component() {
    (0, _classCallCheck2.default)(this, Component);
    (0, _defineProperty2.default)(this, "name", void 0);
    (0, _defineProperty2.default)(this, "parent", void 0);
    Component.nextId++;
    this.id = Component.nextId;
  }

  (0, _createClass2.default)(Component, [{
    key: "onAfterAdded",
    value: function onAfterAdded() {}
  }, {
    key: "onAfterRemoved",
    value: function onAfterRemoved() {}
  }]);
  return Component;
}();

exports.Component = Component;
(0, _defineProperty2.default)(Component, "nextId", 1);
var registeredComponents = {
  'transform': 0,
  'mesh': 1,
  'light': 2,
  'material': 3
};
exports.registeredComponents = registeredComponents;
},{"@babel/runtime/helpers/classCallCheck":"node_modules/@babel/runtime/helpers/classCallCheck.js","@babel/runtime/helpers/createClass":"node_modules/@babel/runtime/helpers/createClass.js","@babel/runtime/helpers/defineProperty":"node_modules/@babel/runtime/helpers/defineProperty.js"}],"src/common/Components/Transform.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Transform = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _Component2 = require("../Component");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

/**
 * @author Alberto Contorno
 * @class
 */
var Transform = /*#__PURE__*/function (_Component) {
  (0, _inherits2.default)(Transform, _Component);

  var _super = _createSuper(Transform);

  function Transform(parent) {
    var _this;

    (0, _classCallCheck2.default)(this, Transform);
    _this = _super.call(this);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "position", [0, 0, 0]);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "rotation", [0, 0, 0]);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "scale", [1, 1, 1]);
    _this.parent = parent;
    _this.name = 'transform';
    return _this;
  }

  (0, _createClass2.default)(Transform, null, [{
    key: "summed",
    value: function summed(t1, t2) {
      if (t1 == null || t2 == null) {
        return null;
      }

      var transform = new Transform();
      transform.position[0] = t1.position[0] + t2.position[0];
      transform.position[1] = t1.position[1] + t2.position[1];
      transform.position[2] = t1.position[2] + t2.position[2];
      transform.rotation[0] = t1.rotation[0] + t2.rotation[0];
      transform.rotation[1] = t1.rotation[1] + t2.rotation[1];
      transform.rotation[2] = t1.rotation[2] + t2.rotation[2];
      transform.scale[0] = t1.scale[0] * t2.scale[0];
      transform.scale[1] = t1.scale[1] * t2.scale[1];
      transform.scale[2] = t1.scale[2] * t2.scale[2];
      return transform;
    }
  }]);
  return Transform;
}(_Component2.Component);

exports.Transform = Transform;
},{"@babel/runtime/helpers/classCallCheck":"node_modules/@babel/runtime/helpers/classCallCheck.js","@babel/runtime/helpers/createClass":"node_modules/@babel/runtime/helpers/createClass.js","@babel/runtime/helpers/assertThisInitialized":"node_modules/@babel/runtime/helpers/assertThisInitialized.js","@babel/runtime/helpers/inherits":"node_modules/@babel/runtime/helpers/inherits.js","@babel/runtime/helpers/possibleConstructorReturn":"node_modules/@babel/runtime/helpers/possibleConstructorReturn.js","@babel/runtime/helpers/getPrototypeOf":"node_modules/@babel/runtime/helpers/getPrototypeOf.js","@babel/runtime/helpers/defineProperty":"node_modules/@babel/runtime/helpers/defineProperty.js","../Component":"src/common/Component.js"}],"src/common/Utils/Vector_Matrix.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.normalMatrix = exports.inverse = exports.inverse4 = exports.inverse3 = exports.inverse2 = exports.det = exports.det4 = exports.det3 = exports.det2 = exports.printm = exports.flatten = exports.scale = exports.mix = exports.normalize = exports.length = exports.cross = exports.negate = exports.dot = exports.transpose = exports.perspective = exports.ortho = exports.lookAt = exports.scalem = exports.rotateZ = exports.rotateY = exports.rotateX = exports.rotate = exports.translate = exports.add = exports.mult = exports.subtract = exports.mat4 = exports.mat3 = exports.mat2 = exports.scalarProduct = exports.vec4 = exports.vec3 = exports.vec2 = void 0;

function _argumentsToArray(args) {
  return [].concat.apply([], Array.prototype.slice.apply(args));
}

function radians(degrees) {
  return degrees * Math.PI / 180.0;
}

function equal(u, v) {
  if (u.length != v.length) {
    return false;
  }

  if (u.matrix && v.matrix) {
    for (var i = 0; i < u.length; ++i) {
      if (u[i].length != v[i].length) {
        return false;
      }

      for (var j = 0; j < u[i].length; ++j) {
        if (u[i][j] !== v[i][j]) {
          return false;
        }
      }
    }
  } else if (u.matrix && !v.matrix || !u.matrix && v.matrix) {
    return false;
  } else {
    for (var i = 0; i < u.length; ++i) {
      if (u[i] !== v[i]) {
        return false;
      }
    }
  }

  return true;
}

var vec2 = function vec2() {
  var result = _argumentsToArray(arguments);

  switch (result.length) {
    case 0:
      result.push(0.0);

    case 1:
      result.push(0.0);
  }

  return result.splice(0, 2);
};

exports.vec2 = vec2;

var vec3 = function vec3() {
  var result = _argumentsToArray(arguments);

  switch (result.length) {
    case 0:
      result.push(0.0);

    case 1:
      result.push(0.0);

    case 2:
      result.push(0.0);
  }

  return result.splice(0, 3);
};

exports.vec3 = vec3;

var vec4 = function vec4() {
  var result = _argumentsToArray(arguments);

  switch (result.length) {
    case 0:
      result.push(0.0);

    case 1:
      result.push(0.0);

    case 2:
      result.push(0.0);

    case 3:
      result.push(1.0);
  }

  return result.splice(0, 4);
};

exports.vec4 = vec4;

var scalarProduct = function scalarProduct(v, s) {
  v.forEach(function (v, i) {
    return v[i] = v * s;
  });
}; /////////////////////////////////////////////////////


exports.scalarProduct = scalarProduct;

var mat2 = function mat2() {
  var v = _argumentsToArray(arguments);

  var m = [];

  switch (v.length) {
    case 0:
      v[0] = 1;

    case 1:
      m = [vec2(v[0], 0.0), vec2(0.0, v[0])];
      break;

    default:
      m.push(vec2(v));
      v.splice(0, 2);
      m.push(vec2(v));
      break;
  }

  m.matrix = true;
  return m;
};

exports.mat2 = mat2;

var mat3 = function mat3() {
  var v = _argumentsToArray(arguments);

  var m = [];

  switch (v.length) {
    case 0:
      v[0] = 1;

    case 1:
      m = [vec3(v[0], 0.0, 0.0), vec3(0.0, v[0], 0.0), vec3(0.0, 0.0, v[0])];
      break;

    default:
      m.push(vec3(v));
      v.splice(0, 3);
      m.push(vec3(v));
      v.splice(0, 3);
      m.push(vec3(v));
      break;
  }

  m.matrix = true;
  return m;
}; //----------------------------------------------------------------------------


exports.mat3 = mat3;

var mat4 = function mat4() {
  var v = _argumentsToArray(arguments);

  var m = [];

  switch (v.length) {
    case 0:
      v[0] = 1;

    case 1:
      m = [vec4(v[0], 0.0, 0.0, 0.0), vec4(0.0, v[0], 0.0, 0.0), vec4(0.0, 0.0, v[0], 0.0), vec4(0.0, 0.0, 0.0, v[0])];
      break;

    default:
      m.push(vec4(v));
      v.splice(0, 4);
      m.push(vec4(v));
      v.splice(0, 4);
      m.push(vec4(v));
      v.splice(0, 4);
      m.push(vec4(v));
      break;
  }

  m.matrix = true;
  return m;
};

exports.mat4 = mat4;

var subtract = function subtract(u, v) {
  var result = [];

  if (u.matrix && v.matrix) {
    if (u.length != v.length) {
      throw "subtract(): trying to subtract matrices" + " of different dimensions";
    }

    for (var i = 0; i < u.length; ++i) {
      if (u[i].length != v[i].length) {
        throw "subtract(): trying to subtact matrices" + " of different dimensions";
      }

      result.push([]);

      for (var j = 0; j < u[i].length; ++j) {
        result[i].push(u[i][j] - v[i][j]);
      }
    }

    result.matrix = true;
    return result;
  } else if (u.matrix && !v.matrix || !u.matrix && v.matrix) {
    throw "subtact(): trying to subtact  matrix and non-matrix variables";
  } else {
    if (u.length != v.length) {
      throw "subtract(): vectors are not the same length";
    }

    for (var i = 0; i < u.length; ++i) {
      result.push(u[i] - v[i]);
    }

    return result;
  }
}; //----------------------------------------------------------------------------


exports.subtract = subtract;

var mult = function mult(u, v) {
  var result = [];

  if (u.matrix && v.matrix) {
    if (u.length != v.length) {
      throw "mult(): trying to add matrices of different dimensions";
    }

    for (var i = 0; i < u.length; ++i) {
      if (u[i].length != v[i].length) {
        throw "mult(): trying to add matrices of different dimensions";
      }
    }

    for (var i = 0; i < u.length; ++i) {
      result.push([]);

      for (var j = 0; j < v.length; ++j) {
        var sum = 0.0;

        for (var k = 0; k < u.length; ++k) {
          sum += u[i][k] * v[k][j];
        }

        result[i].push(sum);
      }
    }

    result.matrix = true;
    return result;
  }

  if (u.matrix && u.length == v.length) {
    for (var i = 0; i < v.length; i++) {
      var sum = 0.0;

      for (var j = 0; j < v.length; j++) {
        sum += u[i][j] * v[j];
      }

      result.push(sum);
    }

    return result;
  } else {
    if (u.length != v.length) {
      throw "mult(): vectors are not the same dimension";
    }

    for (var i = 0; i < u.length; ++i) {
      result.push(u[i] * v[i]);
    }

    return result;
  }
}; //----------------------------------------------------------------------------
//
//  Basic Transformation Matrix Generators
//


exports.mult = mult;

var add = function add(u, v) {
  var result = [];

  if (u.matrix && v.matrix) {
    if (u.length != v.length) {
      throw "add(): trying to add matrices of different dimensions";
    }

    for (var i = 0; i < u.length; ++i) {
      if (u[i].length != v[i].length) {
        throw "add(): trying to add matrices of different dimensions";
      }

      result.push([]);

      for (var j = 0; j < u[i].length; ++j) {
        result[i].push(u[i][j] + v[i][j]);
      }
    }

    result.matrix = true;
    return result;
  } else if (u.matrix && !v.matrix || !u.matrix && v.matrix) {
    throw "add(): trying to add matrix and non-matrix variables";
  } else {
    if (u.length != v.length) {
      throw "add(): vectors are not the same dimension";
    }

    for (var i = 0; i < u.length; ++i) {
      result.push(u[i] + v[i]);
    }

    return result;
  }
};

exports.add = add;

var translate = function translate(x, y, z) {
  if (Array.isArray(x) && x.length == 3) {
    z = x[2];
    y = x[1];
    x = x[0];
  }

  var result = mat4();
  result[0][3] = x;
  result[1][3] = y;
  result[2][3] = z;
  return result;
};

exports.translate = translate;

var rotate = function rotate(angle, axis) {
  if (!Array.isArray(axis)) {
    axis = [arguments[1], arguments[2], arguments[3]];
  }

  var v = normalize(axis);
  var x = v[0];
  var y = v[1];
  var z = v[2];
  var c = Math.cos(radians(angle));
  var omc = 1.0 - c;
  var s = Math.sin(radians(angle));
  var result = mat4(vec4(x * x * omc + c, x * y * omc - z * s, x * z * omc + y * s, 0.0), vec4(x * y * omc + z * s, y * y * omc + c, y * z * omc - x * s, 0.0), vec4(x * z * omc - y * s, y * z * omc + x * s, z * z * omc + c, 0.0), vec4());
  return result;
};

exports.rotate = rotate;

var rotateX = function rotateX(theta) {
  var c = Math.cos(radians(theta));
  var s = Math.sin(radians(theta));
  var rx = mat4(1.0, 0.0, 0.0, 0.0, 0.0, c, -s, 0.0, 0.0, s, c, 0.0, 0.0, 0.0, 0.0, 1.0);
  return rx;
};

exports.rotateX = rotateX;

var rotateY = function rotateY(theta) {
  var c = Math.cos(radians(theta));
  var s = Math.sin(radians(theta));
  var ry = mat4(c, 0.0, s, 0.0, 0.0, 1.0, 0.0, 0.0, -s, 0.0, c, 0.0, 0.0, 0.0, 0.0, 1.0);
  return ry;
};

exports.rotateY = rotateY;

var rotateZ = function rotateZ(theta) {
  var c = Math.cos(radians(theta));
  var s = Math.sin(radians(theta));
  var rz = mat4(c, -s, 0.0, 0.0, s, c, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0);
  return rz;
}; //----------------------------------------------------------------------------


exports.rotateZ = rotateZ;

var scalem = function scalem(x, y, z) {
  if (Array.isArray(x) && x.length == 3) {
    z = x[2];
    y = x[1];
    x = x[0];
  }

  var result = mat4();
  result[0][0] = x;
  result[1][1] = y;
  result[2][2] = z;
  return result;
}; //----------------------------------------------------------------------------
//
//  ModelView Matrix Generators
//


exports.scalem = scalem;

var lookAt = function lookAt(eye, at, up) {
  if (!Array.isArray(eye) || eye.length != 3) {
    throw "lookAt(): first parameter [eye] must be an a vec3";
  }

  if (!Array.isArray(at) || at.length != 3) {
    throw "lookAt(): first parameter [at] must be an a vec3";
  }

  if (!Array.isArray(up) || up.length != 3) {
    throw "lookAt(): first parameter [up] must be an a vec3";
  }

  if (equal(eye, at)) {
    return mat4();
  }

  var v = normalize(subtract(at, eye)); // view direction vector

  var n = normalize(cross(v, up)); // perpendicular vector

  var u = normalize(cross(n, v)); // "new" up vector

  v = negate(v);
  var result = mat4(vec4(n, -dot(n, eye)), vec4(u, -dot(u, eye)), vec4(v, -dot(v, eye)), vec4());
  return result;
}; //----------------------------------------------------------------------------
//
//  Projection Matrix Generators
//


exports.lookAt = lookAt;

var ortho = function ortho(left, right, bottom, top, near, far) {
  if (left == right) {
    throw "ortho(): left and right are equal";
  }

  if (bottom == top) {
    throw "ortho(): bottom and top are equal";
  }

  if (near == far) {
    throw "ortho(): near and far are equal";
  }

  var w = right - left;
  var h = top - bottom;
  var d = far - near;
  var result = mat4();
  result[0][0] = 2.0 / w;
  result[1][1] = 2.0 / h;
  result[2][2] = -2.0 / d;
  result[0][3] = -(left + right) / w;
  result[1][3] = -(top + bottom) / h;
  result[2][3] = -(near + far) / d;
  return result;
}; //----------------------------------------------------------------------------


exports.ortho = ortho;

var perspective = function perspective(fovy, aspect, near, far) {
  var f = 1.0 / Math.tan(radians(fovy) / 2);
  var d = far - near;
  var result = mat4();
  result[0][0] = f / aspect;
  result[1][1] = f;
  result[2][2] = -(near + far) / d;
  result[2][3] = -2 * near * far / d;
  result[3][2] = -1;
  result[3][3] = 0.0;
  return result;
}; //----------------------------------------------------------------------------
//
//  Matrix Functions
//


exports.perspective = perspective;

var transpose = function transpose(m) {
  if (!m.matrix) {
    return "transpose(): trying to transpose a non-matrix";
  }

  var result = [];

  for (var i = 0; i < m.length; ++i) {
    result.push([]);

    for (var j = 0; j < m[i].length; ++j) {
      result[i].push(m[j][i]);
    }
  }

  result.matrix = true;
  return result;
}; //----------------------------------------------------------------------------
//
//  Vector Functions
//


exports.transpose = transpose;

var dot = function dot(u, v) {
  if (u.length != v.length) {
    throw "dot(): vectors are not the same dimension";
  }

  var sum = 0.0;

  for (var i = 0; i < u.length; ++i) {
    sum += u[i] * v[i];
  }

  return sum;
}; //----------------------------------------------------------------------------


exports.dot = dot;

var negate = function negate(u) {
  var result = [];

  for (var i = 0; i < u.length; ++i) {
    result.push(-u[i]);
  }

  return result;
}; //----------------------------------------------------------------------------


exports.negate = negate;

var cross = function cross(u, v) {
  if (!Array.isArray(u) || u.length < 3) {
    throw "cross(): first argument is not a vector of at least 3";
  }

  if (!Array.isArray(v) || v.length < 3) {
    throw "cross(): second argument is not a vector of at least 3";
  }

  var result = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]];
  return result;
}; //----------------------------------------------------------------------------


exports.cross = cross;

var length = function length(u) {
  return Math.sqrt(dot(u, u));
}; //----------------------------------------------------------------------------


exports.length = length;

var normalize = function normalize(u, excludeLastComponent) {
  if (excludeLastComponent) {
    var last = u.pop();
  }

  var len = length(u);

  if (!isFinite(len)) {
    throw "normalize: vector " + u + " has zero length";
  }

  for (var i = 0; i < u.length; ++i) {
    u[i] /= len;
  }

  if (excludeLastComponent) {
    u.push(last);
  }

  return u;
}; //----------------------------------------------------------------------------


exports.normalize = normalize;

var mix = function mix(u, v, s) {
  if (typeof s !== "number") {
    throw "mix: the last paramter " + s + " must be a number";
  }

  if (u.length != v.length) {
    throw "vector dimension mismatch";
  }

  var result = [];

  for (var i = 0; i < u.length; ++i) {
    result.push((1.0 - s) * u[i] + s * v[i]);
  }

  return result;
}; //----------------------------------------------------------------------------
//
// Vector and Matrix functions
//


exports.mix = mix;

var scale = function scale(s, u) {
  if (!Array.isArray(u)) {
    throw "scale: second parameter " + u + " is not a vector";
  }

  var result = [];

  for (var i = 0; i < u.length; ++i) {
    result.push(s * u[i]);
  }

  return result;
}; //----------------------------------------------------------------------------
//
//
//


exports.scale = scale;

var flatten = function flatten(v) {
  if (v.matrix === true) {
    v = transpose(v);
  }

  var n = v.length;
  var elemsAreArrays = false;

  if (Array.isArray(v[0])) {
    elemsAreArrays = true;
    n *= v[0].length;
  }

  var floats = new Float32Array(n);

  if (elemsAreArrays) {
    var idx = 0;

    for (var i = 0; i < v.length; ++i) {
      for (var j = 0; j < v[i].length; ++j) {
        floats[idx++] = v[i][j];
      }
    }
  } else {
    for (var i = 0; i < v.length; ++i) {
      floats[i] = v[i];
    }
  }

  return floats;
}; //----------------------------------------------------------------------------


exports.flatten = flatten;
var sizeof = {
  'vec2': new Float32Array(flatten(vec2())).byteLength,
  'vec3': new Float32Array(flatten(vec3())).byteLength,
  'vec4': new Float32Array(flatten(vec4())).byteLength,
  'mat2': new Float32Array(flatten(mat2())).byteLength,
  'mat3': new Float32Array(flatten(mat3())).byteLength,
  'mat4': new Float32Array(flatten(mat4())).byteLength
}; // new functions 5/2/2015
// printing

var printm = function printm(m) {
  if (m.length == 2) for (var i = 0; i < m.length; i++) {
    console.log(m[i][0], m[i][1]);
  } else if (m.length == 3) for (var i = 0; i < m.length; i++) {
    console.log(m[i][0], m[i][1], m[i][2]);
  } else if (m.length == 4) for (var i = 0; i < m.length; i++) {
    console.log(m[i][0], m[i][1], m[i][2], m[i][3]);
  }
}; // determinants


exports.printm = printm;

var det2 = function det2(m) {
  return m[0][0] * m[1][1] - m[0][1] * m[1][0];
};

exports.det2 = det2;

var det3 = function det3(m) {
  var d = m[0][0] * m[1][1] * m[2][2] + m[0][1] * m[1][2] * m[2][0] + m[0][2] * m[2][1] * m[1][0] - m[2][0] * m[1][1] * m[0][2] - m[1][0] * m[0][1] * m[2][2] - m[0][0] * m[1][2] * m[2][1];
  return d;
};

exports.det3 = det3;

var det4 = function det4(m) {
  var m0 = [vec3(m[1][1], m[1][2], m[1][3]), vec3(m[2][1], m[2][2], m[2][3]), vec3(m[3][1], m[3][2], m[3][3])];
  var m1 = [vec3(m[1][0], m[1][2], m[1][3]), vec3(m[2][0], m[2][2], m[2][3]), vec3(m[3][0], m[3][2], m[3][3])];
  var m2 = [vec3(m[1][0], m[1][1], m[1][3]), vec3(m[2][0], m[2][1], m[2][3]), vec3(m[3][0], m[3][1], m[3][3])];
  var m3 = [vec3(m[1][0], m[1][1], m[1][2]), vec3(m[2][0], m[2][1], m[2][2]), vec3(m[3][0], m[3][1], m[3][2])];
  return m[0][0] * det3(m0) - m[0][1] * det3(m1) + m[0][2] * det3(m2) - m[0][3] * det3(m3);
};

exports.det4 = det4;

var det = function det(m) {
  if (m.matrix != true) console.log("not a matrix");
  if (m.length == 2) return det2(m);
  if (m.length == 3) return det3(m);
  if (m.length == 4) return det4(m);
}; //---------------------------------------------------------
// inverses


exports.det = det;

var inverse2 = function inverse2(m) {
  var a = mat2();
  var d = det2(m);
  a[0][0] = m[1][1] / d;
  a[0][1] = -m[0][1] / d;
  a[1][0] = -m[1][0] / d;
  a[1][1] = m[0][0] / d;
  a.matrix = true;
  return a;
};

exports.inverse2 = inverse2;

var inverse3 = function inverse3(m) {
  var a = mat3();
  var d = det3(m);
  var a00 = [vec2(m[1][1], m[1][2]), vec2(m[2][1], m[2][2])];
  var a01 = [vec2(m[1][0], m[1][2]), vec2(m[2][0], m[2][2])];
  var a02 = [vec2(m[1][0], m[1][1]), vec2(m[2][0], m[2][1])];
  var a10 = [vec2(m[0][1], m[0][2]), vec2(m[2][1], m[2][2])];
  var a11 = [vec2(m[0][0], m[0][2]), vec2(m[2][0], m[2][2])];
  var a12 = [vec2(m[0][0], m[0][1]), vec2(m[2][0], m[2][1])];
  var a20 = [vec2(m[0][1], m[0][2]), vec2(m[1][1], m[1][2])];
  var a21 = [vec2(m[0][0], m[0][2]), vec2(m[1][0], m[1][2])];
  var a22 = [vec2(m[0][0], m[0][1]), vec2(m[1][0], m[1][1])];
  a[0][0] = det2(a00) / d;
  a[0][1] = -det2(a10) / d;
  a[0][2] = det2(a20) / d;
  a[1][0] = -det2(a01) / d;
  a[1][1] = det2(a11) / d;
  a[1][2] = -det2(a21) / d;
  a[2][0] = det2(a02) / d;
  a[2][1] = -det2(a12) / d;
  a[2][2] = det2(a22) / d;
  return a;
};

exports.inverse3 = inverse3;

var inverse4 = function inverse4(m) {
  var a = mat4();
  var d = det4(m);
  var a00 = [vec3(m[1][1], m[1][2], m[1][3]), vec3(m[2][1], m[2][2], m[2][3]), vec3(m[3][1], m[3][2], m[3][3])];
  var a01 = [vec3(m[1][0], m[1][2], m[1][3]), vec3(m[2][0], m[2][2], m[2][3]), vec3(m[3][0], m[3][2], m[3][3])];
  var a02 = [vec3(m[1][0], m[1][1], m[1][3]), vec3(m[2][0], m[2][1], m[2][3]), vec3(m[3][0], m[3][1], m[3][3])];
  var a03 = [vec3(m[1][0], m[1][1], m[1][2]), vec3(m[2][0], m[2][1], m[2][2]), vec3(m[3][0], m[3][1], m[3][2])];
  var a10 = [vec3(m[0][1], m[0][2], m[0][3]), vec3(m[2][1], m[2][2], m[2][3]), vec3(m[3][1], m[3][2], m[3][3])];
  var a11 = [vec3(m[0][0], m[0][2], m[0][3]), vec3(m[2][0], m[2][2], m[2][3]), vec3(m[3][0], m[3][2], m[3][3])];
  var a12 = [vec3(m[0][0], m[0][1], m[0][3]), vec3(m[2][0], m[2][1], m[2][3]), vec3(m[3][0], m[3][1], m[3][3])];
  var a13 = [vec3(m[0][0], m[0][1], m[0][2]), vec3(m[2][0], m[2][1], m[2][2]), vec3(m[3][0], m[3][1], m[3][2])];
  var a20 = [vec3(m[0][1], m[0][2], m[0][3]), vec3(m[1][1], m[1][2], m[1][3]), vec3(m[3][1], m[3][2], m[3][3])];
  var a21 = [vec3(m[0][0], m[0][2], m[0][3]), vec3(m[1][0], m[1][2], m[1][3]), vec3(m[3][0], m[3][2], m[3][3])];
  var a22 = [vec3(m[0][0], m[0][1], m[0][3]), vec3(m[1][0], m[1][1], m[1][3]), vec3(m[3][0], m[3][1], m[3][3])];
  var a23 = [vec3(m[0][0], m[0][1], m[0][2]), vec3(m[1][0], m[1][1], m[1][2]), vec3(m[3][0], m[3][1], m[3][2])];
  var a30 = [vec3(m[0][1], m[0][2], m[0][3]), vec3(m[1][1], m[1][2], m[1][3]), vec3(m[2][1], m[2][2], m[2][3])];
  var a31 = [vec3(m[0][0], m[0][2], m[0][3]), vec3(m[1][0], m[1][2], m[1][3]), vec3(m[2][0], m[2][2], m[2][3])];
  var a32 = [vec3(m[0][0], m[0][1], m[0][3]), vec3(m[1][0], m[1][1], m[1][3]), vec3(m[2][0], m[2][1], m[2][3])];
  var a33 = [vec3(m[0][0], m[0][1], m[0][2]), vec3(m[1][0], m[1][1], m[1][2]), vec3(m[2][0], m[2][1], m[2][2])];
  a[0][0] = det3(a00) / d;
  a[0][1] = -det3(a10) / d;
  a[0][2] = det3(a20) / d;
  a[0][3] = -det3(a30) / d;
  a[1][0] = -det3(a01) / d;
  a[1][1] = det3(a11) / d;
  a[1][2] = -det3(a21) / d;
  a[1][3] = det3(a31) / d;
  a[2][0] = det3(a02) / d;
  a[2][1] = -det3(a12) / d;
  a[2][2] = det3(a22) / d;
  a[2][3] = -det3(a32) / d;
  a[3][0] = -det3(a03) / d;
  a[3][1] = det3(a13) / d;
  a[3][2] = -det3(a23) / d;
  a[3][3] = det3(a33) / d;
  return a;
};

exports.inverse4 = inverse4;

var inverse = function inverse(m) {
  if (m.matrix != true) console.log("not a matrix");
  if (m.length == 2) return inverse2(m);
  if (m.length == 3) return inverse3(m);
  if (m.length == 4) return inverse4(m);
};

exports.inverse = inverse;

var normalMatrix = function normalMatrix(m, flag) {
  var a = mat4();
  a = inverse(transpose(m));
  if (flag != true) return a;else {
    var b = mat3();

    for (var i = 0; i < 3; i++) {
      for (var j = 0; j < 3; j++) {
        b[i][j] = a[i][j];
      }
    }

    return b;
  }
};

exports.normalMatrix = normalMatrix;
},{}],"src/common/Camera.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Camera = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _Vector_Matrix = require("./Utils/Vector_Matrix");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @author Alberto Contorno
 * @class
 * It represents a Camera that can be used in a Scene. 
 * It provides methods to move and rotate the camera and 
 * default view matrices ('ortho', 'perspective').
 */
var Camera = /*#__PURE__*/function () {
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
  function Camera(position, up, speed, type, moveKeys, projOptions, sensitivity, zooms) {
    var _this = this;

    (0, _classCallCheck2.default)(this, Camera);
    (0, _defineProperty2.default)(this, "position", (0, _Vector_Matrix.vec3)(0, 0, 0));
    (0, _defineProperty2.default)(this, "rotation", (0, _Vector_Matrix.vec3)(0, 0, 0));
    (0, _defineProperty2.default)(this, "up", (0, _Vector_Matrix.vec3)(0, 1, 0));
    (0, _defineProperty2.default)(this, "right", void 0);
    (0, _defineProperty2.default)(this, "direction", (0, _Vector_Matrix.vec3)(0, 0, 0));
    (0, _defineProperty2.default)(this, "front", (0, _Vector_Matrix.vec3)(0, 0, 0));
    (0, _defineProperty2.default)(this, "proj", void 0);
    (0, _defineProperty2.default)(this, "type", 'perspective');
    (0, _defineProperty2.default)(this, "yaw", 0);
    (0, _defineProperty2.default)(this, "pitch", 0);
    (0, _defineProperty2.default)(this, "zoomLevel", 2);
    (0, _defineProperty2.default)(this, "zooms", void 0);
    (0, _defineProperty2.default)(this, "sensitivity", 1);
    (0, _defineProperty2.default)(this, "speed", 1);
    (0, _defineProperty2.default)(this, "currX", void 0);
    (0, _defineProperty2.default)(this, "currY", void 0);
    (0, _defineProperty2.default)(this, "lastX", void 0);
    (0, _defineProperty2.default)(this, "lastY", void 0);
    (0, _defineProperty2.default)(this, "moveKeys", {
      forward: 'w',
      backward: 's',
      right: 'd',
      left: 'a'
    });
    (0, _defineProperty2.default)(this, "updateCameraDirection", void 0);
    (0, _defineProperty2.default)(this, "updateCameraPos", void 0);
    (0, _defineProperty2.default)(this, "inputs", void 0);
    (0, _defineProperty2.default)(this, "time", void 0);
    Camera.nextId++;
    this.id = Camera.nextId;
    this.sensitivity = sensitivity;
    this.speed = speed;
    this.position = position;
    this.type = type;
    this.projOptions = projOptions;
    this.zooms = zooms;
    window.addEventListener("wheel", function (event) {
      _this.zoomLevel += Math.sign(event.deltaY);
      _this.zoomLevel = Math.clamp(_this.zoomLevel, 0, _this.zooms.maxLevel);

      _this.setZoomLevel(_this.zoomLevel);
    });

    if (type && type === 'perspective') {
      this.proj = (0, _Vector_Matrix.perspective)(this.projOptions.fov, this.projOptions.aspect, this.projOptions.near, this.projOptions.far);
      this.updateCameraDirection = this._updateCameraDirection; //this.updateCameraPos = this._updateCameraPos;
    } else if (type && type === 'orthographic') {
      this.proj = (0, _Vector_Matrix.ortho)(this.projOptions.left, this.projOptions.right, this.projOptions.bottom, this.projOptions.ytop, this.projOptions.near, this.projOptions.far);
      this.updateCameraDirection = this._updateCameraDirection;
    }
  }
  /**
   * Return the Projection Matrix of the camera.
   */


  (0, _createClass2.default)(Camera, [{
    key: "getProjectionMatrix",
    value: function getProjectionMatrix() {
      return this.proj;
    }
    /**
     * Return the front vector of the camera;
     */

  }, {
    key: "getFrontVector",
    value: function getFrontVector() {
      return (0, _Vector_Matrix.vec3)(this.position[0] + this.direction[0], this.position[1] + this.direction[1], this.position[2] + this.direction[2]);
    }
    /**
     * Return the View Matrix of the camera.
     */

  }, {
    key: "getViewMatrix",
    value: function getViewMatrix() {
      return (0, _Vector_Matrix.lookAt)(this.getFrontVector(), this.position, this.up);
    }
    /**
     * It updates the direction of the camera.
     * @param {number} offsetX Offset on X direction to update the yaw of the camera (i.e. how much the camera must turn to the rigth/left)
     * @param {number} offsetY Offset on Y direction to update the pitch of the camera (i.e. how much the camera must turn up/down)
     * @param {number} deltaTime The delta time used to scale the quantities of the movements to make everything indipendent from the frame rate
     */

  }, {
    key: "_updateCameraDirection",
    value: function _updateCameraDirection(offsetX, offsetY, deltaTime) {
      offsetX *= this.sensitivity * deltaTime;
      offsetY *= this.sensitivity * deltaTime;
      this.yaw += offsetX;
      this.pitch += offsetY;

      if (this.pitch > 89.0) {
        this.pitch = 89.0;
      }

      if (this.pitch < -89.0) {
        this.pitch = -89.0;
      }

      this.direction = (0, _Vector_Matrix.vec3)(Math.cos(Math.radians(this.pitch)) * Math.cos(Math.radians(this.yaw)), Math.sin(Math.radians(this.pitch)), Math.cos(Math.radians(this.pitch)) * Math.sin(Math.radians(this.yaw)));
    }
    /**
     * Set a new position for the camera.
     * @param {vec3} newPos A vector of 3 components (x,y,z) representing the new positon of the camera in the world
     */

  }, {
    key: "_updateCameraPos",
    value: function _updateCameraPos(newPos) {
      this.position = (0, _Vector_Matrix.vec3)(newPos[0], newPos[1], 0.0);
    }
    /**
     * Move the camera forward with respect to the current looking direction, based on the camera speed,
     *  @param {number} deltaTime The delta time used to scale the quantity of the movement to make it indipendent from the frame rate
     */

  }, {
    key: "moveForward",
    value: function moveForward(deltaTime) {
      this.position = (0, _Vector_Matrix.subtract)(this.position, (0, _Vector_Matrix.scale)(this.speed * deltaTime, this.direction));
    }
    /**
     * Move the camera backwards with respect to the current looking direction, based on the camera speed,
     *  @param {number} deltaTime The delta time used to scale the quantity of the movement to make it indipendent from the frame rate
     */

  }, {
    key: "moveBackwards",
    value: function moveBackwards(deltaTime) {
      this.position = (0, _Vector_Matrix.add)(this.position, (0, _Vector_Matrix.scale)(this.speed * deltaTime, this.direction));
    }
    /**
     * Move the camera to the left with respect to the current looking direction, based on the camera speed,
     *  @param {number} deltaTime The delta time used to scale the quantity of the movement to make it indipendent from the frame rate
     */

  }, {
    key: "moveLeft",
    value: function moveLeft(deltaTime) {
      this.position = (0, _Vector_Matrix.add)(this.position, (0, _Vector_Matrix.scale)(this.speed * deltaTime, (0, _Vector_Matrix.normalize)((0, _Vector_Matrix.cross)(this.direction, this.up))));
    }
    /**
     * Move the camera to the left with respect to the current looking direction, based on the camera speed,
     *  @param {number} deltaTime The delta time used to scale the quantity of the movement to make it indipendent from the frame rate
     */

  }, {
    key: "moveRight",
    value: function moveRight(deltaTime) {
      this.position = (0, _Vector_Matrix.subtract)(this.position, (0, _Vector_Matrix.scale)(this.speed * deltaTime, (0, _Vector_Matrix.normalize)((0, _Vector_Matrix.cross)(this.direction, this.up))));
    }
    /**
     * Move the camera up, based on the camera speed,
     *  @param {number} deltaTime The delta time used to scale the quantity of the movement to make it indipendent from the frame rate
     */

  }, {
    key: "moveUp",
    value: function moveUp(deltaTime) {
      this.position = (0, _Vector_Matrix.add)(this.position, (0, _Vector_Matrix.scale)(this.speed * deltaTime, (0, _Vector_Matrix.vec3)(0, 1, 0)));
    }
    /**
     * Move the camera down, based on the camera speed,
     *  @param {number} deltaTime The delta time used to scale the quantity of the movement to make it indipendent from the frame rate
     */

  }, {
    key: "moveDown",
    value: function moveDown(deltaTime) {
      this.position = (0, _Vector_Matrix.subtract)(this.position, (0, _Vector_Matrix.scale)(this.speed * deltaTime, (0, _Vector_Matrix.vec3)(0, 1, 0)));
    }
    /**
     * Set the configuration of the levels of zooms. Only for perspective cameras.
     * @param {object} zooms - An object of configuration. It must contains a maxLevel zoom, and a key[int]-value[int] pair for every level of zoom, indicating
     * as a key the level (an integer starting from 0 and incremented by 1 for every zoom level) and as a value the fov associated.
     * @example
     * { maxLevel: 3, 0: 30, 1: 45, 2: 75, 3: 90 },
     */

  }, {
    key: "setZoomLevels",
    value: function setZoomLevels(zooms) {
      this.zooms = zooms;
    }
    /**
     * Set the current level of zoom to be used, if applicable on the base of the zooms configuration.
     * @param {*} level The chosen level of zoom.
     */

  }, {
    key: "setZoomLevel",
    value: function setZoomLevel(level) {
      this.zoomLevel = level;

      if (this.zooms) {
        this.projOptions.fov = this.zooms[this.zoomLevel] || 45;
      } else {
        this.projOptions.fov = 45;
      }

      this.proj = (0, _Vector_Matrix.perspective)(this.projOptions.fov, this.projOptions.aspect, this.projOptions.near, this.projOptions.far);
    }
  }]);
  return Camera;
}();

exports.Camera = Camera;
(0, _defineProperty2.default)(Camera, "nextId", 1);
},{"@babel/runtime/helpers/classCallCheck":"node_modules/@babel/runtime/helpers/classCallCheck.js","@babel/runtime/helpers/createClass":"node_modules/@babel/runtime/helpers/createClass.js","@babel/runtime/helpers/defineProperty":"node_modules/@babel/runtime/helpers/defineProperty.js","./Utils/Vector_Matrix":"src/common/Utils/Vector_Matrix.js"}],"src/common/Object.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SceneObject = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _Transform = require("./Components/Transform");

var _Component = require("./Component");

var _Camera = require("./Camera");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

/**
 * @author Alberto Contorno
 * @class
 */
var SceneObject = /*#__PURE__*/function () {
  //model
  function SceneObject(startCallback, name) {
    (0, _classCallCheck2.default)(this, SceneObject);
    (0, _defineProperty2.default)(this, "id", void 0);
    (0, _defineProperty2.default)(this, "scene", void 0);
    (0, _defineProperty2.default)(this, "components", {});
    (0, _defineProperty2.default)(this, "transform", void 0);
    (0, _defineProperty2.default)(this, "meshes", []);
    (0, _defineProperty2.default)(this, "children", []);
    (0, _defineProperty2.default)(this, "parent", void 0);
    (0, _defineProperty2.default)(this, "material", void 0);
    (0, _defineProperty2.default)(this, "name", void 0);
    (0, _defineProperty2.default)(this, "onStart", function () {});
    (0, _defineProperty2.default)(this, "onUpdate", function () {});
    (0, _defineProperty2.default)(this, "onDestroy", function () {});
    this.name = name;
    SceneObject.nextId++;
    this.id = SceneObject.nextId;
    this.onStart = startCallback;
    this.transform = this.components['transform'] = new _Transform.Transform(this);
  }

  (0, _createClass2.default)(SceneObject, [{
    key: "addMesh",
    value: function addMesh(mesh) {
      var _iterator = _createForOfIteratorHelper(this.meshes),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var m = _step.value;

          if (m.id === mesh.id) {
            console.warning('[WARNING - Object](addMesh) - Added mesh is already present.');
            return;
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      this.meshes.push(mesh);
    }
  }, {
    key: "addChild",
    value: function addChild(child) {
      this.children.push(child);
      child.parent = this;
    }
  }, {
    key: "getTransformToRender",
    value: function getTransformToRender() {
      var transformToRender;

      if (this.parent) {
        transformToRender = _Transform.Transform.summed(this.transform, this.parent.getTransformToRender());
      } else {
        transformToRender = this.transform;
      }

      return transformToRender;
    }
    /**
     * 
     * @param {GL_CONTEXT} gl 
     * @param {Camera} camera 
     * @param {*} lights 
     */

  }, {
    key: "render",
    value: function render(gl, camera, lights, lightsTypes) {
      //obj passes position, rotation and scaling
      var _iterator2 = _createForOfIteratorHelper(this.meshes),
          _step2;

      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var mesh = _step2.value;
          var transformToRender = this.getTransformToRender();
          mesh.render(gl, camera, this, this.type, this.material, lights, lightsTypes, this.name); //mesh.renderDefault(gl, camera, this, this.type, this.material, lights, defaultShader, locs)
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
    }
    /**
     * 
     * @param {Component} component 
     */

  }, {
    key: "addComponent",
    value: function addComponent(component) {
      if (!component) {
        console.warn('[WARNING - SCENE_OBJECT](addComponent) - Trying to add a component but no component provided.');
        return;
      }

      this.components[component.name] = component;
      component.parent = this;
      component.onAfterAdded(this, this.scene);
    }
    /**
     * 
     * @param {Component} component 
     */

  }, {
    key: "removeComponent",
    value: function removeComponent(component) {
      if (!component) {
        console.warn('[WARNING - SCENE_OBJECT](addComponent) - Trying to add a component but no component provided.');
        return;
      }

      this.components[component.name] = null;
      component.parent = null;
      component.onAfterRemoved(this, this.scene);
    }
  }]);
  return SceneObject;
}();

exports.SceneObject = SceneObject;
(0, _defineProperty2.default)(SceneObject, "nextId", 1);
},{"@babel/runtime/helpers/classCallCheck":"node_modules/@babel/runtime/helpers/classCallCheck.js","@babel/runtime/helpers/createClass":"node_modules/@babel/runtime/helpers/createClass.js","@babel/runtime/helpers/defineProperty":"node_modules/@babel/runtime/helpers/defineProperty.js","./Components/Transform":"src/common/Components/Transform.js","./Component":"src/common/Component.js","./Camera":"src/common/Camera.js"}],"src/common/Scene.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Scene = void 0;

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _Object = require("./Object");

var _Camera = require("./Camera");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

/**
 * @author Alberto Contorno
 * @class
 * Class that represents a Scene. 
 * A Scene is a container to render and manage objects.
 * Moreover it has an array of cameras that can be used, of which, one is the main camera used to render.
 */
var Scene = /*#__PURE__*/function () {
  function Scene() {
    (0, _classCallCheck2.default)(this, Scene);
    (0, _defineProperty2.default)(this, "id", void 0);
    (0, _defineProperty2.default)(this, "objects", []);
    (0, _defineProperty2.default)(this, "objectsMap", {});
    (0, _defineProperty2.default)(this, "cameras", []);
    (0, _defineProperty2.default)(this, "mainCamera", void 0);
    (0, _defineProperty2.default)(this, "lights", []);
    (0, _defineProperty2.default)(this, "lightsTypes", {});
    (0, _defineProperty2.default)(this, "defaultShaders", {
      vertex: null,
      fragment: null,
      program: null
    });
    (0, _defineProperty2.default)(this, "defaultLocations", {});
    (0, _defineProperty2.default)(this, "emptyTextures", void 0);
    (0, _defineProperty2.default)(this, "engine", void 0);
    Scene.nextId++;
    this.id = Scene.nextId;
  }

  (0, _createClass2.default)(Scene, [{
    key: "onAfterSceneAdded",
    value: function onAfterSceneAdded(engine) {
      this.engine = engine; //this.setupDefaultShaders();
    }
    /**
     * 
     * @param {Camera} camera 
     */

  }, {
    key: "addCamera",
    value: function addCamera(camera) {
      var _iterator = _createForOfIteratorHelper(this.cameras),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var cam = _step.value;

          if (cam.id === camera.id) {
            console.warn('[WARNING - SCENE](addCamera) - Added camera is already present.');
            return;
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      this.cameras.push(camera);

      if (!this.mainCamera) {
        this.mainCamera = camera;
      }
    }
    /**
     * 
     * @param {Camera} camera 
     */

  }, {
    key: "setMainCamera",
    value: function setMainCamera(camera) {
      this.mainCamera = camera;
      var alreadyPresent = false;

      var _iterator2 = _createForOfIteratorHelper(this.cameras),
          _step2;

      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var cam = _step2.value;

          if (cam.id === camera.id) {
            alreadyPresent = true;
            break;
          }
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }

      if (!alreadyPresent) {
        this.cameras.push(camera);
      }
    }
    /**
     * 
     * @param {SceneObject} obj 
     */

  }, {
    key: "addObject",
    value: function addObject(obj) {
      this.objects.push(obj);
      obj.scene = this;
      this.objectsMap[obj.id] = this.objects.length - 1;
    }
    /**
     * 
     * @param {SceneObject} obj 
     */

  }, {
    key: "removeObject",
    value: function removeObject(obj) {
      if ((0, _typeof2.default)(obj) === 'object') {
        if (this.objectsMap[this.objectsMap[obj.id]] != null) {
          this.objects[this.objectsMap[obj.id]] = null;
          this.objectsMap[this.objectsMap[obj.id]] = null;
        }
      } else if (typeof obj === 'number') {
        if (this.objects[obj] != null) {
          this.objects[obj] = null;
        }
      }
    }
  }, {
    key: "registerLight",
    value: function registerLight(type, light) {
      this.lights.push({
        parentObj: light.parent,
        type: type,
        light: light
      });
      this.lightsTypes[type] = this.lightsTypes[type] ? this.lightsTypes[type] + 1 : 1; // TODO Recompute shader
    }
  }, {
    key: "unregisterLight",
    value: function unregisterLight(type, light) {
      if (!light) {
        console.warn('[WARNING - SCENE](unregisterLight) - Trying to unregister a light but no light is provided.');
      }

      var lightIndex = this.lights.findIndex(function (el) {
        return el.id = light.id;
      });

      if (lightIndex >= 0) {
        this.lights[lightIndex].parentObj = null;
        this.lights[lightIndex].light = null;
        this.lightsTypes[type] = this.lightsTypes[type] ? this.lightsTypes[type] - 1 : 0;
        this.lights.splice(lightIndex, 1); //TODO Recompute shader
      } else {
        console.warn('[WARNING - SCENE](unregisterLight) - Trying to unregister a light that is not registered into the scene.');
      }
    }
  }, {
    key: "renderScene",
    value: function renderScene(gl) {
      var _iterator3 = _createForOfIteratorHelper(this.objects),
          _step3;

      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var obj = _step3.value;
          obj.onUpdate(obj);
          obj.render(gl, this.mainCamera, this.lights, this.lightsTypes);
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }
    }
  }]);
  return Scene;
}();

exports.Scene = Scene;
(0, _defineProperty2.default)(Scene, "nextId", 1);
},{"@babel/runtime/helpers/typeof":"node_modules/@babel/runtime/helpers/typeof.js","@babel/runtime/helpers/classCallCheck":"node_modules/@babel/runtime/helpers/classCallCheck.js","@babel/runtime/helpers/createClass":"node_modules/@babel/runtime/helpers/createClass.js","@babel/runtime/helpers/defineProperty":"node_modules/@babel/runtime/helpers/defineProperty.js","./Object":"src/common/Object.js","./Camera":"src/common/Camera.js"}],"node_modules/@babel/runtime/helpers/arrayWithHoles.js":[function(require,module,exports) {
function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

module.exports = _arrayWithHoles;
},{}],"node_modules/@babel/runtime/helpers/iterableToArrayLimit.js":[function(require,module,exports) {
function _iterableToArrayLimit(arr, i) {
  if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

module.exports = _iterableToArrayLimit;
},{}],"node_modules/@babel/runtime/helpers/nonIterableRest.js":[function(require,module,exports) {
function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

module.exports = _nonIterableRest;
},{}],"node_modules/@babel/runtime/helpers/slicedToArray.js":[function(require,module,exports) {
var arrayWithHoles = require("./arrayWithHoles");

var iterableToArrayLimit = require("./iterableToArrayLimit");

var unsupportedIterableToArray = require("./unsupportedIterableToArray");

var nonIterableRest = require("./nonIterableRest");

function _slicedToArray(arr, i) {
  return arrayWithHoles(arr) || iterableToArrayLimit(arr, i) || unsupportedIterableToArray(arr, i) || nonIterableRest();
}

module.exports = _slicedToArray;
},{"./arrayWithHoles":"node_modules/@babel/runtime/helpers/arrayWithHoles.js","./iterableToArrayLimit":"node_modules/@babel/runtime/helpers/iterableToArrayLimit.js","./unsupportedIterableToArray":"node_modules/@babel/runtime/helpers/unsupportedIterableToArray.js","./nonIterableRest":"node_modules/@babel/runtime/helpers/nonIterableRest.js"}],"src/common/Shader.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Shader = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _shadersUtils = require("./shadersUtils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @author Alberto Contorno
 * @class
 */
var Shader = /*#__PURE__*/function () {
  function Shader(gl, type, source) {
    (0, _classCallCheck2.default)(this, Shader);
    (0, _defineProperty2.default)(this, "type", void 0);
    (0, _defineProperty2.default)(this, "source", void 0);
    (0, _defineProperty2.default)(this, "id", void 0);
    (0, _defineProperty2.default)(this, "errors", []);
    (0, _defineProperty2.default)(this, "shader", void 0);
    Shader.nextId++;
    this.id = Shader.nextId;
    this.type = type === 'vertex' ? gl.VERTEX_SHADER : gl.FRAGMENT_SHADER;
    this.shader = _shadersUtils.ShaderUtils.loadAndCompileShader(this.type, source);
    this.source = source;

    var shaderError = _shadersUtils.ShaderUtils.checkShaderCompilingErrors(this.shader);

    if (shaderError) {
      console.log("err", shaderError);
      this.errors.push(shaderError);
    }
  }

  (0, _createClass2.default)(Shader, [{
    key: "equals",
    value: function equals(other) {
      return this.id === other.id;
    }
  }, {
    key: "destroy",
    value: function destroy(gl) {}
  }]);
  return Shader;
}();

exports.Shader = Shader;
(0, _defineProperty2.default)(Shader, "nextId", 1);
},{"@babel/runtime/helpers/classCallCheck":"node_modules/@babel/runtime/helpers/classCallCheck.js","@babel/runtime/helpers/createClass":"node_modules/@babel/runtime/helpers/createClass.js","@babel/runtime/helpers/defineProperty":"node_modules/@babel/runtime/helpers/defineProperty.js","./shadersUtils":"src/common/shadersUtils.js"}],"src/common/ShaderProgram.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ShaderProgram = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _shadersUtils = require("./shadersUtils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @author Alberto Contorno
 * @class
 */
var ShaderProgram = function ShaderProgram(gl, shaders) {
  (0, _classCallCheck2.default)(this, ShaderProgram);
  (0, _defineProperty2.default)(this, "program", void 0);
  (0, _defineProperty2.default)(this, "errors", []);
  ShaderProgram.nextId++;
  this.id = ShaderProgram.nextId;
  this.program = _shadersUtils.ShaderUtils.createShaderProgramFromShaders(shaders);

  var shaderError = _shadersUtils.ShaderUtils.checkShaderProgramLinkingErrors(this.program);

  if (shaderError) {
    console.log('err prog', shaderError);
    this.errors.push(shaderError);
  }
};

exports.ShaderProgram = ShaderProgram;
(0, _defineProperty2.default)(ShaderProgram, "nextId", 1);
},{"@babel/runtime/helpers/classCallCheck":"node_modules/@babel/runtime/helpers/classCallCheck.js","@babel/runtime/helpers/defineProperty":"node_modules/@babel/runtime/helpers/defineProperty.js","./shadersUtils":"src/common/shadersUtils.js"}],"src/common/Utils/constants.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DefTextCoords = exports.EmptyTexture = exports.TextureTypes = exports.LightTypes = void 0;

var _Vector_Matrix = require("./Vector_Matrix");

var LightTypes = {
  DirectionalLight: 'DIRECTIONAL_LIGHT',
  PointLight: 'POINTLIGHT',
  SpotLight: 'SPOTLIGHT'
};
exports.LightTypes = LightTypes;
var TextureTypes = {
  DiffuseMap: 'DIFFUSE_MAP',
  SpecularMap: 'SPECULAR_MAP',
  NormalMap: 'NORMAL_MAP',
  LightMap: 'LIGHT_MAP',
  BumpMap: 'BUMP_MAP',
  ShadowMap: 'SHADOW_MAP'
};
exports.TextureTypes = TextureTypes;
var EmptyTexture = {
  level: 0,
  width: 1,
  height: 1,
  border: 0,
  srcFormat: 'RGBA',
  internalFormat: 'RGBA',
  srcType: 'UNSIGNED_BYTE',
  pixels: new Uint8Array([255, 255, 255, 255])
};
exports.EmptyTexture = EmptyTexture;
var DefTextCoords = (0, _Vector_Matrix.vec2)(0, 0);
exports.DefTextCoords = DefTextCoords;
},{"./Vector_Matrix":"src/common/Utils/Vector_Matrix.js"}],"src/shaders/shaderDefaults.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fragmentShaderCompleteObj = exports.fTbn_Calc = exports.fTangent_In = exports.fTBN_In = exports.fNormalCalc_Tangents = exports.fNormalCalc_noTangents = exports.fOutput_Lights_Color = exports.fOutput_Lights = exports.fDiffuseCoords = exports.fTextureCoords = exports.normalMapVar = exports.shadowMapVar = exports.bumbMapVar = exports.lightMapVar = exports.specularMapVar = exports.diffuseMapVar = exports.fColorIn = exports.materialVar = exports.SpotLightFuncImplObj = exports.PointLightFuncImplObj = exports.DirLightFuncImplObj = exports.LightSpecularWithTexture_Spec = exports.LightDiffuseWithTexture_Spec = exports.LightAmbientWithTexture_Spec = exports.LightSpecularWithTexture_Diff = exports.LightDiffuseWithTexture_Diff = exports.LightAmbientWithTexture_Diff = exports.LightSpecularWithTexture_Diff_Spec = exports.LightDiffuseWithTexture_Diff_Spec = exports.LightAmbientWithTexture_Diff_Spec = exports.SpotLightFuncDec = exports.PointLightFuncDec = exports.DirLightFuncDec = exports.SpotLightShader_NoPos = exports.SpotLightShader = exports.PointLightShader_NoPos = exports.PointLightShader = exports.DirectionalLightShader = exports.materialStruct = exports.vertexCompleteShaderObj = exports.vTbn_Assing = exports.vTbn_Out = exports.vTangentCalc = exports.vTangent_Assign = exports.vTangent_Out = exports.vTangent_In = exports.vTextureCoords_Assign = exports.vTextureCoords_Out = exports.vTextureCoords_In = exports.vColor_Assign = exports.vColor_Out = exports.vColor_In = exports.vMainBody_fPos_Calc_TBN = exports.vMainBody_fPos_Calc = void 0;
var vMainBody_fPos_Calc = '\tfPos = vec3(model * vPosition);\n';
exports.vMainBody_fPos_Calc = vMainBody_fPos_Calc;
var vMainBody_fPos_Calc_TBN = '\tfPos = vec3(model * vPosition) * TBN;\n';
exports.vMainBody_fPos_Calc_TBN = vMainBody_fPos_Calc_TBN;
var vColor_In = 'in vec4 vColor;\n';
exports.vColor_In = vColor_In;
var vColor_Out = 'out vec4 fColor;\n';
exports.vColor_Out = vColor_Out;
var vColor_Assign = 'fColor = vColor;\n';
exports.vColor_Assign = vColor_Assign;
var vTextureCoords_In = 'in vec2 vTextureCoords;\n';
exports.vTextureCoords_In = vTextureCoords_In;
var vTextureCoords_Out = 'out vec2 fTextureCoords;\n';
exports.vTextureCoords_Out = vTextureCoords_Out;
var vTextureCoords_Assign = '\tfTextureCoords = vTextureCoords;\n';
exports.vTextureCoords_Assign = vTextureCoords_Assign;
var vTangent_In = 'in vec3 vTangent;\n';
exports.vTangent_In = vTangent_In;
var vTangent_Out = 'out vec3 fTangent;\n';
exports.vTangent_Out = vTangent_Out;
var vTangent_Assign = '\tfTangent = normalize(normalMatrix * vTangent);\n';
exports.vTangent_Assign = vTangent_Assign;
var vTangentCalc = "\n    vec3 T = normalize(normalMatrix * vTangent);\n    vec3 N = normalize(fNormal);\n    T = normalize(T - dot(T, N) * N);\n    vec3 B = cross(N, T);\n    mat3 TBN = mat3(T, B, N);\n";
exports.vTangentCalc = vTangentCalc;
var vTbn_Out = 'out mat3 fTBN;\n';
exports.vTbn_Out = vTbn_Out;
var vTbn_Assing = '\tfTBN = TBN;\n';
exports.vTbn_Assing = vTbn_Assing;

var vertexCompleteShaderObj = function vertexCompleteShaderObj() {
  return {
    version: '#version 300 es\n',
    position: 'in vec4 vPosition;\n',
    lightsPosUniform: '',
    lightsPosOut: '',
    colorIn: '',
    textureCoordsIn: '',
    textureCoordsOut: '',
    normalIn: 'in vec3 vNormal;\n',
    tangentIn: '',
    tangentOut: '',
    modelViewProj: 'uniform mat4 model;\nuniform mat4 view;\nuniform mat4 projection;\n',
    colorOut: '',
    normalOut: 'out vec3 fNormal;\n',
    tbnOut: '',
    fragPosOut: 'out vec3 fPos;\n',
    mainStart: 'void main(){\n',
    mainBodyNormalCalc: '\tmat3 normalMatrix = mat3(transpose(inverse(model)));\n\tfNormal = normalMatrix * vNormal;\n',
    textureCoordsAssign: '',
    tangentAssign: '',
    tbnCalc: '',
    tbnAssign: '',
    mainBodyFPos: '',
    colorAssign: '',
    mainBodyOutput: '\n\tgl_Position = projection * view * model * vPosition;\n}'
  };
};

exports.vertexCompleteShaderObj = vertexCompleteShaderObj;
var materialStruct = 'struct Material {\n' + '\tvec3 ambient;\n' + '\tvec3 diffuse;\n' + '\tvec3 specular;\n' + '\tfloat shininess;\n' + '};\n';
exports.materialStruct = materialStruct;
var DirectionalLightShader = "struct DirectionalLight {\n    vec3 direction;\n    vec3 ambient;\n    vec3 diffuse;\n    vec3 specular;\n};\n";
exports.DirectionalLightShader = DirectionalLightShader;
var PointLightShader = "struct PointLight {\n    vec3 position;\n    vec3 ambient;\n    vec3 diffuse;\n    vec3 specular;\n    float constant;\n    float linear;\n    float quadratic;\n};\n";
exports.PointLightShader = PointLightShader;
var PointLightShader_NoPos = "struct PointLight {\n    vec3 ambient;\n    vec3 diffuse;\n    vec3 specular;\n    float constant;\n    float linear;\n    float quadratic;\n};\n";
exports.PointLightShader_NoPos = PointLightShader_NoPos;
var SpotLightShader = "\nstruct SpotLight {\n    vec3 direction;\n    vec3 position;\n    vec3 ambient;\n    vec3 diffuse;\n    vec3 specular;\n    float constant;\n    float linear;\n    float quadratic;\n    float cutOff;\n    float outerCutOff;\n};\n";
exports.SpotLightShader = SpotLightShader;
var SpotLightShader_NoPos = "\nstruct SpotLight {\n    vec3 direction;\n    vec3 ambient;\n    vec3 diffuse;\n    vec3 specular;\n    float constant;\n    float linear;\n    float quadratic;\n    float cutOff;\n    float outerCutOff;\n};\n";
exports.SpotLightShader_NoPos = SpotLightShader_NoPos;
var DirLightFuncDec = 'vec3 CalcDirLight(DirectionalLight light, vec3 normal, vec3 viewDir);\n';
exports.DirLightFuncDec = DirLightFuncDec;
var PointLightFuncDec = 'vec3 CalcPointLight(PointLight light, vec3 normal, vec3 fragPos, vec3 viewDir);\n';
exports.PointLightFuncDec = PointLightFuncDec;
var SpotLightFuncDec = 'vec3 CalcSpotLight(SpotLight light, vec3 normal, vec3 fragPos, vec3 viewDir);\n';
exports.SpotLightFuncDec = SpotLightFuncDec;
var LightAmbientWithTexture_Diff_Spec = '\tvec3 ambient = light.ambient * vec3(texture(diffuseTexture, fTextureCoords));\n';
exports.LightAmbientWithTexture_Diff_Spec = LightAmbientWithTexture_Diff_Spec;
var LightDiffuseWithTexture_Diff_Spec = '\tvec3 diffuse = light.diffuse * diff * vec3(texture(diffuseTexture, fTextureCoords));\n';
exports.LightDiffuseWithTexture_Diff_Spec = LightDiffuseWithTexture_Diff_Spec;
var LightSpecularWithTexture_Diff_Spec = '\tvec3 specular = light.specular * spec * vec3(texture(specularTexture, fTextureCoords));\n';
exports.LightSpecularWithTexture_Diff_Spec = LightSpecularWithTexture_Diff_Spec;
var LightAmbientWithTexture_Diff = '\tvec3 ambient = light.ambient * vec3(texture(diffuseTexture, fTextureCoords));\n';
exports.LightAmbientWithTexture_Diff = LightAmbientWithTexture_Diff;
var LightDiffuseWithTexture_Diff = '\tvec3 diffuse = light.diffuse * diff * vec3(texture(diffuseTexture, fTextureCoords));\n';
exports.LightDiffuseWithTexture_Diff = LightDiffuseWithTexture_Diff;
var LightSpecularWithTexture_Diff = '\tvec3 specular = light.specular * spec * material.specular;\n';
exports.LightSpecularWithTexture_Diff = LightSpecularWithTexture_Diff;
var LightAmbientWithTexture_Spec = '\tvec3 ambient = light.ambient * material.diffuse;\n';
exports.LightAmbientWithTexture_Spec = LightAmbientWithTexture_Spec;
var LightDiffuseWithTexture_Spec = '\tvec3 diffuse = light.ambient * material.diffuse;\n';
exports.LightDiffuseWithTexture_Spec = LightDiffuseWithTexture_Spec;
var LightSpecularWithTexture_Spec = '\tvec3 specular = light.specular * spec * vec3(texture(specularTexture, fTextureCoords));\n';
exports.LightSpecularWithTexture_Spec = LightSpecularWithTexture_Spec;

var DirLightFuncImplObj = function DirLightFuncImplObj() {
  return {
    signature: 'vec3 CalcDirLight(DirectionalLight light, vec3 normal, vec3 viewDir){\n',
    bodyStandandPart: "\tvec3 lightDir = normalize(-light.direction);\n  \t// diffuse shading\n  \tfloat diff = max(dot(normal, lightDir), 0.0);\n  \t// specular shading\n  \tvec3 reflectDir = reflect(-lightDir, normal);\n  \tfloat spec = pow(max(dot(viewDir, reflectDir), 0.0), material.shininess);\n  \t// combine results\n",
    bodyAmbient: '\tvec3 ambient = light.ambient * material.diffuse;\n',
    bodyDiffuse: '\tvec3 diffuse = light.diffuse * diff * material.diffuse;\n',
    bodySpecular: '\tvec3 specular = light.specular * spec * material.specular;\n',
    bodyReturn: '\treturn (ambient + diffuse + specular);\n}\n'
  };
};

exports.DirLightFuncImplObj = DirLightFuncImplObj;

var PointLightFuncImplObj = function PointLightFuncImplObj() {
  return {
    signature: 'vec3 CalcPointLight(PointLight light, vec3 normal, vec3 fragPos, vec3 viewDir){\n',
    bodyStandandPart: "\tvec3 lightDir = normalize(light.position - fragPos);\n  \t// diffuse shading\n  \tfloat diff = max(dot(normal, lightDir), 0.0);\n  \t// specular shading\n  \tvec3 reflectDir = reflect(-lightDir, normal);\n  \tfloat spec = pow(max(dot(viewDir, reflectDir), 0.0), material.shininess);\n  \t// attenuation\n  \tfloat distance = length(light.position - fragPos);\n  \tfloat attenuation = 1.0 / (light.constant + light.linear * distance + light.quadratic * (distance * distance));    \n  \t// combine results\n",
    bodyAmbient: '\tvec3 ambient = light.ambient * material.diffuse;\n',
    bodyDiffuse: '\tvec3 diffuse = light.diffuse * diff * material.diffuse;\n',
    bodySpecular: '\tvec3 specular = light.specular * spec * material.specular;\n',
    bodyAttenuation: "\tambient *= attenuation;\n  \tdiffuse *= attenuation;\n  \tspecular *= attenuation;\n",
    bodyReturn: '\treturn (ambient + diffuse + specular);\n}\n'
  };
};

exports.PointLightFuncImplObj = PointLightFuncImplObj;

var SpotLightFuncImplObj = function SpotLightFuncImplObj() {
  return {
    signature: 'vec3 CalcSpotLight(SpotLight light, vec3 normal, vec3 fragPos, vec3 viewDir){\n',
    bodyStandandPart: "\tvec3 lightDir = normalize(light.position - fragPos);\n  \t// diffuse shading\n  \tfloat diff = max(dot(normal, lightDir), 0.0);\n  \t// specular shading\n  \tvec3 reflectDir = reflect(-lightDir, normal);\n  \tfloat spec = pow(max(dot(viewDir, reflectDir), 0.0), material.shininess);\n  \t// attenuation\n  \tfloat distance = length(light.position - fragPos);\n  \tfloat attenuation = 1.0 / (light.constant + light.linear * distance + light.quadratic * (distance * distance));    \n  \t// spotlight intensity\n  \tfloat theta = dot(lightDir, normalize(-light.direction)); \n  \tfloat epsilon = light.cutOff - light.outerCutOff;\n  \tfloat intensity = clamp((theta - light.outerCutOff) / epsilon, 0.0, 1.0);\n  \t// combine results\n",
    bodyAmbient: '\tvec3 ambient = light.ambient * material.diffuse;\n',
    bodyDiffuse: '\tvec3 diffuse = light.diffuse * diff * material.diffuse;\n',
    bodySpecular: '\tvec3 specular = light.specular * spec * material.specular;\n',
    bodyAttenuation: "\tambient *= attenuation * intensity;\n  \tdiffuse *= attenuation * intensity;\n  \tspecular *= attenuation * intensity;\n",
    bodyReturn: '\treturn (ambient + diffuse + specular);\n}\n'
  };
};

exports.SpotLightFuncImplObj = SpotLightFuncImplObj;
var materialVar = 'uniform Material material;\n';
exports.materialVar = materialVar;
var fColorIn = 'in vec4 fColor;\n';
exports.fColorIn = fColorIn;
var diffuseMapVar = 'uniform sampler2D diffuseTexture;\n';
exports.diffuseMapVar = diffuseMapVar;
var specularMapVar = 'uniform sampler2D specularTexture;\n';
exports.specularMapVar = specularMapVar;
var lightMapVar = 'uniform sampler2D lightTexture;\n';
exports.lightMapVar = lightMapVar;
var bumbMapVar = 'uniform sampler2D bumpTexture;\n';
exports.bumbMapVar = bumbMapVar;
var shadowMapVar = 'uniform sampler2D shadowTexture;\n';
exports.shadowMapVar = shadowMapVar;
var normalMapVar = 'uniform sampler2D normalTexture;\n';
exports.normalMapVar = normalMapVar;
var fTextureCoords = 'in vec2 fTextureCoords;\n';
exports.fTextureCoords = fTextureCoords;
var fDiffuseCoords = 'in vec2 fDiffuseTextCoords;\n';
exports.fDiffuseCoords = fDiffuseCoords;
var fOutput_Lights = '\tfragColor = vec4(lightColor, 1.0);\n';
exports.fOutput_Lights = fOutput_Lights;
var fOutput_Lights_Color = '\tfragColor = vec4(lightColor, 1.0) * fColor;\n';
exports.fOutput_Lights_Color = fOutput_Lights_Color;
var fNormalCalc_noTangents = "\tvec3 norm = texture(normalTexture, fTextureCoords).rgb;\n\tnorm = normalize(norm * 2.0 - 1.0);\n";
exports.fNormalCalc_noTangents = fNormalCalc_noTangents;
var fNormalCalc_Tangents = "vec3 norm = texture(normalTexture, fTextureCoords).rgb;\nnorm = norm * 2.0 - 1.0;   \nnorm = normalize(fTBN * norm);";
exports.fNormalCalc_Tangents = fNormalCalc_Tangents;
var fTBN_In = 'in mat3 fTBN;\n';
exports.fTBN_In = fTBN_In;
var fTangent_In = 'in vec3 fTangent;\n';
exports.fTangent_In = fTangent_In;
var fTbn_Calc = "\tvec3 norm = normalize(fNormal) * ( float( gl_FrontFacing ) * 2.0 - 1.0 );\n\tvec3 tangent = normalize(fTangent) * ( float( gl_FrontFacing ) * 2.0 - 1.0 );\n\tvec3 bitangent = normalize(cross(norm, tangent));\n\tmat3 tbn = mat3(tangent, bitangent, norm);\n\tnorm = texture(normalTexture, fTextureCoords).rgb * 2. - 1.;\n\tnorm = normalize(tbn * norm);\n";
exports.fTbn_Calc = fTbn_Calc;

var fragmentShaderCompleteObj = function fragmentShaderCompleteObj() {
  return {
    version: '#version 300 es\n',
    precision: 'precision mediump float;\n',
    materialStruct: '',
    lightsStructs: '',
    lightsFuncDec: '',
    colorIn: '',
    normalIn: 'in vec3 fNormal;\n',
    tangentIn: '',
    tbnIn: '',
    fragPosIn: 'in vec3 fPos;\n',
    texturesCoords: '',
    samplers: '',
    viewPos: 'uniform vec3 viewPos;\n',
    material: '',
    lightsUniform: '',
    colorOut: 'out vec4 fragColor;\n',
    mainStart: 'void main(){\n',
    normalCalc: '',
    lightsCalc: '',
    textureCalc: '',
    fragOutput: '\tfragColor = vec4(0.0, 0.0, 1.0, 1.0);\n',
    mainEnd: '}\n',
    lightsFuncImpl: '',
    textureFuncImpl: ''
  };
};

exports.fragmentShaderCompleteObj = fragmentShaderCompleteObj;
},{}],"src/common/Material.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Material = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _Vector_Matrix = require("./Utils/Vector_Matrix");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @author Alberto Contorno
 * @class
 * Class that represents a Material of a Mesh, that defines the differents components
 * of the Phong Lighting.
 */
var Material = // Can be a Texture - If present ambient is to be ignored
// Can be a Texture
// TODO { diffuseMap: Texture, specularMap: Texture, lightMap: Texture, bumpMap: Texture, shadowMap: Texture}

/**
 * Create a new Material to be used by a Mesh.
 * @param {vec3} ambient The ambient color of the object
 * @param {vec3} diffuse The diffuse color of the objcet
 * @param {vec3} diffuse The spcular color of the objcet
 * @param {float} diffuse The shininess level of the objcet (a power of 2 (eg. 32, 64 ...))
 */
function Material(ambient, diffuse, specular, shininess) {
  (0, _classCallCheck2.default)(this, Material);
  (0, _defineProperty2.default)(this, "ambient", void 0);
  (0, _defineProperty2.default)(this, "diffuse", void 0);
  (0, _defineProperty2.default)(this, "specular", void 0);
  (0, _defineProperty2.default)(this, "shininess", void 0);
  (0, _defineProperty2.default)(this, "textures", void 0);
  Material.nextId++;
  this.id = Material.nextId;
  this.ambient = ambient || (0, _Vector_Matrix.vec3)(0.5, 0.5, 0.5);
  this.diffuse = diffuse || (0, _Vector_Matrix.vec3)(0.5, 0.5, 0.5);
  this.specular = specular || (0, _Vector_Matrix.vec3)(0.5, 0.5, 0.5);
  this.shininess = shininess || 64;
};

exports.Material = Material;
(0, _defineProperty2.default)(Material, "nextId", 1);
},{"@babel/runtime/helpers/classCallCheck":"node_modules/@babel/runtime/helpers/classCallCheck.js","@babel/runtime/helpers/defineProperty":"node_modules/@babel/runtime/helpers/defineProperty.js","./Utils/Vector_Matrix":"src/common/Utils/Vector_Matrix.js"}],"src/shaders/ShaderFactory.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ShaderFactory = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _Mesh = require("../common/Mesh");

var _constants = require("../common/Utils/constants");

var shaderDefault = _interopRequireWildcard(require("./shaderDefaults"));

var _Material = require("../common/Material");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @author Alberto Contorno
 * @class
 * Class used to create Default Shaders according to Mesh properties.
 */
var ShaderFactory = /*#__PURE__*/function () {
  function ShaderFactory() {
    (0, _classCallCheck2.default)(this, ShaderFactory);
  }

  (0, _createClass2.default)(ShaderFactory, null, [{
    key: "CreateVertexShaderFromProperties",
    // ==============================================================================================================================

    /**
     * 
     * @param {{
        *  material : { diffuse, specular, specular, shininess, vertexColoring(true, false),
        *      textures: { diffuseMap, specularMap, lightMap, bumpMap, shadowMap}
        *  },
        *  lights : {lights, lightsValues: []},
        * }} props 
    */
    value: function CreateVertexShaderFromProperties(props) {
      var vertexSource = shaderDefault.vertexCompleteShaderObj();

      if (props.material) {
        if (props.material.vertexColoring) {
          vertexSource.colorIn = shaderDefault.vColor_In;
          vertexSource.colorOut = shaderDefault.vColor_Out;
          vertexSource.colorAssign = shaderDefault.vColor_Assign;
        }

        var textures = props.material.textures;

        if (textures) {
          vertexSource.textureCoordsIn = shaderDefault.vTextureCoords_In;
          vertexSource.textureCoordsOut = shaderDefault.vTextureCoords_Out;
          vertexSource.textureCoordsAssign = shaderDefault.vTextureCoords_Assign;

          if (textures[_constants.TextureTypes.NormalMap]) {
            vertexSource.tangentIn = shaderDefault.vTangent_In;
            vertexSource.tangentOut = shaderDefault.vTangent_Out;
            vertexSource.tangentAssign = shaderDefault.vTangent_Assign;
            /* vertexSource.tbnOut = shaderDefault.vTbn_Out;
            vertexSource.tbnCalc = shaderDefault.vTangentCalc;
            vertexSource.tbnAssign = shaderDefault.vTbn_Assing; */

            vertexSource.mainBodyFPos = shaderDefault.vMainBody_fPos_Calc; //TODO CHANGE

            /* if(props.lights){
                const tangentVertexLightsVars = this.getLightsPosForTangentSpace(props.lights.lights); 
                vertexSource.lightsPosUniform = tangentVertexLightsVars.inUniforms;
                vertexSource.lightsPosOut = tangentVertexLightsVars.outPos;
                vertexSource.tangentCalc += tangentVertexLightsVars.tangentLightsCalc;
            } */
          } else {
            vertexSource.mainBodyFPos = shaderDefault.vMainBody_fPos_Calc;
          }
        }
      }

      vertexSource = Object.values(vertexSource).join('');
      return vertexSource;
    }
    /**
     * 
     * @param {{
        *  material : { diffuse, specular, specular, shininess, vertexColoring(true, false),
        *      textures: { diffuseMap, specularMap, lightMap, bumpMap, shadowMap}
        *  },
        *  lights : {lights, lightsValues: []},
        * }} props
     */

  }, {
    key: "CreateFragmentShaderFromProperties",
    value: function CreateFragmentShaderFromProperties(props, n) {
      var fragmentSource = shaderDefault.fragmentShaderCompleteObj();
      var hasLights = false;

      if (props.material) {
        if (props.material.vertexColoring) {
          fragmentSource.colorIn = shaderDefault.fColorIn;
        }

        fragmentSource.materialStruct = shaderDefault.materialStruct;
        fragmentSource.material = shaderDefault.materialVar;
        var textures = props.material.textures;

        if (textures) {
          fragmentSource.texturesCoords = shaderDefault.fTextureCoords;

          if (textures[_constants.TextureTypes.DiffuseMap]) {
            fragmentSource.samplers += shaderDefault.diffuseMapVar;
          }

          if (textures[_constants.TextureTypes.SpecularMap]) {
            fragmentSource.samplers += shaderDefault.specularMapVar;
          }

          if (textures[_constants.TextureTypes.LightMap]) {
            fragmentSource.samplers += shaderDefault.lightMapVar;
          }

          if (textures[_constants.TextureTypes.BumpMap]) {
            fragmentSource.samplers += shaderDefault.bumbMapVar;
          }

          if (textures[_constants.TextureTypes.NormalMap]) {
            fragmentSource.samplers += shaderDefault.normalMapVar; //fragmentSource.tbnIn = shaderDefault.fTBN_In;

            fragmentSource.tangentIn = shaderDefault.fTangent_In;
          }

          if (textures[_constants.TextureTypes.ShadowMap]) {
            fragmentSource.samplers += shaderDefault.shadowMapVar;
          }

          fragmentSource.textureCalc = this.getTexturesCalc(props.material.textures);
        }
      }

      if (props.lights) {
        hasLights = true;
        fragmentSource.lightsStructs = this.getLightsStructsFromLights(props.lights.lightsTypes);
        fragmentSource.lightsFuncDec = this.getLightsFuncDec(props.lights.lightsTypes);
        fragmentSource.lightsUniform = this.getLightsVarsFromLights(props.lights.lights);
        fragmentSource.lightsCalc = this.doLightCalcs(props.lights.lights, props.material.textures);
        fragmentSource.lightsFuncImpl = this.getLightsFuncImpl(props.lights.lightsTypes, props.material.textures);
        fragmentSource.fragOutput = shaderDefault.fOutput_Lights;

        if (props.material.vertexColoring) {
          fragmentSource.fragOutput = shaderDefault.fOutput_Lights_Color;
        }
      }

      fragmentSource = Object.values(fragmentSource).join('');
      return fragmentSource;
    } //===================UTILS===================

  }, {
    key: "getLights",
    value: function getLights(sources) {
      var lights = '';

      if (sources && sources.lights) {
        for (var i = 0; i < sources.lights.length; i++) {
          lights += 'uniform Light light' + i + ';\n';
        }
      }

      return lights;
    }
  }, {
    key: "doLightCalcs",
    value: function doLightCalcs(lights, textures) {
      var lightsCalc = '';

      if (textures[_constants.TextureTypes.NormalMap]) {
        lightsCalc = '\tvec3 viewDir = normalize(viewPos - fPos);\n'
        /* +
        shaderDefault.fNormalCalc_noTangents; */
        + shaderDefault.fTbn_Calc;
      } else {
        lightsCalc = '\tvec3 viewDir = normalize(viewPos - fPos);\n' + '\tvec3 norm = normalize(fNormal);\n';
      }

      for (var i = 0; i < lights.length; i++) {
        if (i == 0) {
          lightsCalc += '\tvec3 lightColor = ';
        } else {
          lightsCalc += '\tlightColor += ';
        }

        if (lights[i].type == _constants.LightTypes.DirectionalLight) {
          lightsCalc += 'CalcDirLight(light' + i + ', norm, viewDir);\n';
        }

        if (lights[i].type == _constants.LightTypes.PointLight) {
          lightsCalc += 'CalcPointLight(light' + i + ', norm, fPos, viewDir);\n';
        }

        if (lights[i].type == _constants.LightTypes.SpotLight) {
          lightsCalc += 'CalcSpotLight(light' + i + ', norm, fPos, viewDir);\n';
        }
      }

      return lightsCalc;
    }
  }, {
    key: "getLightsStructsFromLights",
    value: function getLightsStructsFromLights(lightsTypes) {
      var r = '';
      if (lightsTypes[_constants.LightTypes.DirectionalLight]) r += shaderDefault.DirectionalLightShader;
      if (lightsTypes[_constants.LightTypes.PointLight]) r += shaderDefault.PointLightShader;
      if (lightsTypes[_constants.LightTypes.SpotLight]) r += shaderDefault.SpotLightShader;
      return r;
    }
  }, {
    key: "getLightsFuncDec",
    value: function getLightsFuncDec(lightsTypes) {
      var r = '';
      if (lightsTypes[_constants.LightTypes.DirectionalLight]) r += shaderDefault.DirLightFuncDec;
      if (lightsTypes[_constants.LightTypes.PointLight]) r += shaderDefault.PointLightFuncDec;
      if (lightsTypes[_constants.LightTypes.SpotLight]) r += shaderDefault.SpotLightFuncDec;
      return r;
    }
  }, {
    key: "getLightsFuncImpl",
    value: function getLightsFuncImpl(lightsTypes, textures) {
      var r = '';

      if (lightsTypes[_constants.LightTypes.DirectionalLight]) {
        var lightSource = shaderDefault.DirLightFuncImplObj();

        if (textures) {
          this.setLightSourceTextures(lightSource, textures);
        }

        r += Object.values(lightSource).join('');
      }

      if (lightsTypes[_constants.LightTypes.PointLight]) {
        var _lightSource = shaderDefault.PointLightFuncImplObj();

        if (textures) {
          this.setLightSourceTextures(_lightSource, textures);
        }

        r += Object.values(_lightSource).join('');
      }

      if (lightsTypes[_constants.LightTypes.SpotLight]) {
        var _lightSource2 = shaderDefault.SpotLightFuncImplObj();

        if (textures) {
          this.setLightSourceTextures(_lightSource2, textures);
        }

        r += Object.values(_lightSource2).join('');
      }

      return r;
    }
  }, {
    key: "setLightSourceTextures",
    value: function setLightSourceTextures(lightSource, textures) {
      if (textures[_constants.TextureTypes.DiffuseMap] && textures[_constants.TextureTypes.SpecularMap]) {
        lightSource.bodyAmbient = shaderDefault.LightAmbientWithTexture_Diff_Spec;
        lightSource.bodyDiffuse = shaderDefault.LightDiffuseWithTexture_Diff_Spec;
        lightSource.bodySpecular = shaderDefault.LightSpecularWithTexture_Diff_Spec;
      } else if (textures[_constants.TextureTypes.DiffuseMap] && !textures[_constants.TextureTypes.SpecularMap]) {
        lightSource.bodyAmbient = shaderDefault.LightAmbientWithTexture_Diff;
        lightSource.bodyDiffuse = shaderDefault.LightDiffuseWithTexture_Diff;
        lightSource.bodySpecular = shaderDefault.LightSpecularWithTexture_Diff;
      } else if (!textures[_constants.TextureTypes.DiffuseMap] && textures[_constants.TextureTypes.SpecularMap]) {
        lightSource.bodyAmbient = shaderDefault.LightAmbientWithTexture_Spec;
        lightSource.bodyDiffuse = shaderDefault.LightDiffuseWithTexture_Spec;
        lightSource.bodySpecular = shaderDefault.LightSpecularWithTexture_Spec;
      }
    }
  }, {
    key: "getLightsVarsFromLights",
    value: function getLightsVarsFromLights(lights) {
      var r = '';

      for (var i = 0; i < lights.length; i++) {
        if (lights[i].type === _constants.LightTypes.DirectionalLight) r += 'uniform DirectionalLight light' + i + ';\n';
        if (lights[i].type === _constants.LightTypes.PointLight) r += 'uniform PointLight light' + i + ';\n';
        if (lights[i].type === _constants.LightTypes.SpotLight) r += 'uniform SpotLight light' + i + ';\n';
      }

      return r;
    }
  }, {
    key: "getLightsPosForTangentSpace",
    value: function getLightsPosForTangentSpace(lights) {
      var inUniforms = '';
      var outPos = '';

      for (var i = 0; i < lights.length; i++) {
        var lightType = lights[i].type;

        if (lightType === _constants.LightTypes.PointLight || lightType === _constants.LightTypes.SpotLight) {
          inUniforms += 'uniform vec3 vLightPos' + i + ';\n';
          outPos += 'out vec3 fLightPos' + i + ';\n';
        }

        ;
      }

      return {
        inUniforms: inUniforms,
        outPos: outPos,
        tangentLightsCalc: tangentLightsCalc
      };
    } //FOR FUTURE

  }, {
    key: "getTexturesCalc",
    value: function getTexturesCalc(textures) {
      var r = '';
      return r;
    }
  }]);
  return ShaderFactory;
}();

exports.ShaderFactory = ShaderFactory;
},{"@babel/runtime/helpers/classCallCheck":"node_modules/@babel/runtime/helpers/classCallCheck.js","@babel/runtime/helpers/createClass":"node_modules/@babel/runtime/helpers/createClass.js","../common/Mesh":"src/common/Mesh.js","../common/Utils/constants":"src/common/Utils/constants.js","./shaderDefaults":"src/shaders/shaderDefaults.js","../common/Material":"src/common/Material.js"}],"src/common/Mesh.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Mesh = void 0;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _Shader = require("./Shader");

var _ShaderProgram = require("./ShaderProgram");

var _ShaderFactory = require("../shaders/ShaderFactory");

var _Vector_Matrix = require("./Utils/Vector_Matrix");

var _Material = require("./Material");

var _constants = require("./Utils/constants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

/**
 * @author Alberto Contorno
 * @class
 */
var Mesh = /*#__PURE__*/function () {
  // {diffuseMap, specularMap, normalMap, BumbpMap, shadowMap}

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
  function Mesh(gl, vertices, indices, shaders, opt, textures, textCoords, normals, tangents, colors) {
    (0, _classCallCheck2.default)(this, Mesh);
    (0, _defineProperty2.default)(this, "vertices", void 0);
    (0, _defineProperty2.default)(this, "indices", void 0);
    (0, _defineProperty2.default)(this, "shaders", {
      vertex: null,
      fragment: null,
      program: null,
      set: false
    });
    (0, _defineProperty2.default)(this, "id", void 0);
    (0, _defineProperty2.default)(this, "VAO", void 0);
    (0, _defineProperty2.default)(this, "VBO", void 0);
    (0, _defineProperty2.default)(this, "EBO", void 0);
    (0, _defineProperty2.default)(this, "NBO", void 0);
    (0, _defineProperty2.default)(this, "TBO", void 0);
    (0, _defineProperty2.default)(this, "type", void 0);
    (0, _defineProperty2.default)(this, "locations", {});
    (0, _defineProperty2.default)(this, "textures", {});
    (0, _defineProperty2.default)(this, "normals", void 0);
    (0, _defineProperty2.default)(this, "material", void 0);
    (0, _defineProperty2.default)(this, "textCoords", void 0);
    (0, _defineProperty2.default)(this, "shaderUpdated", false);
    Mesh.nextId++;
    this.gl = gl;
    this.id = Mesh.nextId;
    this.vertices = vertices;
    this.colors = colors;
    this.indices = indices;
    this.opt = opt || {
      keepData: true
    };
    this.type = this.opt.type || gl.TRIANGLES;
    this.textures = Object.assign({
      DIFFUSE_MAP: null,
      SPECULAR_MAP: null,
      NORMAL_MAP: null,
      LIGHT_MAP: null,
      BUMP_MAP: null,
      SHADOW_MAP: null
    }, textures);
    ;
    this.textCoords = textCoords;
    this.normals = normals;
    this.tangents = tangents;
    this.shaders = {}; //Create shader if passed else do it automatically from info
    // TODO create shader from object properties, update when properties change (eg. a component in the object is removed)

    console.log('MESH CREATED_' + this.id, this);
  }

  (0, _createClass2.default)(Mesh, [{
    key: "createAndLoadBuffers",
    value: function createAndLoadBuffers(gl) {
      this.VAO = gl.createVertexArray();
      gl.bindVertexArray(this.VAO);
      this.VBO = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, this.VBO);
      gl.bufferData(gl.ARRAY_BUFFER, (0, _Vector_Matrix.flatten)(this.vertices), gl.STATIC_DRAW);
      var positionLoc = gl.getAttribLocation(this.shaders.program.program, 'vPosition');
      gl.vertexAttribPointer(positionLoc, 4, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(positionLoc);

      if (this.normals) {
        this.NBO = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.NBO);
        gl.bufferData(gl.ARRAY_BUFFER, (0, _Vector_Matrix.flatten)(this.normals), gl.STATIC_DRAW);
        var normalLoc = gl.getAttribLocation(this.shaders.program.program, 'vNormal');
        gl.vertexAttribPointer(normalLoc, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(normalLoc);
      }

      if (this.tangents) {
        this.TBO = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.TBO);
        gl.bufferData(gl.ARRAY_BUFFER, (0, _Vector_Matrix.flatten)(this.tangents), gl.STATIC_DRAW);
        var tangentLoc = gl.getAttribLocation(this.shaders.program.program, 'vTangent');
        console.log('tangentLoc', tangentLoc, this.shaders.fragment.source);
        gl.vertexAttribPointer(tangentLoc, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(tangentLoc);
      }

      this.locations.textures = {};

      if (this.textures.DIFFUSE_MAP) {
        if (this.textCoords) {
          this.textCoordBuffer = gl.createBuffer();
          gl.bindBuffer(gl.ARRAY_BUFFER, this.textCoordBuffer);
          gl.bufferData(gl.ARRAY_BUFFER, (0, _Vector_Matrix.flatten)(this.textCoords), gl.STATIC_DRAW);
          var textCoordLoc = gl.getAttribLocation(this.shaders.program.program, 'vTextureCoords');
          gl.vertexAttribPointer(textCoordLoc, 2, gl.FLOAT, false, 0, 0);
          gl.enableVertexAttribArray(textCoordLoc);
        }
      }

      if (this.indices) {
        this.EBO = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.EBO);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), gl.STATIC_DRAW);
      }

      if (this.colors) {
        this.CBO = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.CBO);
        gl.bufferData(gl.ARRAY_BUFFER, (0, _Vector_Matrix.flatten)(this.colors), gl.STATIC_DRAW);
        var colorsLoc = gl.getAttribLocation(this.shaders.program.program, 'vColor');
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
      this.unbindVAO(gl); //TODO
      //in teoria this.vertices, e this.indices non serve più e possiamo tenerci solo la this.indices.lenght
      //se servono usiamo un flag per decidere di tenerli

      if (this.opt && !this.opt.keepData) {
        this.vertices = null;
        this.indices = null;
        this.textCoords = null;
      }
    }
  }, {
    key: "unbindVAO",
    value: function unbindVAO(gl) {
      gl.bindVertexArray(null);
    }
  }, {
    key: "getModelMatrix",
    value: function getModelMatrix(object) {
      var transform = object.transform;
      var position = transform.position || [0, 0, 0];
      var rotation = transform.rotation || [0, 0, 0];
      var scale = transform.scale || [1, 1, 1];
      var modelMatrix = (0, _Vector_Matrix.mat4)(); // da costruire a partire dalla posizione dell'oggetto

      var traslationMatrix = (0, _Vector_Matrix.translate)(position[0], position[1], position[2]); //da costruire a partire dalla rotazione dell'oggetto

      var rotationMatrixX = (0, _Vector_Matrix.rotateX)(rotation[0]);
      var rotationMatrixY = (0, _Vector_Matrix.rotateY)(rotation[1]);
      var rotationMatrixZ = (0, _Vector_Matrix.rotateZ)(rotation[2]);
      var scaleMatrix = (0, _Vector_Matrix.scalem)(scale[0], scale[1], scale[2]); //translate * rotate * scale

      modelMatrix = (0, _Vector_Matrix.mult)(traslationMatrix, rotationMatrixX);
      modelMatrix = (0, _Vector_Matrix.mult)(modelMatrix, rotationMatrixY);
      modelMatrix = (0, _Vector_Matrix.mult)(modelMatrix, rotationMatrixZ);
      modelMatrix = (0, _Vector_Matrix.mult)(modelMatrix, scaleMatrix);

      if (object.parent) {
        modelMatrix = (0, _Vector_Matrix.mult)(this.getModelMatrix(object.parent), modelMatrix);
      }

      return modelMatrix;
    }
  }, {
    key: "getDirectionalLightLocations",
    value: function getDirectionalLightLocations(gl, lightName) {
      var lightLocs = {
        type: _constants.LightTypes.DirectionalLight
      };
      lightLocs.ambient = gl.getUniformLocation(this.shaders.program.program, lightName + '.ambient');
      lightLocs.diffuse = gl.getUniformLocation(this.shaders.program.program, lightName + '.diffuse');
      lightLocs.specular = gl.getUniformLocation(this.shaders.program.program, lightName + '.specular');
      lightLocs.direction = gl.getUniformLocation(this.shaders.program.program, lightName + '.direction');
      return lightLocs;
    }
  }, {
    key: "getPointLightLocations",
    value: function getPointLightLocations(gl, lightName) {
      var lightLocs = {
        type: _constants.LightTypes.PointLight
      };
      lightLocs.position = gl.getUniformLocation(this.shaders.program.program, lightName + '.position');
      lightLocs.ambient = gl.getUniformLocation(this.shaders.program.program, lightName + '.ambient');
      lightLocs.diffuse = gl.getUniformLocation(this.shaders.program.program, lightName + '.diffuse');
      lightLocs.specular = gl.getUniformLocation(this.shaders.program.program, lightName + '.specular');
      lightLocs.constant = gl.getUniformLocation(this.shaders.program.program, lightName + '.constant');
      lightLocs.linear = gl.getUniformLocation(this.shaders.program.program, lightName + '.linear');
      lightLocs.quadratic = gl.getUniformLocation(this.shaders.program.program, lightName + '.quadratic');
      return lightLocs;
    }
  }, {
    key: "getSpotLightLocations",
    value: function getSpotLightLocations(lightName) {
      var gl = this.gl;
      var lightLocs = {
        type: _constants.LightTypes.SpotLight
      };
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
  }, {
    key: "getLocations",
    value: function getLocations(lights) {
      var _this = this;

      var gl = this.gl; //vertex

      this.locations.modelLoc = gl.getUniformLocation(this.shaders.program.program, 'model');
      this.locations.viewLoc = gl.getUniformLocation(this.shaders.program.program, 'view');
      this.locations.projLoc = gl.getUniformLocation(this.shaders.program.program, 'projection'); //fragment

      this.locations.viewPosLoc = gl.getUniformLocation(this.shaders.program.program, 'viewPos');
      this.locations.materialLocs = {};
      this.locations.materialLocs.ambient = gl.getUniformLocation(this.shaders.program.program, 'material.ambient');
      this.locations.materialLocs.diffuse = gl.getUniformLocation(this.shaders.program.program, 'material.diffuse');
      this.locations.materialLocs.specular = gl.getUniformLocation(this.shaders.program.program, 'material.specular');
      this.locations.materialLocs.shininess = gl.getUniformLocation(this.shaders.program.program, 'material.shininess');

      if (lights && lights.length > 0) {
        this.locations.lights = [];

        for (var i = 0; i < lights.length; i++) {
          if (lights[i].type == _constants.LightTypes.DirectionalLight) {
            this.locations.lights.push(this.getDirectionalLightLocations(gl, 'light' + i));
          } else if (lights[i].type == _constants.LightTypes.PointLight) {
            this.locations.lights.push(this.getPointLightLocations(gl, 'light' + i));
          } else if (lights[i].type == _constants.LightTypes.SpotLight) {
            this.locations.lights.push(this.getSpotLightLocations(gl, 'light' + i));
          }
        }
      }

      this.locations.texturesLocs = {};
      Object.entries(this.textures).forEach(function (_ref) {
        var _ref2 = (0, _slicedToArray2.default)(_ref, 2),
            k = _ref2[0],
            texture = _ref2[1];

        if (texture) {
          if (k === _constants.TextureTypes.DiffuseMap) {
            _this.locations.texturesLocs[_constants.TextureTypes.DiffuseMap] = gl.getUniformLocation(_this.shaders.program.program, 'diffuseTexture');
          } else if (k === _constants.TextureTypes.SpecularMap) {
            _this.locations.texturesLocs[_constants.TextureTypes.SpecularMap] = gl.getUniformLocation(_this.shaders.program.program, 'specularTexture');
          } else if (k === _constants.TextureTypes.NormalMap) {
            _this.locations.texturesLocs[_constants.TextureTypes.NormalMap] = gl.getUniformLocation(_this.shaders.program.program, 'normalTexture');
          } else if (k === _constants.TextureTypes.ShadowMap) {
            _this.locations.texturesLocs[_constants.TextureTypes.ShadowMap] = gl.getUniformLocation(_this.shaders.program.program, 'shadowTexture');
          }
        }
      });
    }
  }, {
    key: "updateShadersAndProgram",
    value: function updateShadersAndProgram(material, lights, lightsTypes, name) {
      this.shaderUpdated = true;
      var props = {
        id: name,
        material: _objectSpread(_objectSpread({}, material), {}, {
          textures: this.textures,
          vertexColoring: !!this.colors
        }),
        lights: {
          lights: lights,
          lightsTypes: lightsTypes
        }
      };

      var v = _ShaderFactory.ShaderFactory.CreateVertexShaderFromProperties(props);

      var f = _ShaderFactory.ShaderFactory.CreateFragmentShaderFromProperties(props, name);

      this.shaders.vertex = new _Shader.Shader(this.gl, 'vertex', v);
      ;
      this.shaders.fragment = new _Shader.Shader(this.gl, 'fragment', f);
      var shaders = [];

      for (var key in this.shaders) {
        if (key != 'program' && key != 'set') {
          shaders.push(this.shaders[key].shader);
        }
      }

      this.shaders.program = new _ShaderProgram.ShaderProgram(this.gl, shaders);

      if (this.opt && !this.opt.keepData) {
        this.shaders.vertex = null;
        this.shaders.fragment = null;
      }

      this.getLocations(lights);
      this.createAndLoadBuffers(this.gl);
    }
  }, {
    key: "render",
    value: function render(gl, camera) {
      var _this2 = this;

      var transform = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var type = arguments.length > 3 ? arguments[3] : undefined;
      var material = arguments.length > 4 ? arguments[4] : undefined;
      var lights = arguments.length > 5 ? arguments[5] : undefined;
      var lightsTypes = arguments.length > 6 ? arguments[6] : undefined;
      var n = arguments.length > 7 ? arguments[7] : undefined;
      //Update shader
      if (!this.shaderUpdated) this.updateShadersAndProgram(material, lights, lightsTypes, n);
      gl.useProgram(this.shaders.program.program);
      gl.bindVertexArray(this.VAO);
      var modelMatrix = this.getModelMatrix(transform);
      var projMatrix = camera.getProjectionMatrix();
      var viewMatrix = camera.getViewMatrix();

      if (this.locations.modelLoc) {
        gl.uniformMatrix4fv(this.locations.modelLoc, false, (0, _Vector_Matrix.flatten)(modelMatrix));
      }

      if (this.locations.viewLoc) {
        gl.uniformMatrix4fv(this.locations.viewLoc, false, (0, _Vector_Matrix.flatten)(viewMatrix));
      }

      if (this.locations.projLoc) {
        gl.uniformMatrix4fv(this.locations.projLoc, false, (0, _Vector_Matrix.flatten)(projMatrix));
      }

      if (this.locations.viewPosLoc) {
        gl.uniform3fv(this.locations.viewPosLoc, camera.getFrontVector());
      }

      if (this.locations.materialLocs) {
        if (!material) {
          material = new _Material.Material();
        }

        gl.uniform3fv(this.locations.materialLocs.ambient, (0, _Vector_Matrix.flatten)(material.ambient));
        gl.uniform3fv(this.locations.materialLocs.diffuse, material.diffuse);
        gl.uniform3fv(this.locations.materialLocs.specular, material.specular);
        gl.uniform1f(this.locations.materialLocs.shininess, material.shininess);
      }

      if (this.locations.lights) {
        for (var i = 0; i < this.locations.lights.length; i++) {
          if (this.locations.lights[i].type === _constants.LightTypes.DirectionalLight) {
            this.setupDirectionalLight(gl, this.locations.lights[i], lights[i]);
          } else if (this.locations.lights[i].type === _constants.LightTypes.PointLight) {
            this.setupPointLight(gl, this.locations.lights[i], lights[i]);
          } else if (this.locations.lights[i].type === _constants.LightTypes.SpotLight) {
            this.setupSpotLight(gl, this.locations.lights[i], lights[i]);
          }
        }
      }

      Object.entries(this.locations.texturesLocs).forEach(function (_ref3) {
        var _ref4 = (0, _slicedToArray2.default)(_ref3, 2),
            k = _ref4[0],
            loc = _ref4[1];

        gl.uniform1i(loc, _this2.textures[k].textureUnit);
      });
      Object.values(this.textures).forEach(function (texture) {
        if (texture) texture.ActiveTexture(gl);
      });

      if (this.indices) {
        //draw elements
        gl.drawElements(type || gl.TRIANGLES, this.indices.length, gl.UNSIGNED_SHORT, 0);
      } else {
        //draw arrays
        gl.drawArrays(type || gl.TRIANGLES, 0, this.vertices.length);
      }

      Object.values(this.textures).forEach(function (texture) {
        if (texture) texture.DisactiveTexture(gl);
      });
      gl.bindVertexArray(null);
      gl.useProgram(null);
    }
  }, {
    key: "destroyShader",
    value: function destroyShader(shader, gl) {
      gl.deleteShader(shader);
    }
  }, {
    key: "destroyShaders",
    value: function destroyShaders(gl) {}
  }, {
    key: "destroyProgram",
    value: function destroyProgram(program, gl) {}
  }, {
    key: "destroy",
    value: function destroy(gl) {
      this.destroyProgram(gl);
      this.destroyShaders(gl);
    }
  }, {
    key: "setupDirectionalLight",
    value: function setupDirectionalLight(gl, lightLocs, light) {
      gl.uniform3fv(lightLocs.ambient, light.light.ambient);
      gl.uniform3fv(lightLocs.diffuse, light.light.diffuse);
      gl.uniform3fv(lightLocs.specular, light.light.specular);
      gl.uniform3fv(lightLocs.direction, light.light.direction);
    }
  }, {
    key: "setupPointLight",
    value: function setupPointLight(gl, lightLocs, light) {
      /* gl.uniform3fv(lightLocs.position, light.light.position);
      gl.uniform3fv(lightLocs.ambient, light.light.ambient);
      gl.uniform3fv(lightLocs.diffuse, light.light.diffuse);
      gl.uniform3fv(lightLocs.specular, light.light.specular);
      gl.uniform1f(lightLocs.constant, light.light.constant);
      gl.uniform1f(lightLocs.linear, light.light.linear);
      gl.uniform1f(lightLocs.quadratic, light.light.quadratic); */
      Object.keys(lightLocs).forEach(function (k) {
        switch (k) {
          case 'position':
            gl.uniform3fv(lightLocs.position, light.light.position);
            break;

          case 'ambient':
            gl.uniform3fv(lightLocs.ambient, light.light.ambient);
            break;

          case 'diffuse':
            gl.uniform3fv(lightLocs.diffuse, light.light.diffuse);
            break;

          case 'specular':
            gl.uniform3fv(lightLocs.specular, light.light.specular);
            break;

          case 'constant':
            gl.uniform1f(lightLocs.constant, light.light.constant);
            break;

          case 'linear':
            gl.uniform1f(lightLocs.linear, light.light.linear);
            break;

          case 'quadratic':
            gl.uniform1f(lightLocs.quadratic, light.light.quadratic);
            break;

          default:
            break;
        }
      });
    }
  }, {
    key: "setupSpotLight",
    value: function setupSpotLight(gl, lightLocs, light) {
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
  }]);
  return Mesh;
}();

exports.Mesh = Mesh;
(0, _defineProperty2.default)(Mesh, "nextId", 1);
},{"@babel/runtime/helpers/slicedToArray":"node_modules/@babel/runtime/helpers/slicedToArray.js","@babel/runtime/helpers/classCallCheck":"node_modules/@babel/runtime/helpers/classCallCheck.js","@babel/runtime/helpers/createClass":"node_modules/@babel/runtime/helpers/createClass.js","@babel/runtime/helpers/defineProperty":"node_modules/@babel/runtime/helpers/defineProperty.js","./Shader":"src/common/Shader.js","./ShaderProgram":"src/common/ShaderProgram.js","../shaders/ShaderFactory":"src/shaders/ShaderFactory.js","./Utils/Vector_Matrix":"src/common/Utils/Vector_Matrix.js","./Material":"src/common/Material.js","./Utils/constants":"src/common/Utils/constants.js"}],"src/common/Texture.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Texture = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _constants = require("./Utils/constants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @author Alberto Contorno
 * @class
 * Class that represents a single Texture of a Mesh.
 */
var Texture = /*#__PURE__*/function () {
  /**
  *
  * @param {number} textureUnit The texture unit associated to the Texture
  * @param {GL_ENUM} gl_type The texture type (e.g. TEXTURE_2D)
  * @param {vec3} up The up vector of the camera
  * @param {GL_ENUM} s_texelType The texel's type of the source data of the texture.
  * @param {GL_ENUM} texelType The texel's type of the data of the texture stored into the GPU.
  * @param {Array} params Array of params objects {key[GL_ENUM]:value} where the key is a GL_ENUM that specifies the texture parameter and the value is the value to apply.
  * @param {TextureTypes} type The type of the texture: one of the values of the constant TextureTypes (eg. NormalMap).
  */
  function Texture(textureUnit, gl_type, imagePath, s_texelType, texelType, params, type) {
    (0, _classCallCheck2.default)(this, Texture);
    (0, _defineProperty2.default)(this, "id", void 0);
    (0, _defineProperty2.default)(this, "textureUnit", 0);
    (0, _defineProperty2.default)(this, "imagePath", void 0);
    (0, _defineProperty2.default)(this, "textureSource", void 0);
    (0, _defineProperty2.default)(this, "texture", void 0);
    (0, _defineProperty2.default)(this, "s_texelType", void 0);
    (0, _defineProperty2.default)(this, "texelType", void 0);
    (0, _defineProperty2.default)(this, "params", void 0);
    Texture.nextId++;
    this.id = Texture.nextId;
    this.textureUnit = textureUnit || 0;
    this.gl_type = type;
    this.imagePath = imagePath;
    this.s_texelType = s_texelType;
    this.texelType = texelType;
    this.params = params;
    this.type = type;
  }

  (0, _createClass2.default)(Texture, [{
    key: "CreateTextureFromArray",
    value: function CreateTextureFromArray(gl) {
      this.texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, this.texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, this.texelType, 1, 1, 0, this.s_texelType, gl.UNSIGNED_BYTE, new Uint8Array([255, 255, 255, 255]));
      gl.bindTexture(gl.TEXTURE_2D, null);
    }
  }, {
    key: "LoadTexture",
    value: function LoadTexture(gl) {
      var _this = this;

      this.textureSource = new Image();
      this.textureSource.crossOrigin = "";
      this.textureSource.src = this.imagePath;
      this.texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, this.texture); //set texture params

      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texImage2D(gl.TEXTURE_2D, 0, this.texelType, 1, 1, 0, this.s_texelType, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 255, 255]));
      gl.bindTexture(gl.TEXTURE_2D, null);

      var _loaded = function _loaded() {
        gl.bindTexture(gl.TEXTURE_2D, _this.texture);
        console.log("TEXTURE LOADED", _this.id);
        gl.texImage2D(gl.TEXTURE_2D, 0, _this.texelType, _this.textureSource.width, _this.textureSource.height, 0, _this.s_texelType, gl.UNSIGNED_BYTE, _this.textureSource);
        gl.generateMipmap(gl.TEXTURE_2D);

        _this.textureSource.removeEventListener('load', _loaded);

        _this.textureSource = null;
        gl.bindTexture(gl.TEXTURE_2D, null);
      };

      this.textureSource.addEventListener('load', _loaded);
    }
  }, {
    key: "UseTexture",
    value: function UseTexture(gl, textureUnit) {
      gl.activeTexture(gl.TEXTURE0 + textureUnit);
      gl.bindTexture(gl.TEXTURE_2D, this.texture);
    }
  }, {
    key: "ActiveTexture",
    value: function ActiveTexture(gl) {
      if (this.params) {
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, this.params.flipY);
      }

      gl.activeTexture(gl.TEXTURE0 + this.textureUnit);
      gl.bindTexture(gl.TEXTURE_2D, this.texture);
    }
  }, {
    key: "DisactiveTexture",
    value: function DisactiveTexture(gl) {
      gl.bindTexture(gl.TEXTURE_2D, null);
    }
  }, {
    key: "deleteTextyre",
    value: function deleteTextyre(gl) {
      gl.deleteTexture(this.texture);
    }
  }]);
  return Texture;
}();

exports.Texture = Texture;
(0, _defineProperty2.default)(Texture, "nextId", 1);
},{"@babel/runtime/helpers/classCallCheck":"node_modules/@babel/runtime/helpers/classCallCheck.js","@babel/runtime/helpers/createClass":"node_modules/@babel/runtime/helpers/createClass.js","@babel/runtime/helpers/defineProperty":"node_modules/@babel/runtime/helpers/defineProperty.js","./Utils/constants":"src/common/Utils/constants.js"}],"src/common/Components/Light.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Light = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _Component2 = require("../Component");

var _Object = require("../Object");

var _Scene = require("../Scene");

var _constants = require("../Utils/constants");

var _Vector_Matrix = require("../Utils/Vector_Matrix");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

var lightTypes = _constants.LightTypes;
/**
 * @author Alberto Contorno
 * @class
 * Components that makes the object to which it is attached a source light.
 */

var Light = /*#__PURE__*/function (_Component) {
  (0, _inherits2.default)(Light, _Component);

  var _super = _createSuper(Light);

  function Light() {
    var _this;

    (0, _classCallCheck2.default)(this, Light);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "id", void 0);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "diffuse", (0, _Vector_Matrix.vec3)(1.0, 1.0, 1.0));
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "ambient", (0, _Vector_Matrix.vec3)(0.1, 0.1, 0.1));
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "specular", (0, _Vector_Matrix.vec3)(1.0, 1.0, 1.0));
    return _this;
  }

  (0, _createClass2.default)(Light, [{
    key: "constructon",

    /**
     * 
     * @param {vec3} diffuse Diffuse component of the light
     * @param {vec3} ambient Ambient component of the light
     * @param {vec3} specular Specular component of the light
     */
    value: function constructon(diffuse, ambient, specular) {
      this.id = Light.nextId;
      Light.nextId++;
      this.name = 'Light';
      this.diffuse = diffuse;
      this.ambient = ambient;
      this.specular = specular;
    }
    /**
     * 
     * @param {SceneObject} parent 
     * @param {Scene} scene 
     */

  }, {
    key: "onAfterAdded",
    value: function onAfterAdded(parent, scene) {
      scene.registerLight(lightTypes[this.constructor.name], this);
    }
  }, {
    key: "onAfterRemoved",
    value: function onAfterRemoved(parent, scene) {
      scene.unregisterLight(lightTypes[this.constructor.name], this);
    }
  }]);
  return Light;
}(_Component2.Component);

exports.Light = Light;
(0, _defineProperty2.default)(Light, "nextId", 1);
},{"@babel/runtime/helpers/classCallCheck":"node_modules/@babel/runtime/helpers/classCallCheck.js","@babel/runtime/helpers/createClass":"node_modules/@babel/runtime/helpers/createClass.js","@babel/runtime/helpers/assertThisInitialized":"node_modules/@babel/runtime/helpers/assertThisInitialized.js","@babel/runtime/helpers/inherits":"node_modules/@babel/runtime/helpers/inherits.js","@babel/runtime/helpers/possibleConstructorReturn":"node_modules/@babel/runtime/helpers/possibleConstructorReturn.js","@babel/runtime/helpers/getPrototypeOf":"node_modules/@babel/runtime/helpers/getPrototypeOf.js","@babel/runtime/helpers/defineProperty":"node_modules/@babel/runtime/helpers/defineProperty.js","../Component":"src/common/Component.js","../Object":"src/common/Object.js","../Scene":"src/common/Scene.js","../Utils/constants":"src/common/Utils/constants.js","../Utils/Vector_Matrix":"src/common/Utils/Vector_Matrix.js"}],"src/common/Components/DirectionalLight.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DirectionalLight = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _Light2 = require("./Light");

var _Vector_Matrix = require("../Utils/Vector_Matrix");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

/**
 * @author Alberto Contorno
 * @class
 * Components that represents a directional global light.
 */
var DirectionalLight = /*#__PURE__*/function (_Light) {
  (0, _inherits2.default)(DirectionalLight, _Light);

  var _super = _createSuper(DirectionalLight);

  function DirectionalLight(diffuse, ambient, specular, direction) {
    var _this;

    (0, _classCallCheck2.default)(this, DirectionalLight);
    _this = _super.call(this, diffuse, ambient, specular);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "direction", void 0);
    _this.name = 'DirectionalLight';
    _this.direction = direction || (0, _Vector_Matrix.vec3)(0, -1, 0);
    return _this;
  }

  (0, _createClass2.default)(DirectionalLight, null, [{
    key: "getDirectionForShader",
    value: function getDirectionForShader() {
      return 'vec3 lightDir = normalize(-light.direction);';
    }
  }]);
  return DirectionalLight;
}(_Light2.Light);

exports.DirectionalLight = DirectionalLight;
},{"@babel/runtime/helpers/classCallCheck":"node_modules/@babel/runtime/helpers/classCallCheck.js","@babel/runtime/helpers/createClass":"node_modules/@babel/runtime/helpers/createClass.js","@babel/runtime/helpers/assertThisInitialized":"node_modules/@babel/runtime/helpers/assertThisInitialized.js","@babel/runtime/helpers/inherits":"node_modules/@babel/runtime/helpers/inherits.js","@babel/runtime/helpers/possibleConstructorReturn":"node_modules/@babel/runtime/helpers/possibleConstructorReturn.js","@babel/runtime/helpers/getPrototypeOf":"node_modules/@babel/runtime/helpers/getPrototypeOf.js","@babel/runtime/helpers/defineProperty":"node_modules/@babel/runtime/helpers/defineProperty.js","./Light":"src/common/Components/Light.js","../Utils/Vector_Matrix":"src/common/Utils/Vector_Matrix.js"}],"src/common/Components/PointLight.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PointLight = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _Light2 = require("./Light");

var _Vector_Matrix = require("../Utils/Vector_Matrix");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

/**
 * @author Alberto Contorno
 * @class
 * Components that represents a point light.
 */
var PointLight = /*#__PURE__*/function (_Light) {
  (0, _inherits2.default)(PointLight, _Light);

  var _super = _createSuper(PointLight);

  function PointLight(diffuse, ambient, specular, position, constant, linear, quadratic) {
    var _this;

    (0, _classCallCheck2.default)(this, PointLight);
    _this = _super.call(this);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "position", void 0);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "constant", void 0);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "linear", void 0);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "quadratic", void 0);
    _this.name = 'PointLight';
    _this.constant = constant || 1.0;
    _this.linear = linear || 0.09;
    _this.quadratic = quadratic || 0.032;
    _this.position = position || (0, _Vector_Matrix.vec3)(0, 5, 0);
    return _this;
  }

  return PointLight;
}(_Light2.Light);

exports.PointLight = PointLight;
},{"@babel/runtime/helpers/classCallCheck":"node_modules/@babel/runtime/helpers/classCallCheck.js","@babel/runtime/helpers/assertThisInitialized":"node_modules/@babel/runtime/helpers/assertThisInitialized.js","@babel/runtime/helpers/inherits":"node_modules/@babel/runtime/helpers/inherits.js","@babel/runtime/helpers/possibleConstructorReturn":"node_modules/@babel/runtime/helpers/possibleConstructorReturn.js","@babel/runtime/helpers/getPrototypeOf":"node_modules/@babel/runtime/helpers/getPrototypeOf.js","@babel/runtime/helpers/defineProperty":"node_modules/@babel/runtime/helpers/defineProperty.js","./Light":"src/common/Components/Light.js","../Utils/Vector_Matrix":"src/common/Utils/Vector_Matrix.js"}],"src/common/Components/SpotLight.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SpotLight = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _Light2 = require("./Light");

var _Vector_Matrix = require("../Utils/Vector_Matrix");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

/**
 * @author Alberto Contorno
 * @class
 * Components that represents a spot light.
 */
var SpotLight = /*#__PURE__*/function (_Light) {
  (0, _inherits2.default)(SpotLight, _Light);

  var _super = _createSuper(SpotLight);

  function SpotLight(diffuse, ambient, specular, position, constant, linear, quadratic, cutOff, outerCutOff, direction) {
    var _this;

    (0, _classCallCheck2.default)(this, SpotLight);
    _this = _super.call(this, diffuse, ambient, specular);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "position", void 0);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "cutOff", void 0);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "outerCutOff", void 0);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "constant", void 0);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "linear", void 0);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "quadratic", void 0);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "direction", void 0);
    _this.name = 'SpotLight';
    _this.constant = constant || 1.0;
    _this.linear = linear || 0.09;
    _this.quadratic = quadratic || 0.032;
    _this.cutOff = cutOff || 0.4;
    _this.outerCutOff = outerCutOff || 0.5;
    _this.direction = direction || (0, _Vector_Matrix.vec3)(1, -1, 0);
    _this.position = position || (0, _Vector_Matrix.vec3)(0, 0, 0);
    return _this;
  }

  return SpotLight;
}(_Light2.Light);

exports.SpotLight = SpotLight;
},{"@babel/runtime/helpers/classCallCheck":"node_modules/@babel/runtime/helpers/classCallCheck.js","@babel/runtime/helpers/assertThisInitialized":"node_modules/@babel/runtime/helpers/assertThisInitialized.js","@babel/runtime/helpers/inherits":"node_modules/@babel/runtime/helpers/inherits.js","@babel/runtime/helpers/possibleConstructorReturn":"node_modules/@babel/runtime/helpers/possibleConstructorReturn.js","@babel/runtime/helpers/getPrototypeOf":"node_modules/@babel/runtime/helpers/getPrototypeOf.js","@babel/runtime/helpers/defineProperty":"node_modules/@babel/runtime/helpers/defineProperty.js","./Light":"src/common/Components/Light.js","../Utils/Vector_Matrix":"src/common/Utils/Vector_Matrix.js"}],"node_modules/regenerator-runtime/runtime.js":[function(require,module,exports) {
/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var runtime = (function (exports) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  exports.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunctionPrototype[toStringTagSymbol] =
    GeneratorFunction.displayName = "GeneratorFunction";

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      prototype[method] = function(arg) {
        return this._invoke(method, arg);
      };
    });
  }

  exports.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  exports.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      if (!(toStringTagSymbol in genFun)) {
        genFun[toStringTagSymbol] = "GeneratorFunction";
      }
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  exports.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator, PromiseImpl) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return PromiseImpl.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return PromiseImpl.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration.
          result.value = unwrapped;
          resolve(result);
        }, function(error) {
          // If a rejected Promise was yielded, throw the rejection back
          // into the async generator function so it can be handled there.
          return invoke("throw", error, resolve, reject);
        });
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new PromiseImpl(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  exports.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  exports.async = function(innerFn, outerFn, self, tryLocsList, PromiseImpl) {
    if (PromiseImpl === void 0) PromiseImpl = Promise;

    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList),
      PromiseImpl
    );

    return exports.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        // Note: ["return"] must be used for ES3 parsing compatibility.
        if (delegate.iterator["return"]) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  Gp[toStringTagSymbol] = "Generator";

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  exports.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  exports.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };

  // Regardless of whether this script is executing as a CommonJS module
  // or not, return the runtime object so that we can declare the variable
  // regeneratorRuntime in the outer scope, which allows this module to be
  // injected easily by `bin/regenerator --include-runtime script.js`.
  return exports;

}(
  // If this script is executing as a CommonJS module, use module.exports
  // as the regeneratorRuntime namespace. Otherwise create a new empty
  // object. Either way, the resulting object will be used to initialize
  // the regeneratorRuntime variable at the top of this file.
  typeof module === "object" ? module.exports : {}
));

try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  // This module should not be running in strict mode, so the above
  // assignment should always work unless something is misconfigured. Just
  // in case runtime.js accidentally runs in strict mode, we can escape
  // strict mode using a global Function call. This could conceivably fail
  // if a Content Security Policy forbids using Function, but in that case
  // the proper solution is to fix the accidental strict mode problem. If
  // you've misconfigured your bundler to force strict mode and applied a
  // CSP to forbid Function, and you're not willing to fix either of those
  // problems, please detail your unique predicament in a GitHub issue.
  Function("r", "regeneratorRuntime = r")(runtime);
}

},{}],"node_modules/@babel/runtime/regenerator/index.js":[function(require,module,exports) {
module.exports = require("regenerator-runtime");

},{"regenerator-runtime":"node_modules/regenerator-runtime/runtime.js"}],"node_modules/@babel/runtime/helpers/asyncToGenerator.js":[function(require,module,exports) {
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

module.exports = _asyncToGenerator;
},{}],"src/common/Utils/Request.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Request = exports.HTTP_RESPONSE_STATUS = exports.HTTP_METHOD = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var HTTP_METHOD = {
  HEAD: 'HEAD',
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE'
};
exports.HTTP_METHOD = HTTP_METHOD;
var HTTP_RESPONSE_STATUS = {
  OK: 200,
  CREATED: 201,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500
};
/**
 * @author Alberto Contorno
 * @class
 * Wrapper to make http requests
 */

exports.HTTP_RESPONSE_STATUS = HTTP_RESPONSE_STATUS;

var Request = /*#__PURE__*/function () {
  function Request(url, method, options, data) {
    (0, _classCallCheck2.default)(this, Request);
    this.url = url;
    this.method = method || 'GET';
    this.options = options;
    this.data = data;
  }

  (0, _createClass2.default)(Request, [{
    key: "send",
    value: function send() {
      var _this = this;

      return new Promise( /*#__PURE__*/function () {
        var _ref = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee2(resolve, reject) {
          var _options;

          return _regenerator.default.wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  if (_this.url) {
                    _context2.next = 2;
                    break;
                  }

                  return _context2.abrupt("return");

                case 2:
                  _options = {
                    methods: _this.method,
                    headers: {
                      'Content-Type': 'application/json'
                    }
                  };

                  if (_this.method == 'GET' || _this.method == 'DELETE' || _this.method == 'HEAD') {} else {
                    if (_options.headers.contentType === 'application/json') _options.body = JSON.stringify(data); // TODO DEPENDS ON MYME-TYPE
                    else _options.body = data;
                  }

                  fetch(_this.url, _options).then( /*#__PURE__*/function () {
                    var _ref2 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee(res) {
                      var body, contentType, _iterator, _step, header, _header, key, value;

                      return _regenerator.default.wrap(function _callee$(_context) {
                        while (1) {
                          switch (_context.prev = _context.next) {
                            case 0:
                              _iterator = _createForOfIteratorHelper(res.headers.entries());

                              try {
                                for (_iterator.s(); !(_step = _iterator.n()).done;) {
                                  header = _step.value;
                                  _header = (0, _slicedToArray2.default)(header, 2), key = _header[0], value = _header[1];

                                  if (key === 'content-type') {
                                    contentType = value;
                                  }
                                }
                              } catch (err) {
                                _iterator.e(err);
                              } finally {
                                _iterator.f();
                              }

                              if (!contentType.includes('application/json')) {
                                _context.next = 8;
                                break;
                              }

                              _context.next = 5;
                              return res.json();

                            case 5:
                              body = _context.sent;
                              _context.next = 9;
                              break;

                            case 8:
                              body = res.text();

                            case 9:
                              ;
                              resolve(body);

                            case 11:
                            case "end":
                              return _context.stop();
                          }
                        }
                      }, _callee);
                    }));

                    return function (_x3) {
                      return _ref2.apply(this, arguments);
                    };
                  }()).catch(function (err) {
                    return reject(err);
                  });

                case 5:
                case "end":
                  return _context2.stop();
              }
            }
          }, _callee2);
        }));

        return function (_x, _x2) {
          return _ref.apply(this, arguments);
        };
      }());
      /* {
          method: 'POST', // *GET, POST, PUT, DELETE, etc.
          mode: 'cors', // no-cors, *cors, same-origin
          cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
          credentials: 'same-origin', // include, *same-origin, omit
          headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
          },  redirect: 'follow', // manual, *follow, error
          referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
          body: JSON.stringify(data) // body data type must match "Content-Type" header)*/
    }
  }]);
  return Request;
}();

exports.Request = Request;
},{"@babel/runtime/regenerator":"node_modules/@babel/runtime/regenerator/index.js","@babel/runtime/helpers/slicedToArray":"node_modules/@babel/runtime/helpers/slicedToArray.js","@babel/runtime/helpers/asyncToGenerator":"node_modules/@babel/runtime/helpers/asyncToGenerator.js","@babel/runtime/helpers/classCallCheck":"node_modules/@babel/runtime/helpers/classCallCheck.js","@babel/runtime/helpers/createClass":"node_modules/@babel/runtime/helpers/createClass.js"}],"src/common/Loaders/ModelLoader.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ModelLoader = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ModelLoader = /*#__PURE__*/function () {
  function ModelLoader() {
    (0, _classCallCheck2.default)(this, ModelLoader);
  }

  (0, _createClass2.default)(ModelLoader, [{
    key: "parse",
    value: function parse(path) {}
  }]);
  return ModelLoader;
}();

exports.ModelLoader = ModelLoader;
},{"@babel/runtime/helpers/classCallCheck":"node_modules/@babel/runtime/helpers/classCallCheck.js","@babel/runtime/helpers/createClass":"node_modules/@babel/runtime/helpers/createClass.js"}],"src/common/Loaders/ObjLoader.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ObjLoader = void 0;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _ModelLoader2 = require("./ModelLoader");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

var ObjLoader = /*#__PURE__*/function (_ModelLoader) {
  (0, _inherits2.default)(ObjLoader, _ModelLoader);

  var _super = _createSuper(ObjLoader);

  function ObjLoader() {
    (0, _classCallCheck2.default)(this, ObjLoader);
    return _super.apply(this, arguments);
  }

  (0, _createClass2.default)(ObjLoader, [{
    key: "parse",
    value: function parse(text) {
      // because indices are base 1 let's just fill in the 0th data
      var objPositions = [[0, 0, 0]];
      var objTexcoords = [[0, 0]];
      var objNormals = [[0, 0, 0]];
      var objColors = [[0, 0, 0]]; // same order as `f` indices

      var objVertexData = [objPositions, objTexcoords, objNormals, objColors]; // same order as `f` indices

      var webglVertexData = [[], // positions
      [], // texcoords
      [], // normals
      [] // colors
      ];
      var materialLibs = [];
      var geometries = [];
      var geometry;
      var groups = ['default'];
      var material = 'default';
      var object = 'default';

      var noop = function noop() {};

      function newGeometry() {
        // If there is an existing geometry and it's
        // not empty then start a new one.
        if (geometry && geometry.data.position.length) {
          geometry = undefined;
        }
      }

      function setGeometry() {
        if (!geometry) {
          var position = [];
          var texcoord = [];
          var normal = [];
          var color = [];
          webglVertexData = [position, texcoord, normal, color];
          geometry = {
            object: object,
            groups: groups,
            material: material,
            data: {
              position: position,
              texcoord: texcoord,
              normal: normal,
              color: color
            }
          };
          geometries.push(geometry);
        }
      }

      function addVertex(vert) {
        var ptn = vert.split('/');
        ptn.forEach(function (objIndexStr, i) {
          var _webglVertexData$i;

          if (!objIndexStr) {
            return;
          }

          var objIndex = parseInt(objIndexStr);
          var index = objIndex + (objIndex >= 0 ? 0 : objVertexData[i].length);

          (_webglVertexData$i = webglVertexData[i]).push.apply(_webglVertexData$i, (0, _toConsumableArray2.default)(objVertexData[i][index])); // if this is the position index (index 0) and we parsed
          // vertex colors then copy the vertex colors to the webgl vertex color data


          if (i === 0 && objColors.length > 1) {
            var _geometry$data$color;

            (_geometry$data$color = geometry.data.color).push.apply(_geometry$data$color, (0, _toConsumableArray2.default)(objColors[index]));
          }
        });
      }

      var keywords = {
        v: function v(parts) {
          // if there are more than 3 values here they are vertex colors
          if (parts.length > 3) {
            objPositions.push(parts.slice(0, 3).map(parseFloat));
            objColors.push(parts.slice(3).map(parseFloat));
          } else {
            objPositions.push(parts.map(parseFloat));
          }
        },
        vn: function vn(parts) {
          objNormals.push(parts.map(parseFloat));
        },
        vt: function vt(parts) {
          // should check for missing v and extra w?
          objTexcoords.push(parts.map(parseFloat));
        },
        f: function f(parts) {
          setGeometry();
          var numTriangles = parts.length - 2;

          for (var tri = 0; tri < numTriangles; ++tri) {
            addVertex(parts[0]);
            addVertex(parts[tri + 1]);
            addVertex(parts[tri + 2]);
          }
        },
        s: noop,
        // smoothing group
        mtllib: function mtllib(parts, unparsedArgs) {
          // the spec says there can be multiple filenames here
          // but many exist with spaces in a single filename
          materialLibs.push(unparsedArgs);
        },
        usemtl: function usemtl(parts, unparsedArgs) {
          material = unparsedArgs;
          newGeometry();
        },
        g: function g(parts) {
          groups = parts;
          newGeometry();
        },
        o: function o(parts, unparsedArgs) {
          object = unparsedArgs;
          newGeometry();
        }
      };
      var keywordRE = /(\w*)(?: )*(.*)/;
      var lines = text.split('\n');

      for (var lineNo = 0; lineNo < lines.length; ++lineNo) {
        var line = lines[lineNo].trim();

        if (line === '' || line.startsWith('#')) {
          continue;
        }

        var m = keywordRE.exec(line);

        if (!m) {
          continue;
        }

        var _m = (0, _slicedToArray2.default)(m, 3),
            keyword = _m[1],
            unparsedArgs = _m[2];

        var parts = line.split(/\s+/).slice(1);
        var handler = keywords[keyword];

        if (!handler) {
          console.warn('obj unhandled keyword:', keyword);
          continue;
        }

        handler(parts, unparsedArgs);
      } // remove any arrays that have no entries.


      for (var _i = 0, _geometries = geometries; _i < _geometries.length; _i++) {
        var _geometry = _geometries[_i];
        _geometry.data = Object.fromEntries(Object.entries(_geometry.data).filter(function (_ref) {
          var _ref2 = (0, _slicedToArray2.default)(_ref, 2),
              array = _ref2[1];

          return array.length > 0;
        }));
      }

      return {
        geometries: geometries,
        materialLibs: materialLibs
      };
    }
  }, {
    key: "parseMapArgs",
    value: function parseMapArgs(unparsedArgs) {
      // TODO: handle options
      return unparsedArgs;
    }
  }, {
    key: "parseMTL",
    value: function parseMTL(text) {
      var _this = this;

      var materials = {};
      var material;
      var keywords = {
        newmtl: function newmtl(parts, unparsedArgs) {
          material = {};
          materials[unparsedArgs] = material;
        },
        Ns: function Ns(parts) {
          material.shininess = parseFloat(parts[0]);
        },
        Ka: function Ka(parts) {
          material.ambient = parts.map(parseFloat);
        },
        Kd: function Kd(parts) {
          material.diffuse = parts.map(parseFloat);
        },
        Ks: function Ks(parts) {
          material.specular = parts.map(parseFloat);
        },
        Ke: function Ke(parts) {
          material.emissive = parts.map(parseFloat);
        },
        map_Kd: function map_Kd(parts, unparsedArgs) {
          material.diffuseMap = _this.parseMapArgs(unparsedArgs);
        },
        map_Ns: function map_Ns(parts, unparsedArgs) {
          material.specularMap = _this.parseMapArgs(unparsedArgs);
        },
        map_Bump: function map_Bump(parts, unparsedArgs) {
          material.normalMap = _this.parseMapArgs(unparsedArgs);
        },
        Ni: function Ni(parts) {
          material.opticalDensity = parseFloat(parts[0]);
        },
        d: function d(parts) {
          material.opacity = parseFloat(parts[0]);
        },
        illum: function illum(parts) {
          material.illum = parseInt(parts[0]);
        }
      };
      console.log(this);
      var keywordRE = /(\w*)(?: )*(.*)/;
      var lines = text.split('\n');

      for (var lineNo = 0; lineNo < lines.length; ++lineNo) {
        var line = lines[lineNo].trim();

        if (line === '' || line.startsWith('#')) {
          continue;
        }

        var m = keywordRE.exec(line);

        if (!m) {
          continue;
        }

        var _m2 = (0, _slicedToArray2.default)(m, 3),
            keyword = _m2[1],
            unparsedArgs = _m2[2];

        var parts = line.split(/\s+/).slice(1);
        var handler = keywords[keyword];

        if (!handler) {
          console.warn('material unhandled keyword:', keyword); // eslint-disable-line no-console

          continue;
        }

        handler(parts, unparsedArgs);
      }

      return materials;
    }
  }]);
  return ObjLoader;
}(_ModelLoader2.ModelLoader);

exports.ObjLoader = ObjLoader;
},{"@babel/runtime/helpers/slicedToArray":"node_modules/@babel/runtime/helpers/slicedToArray.js","@babel/runtime/helpers/toConsumableArray":"node_modules/@babel/runtime/helpers/toConsumableArray.js","@babel/runtime/helpers/classCallCheck":"node_modules/@babel/runtime/helpers/classCallCheck.js","@babel/runtime/helpers/createClass":"node_modules/@babel/runtime/helpers/createClass.js","@babel/runtime/helpers/inherits":"node_modules/@babel/runtime/helpers/inherits.js","@babel/runtime/helpers/possibleConstructorReturn":"node_modules/@babel/runtime/helpers/possibleConstructorReturn.js","@babel/runtime/helpers/getPrototypeOf":"node_modules/@babel/runtime/helpers/getPrototypeOf.js","./ModelLoader":"src/common/Loaders/ModelLoader.js"}],"src/common/Utils/NormalsGenerator.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateTangents = generateTangents;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _Vector_Matrix = require("./Vector_Matrix");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var toVec3 = function toVec3(v) {
  return (0, _Vector_Matrix.vec3)(v[0], v[1], v[2]);
};

function generateTangents(verteces, texcoords, indices) {
  var numFaces = verteces.length / 3;
  var tangents = [];

  for (var i = 0; i < numFaces; i++) {
    var p1 = toVec3(verteces[i]);
    var p2 = toVec3(verteces[i + 1]);
    var p3 = toVec3(verteces[i + 2]);
    var uv1 = texcoords[i];
    var uv2 = texcoords[i + 1];
    var uv3 = texcoords[i + 2];
    var edge1 = (0, _Vector_Matrix.subtract)(p2, p1);
    var edge2 = (0, _Vector_Matrix.subtract)(p3, p1);
    var deltaUV1 = (0, _Vector_Matrix.subtract)(uv2, uv1);
    var deltaUV2 = (0, _Vector_Matrix.subtract)(uv3, uv1);
    var f = 1.0 / (deltaUV1[0] * deltaUV2[1] - deltaUV2[0] * deltaUV1[1]);
    var tangent = Number.isFinite(f) ? (0, _Vector_Matrix.normalize)((0, _Vector_Matrix.scale)(f, (0, _Vector_Matrix.subtract)((0, _Vector_Matrix.scale)(deltaUV2[1], edge1), (0, _Vector_Matrix.scale)(deltaUV1[1], edge2)))) : [1, 0, 0];
    tangents.push.apply(tangents, (0, _toConsumableArray2.default)(tangent).concat((0, _toConsumableArray2.default)(tangent), (0, _toConsumableArray2.default)(tangent)));
  }

  return tangents;
}
},{"@babel/runtime/helpers/toConsumableArray":"node_modules/@babel/runtime/helpers/toConsumableArray.js","./Vector_Matrix":"src/common/Utils/Vector_Matrix.js"}],"src/index.js":[function(require,module,exports) {
"use strict";

require("./styles.css");

var _webglUtils = require("./common/webgl-utils");

var _Engine = require("./common/Engine");

var _inputManager = require("./common/inputManager");

var _Scene = require("./common/Scene");

var _Camera = require("./common/Camera");

var _Object = require("./common/Object");

var _Mesh = require("./common/Mesh");

var _Texture = require("./common/Texture");

var _DirectionalLight = require("./common/Components/DirectionalLight");

var _PointLight = require("./common/Components/PointLight");

var _SpotLight = require("./common/Components/SpotLight");

var _Vector_Matrix = require("./common/Utils/Vector_Matrix");

var _Material = require("./common/Material");

var _Request = require("./common/Utils/Request");

var _ObjLoader = require("./common/Loaders/ObjLoader");

var _NormalsGenerator = require("./common/Utils/NormalsGenerator");

/**
 * @author Alberto Contorno
 */
var inputs = new _inputManager.InputManager();
var up = (0, _Vector_Matrix.vec3)(0.0, 1.0, 0.0);
var canvas = document.getElementById("app");
inputs.lockMouse(canvas);

var gl = _webglUtils.WebGLUtils.setupWebGL(canvas);

var aspect = gl.drawingBufferWidth / gl.drawingBufferHeight;
var camera = new _Camera.Camera((0, _Vector_Matrix.vec3)(0, 0, 5), up, 5, "perspective", {}, {
  fov: 45,
  aspect: aspect,
  near: 0.1,
  far: 100
}, 25, {
  maxLevel: 3,
  0: 30,
  1: 45,
  2: 75,
  3: 90
}, 1);
/* var camera = new Camera(vec3(0, 0, 0), up, 5, "orthographic", {},
  { left: -1, right: 1, up: 1, bottom: -1, near: 0.1, far: 100 },
  25, { maxLevel: 3, 0: 30, 1: 45, 2: 75, 3: 90 }, 1
); */

gl.enable(gl.DEPTH_TEST); //gl.enable(gl.CULL_FACE);

gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
var engine = new _Engine.Engine(gl, {
  showFps: true,
  clearColor: [0.0, 0.0, 0.0, 0.0]
});
var scene = new _Scene.Scene();
var req = new _Request.Request('https://albertocontorno.github.io/WebGL_Engine/assets/windmill.obj');
var reqMtl = new _Request.Request('https://albertocontorno.github.io/WebGL_Engine/assets/windmill.mtl');
Promise.all([req.send(), reqMtl.send()]).then(function (res) {
  var obj = res[0];
  var mat = res[1];
  var loader = new _ObjLoader.ObjLoader();
  var m = loader.parse(obj);
  console.log(m);
  var o = new _Object.SceneObject(null, 'holder');
  scene.addObject(o);
  var mtl = loader.parseMTL(mat);
  console.log(mtl);

  o.onUpdate = function () {
    o.transform.rotation[1] += 25 * engine.time.deltaTime; //o.transform.rotation[0] += 5 * engine.time.deltaTime; 
  };

  m.geometries.forEach(function (g) {
    var oo = new _Object.SceneObject(null, 'sub');
    var verts = [];
    var verts_n = [];
    var text_coords = [];
    var colors;
    var data = g.data;
    var tangents;

    for (var i = 0; i < data.position.length - 2; i += 3) {
      verts.push((0, _Vector_Matrix.vec4)(data.position[i], data.position[i + 1], data.position[i + 2], 1.0));
      verts_n.push((0, _Vector_Matrix.vec3)(data.normal[i], data.normal[i + 1], data.normal[i + 2]));
    }

    for (var _i = 0; _i < data.texcoord.length - 1; _i += 2) {
      text_coords.push((0, _Vector_Matrix.vec2)(data.texcoord[_i], data.texcoord[_i + 1], 1.0));
    }

    if (data.color) {
      colors = [];

      for (var _i2 = 0; _i2 < data.color.length - 2; _i2 += 3) {
        colors.push((0, _Vector_Matrix.vec4)(data.color[_i2], data.color[_i2 + 1], data.color[_i2 + 2], 1.0));
      }
    }

    var ooMat = mtl[g.material];

    if (data.texcoord && data.normal && ooMat['normalMap']) {
      var tangents_ = (0, _NormalsGenerator.generateTangents)(verts, text_coords);
      tangents = [];

      for (var _i3 = 0; _i3 < tangents_.length - 2; _i3 += 3) {
        tangents.push((0, _Vector_Matrix.vec3)(tangents_[_i3], tangents_[_i3 + 1], tangents_[_i3 + 2]));
      }
    }

    var ooMesh = new _Mesh.Mesh(gl, verts, null, null, null, null, text_coords, verts_n, tangents);
    oo.addMesh(ooMesh);
    oo.parent = o;
    scene.addObject(oo);

    if (ooMat['diffuseMap']) {
      var diffuseMap = new _Texture.Texture(0, null, 'assets/' + ooMat['diffuseMap'], gl.RGB, gl.RGB, {
        flipY: true
      });
      diffuseMap.LoadTexture(gl);
      ooMesh.textures.DIFFUSE_MAP = diffuseMap;
    }

    if (ooMat['normalMap']) {
      console.log('NORMAL MAP ' + ooMat['normalMap']);
      var normalMap = new _Texture.Texture(2, null, 'assets/' + ooMat['normalMap'], gl.RGB, gl.RGB, {
        flipY: true
      });
      normalMap.LoadTexture(gl);
      ooMesh.textures.NORMAL_MAP = normalMap;
    }

    if (ooMat['specularMap']) {
      var specularMap = new _Texture.Texture(1, null, 'assets/' + ooMat['specularMap'], gl.RGB, gl.RGB, {
        flipY: true
      });
      specularMap.LoadTexture(gl);
      ooMesh.textures.SPECULAR_MAP = specularMap;
    }

    oo.material = new _Material.Material(ooMat.ambient, ooMat.diffuse, ooMat.specular, ooMat.shininess);
  });
  o.transform.position = [0, 0, -3];
  o.transform.rotation = [0, -90, 0];
  o.transform.scale = [.1, .1, .1];
  scene.addObject(o);
});

function handleInputs() {
  if (inputs.isKeyDown(inputs.keyCodes.KEYNAMES.shift) && inputs.isKeyDown(inputs.keyCodes.KEYNAMES.w)) {
    camera.moveUp(engine.time.deltaTime);
  } else if (inputs.isKeyDown(inputs.keyCodes.KEYNAMES.shift) && inputs.isKeyDown(inputs.keyCodes.KEYNAMES.s)) {
    camera.moveDown(engine.time.deltaTime);
  } else {
    if (inputs.isKeyDown(inputs.keyCodes.KEYNAMES.a)) {
      camera.moveLeft(engine.time.deltaTime);
    }

    if (inputs.isKeyDown(inputs.keyCodes.KEYNAMES.s)) {
      camera.moveBackwards(engine.time.deltaTime);
    }

    if (inputs.isKeyDown(inputs.keyCodes.KEYNAMES.d)) {
      camera.moveRight(engine.time.deltaTime);
    }

    if (inputs.isKeyDown(inputs.keyCodes.KEYNAMES.w)) {
      camera.moveForward(engine.time.deltaTime);
    }

    if (inputs.isKeyDown(inputs.keyCodes.KEYNAMES.q)) {
      obj3.transform.rotation[0] += 4;
      obj3.transform.rotation[1] += 5;
      obj3.transform.rotation[2] += 4;
    }

    if (inputs.isKeyDown(inputs.keyCodes.KEYNAMES.r)) {
      robotLowerArm.transform.rotation[0] += 4;
    }

    if (inputs.isKeyDown(inputs.keyCodes.KEYNAMES.t)) {
      robotBody.transform.rotation[1] += 4;
    }

    if (inputs.isKeyDown(inputs.keyCodes.KEYNAMES.o)) {
      pointLight_obj.transform.position[0] = 4 * Math.sin(engine.time.time);
      pointLight_obj.transform.position[2] = 4 * Math.cos(engine.time.time);
      pointLight.position = pointLight_obj.transform.position;
    }
  }

  camera.updateCameraDirection(inputs.getMouseMovX(), inputs.getMouseMovY(), engine.time.deltaTime);
}

var vertices1 = [(0, _Vector_Matrix.vec4)(-0.5, -0.5, -0.5, 1.0), (0, _Vector_Matrix.vec4)(0.5, -0.5, -0.5, 1.0), (0, _Vector_Matrix.vec4)(0.5, 0.5, -0.5, 1.0), (0, _Vector_Matrix.vec4)(0.5, 0.5, -0.5, 1.0), (0, _Vector_Matrix.vec4)(-0.5, 0.5, -0.5, 1.0), (0, _Vector_Matrix.vec4)(-0.5, -0.5, -0.5, 1.0), (0, _Vector_Matrix.vec4)(-0.5, -0.5, 0.5, 1.0), (0, _Vector_Matrix.vec4)(0.5, -0.5, 0.5, 1.0), (0, _Vector_Matrix.vec4)(0.5, 0.5, 0.5, 1.0), (0, _Vector_Matrix.vec4)(0.5, 0.5, 0.5, 1.0), (0, _Vector_Matrix.vec4)(-0.5, 0.5, 0.5, 1.0), (0, _Vector_Matrix.vec4)(-0.5, -0.5, 0.5, 1.0), (0, _Vector_Matrix.vec4)(-0.5, 0.5, 0.5, 1.0), (0, _Vector_Matrix.vec4)(-0.5, 0.5, -0.5, 1.0), (0, _Vector_Matrix.vec4)(-0.5, -0.5, -0.5, 1.0), (0, _Vector_Matrix.vec4)(-0.5, -0.5, -0.5, 1.0), (0, _Vector_Matrix.vec4)(-0.5, -0.5, 0.5, 1.0), (0, _Vector_Matrix.vec4)(-0.5, 0.5, 0.5, 1.0), (0, _Vector_Matrix.vec4)(0.5, 0.5, 0.5, 1.0), (0, _Vector_Matrix.vec4)(0.5, 0.5, -0.5, 1.0), (0, _Vector_Matrix.vec4)(0.5, -0.5, -0.5, 1.0), (0, _Vector_Matrix.vec4)(0.5, -0.5, -0.5, 1.0), (0, _Vector_Matrix.vec4)(0.5, -0.5, 0.5, 1.0), (0, _Vector_Matrix.vec4)(0.5, 0.5, 0.5, 1.0), (0, _Vector_Matrix.vec4)(-0.5, -0.5, -0.5, 1.0), (0, _Vector_Matrix.vec4)(0.5, -0.5, -0.5, 1.0), (0, _Vector_Matrix.vec4)(0.5, -0.5, 0.5, 1.0), (0, _Vector_Matrix.vec4)(0.5, -0.5, 0.5, 1.0), (0, _Vector_Matrix.vec4)(-0.5, -0.5, 0.5, 1.0), (0, _Vector_Matrix.vec4)(-0.5, -0.5, -0.5, 1.0), (0, _Vector_Matrix.vec4)(-0.5, 0.5, -0.5, 1.0), (0, _Vector_Matrix.vec4)(0.5, 0.5, -0.5, 1.0), (0, _Vector_Matrix.vec4)(0.5, 0.5, 0.5, 1.0), (0, _Vector_Matrix.vec4)(0.5, 0.5, 0.5, 1.0), (0, _Vector_Matrix.vec4)(-0.5, 0.5, 0.5, 1.0), (0, _Vector_Matrix.vec4)(-0.5, 0.5, -0.5, 1.0)];
var normals = [(0, _Vector_Matrix.vec3)(0.0, 0.0, -1.0), (0, _Vector_Matrix.vec3)(0.0, 0.0, -1.0), (0, _Vector_Matrix.vec3)(0.0, 0.0, -1.0), (0, _Vector_Matrix.vec3)(0.0, 0.0, -1.0), (0, _Vector_Matrix.vec3)(0.0, 0.0, -1.0), (0, _Vector_Matrix.vec3)(0.0, 0.0, -1.0), (0, _Vector_Matrix.vec3)(0.0, 0.0, 1.0), (0, _Vector_Matrix.vec3)(0.0, 0.0, 1.0), (0, _Vector_Matrix.vec3)(0.0, 0.0, 1.0), (0, _Vector_Matrix.vec3)(0.0, 0.0, 1.0), (0, _Vector_Matrix.vec3)(0.0, 0.0, 1.0), (0, _Vector_Matrix.vec3)(0.0, 0.0, 1.0), (0, _Vector_Matrix.vec3)(-1.0, 0.0, 0.0), (0, _Vector_Matrix.vec3)(-1.0, 0.0, 0.0), (0, _Vector_Matrix.vec3)(-1.0, 0.0, 0.0), (0, _Vector_Matrix.vec3)(-1.0, 0.0, 0.0), (0, _Vector_Matrix.vec3)(-1.0, 0.0, 0.0), (0, _Vector_Matrix.vec3)(-1.0, 0.0, 0.0), (0, _Vector_Matrix.vec3)(1.0, 0.0, 0.0), (0, _Vector_Matrix.vec3)(1.0, 0.0, 0.0), (0, _Vector_Matrix.vec3)(1.0, 0.0, 0.0), (0, _Vector_Matrix.vec3)(1.0, 0.0, 0.0), (0, _Vector_Matrix.vec3)(1.0, 0.0, 0.0), (0, _Vector_Matrix.vec3)(1.0, 0.0, 0.0), (0, _Vector_Matrix.vec3)(0.0, -1.0, 0.0), (0, _Vector_Matrix.vec3)(0.0, -1.0, 0.0), (0, _Vector_Matrix.vec3)(0.0, -1.0, 0.0), (0, _Vector_Matrix.vec3)(0.0, -1.0, 0.0), (0, _Vector_Matrix.vec3)(0.0, -1.0, 0.0), (0, _Vector_Matrix.vec3)(0.0, -1.0, 0.0), (0, _Vector_Matrix.vec3)(0.0, 1.0, 0.0), (0, _Vector_Matrix.vec3)(0.0, 1.0, 0.0), (0, _Vector_Matrix.vec3)(0.0, 1.0, 0.0), (0, _Vector_Matrix.vec3)(0.0, 1.0, 0.0), (0, _Vector_Matrix.vec3)(0.0, 1.0, 0.0), (0, _Vector_Matrix.vec3)(0.0, 1.0, 0.0)];
var cube = new _Mesh.Mesh(gl, vertices1, null, null, null, null, null, normals);
var lightsObj = new _Object.SceneObject(null, 'lights');
scene.addObject(lightsObj);
var dirLight = new _DirectionalLight.DirectionalLight();
dirLight.ambient = (0, _Vector_Matrix.vec3)(0.1, 0.1, 0.1);
dirLight.diffuse = (0, _Vector_Matrix.vec3)(1.0, 1.0, 1.0);
dirLight.direction = (0, _Vector_Matrix.vec3)(-1, -1, 5);
dirLight.specular = (0, _Vector_Matrix.vec3)(1, 1, 1);
var pointLight_obj = new _Object.SceneObject(null, 'dirLight');
pointLight_obj.addMesh(cube);
pointLight_obj.material = new _Material.Material((0, _Vector_Matrix.vec3)(0.0, 1.0, 0.0), (0, _Vector_Matrix.vec3)(0.0, 1.0, 0.0));
scene.addObject(pointLight_obj);
pointLight_obj.transform.position = [0.0, 0, -2.0];
pointLight_obj.transform.scale = [.1, .1, .1];
var pointLight = new _PointLight.PointLight();
pointLight.position = (0, _Vector_Matrix.vec3)(0.0, 0, -2.0);
pointLight.diffuse = (0, _Vector_Matrix.vec3)(1.0, 1.0, 1.0);
/* var pointLight_obj2 = new SceneObject(null, 'dirLight');
pointLight_obj2.addMesh(cube);
pointLight_obj2.material = new Material(vec3(1.0, 1.0, 1.0), vec3(1.0, 1.0, 1.0));
scene.addObject(pointLight_obj2);

pointLight_obj2.transform.position = [0.0, -3.0, 0.0];
pointLight_obj2.transform.scale = [.2, .2, .2];

let pointLight2 = new PointLight();
pointLight2.position = vec3(0.0, -3.0, 0.0);
pointLight2.diffuse = vec3(1.0, 1.0, 1.0); */

var spotLight = new _SpotLight.SpotLight();
spotLight.direction = (0, _Vector_Matrix.vec3)(0, 1.0, 0.0);
spotLight.position = (0, _Vector_Matrix.vec3)(0.0, 2.0, -3.0);
spotLight.cutOff = 0.011;
spotLight.outerCutOff = 0.512;
spotLight.ambient = (0, _Vector_Matrix.vec3)(1.0, 0.1, 0.1);
lightsObj.addComponent(dirLight);
/* lightsObj.addComponent(pointLight); */

/* lightsObj.addComponent(pointLight2); */

var gameManager = new _Object.SceneObject(null, 'gm');
console.log(engine);

gameManager.onUpdate = function () {
  handleInputs();
  inputs.clearMousePosition();
};

scene.addObject(gameManager);
scene.addCamera(camera);
engine.addScene(scene);

function main() {
  engine.doRendering();
}

main();
},{"./styles.css":"src/styles.css","./common/webgl-utils":"src/common/webgl-utils.js","./common/Engine":"src/common/Engine.js","./common/inputManager":"src/common/inputManager.js","./common/Scene":"src/common/Scene.js","./common/Camera":"src/common/Camera.js","./common/Object":"src/common/Object.js","./common/Mesh":"src/common/Mesh.js","./common/Texture":"src/common/Texture.js","./common/Components/DirectionalLight":"src/common/Components/DirectionalLight.js","./common/Components/PointLight":"src/common/Components/PointLight.js","./common/Components/SpotLight":"src/common/Components/SpotLight.js","./common/Utils/Vector_Matrix":"src/common/Utils/Vector_Matrix.js","./common/Material":"src/common/Material.js","./common/Utils/Request":"src/common/Utils/Request.js","./common/Loaders/ObjLoader":"src/common/Loaders/ObjLoader.js","./common/Utils/NormalsGenerator":"src/common/Utils/NormalsGenerator.js"}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "54852" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","src/index.js"], null)
//# sourceMappingURL=/src.a2b27638.js.map