//
// Computer Graphics
//
// WebGL Exercises
//

// Register function to call after document has loaded
window.onload = startup;

// the gl object is saved globally
var gl;

// we keep all local parameters for the program in a single object
var ctx = {
    shaderProgram: -1, //wird unten wieder überschrieben
    aVertexPositionId: -1,
    // uColorId: -1 - Block 2 - Aufgabe 1
    // aVertexColorId: -1, Block 2 - Aufgabe 2
    aVertexTextureCoordId: -1,
    uSampler2DId: -1,
};

// we keep all the parameters for drawing a specific object together
var rectangleObject = {
    buffer: -1,
    // colorBuffer: -1, Block 2 - Aufgabe 2
    texBuffer: -1 // Block 2 - Aufgabe 3
};

/**
 * Startup function to be called when the body is loaded
 */
function startup() {
    "use strict";
    var canvas = document.getElementById("myCanvas");
    gl = createGLContext(canvas);
    initGL();
    draw();
}

/**
 * InitGL should contain the functionality that needs to be executed only once
 */
function initGL() {
    "use strict";
    ctx.shaderProgram = loadAndCompileShaders(gl, 'VertexShader.glsl', 'FragmentShader.glsl');
    setUpAttributesAndUniforms();
    setUpBuffers();

    // set the clear color here

    /**
     * BLOCK 1 - AUFGABE 1
     * Frage:
     * clearColor() only sets the color for the buffer, but doesn't actually do anything else.
     * clear() has to be called in order for the color to be painted.
     */

    /**
     * BLOCK 2 - AUFGABE 3 (TEXTURE MAPPING)
     *
     */
    loadTexture();

    //gl.clearColor(.2,.2,.2,1); //-> damit wird alles übermalen (erst wenn clear)
    gl.clearColor(0.8, 0.8, 0.8, 1.0);
    // add more necessary commands here
}

/**
 * Setup all the attribute and uniform variables
 */
function setUpAttributesAndUniforms(){
    "use strict";
    // finds the index of the variable in the program || überschreibt ctx.aVertexPositionId
    ctx.aVertexPositionId = gl.getAttribLocation(ctx.shaderProgram, "aVertexPosition");
    // ctx.uColorId = gl.getUniformLocation(ctx.shaderProgram, "uColor"); - Block 2 - Aufgabe 1

    // ctx.aVertexColorId = gl.getAttribLocation(ctx.shaderProgram, "aVertexColor"); Block 2 - Aufgabe 2

    /**
     * BLOCK 2 - AUFGABE 3 (TEXTURE MAPPING)
     */
    ctx.aVertexTextureCoordId = gl.getAttribLocation(ctx.shaderProgram, "aVertexTextureCoord");
    ctx.uSampler2DId = gl.getUniformLocation(ctx.shaderProgram, "uSampler");
}

// keep texture parameters in an object so we can mix textures and objects
var lennaTxt = {
    textureObj: {}
};


/**
 * Initialize a texture from an image
 * @param image the loaded image
 * @param textureObject WebGL Texture Object
 */
function initTexture(image, textureObject ) {
// create a new texture
    gl.bindTexture(gl.TEXTURE_2D, textureObject );
// set parameters for the texture
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true );
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA , gl.RGBA , gl.UNSIGNED_BYTE, image );
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR );
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST );
    gl.generateMipmap(gl.TEXTURE_2D);
// turn texture off again
    gl.bindTexture(gl.TEXTURE_2D, null );
}


/**
 * Load an image as a texture
 */
function loadTexture() {
    var image = new Image();
// create a texture object
    lennaTxt.textureObj = gl.createTexture();
    image.onload = function() {
        initTexture(image, lennaTxt.textureObj);
// make sure there is a redraw after the loading of the texture
        draw();
    };
// setting the src will trigger onload
    image.src = "lena.png";
}


/**
 * Setup the buffers to use. If more objects are needed this should be split in a file per object.
 */
function setUpBuffers(){
    "use strict";

    rectangleObject.buffer = gl.createBuffer();

    var vertices = [
        -0.5, 0.5,
        0.5,0.5,
        0.5,-0.5,
        -0.5,-0.5
    ]


    gl.bindBuffer(gl.ARRAY_BUFFER, rectangleObject.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);


    /** BLOCK 2 - AUFGABE 2/FRAGE:
     The pixel coloring between the vertices is done by interpolating
     the vertices colors and thus, generate a gradient.
     rectangleObject.colorBuffer = gl.createBuffer();
     var vertices_colors = [
     1.0, 0.0, 0.0, 1.0,
     0.0, 1.0, 0.0, 1.0,
     0.0, 0.0, 1.0, 1.0,
     0.0, 0.0, 0.0, 1.0,
     ];
     gl.bindBuffer(gl.ARRAY_BUFFER, rectangleObject.colorBuffer);
     gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices_colors), gl.STATIC_DRAW);
     */


    // BLOCK 2 - AUFGABE 3 (TEXTURE MAPPING)
    // Texture Coordinate Setup
    rectangleObject.texBuffer = gl.createBuffer();

    var texCoords = [
        0.0, 1.0,
        1.0, 1.0,
        1.0, 0.0,
        0.0, .0
    ];

    gl.bindBuffer(gl.ARRAY_BUFFER, rectangleObject.texBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoords), gl.STATIC_DRAW);

}

/**
 * Draw the scene.
 */
function draw() {
    "use strict";
    console.log("Drawing");
    gl.clear(gl.COLOR_BUFFER_BIT);
    // add drawing routines here



    gl.bindBuffer(gl.ARRAY_BUFFER, rectangleObject.buffer);
    gl.vertexAttribPointer(ctx.aVertexPositionId, 2, gl.FLOAT, false, 0,0);
    gl.enableVertexAttribArray(ctx.aVertexPositionId);


    /**
     * BLOCK 2 - AUFGABE 3 (TEXTURE MAPPING)
     */
    gl.bindBuffer(gl.ARRAY_BUFFER, rectangleObject.texBuffer);
    gl.vertexAttribPointer(ctx.aVertexTextureCoordId, 2, gl.FLOAT, false, 0,0);
    gl.enableVertexAttribArray(ctx.aVertexTextureCoordId);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, lennaTxt.textureObj);
    gl.uniform1i(ctx.uSampler2DId, 0);


    /**
     * BLOCK 2 - AUFGABE 2 (COLORING)
     *
     * gl.bindBuffer(gl.ARRAY_BUFFER, rectangleObject.colorBuffer);
     * gl.vertexAttribPointer(ctx.aVertexColorId, 4, gl.FLOAT, false, 0,0);
     * gl.enableVertexAttribArray(ctx.aVertexColorId);
     * /
     /**
     * BLOCK 2 - AUFGABE 1
     * Farbe des Rechteckes kann nun hier im JS definiert werden
     *
     * gl.uniform4f(ctx.uColorId, 0.8, 0.6, 0.8, 1.0);
     * /
     /**
     * BLOCK 1 - AUFGABE 3
     * Anstelle von gl.LINE_LOOP muss gl.TRIANGLE_FAN übergeben werden, dann erhalten wir ein ausgemalenes Rechteck
     */
    gl.drawArrays(gl.TRIANGLE_FAN, 0,4);
    console.log("done");
}