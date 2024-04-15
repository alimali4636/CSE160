// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE = ` 
  attribute vec4 a_Position;
  uniform float u_Size;
  void main() {
    gl_Position = a_Position;
    gl_PointSize = u_Size;
  }`

// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;
  uniform vec4 u_FragColor;
  void main() {
    gl_FragColor = u_FragColor;
  }`

  // Global Variables
  let canvas;
  let gl;
  let a_Position;
  let u_FragColor;
  let u_Size;

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
    // For opacity
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  }

  function connectVariablesToGLSL(){
     // Initialize shaders
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
      console.log('Failed to intialize shaders.');
      return;
    }

    // // Get the storage location of a_Position
    a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
      console.log('Failed to get the storage location of a_Position');
      return;
    }

    // Get the storage location of u_FragColor
    u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
    if (!u_FragColor) {
      console.log('Failed to get the storage location of u_FragColor');
      return;
    }

    // Get the storage location of u_FragColor
    u_Size = gl.getUniformLocation(gl.program, 'u_Size');
    if (!u_Size) {
      console.log('Failed to get the storage location of u_Size');
      return;
    }
  }
  // Constants
  const POINT = 0;
  const TRIANGLE = 1;
  const CIRCLE = 2;

  // UI Globals
  let g_selectedColor = [1.0, 1.0, 1.0, 1.0];
  let g_selectedOpacity = 1.0;
  let g_selectedSize = 5;
  let g_selectedSegment = 10;
  let g_selectedType = POINT;
  let drawingTriangles = [
    //reds
    { vertices: [-0.4, 0.0, .4, 0.0, 0.0, 0.2], color: [1.0, 0.0, 0.0, 1.0] },
    { vertices: [-0.4, 0.0, .4, 0.0, 0.0, -0.2], color: [1.0, 0.0, 0.0, 1.0] },
    { vertices: [-0.15, 0.0, -.2, 0.0, -.15, 0.05], color: [0.0, 0.0, 0.0, 1.0] },
    { vertices: [-0.15, 0.05, -.2, 0.05, -.2, 0.0], color: [0.0, 0.0, 0.0, 1.0] },
    { vertices: [0.15, 0.0, .2, 0.0, .15, 0.05], color: [0.0, 0.0, 0.0, 1.0] },
    { vertices: [0.15, 0.05, .2, 0.05, .2, 0.0], color: [0.0, 0.0, 0.0, 1.0] },
    { vertices: [0.2, -0.1, .2, -.2, .25, -0.1], color: [1.0, 0.0, 0.0, 1.0] },
    { vertices: [0.3, -0.05, .4, -.05, .3, -0.2], color: [1.0, 0.0, 0.0, 1.0] },
    { vertices: [-0.2, -0.1, -.2, -.2, -.25, -0.1], color: [1.0, 0.0, 0.0, 1.0] },
    { vertices: [-0.3, -0.05, -.4, -.05, -.3, -0.2], color: [1.0, 0.0, 0.0, 1.0] },
    { vertices: [-0.4, 0.0, -.35, .025, -.5, .15], color: [1.0, 0.0, 0.0, 1.0] },
    { vertices: [-0.3, -0.025, -.5, .15, -.45, 0.2], color: [1.0, 0.0, 0.0, 1.0] },
    { vertices: [0.4, 0.0, .35, .025, .5, .15], color: [1.0, 0.0, 0.0, 1.0] },
    { vertices: [0.3, -0.025, .5, .15, .45, 0.2], color: [1.0, 0.0, 0.0, 1.0] },
    { vertices: [-0.6, 0.0, -.8, .2, -.45, 0.15], color: [1.0, 0.0, 0.0, 1.0] },
    { vertices: [-0.425, 0.15, -.4, .4, -.6, 0.4], color: [1.0, 0.0, 0.0, 1.0] },
    { vertices: [0.6, 0.0, .8, .2, .45, 0.15], color: [1.0, 0.0, 0.0, 1.0] },
    { vertices: [0.425, 0.15, .4, .4, .6, 0.4], color: [1.0, 0.0, 0.0, 1.0] },
    { vertices: [-0.07, -0.05, .07, -0.05, 0.0, -0.1], color: [0.0, 0.0, 0.0, 1.0] },
    { vertices: [-1.0, -0.2, 1.0, -.2, -1.0, -1.0], color: [1.0, 0.8, 0.0, 1.0] },
    { vertices: [1.0, -0.2, -1.0, -1.0, 1.0, -1.0], color: [1.0, 0.8, 0.0, 1.0] },
    
  ];

  // Set up actions for HTML UI elements
  function addActionsForHTMLUI(){

    //Button Events
    document.getElementById('clearButton').onclick = function() {g_shapesList=[]; renderAllShapes();};
    document.getElementById('pointButton').onclick = function() {g_selectedType = POINT};
    document.getElementById('triangleButton').onclick = function() {g_selectedType = TRIANGLE};
    document.getElementById('circleButton').onclick = function() {g_selectedType = CIRCLE};
    document.getElementById('drawingButton').onclick = displayDrawing;

    //Color Slider Events
    document.getElementById('redSlide').addEventListener('mouseup', function() {g_selectedColor[0] = this.value/100; });
    document.getElementById('greenSlide').addEventListener('mouseup', function() {g_selectedColor[1] = this.value/100; });
    document.getElementById('blueSlide').addEventListener('mouseup', function() {g_selectedColor[2] = this.value/100; });
    document.getElementById('opacitySlide').addEventListener('mouseup', function() {g_selectedOpacity = this.value / 100; });

    //Size Slider Events
    document.getElementById('sizeSlide').addEventListener('mouseup', function() {g_selectedSize = this.value; });
    document.getElementById('segmentSlide').addEventListener('mouseup', function() {g_selectedSegment = this.value; });
  }

function main() {

  setupWebGL();

  connectVariablesToGLSL();

  addActionsForHTMLUI()

  // Register function (event handler) to be called on a mouse press
  canvas.onmousedown = click;
  canvas.onmousemove = function(ev) { if(ev.buttons == 1) { click(ev) } };

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);
}


var g_shapesList = [];

// var g_points = [];  // The array to store the position of a mouse press
// var g_colors = [];  // The array to store the color of a point
// var g_sizes = [];   // The array to store the size of a point

function click(ev) {

  // Extract the event click and return it in WebGL coordinates
  let [x,y] = convertCoordinatesToGL(ev);

  let point;
  if (g_selectedType == POINT) {
    point = new Point();
  } else if (g_selectedType == TRIANGLE){
    point = new Triangle();
  } else{
    point = new Circle();
  }
  
  point.position = [x,y];
  point.color = [g_selectedColor[0], g_selectedColor[1], g_selectedColor[2], g_selectedOpacity];
  point.size = g_selectedSize;
  point.segments = g_selectedSegment;
  g_shapesList.push(point);

  // // Store the coordinates to g_points array
  // g_points.push([x, y]);

  // // Store the coordinates to g_colors array
  // g_colors.push(g_selectedColor.slice());

  // // Store the coordinates to g_colors array
  // g_sizes.push(g_selectedSize);

  // if (x >= 0.0 && y >= 0.0) {      // First quadrant
  //   g_colors.push([1.0, 0.0, 0.0, 1.0]);  // Red
  // } else if (x < 0.0 && y < 0.0) { // Third quadrant
  //   g_colors.push([0.0, 1.0, 0.0, 1.0]);  // Green
  // } else {                         // Others
  //   g_colors.push([1.0, 1.0, 1.0, 1.0]);  // White
  // }

  // Draw every shape that is supposed to be in the canvas
  renderAllShapes();
}

// Extract the event click and return it in WebGL coordinates
function convertCoordinatesToGL(ev){
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var rect = ev.target.getBoundingClientRect();

  x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

  return([x,y]);
}

function renderAllShapes(){
  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  // var len = g_points.length;
  var len = g_shapesList.length;

  for(var i = 0; i < len; i++) {
    g_shapesList[i].render();
  }
}

function displayDrawing() {
  g_shapesList = [];
  g_shapesList = []; // Optionally clear existing shapes
  for (let i = 0; i < drawingTriangles.length; i++) {
    drawTriangle(drawingTriangles[i].vertices, drawingTriangles[i].color);
  }
}

function drawTriangle(vertices, color) {
  const vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_Position);
  gl.uniform4f(u_FragColor, color[0], color[1], color[2], color[3]);
  gl.drawArrays(gl.TRIANGLES, 0, 3);
}