// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE = ` 
  attribute vec4 a_Position;
  attribute vec2 a_UV;
  attribute vec3 a_Normal;
  varying vec2 v_UV;
  varying vec3 v_Normal;
  varying vec4 v_VertPos;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_GlobalRotateMatrix;
  uniform mat4 u_ViewMatrix;
  uniform mat4 u_ProjectionMatrix;
  void main() {
    gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
    v_UV = a_UV;
    v_Normal = a_Normal;
    v_VertPos = u_ModelMatrix * a_Position;
  }`

// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;
  varying vec2 v_UV;
  varying vec3 v_Normal;
  varying vec4 v_VertPos;
  uniform vec4 u_FragColor;
  uniform sampler2D u_Sampler0;
  uniform sampler2D u_Sampler1;
  uniform vec3 u_lightPos;
  uniform vec3 u_cameraPos;
  uniform int u_whichTexture;
  uniform bool u_lightOn;
  void main() {
    if (u_whichTexture == -3) {
      gl_FragColor = vec4((v_Normal+1.0)/2.0, 1.0); //Use normal
    } else if (u_whichTexture == -2) {
      gl_FragColor = u_FragColor;                 //Use color
    } else if (u_whichTexture == -1) {
      gl_FragColor = vec4(v_UV, 1.0, 1.0);        //Use UV debug color
    } else if (u_whichTexture == 0) {
      gl_FragColor = texture2D(u_Sampler0, v_UV); //Use texture0
    } else if (u_whichTexture == 1) {
      gl_FragColor = texture2D(u_Sampler1, v_UV); //Use texture1
    } else {
      gl_FragColor = vec4(1,.2,.2,1);             //Error
    }
    vec3 lightVector = u_lightPos - vec3(v_VertPos);
    float r = length(lightVector);
    vec3 L = normalize(lightVector);
    vec3 N = normalize(v_Normal);
    float nDotL = max(dot(N, L), 0.0);
    vec3 R = reflect(-L,N);
    vec3 E = normalize(u_cameraPos-vec3(v_VertPos));
    float specular = pow(max(dot(E,R), 0.0), 10.0);
    vec3 diffuse = vec3(gl_FragColor) * nDotL * 0.7;
    vec3 ambient = vec3(gl_FragColor) * 0.3;
    if (u_lightOn) {
      gl_FragColor = vec4(specular+diffuse+ambient, 1.0);
    } else {
      gl_FragColor = vec4(ambient, 1.0);
    }
    
    // gl_FragColor = vec4(vec3(gl_FragColor) / (r * r), 1.0);
    // if (r<1.0) {
    //   gl_FragColor = vec4(1,0,0,1);
    // } else if (r<2.0) {
    //   gl_FragColor = vec4(0,1,0,1);
    // }
  }`;

  // Global Variables
  let canvas;
  let gl;
  let a_Position;
  let a_UV;
  let a_Normal;
  let u_Sampler0
  let u_FragColor;
  let u_Size;
  let u_ModelMatrix;
  let u_ProjectionMatrix;
  let u_ViewMatrix;
  let u_GlobalRotateMatrix;
  let u_lightPos;
  let u_lightOn;
  let u_cameraPos;

  function setupWebGL(){
        // Retrieve <canvas> element
    canvas = document.getElementById('webgl');

    // Get the rendering context for WebGL
    // gl = getWebGLContext(canvas);
    gl = canvas.getContext("webgl", { preserveDrawingBuffer: true});
    if (!gl) {
      console.log('Failed to get the rendering context for WebGL');
      return;
    }
    gl.enable(gl.DEPTH_TEST);
  }

  function connectVariablesToGLSL(){
     // Initialize shaders
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
      console.log('Failed to intialize shaders.');
      return;
    }

    // Get the storage location of a_Position
    a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
      console.log('Failed to get the storage location of a_Position');
      return;
    }

    // Get the storage location of a_UV
    a_UV = gl.getAttribLocation(gl.program, 'a_UV');
    if (a_UV < 0) {
      console.log('Failed to get the storage location of a_UV');
      return;
    }

    // Get the storage location of a_Normal
    a_Normal = gl.getAttribLocation(gl.program, 'a_Normal');
    if (a_Normal < 0) {
      console.log('Failed to get the storage location of a_Normal');
      return;
    }

    // Get the storage location of u_Sampler
    u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0');
    if (!u_Sampler0) {
      console.log('Failed to get the storage location of u_Sampler0');
      return false;
    }

    // Get the storage location of u_Sampler
    u_Sampler1 = gl.getUniformLocation(gl.program, 'u_Sampler1');
    if (!u_Sampler1) {
      console.log('Failed to get the storage location of u_Sampler1');
      return false;
    }

    // Get the storage location of u_whichTexture
    u_whichTexture = gl.getUniformLocation(gl.program, 'u_whichTexture');
    if (!u_whichTexture) {
      console.log('Failed to get the storage location of u_whichTexture');
      return false;
    }

    // Get the storage location of u_FragColor
    u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
    if (!u_FragColor) {
      console.log('Failed to get the storage location of u_FragColor');
      return;
    }

    // Get the storage location of u_lightPos
    u_lightPos = gl.getUniformLocation(gl.program, 'u_lightPos');
    if (!u_lightPos) {
      console.log('Failed to get the storage location of u_lightPos');
      return;
    }

    // Get the storage location of u_cameraPos
    u_cameraPos = gl.getUniformLocation(gl.program, 'u_cameraPos');
    if (!u_cameraPos) {
      console.log('Failed to get the storage location of u_cameraPos');
      return;
    }

    // Get the storage location of u_lightOn
    u_lightOn = gl.getUniformLocation(gl.program, 'u_lightOn');
    if (!u_lightOn) {
      console.log('Failed to get the storage location of u_lightOn');
      return;
    }

    // Get the storage location of u_ModelMatrix
    u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix')
    if(!u_ModelMatrix) {
      console.log('Failed to get the storage location of u_ModelMatrix');
      return;
    }

    // Get the storage location of u_ViewMatrix
    u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix')
    if(!u_ViewMatrix) {
      console.log('Failed to get the storage location of u_ViewMatrix');
      return;
    }

    // Get the storage location of u_ProjectionMatrix
    u_ProjectionMatrix = gl.getUniformLocation(gl.program, 'u_ProjectionMatrix')
    if(!u_ProjectionMatrix) {
      console.log('Failed to get the storage location of u_ProjectionMatrix');
      return;
    }

    // Get the storage location of u_GlobalRotateMatrix
    u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix')
    if(!u_GlobalRotateMatrix) {
      console.log('Failed to get the storage location of u_GlobalRotateMatrix');
      return;
    }
  }
  // Constants
  const POINT = 0;
  const TRIANGLE = 1;
  const CIRCLE = 2;

  // UI Globals
  let g_globalAngle = 0;
  let g_tailAngle = 0;
  let g_tailtipAngle = 0;
  let g_tailAnim = false;
  let g_tailtipAnim = false;
  let g_tailtip2Anim = false;
  let g_tailtip2Angle = 0;
  let g_idleAnim = true ;
  let g_idleYVal = 0;
  let g_idleYValHead = 0;
  let g_normalOn = false;
  let g_lightOn = true;
  let g_lightPos = [0,0,-1];

  // For fps
  let startTime = performance.now();
  let frameCount = 0;

  // Set up actions for HTML UI elements
  function addActionsForHTMLUI(){

    //Other Slider Events
    document.getElementById('normalOn').onclick = function() {g_normalOn=true;  renderAllShapes();}
    document.getElementById('normalOff').onclick = function() {g_normalOn=false;  renderAllShapes();}
    document.getElementById('lightOn').onclick = function() {g_lightOn=true;  renderAllShapes();}
    document.getElementById('lightOff').onclick = function() {g_lightOn=false;  renderAllShapes();}
    document.getElementById('lightSlideX').addEventListener('mousemove', function(ev) {if(ev.buttons == 1){ g_lightPos[0] = -this.value/100; renderScene();}});
   document.getElementById('lightSlideY').addEventListener('mousemove', function(ev) {if(ev.buttons == 1){ g_lightPos[1] = this.value/100; renderScene();}});
   document.getElementById('lightSlideZ').addEventListener('mousemove', function(ev) {if(ev.buttons == 1){ g_lightPos[2] = -this.value/100; renderScene();}});
    document.getElementById('angleSlide').addEventListener('mousemove', function() {g_globalAngle = this.value; renderAllShapes(); });
    document.getElementById('tailSlide').addEventListener('mousemove', function() {g_tailAngle = this.value; renderAllShapes(); });
    document.getElementById('tailtipSlide').addEventListener('mousemove', function() {g_tailtipAngle = this.value; renderAllShapes(); });
    document.getElementById('tailtip2Slide').addEventListener('mousemove', function() {g_tailtip2Angle = this.value; renderAllShapes(); });
    document.getElementById('tailAnimOn').onclick = function() {g_tailAnim = true;};
    document.getElementById('tailtipAnimOn').onclick = function() {g_tailtipAnim = true;};
    document.getElementById('tailAnimOff').onclick = function() {g_tailAnim = false;};
    document.getElementById('tailtipAnimOff').onclick = function() {g_tailtipAnim = false;};
    document.getElementById('tailtip2AnimOn').onclick = function() {g_tailtip2Anim = true;};
    document.getElementById('tailtip2AnimOff').onclick = function() {g_tailtip2Anim = false;};
    document.getElementById('idleAnimOn').onclick = function() {g_idleAnim = true;};
    document.getElementById('idleAnimOff').onclick = function() {g_idleAnim = false;};
  }

  var camera;

function main() {

  setupWebGL();

  connectVariablesToGLSL();

  camera = new Camera(canvas);
  
  updateFPS();
  addActionsForHTMLUI();
  
  document.onkeydown = keydown;

  initTextures();

  // Specify the color for clearing <canvas>
  gl.clearColor(0, 0, 0, 1.0);

  updateAnimationAngles();

  renderAllShapes();

  // Clear <canvas>
  requestAnimationFrame(tick);

}

function initTextures() {
  var texture = gl.createTexture();   // Create a texture object
  if (!texture) {
    console.log('Failed to create the texture object');
    return false;
  }
  var texture2 = gl.createTexture();   // Create a texture object
  if (!texture2) {
    console.log('Failed to create the texture2 object');
    return false;
  }
  var image = new Image();  // Create the image object
  if (!image) {
    console.log('Failed to create the image object');
    return false;
  }
  image.onload = function(){ sendImageToTEXTURE0(texture, image, 0); };
  // Tell the browser to load an image
  image.src = 'pavement.png';

  var image2 = new Image();  // Create the image object
  if (!image2) {
    console.log('Failed to create the image object');
    return false;
  }
  image2.onload = function(){ sendImageToTEXTURE0(texture2, image2, 1); };
  // Tell the browser to load an image
  image2.src = 'city.png';

  return true;
}

function sendImageToTEXTURE0(texture, image, whichTexture) {
   // Flip the image's y axis
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
  // Enable the correct texture unit
  gl.activeTexture(gl.TEXTURE0 + whichTexture);
  // Bind the texture object to the target
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Set the texture parameters
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  // Set the texture image
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
  
  if (whichTexture == 0) {
      gl.uniform1i(u_Sampler0, 0);
  } else {
      gl.uniform1i(u_Sampler1, 1);
  }
  
  // gl.clear(gl.COLOR_BUFFER_BIT);   // Clear <canvas>

  // gl.drawArrays(gl.TRIANGLE_STRIP, 0, n); // Draw the rectangle
  console.log('finished loadTexture');
}

function updateFPS() {
    const timePassed = performance.now() - startTime;
    frameCount++;

    if (timePassed >= 1000) {
        const fps = frameCount / (timePassed / 1000);
        document.getElementById('fpsCount').innerText = Math.round(fps);
        
        //Reset time
        startTime = performance.now();
        frameCount = 0;
    }
    requestAnimationFrame(updateFPS);
}

function keydown(ev) {
  switch (ev.keyCode) {
    case 87:
      camera.moveForward(.5); //PRESS W
      break;
    case 83:
      camera.moveBackward(.5); //PRESS S
      break;
    case 65:
      camera.moveLeft(.5); //PRESS A
      break;
    case 68:
      camera.moveRight(.5); //PRESS A
      break;
    case 81:
      camera.panLeft(5); //PRESS Q
      break;
    case 69:
      camera.panRight(5); //PRESS E
      break;
  }
  renderAllShapes();
}

function updateAnimationAngles() {
  if (g_tailAnim) {
    g_tailAngle = (10*Math.sin(g_seconds));
  }
  if (g_tailtipAnim) {
    g_tailtipAngle = (35*Math.sin(g_seconds));
  }
  if (g_tailtip2Anim) {
    g_tailtip2Angle = (35*Math.sin(g_seconds));
  }
  if (g_idleAnim) {
    g_idleYVal = (.04*Math.sin(1.1* g_seconds));
    g_idleYValHead = (.02*Math.sin(1.1* g_seconds));
  }
  g_lightPos[0] = 1.5*Math.cos(g_seconds);
}

var g_startTime = performance.now() / 1000.0;
var g_seconds = performance.now() / 1000.0 - g_startTime;

function tick(){
  g_seconds = performance.now() / 1000.0 - g_startTime;
  // console.log(g_seconds);

  updateAnimationAngles();

  renderAllShapes();

  requestAnimationFrame(tick);
}

var g_map = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
]

function drawMap() {
  for (x=0; x<32; x++){
    for (y=0; y<32; y++){
      if (g_map[x][y]==1){
        var body = new Cube();
        body.color = [.2,.35,.2,1];
        body.matrix.translate(x-16, -2, y-16);
        body.matrix.scale(1, 1.5, 1);
        body.render();
      }
    }
  }
}

function renderAllShapes(){

  var projMat = camera.projectionMatrix;
  gl.uniformMatrix4fv(u_ProjectionMatrix, false, projMat.elements);

  var viewMat = camera.viewMatrix;
  gl.uniformMatrix4fv(u_ViewMatrix, false, viewMat.elements);

  var globalRotMat = new Matrix4().rotate(g_globalAngle,0,1,0);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // var body2 = new Cube();
  // body2.color = [0, 0.3, 1, 1];  // Blue color
  // body2.matrix.translate(-1, -1, -1);  // Center the skybox
  // body2.matrix.scale(300, 300, 300);  // Scale up uniformly in all directions
  // body2.render();

  drawMap();

  gl.uniform3f(u_lightPos, g_lightPos[0], g_lightPos[1], g_lightPos[2])
  gl.uniform1i(u_lightOn, g_lightOn);
  // gl.uniform3f(u_cameraPos, camera.eye.x, camera.eye.y, camera.eye.z);

  var light = new Cube();
  light.color = [2,2,0,1];
  light.matrix.translate(g_lightPos[0],g_lightPos[1],g_lightPos[2]);
  light.matrix.scale(.1,.1,.1);
  light.matrix.translate(-.5,-.5,-.5);
  light.render();

  var ear = new TriPrism();
  ear.color = [0.0,.85,0.7,1.0];
  ear.matrix.translate(-.7, .33, -.575);
  ear.matrix.scale(.2,.2, .06);
  ear.matrix.rotate(10,0,1,0);
  ear.matrix.translate(0, g_idleYValHead, 0);
  ear.render();

  var earfur = new TriPrism();
  earfur.color = [0.25,.05,0.05,1.0];
  earfur.matrix.translate(-.67, .33, -.578);
  earfur.matrix.scale(.15,.15, .06);
  earfur.matrix.rotate(10,0,1,0);
  earfur.matrix.translate(0, g_idleYValHead, 0);
  earfur.render();

  var earback = new TriPrism();
  earback.color = [0.0,.85,0.7,1.0];
  earback.matrix.translate(-.68, .33, -.56);
  earback.matrix.scale(.18,.15, .12);
  earback.matrix.rotate(10,0,1,0);
  earback.matrix.translate(0, g_idleYValHead, 0);
  earback.render();

  var ear2 = new TriPrism();
  ear2.color = [0.25,.05,0.05,1.0];
  ear2.matrix.translate(-.33, .33, -.578);
  ear2.matrix.scale(.15,.15, .06);
  ear2.matrix.rotate(-10,0,1,0);
  ear2.matrix.translate(0, g_idleYValHead, 0);
  ear2.render();

  var ear2fur = new TriPrism();
  ear2fur.color = [0.0,.85,0.7,1.0];
  ear2fur.matrix.translate(-.35, .33, -.575);
  ear2fur.matrix.scale(.2,.2, .06);
  ear2fur.matrix.rotate(-10,0,1,0);
  ear2fur.matrix.translate(0, g_idleYValHead, 0);
  ear2fur.render();

  var earback2 = new TriPrism();
  earback2.color = [0.0,.85,0.7,1.0];
  earback2.matrix.translate(-.36, .33, -.56);
  earback2.matrix.scale(.18,.15, .12);
  earback2.matrix.rotate(-10,0,1,0);
  earback2.matrix.translate(0, g_idleYValHead, 0);
  earback2.render();
  // -----------------------------------------------------------------------------------
  var sky = new Cube();
  sky.color = [1,1,1,1];
  if(g_normalOn) {
    sky.textureNum= -3;
  }
  
  sky.matrix.scale(-50,-50,-50);
  sky.matrix.translate(-.5, -.5, -.5);
  sky.render();

  var ground = new Cube();
  ground.color = [.7,.7,.7,1];
  if(g_normalOn) {
    ground.textureNum= -3;
  }
  ground.matrix.translate(-25, -1.99, -25);
  ground.matrix.scale(50,1,50);
  ground.render();

  var sphere = new Sphere();
  sphere.color = [1,1,1,1];
  if(g_normalOn) {
    sphere.textureNum= -3;
  }
  sphere.matrix.scale(.5,.5,.5);
  sphere.matrix.translate(3, -.5, -.5);
  sphere.render();

  // -----------------------------------------------------------------------------------
  var head = new Cube();
  head.color = [0.0,.85,0.7,1.0];
  head.matrix.translate(-.725, -.1, -.7);
  head.matrix.scale(.6,.45, .85);
  head.matrix.translate(0, g_idleYValHead, 0);
  head.render();

  //Bottom snout
  var snout = new Cube();
  snout.color = [0.25,.05,0.05,1.0];
  snout.matrix.translate(-.495, -.045, -.9);
  snout.matrix.scale(.14,.10, .85);
  snout.matrix.translate(0, g_idleYValHead*2, 0);
  snout.render();

  //Top snout
  var snout1 = new Cube();
  snout1.color = [0.25,.05,0.05,1.0];
  snout1.matrix.translate(-.525, -.02, -.9);
  snout1.matrix.rotate(-10,1,0,0);
  snout1.matrix.scale(.2,.10, .85);
  snout1.matrix.translate(0, g_idleYValHead*4, 0);
  snout1.render();

  var nose = new Cube();
  nose.color = [0.1,.015,0.05,1.0];
  nose.matrix.translate(-.47, 0.03, -.925);
  nose.matrix.rotate(-5,1,0,0);
  nose.matrix.scale(.09,.05, .1);
  nose.matrix.translate(0, g_idleYValHead*4, 0);
  nose.render();

  var eye1 = new TriPrism();
  eye1.color = [0.8,.8,0.8,1.0];
  eye1.matrix.translate(-.53, 0.13, -.73);
  eye1.matrix.rotate(30,0,0,1)
  eye1.matrix.rotate(6,1,0,0)
  eye1.matrix.scale(.032,.052, .05);
  eye1.render();

  var eye2 = new TriPrism();
  eye2.color = [0.8,.8,0.8,1.0];
  eye2.matrix.translate(-.345, 0.145, -.736);
  eye2.matrix.rotate(-30,0,0,1)
  eye2.matrix.rotate(10,1,0,0)
  eye2.matrix.scale(.032,.052, .05);
  eye2.render();

  //SNOUT UPWARD TRIANGLE
  var snout2 = new TriPrism();
  snout2.color = [0.25,.05,0.05,1.0];
  snout2.matrix.translate(-.525, .1, -.8);
  snout2.matrix.rotate(70,1,0,0);
  snout2.matrix.scale(.2,.26, .06);
  snout2.render();

  //SNOUT AT THE EYE AREA
  var snout6 = new TriPrism();
  snout6.color = [0.25,.05,0.05,1.0];
  snout6.matrix.translate(-.53, .105, -.75);
  snout6.matrix.rotate(25,1,0,0);
  snout6.matrix.rotate(38,0,0,1);
  snout6.matrix.scale(.06,.26, .06);
  snout6.render();

  var snout7 = new TriPrism();
  snout7.color = [0.25,.05,0.05,1.0];
  snout7.matrix.translate(-.405, .105, -.76);
  snout7.matrix.rotate(30,1,0,0);
  snout7.matrix.rotate(-38,0,0,1);
  snout7.matrix.scale(.079,.26, .06);
  snout7.render();

  //SNOUT UPWARD TRIANGLE2
  var snout4 = new TriPrism();
  snout4.color = [0.25,.05,0.05,1.0];
  snout4.matrix.translate(-.545, .02, -.8);
  snout4.matrix.rotate(40,1,0,0);
  snout4.matrix.rotate(40,0,1,0);
  snout4.matrix.rotate(40,0,0,1);
  snout4.matrix.scale(.12,.26, .06);
  snout4.render();

  //SNOUT UPWARD TRIANGLE2
  var snout5 = new TriPrism();
  snout5.color = [0.25,.05,0.05,1.0];
  snout5.matrix.translate(-.365, .12, -.8);
  snout5.matrix.rotate(40,1,0,0);
  snout5.matrix.rotate(-40,0,1,0);
  snout5.matrix.rotate(-40,0,0,1);
  snout5.matrix.scale(.12,.26, .06);
  snout5.render();

  //SNOUT GREEN FUR TRIANGLE
  var snout3 = new TriPrism();
  snout3.color = [0.0,.85,0.7,1.0];
  snout3.matrix.translate(-.5, .1, -.65);
  snout3.matrix.rotate(-110,1,0,0);
  snout3.matrix.scale(.15,.18, .06);
  snout3.render();

  //RED TRIANGLE
  var forehead = new TriPrism();
  forehead.color = [.8,.2,0.2,1.0];
  forehead.matrix.translate(-.473, .2, -.71);
  // snout3.matrix.rotate(180,1,0,0);
  forehead.matrix.scale(.1,.08,.08);
  forehead.render();
  var forehead2 = new TriPrism();
  forehead2.color = [0.0,.85,0.7,1.0];
  forehead2.matrix.translate(-.458, .21, -.711);
  // snout3.matrix.rotate(180,1,0,0);
  forehead2.matrix.scale(.07,.05,.08);
  forehead2.render();

  var body = new Cube();
  body.color = [0.0,.9,0.65,1.0];
  body.matrix.translate(-.865, -.32, -.4);
  body.matrix.scale(.9,.8, .85);
  body.matrix.translate(0, g_idleYVal, 0);
  body.render();

  var body1 = new Cube();
  body1.color = [0.0,.9,0.55,1.0];
  body1.matrix.translate(-.7, -.28, -.25);
  body1.matrix.scale(.8,.8, .85);
  body1.matrix.translate(0, g_idleYVal, 0);
  body1.render();

  var body2 = new Cube();
  body2.color = [0,.9,0.40,1];
  body2.matrix.translate(-.6, -.4, 0);
  body2.matrix.scale(.8,.7, .75);
  body2.matrix.translate(0, g_idleYVal, 0);
  body2.render();

  var body3 = new Cube();
  body3.color = [.2,.87,.3,1];
  body3.matrix.translate(-.35, -.55, .2);
  body3.matrix.scale(.7,.6, .65);
  body3.matrix.translate(0, g_idleYVal, 0);
  body3.render();

  var body4 = new Cube();
  body4.color = [.4,.87,.2,1];
  body4.matrix.translate(-.2, -.655, .25);
  body4.matrix.rotate(g_tailAngle,0, 1, 0);
  body4Coordinates = new Matrix4(body4.matrix);
  body4.matrix.scale(.6,.4, .65);
  body4.matrix.translate(0, g_idleYVal, 0);
  body4.render();

  var body5 = new Cube();
  body5.color = [.50,.9,.1,1];
  body5.matrix = body4Coordinates;
  body5.matrix.translate(.35, -.1, .1);
  body5Coordinates = new Matrix4(body5.matrix);
  body5.matrix.scale(.4,.3, .65);
  body5.matrix.translate(0, g_idleYVal, 0);
  body5.render();

  var body6 = new Cube();
  body6.color = [.65,.9,0,1];
  body6.matrix = body5Coordinates;
  body6.matrix.translate(.2, -.05, .1);
  body6.matrix.rotate(g_tailtipAngle,0, 1, 0);
  body6Coordinates = new Matrix4(body6.matrix);
  body6.matrix.scale(.3,.2, .5);
  body6.matrix.translate(0, g_idleYVal, 0);
  body6.render();

  var body7 = new Cube();
  body7.color = [.75,.9,0,1];
  body7.matrix = body6Coordinates;
  body7.matrix.translate(.1, -0.05, .05);
  body7Coordinates = new Matrix4(body7.matrix);
  body7.matrix.scale(.35,.125, .35);
  body7.matrix.translate(0, g_idleYVal, 0);
  body7.render();

  var body8 = new Cube();
  body8.color = [.8,.95,0,1];
  body8.matrix = body7Coordinates;
  body8.matrix.translate(.3, .1, .05);
  body8.matrix.rotate(g_tailtip2Angle,0, 1, 0);
  body8.matrix.scale(.17,.07, .25);
  body8.matrix.translate(0, g_idleYVal, 0);
  body8.render();

  
}