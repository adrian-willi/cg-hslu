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
    aVertexColorId: -1,
    aVertexTexCoordId: -1,
    uProjMatId: -1,
    uViewMatId: -1,
    uWorldMatId: -1,
    uSamplerId: -1,
    uEnableTextureId: -1,
};

// we keep all the parameters for drawing a specific object together
var cubes = {
    wireFrameCube: -1,
};

var lennaTex = {
    texture: {},
};

var canvas;

/**
 * Startup function to be called when the body is loaded
 */
function startup() {
    "use strict";
    canvas = document.getElementById("myCanvas");
    gl = createGLContext(canvas);
    initGL();
    loadTexture();
}

/**
 * InitGL should contain the functionality that needs to be executed only once
 */
function initGL() {
    "use strict";
    ctx.shaderProgram = loadAndCompileShaders(gl, 'VertexShader.glsl', 'FragmentShader.glsl');

    gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    gl.frontFace(gl.CCW);
    gl.cullFace(gl.BACK);

    setUpAttributesAndUniforms();
    setUpBuffers();
    loadTexture();

    // set the clear color here
    // NOTE(TF) Aufgabe 1 / Frage:
    //     clearColor() only sets the color for the buffer, but doesn't actually do anything else.
    //     clear() has to be called in order for the color to be painted.
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
    ctx.aVertexColorId = gl.getAttribLocation(ctx.shaderProgram, "aVertexColor");
    ctx.aVertexTexCoordId = gl.getAttribLocation(ctx.shaderProgram, "aVertexTexCoord");

    ctx.uProjMatId = gl.getUniformLocation(ctx.shaderProgram, "uProjMat");
    ctx.uViewMatId = gl.getUniformLocation(ctx.shaderProgram, "uViewMat");
    ctx.uWorldMatId = gl.getUniformLocation(ctx.shaderProgram, "uWorldMat");

    ctx.uSamplerId = gl.getUniformLocation(ctx.shaderProgram, "uSampler");
    ctx.uEnableTextureId = gl.getUniformLocation(ctx.shaderProgram, "uEnableTexture");
}

function loadTexture() {
    var image = new Image();
    lennaTex.texture = gl.createTexture();
    image.onload = function() {
        gl.bindTexture(gl.TEXTURE_2D, lennaTex.texture);

        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        //gl.generateMipmap(gl.TEXTURE_2D);
        gl.bindTexture(gl.TEXTURE_2D, null);

        draw();
    };
    image.src = "tp.jpg";
}

/**
 * Setup the buffers to use. If more objects are needed this should be split in a file per object.
 */
function setUpBuffers(){
    "use strict";

    cubes.wireFrameCube = WireFrameCube(gl, [0.0, 0.0, 1.0, 0.5]);

    var viewMat = mat4.create();
    mat4.lookAt(
        viewMat,
        [0, -5, 0], // eye
        [0, 2, 0], // fovy / center
        [0, 0, 1], // up
    );

    var projMat = mat4.create();
    mat4.perspective(
        projMat,
        glMatrix.toRadian(45), // fovy
        canvas.clientWidth / canvas.clientHeight,  // aspect
        0.1, // near
        1000, // far
    );

    // set matrices for vertex shader
    gl.uniformMatrix4fv(ctx.uViewMatId, false, viewMat);
    gl.uniformMatrix4fv(ctx.uProjMatId, false, projMat);
}

/**
 * Draw the scene.
 */
function draw() {
    "use strict";
    console.log("Drawing");

    var worldMat = new Float32Array(16);
    var identityMatrix = new Float32Array(16);
    var xRotation = new Float32Array(16);
    var zRotation = new Float32Array(16);

    mat4.identity(worldMat);
    mat4.identity(identityMatrix);
    mat4.identity(xRotation)
    mat4.identity(zRotation)

    gl.uniform1i(ctx.uEnableTextureId, 1);
    gl.uniform1i(ctx.uSamplerId, 0);

    var angle;
    var loop = function() {
        angle = performance.now() / 1000 / 6 * 2 * Math.PI;

        // rotate
        mat4.rotate(xRotation, identityMatrix, angle, [0, 0, 1]);
        mat4.rotate(zRotation, identityMatrix, angle / 4, [1, 0, 0]);
        mat4.mul(worldMat, xRotation, zRotation);

        gl.uniformMatrix4fv(ctx.uWorldMatId, false, worldMat);

        gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);

        gl.bindTexture(gl.TEXTURE_2D, lennaTex.texture);
        gl.activeTexture(gl.TEXTURE0);

        cubes.wireFrameCube.draw(gl, ctx.aVertexPositionId, ctx.aVertexColorId, ctx.aVertexTexCoordId);

        requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
    console.log("done");
}
