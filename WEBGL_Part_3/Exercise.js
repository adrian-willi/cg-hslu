//
// DI Computer Graphics
//
// WebGL Exercises
//

// Call startup function on windows onload
window.onload = startup;



// Variable of gl
var gl;



// Variable for the random color generation
var COUNTER = 0;
var COLORS = generateRandomColors()



// Variable for the context
var ctx = {
    shaderProgram: -1,
    aVertexPositionId: -1,
    uColorId: -1,

    uProjectionMatId: -1,
    uModelMatId: -1,
};



// Variable for the rectangle
var rectangleObject = {
    buffer: -1
};



// Key Handling
var key = {
    _pressed: {},

    // Right Player
    UP: 38, // Up
    DOWN: 40, // Down

    // Left Player
    W: 87, // Up
    S: 83, // Down
};



var dimensions = {
    xAxesPlayerSize: 20,
    yAxesPlayerSize: 100,

    xAxesPlayerPosition: 350,
    yAxesPlayerPosition: 0
};



// Variable for the player on the left
var playerLeft = {
    position : [-(dimensions.xAxesPlayerPosition), dimensions.yAxesPlayerPosition],
    size: [dimensions.xAxesPlayerSize, dimensions.yAxesPlayerSize],
    points: 0
};


// Variable for the player on the right
var playerRight = {
    position : [dimensions.xAxesPlayerPosition, dimensions.yAxesPlayerPosition],
    size: [dimensions.xAxesPlayerSize, dimensions.yAxesPlayerSize],
    points: 0
};



// Variable for the middle line
var middle = {
    position : [0, 0],
    size: [1, 600]
};



// Variable for the ball
var ball = {
    position : [0, 0],
    size: [16, 16],
    movement: [3, 2]
}



// Variable to store positions and movements
var gameObjectForces = {
    playerMovement: 5,
    playerBorderPosition : 250, // (canvasHeight - playerObjectHeight) / 2
    playerThresholdPosition : 245, // playerBorderPosition - playerMovement

    ballThresholdRange1: 329, // (playerPositionX - (playerSizeX / 2)) - (ballSizeX / 2) - (ballMovementX)
    ballThresholdRange2: 332, // ((playerPositionX - (playerSizeX / 2)) - (ballSizeX / 2))


    gameBorder : 400 // canvasWidth / 2

};



/**
 * Startup function to be called when the body is loaded
 */
function startup() {
    "use strict";
    var canvas = document.getElementById("myCanvas");

    document.getElementById("pointsPlayerLeft").innerHTML = playerLeft.points.toString();
    document.getElementById("pointsPlayerRight").innerText = playerRight.points.toString();

    gl = createGLContext(canvas);
    initGL();
    window.addEventListener('keyup', onKeyup, false);
    window.addEventListener('keydown', onKeydown, false);

    // function with draw() as a callback function
    requestAnimationFrame(draw)
}

/**
 * InitGL should contain the functionality that needs to be executed only once
 */
function initGL() {
    "use strict";
    ctx.shaderProgram = loadAndCompileShaders(gl, 'VertexShader.glsl', 'FragmentShader.glsl');
    setUpAttributesAndUniforms();
    setUpBuffers();

    // function to set up the game environment
    setUpGameEnvironment();
    
    gl.clearColor(0.1, 0.1, 0.1, 1);
}

/**
 * Function to set up the game environment
 */
function setUpGameEnvironment(){
    var projectioMat = mat3.create();

    mat3.fromScaling(projectioMat, [2.0 / gl.drawingBufferWidth, 2.0 / gl.drawingBufferHeight])
    gl.uniformMatrix3fv(ctx.uProjectionMatId, false, projectioMat);
}


/**
 * Function to set up attributes and uniforms
 */
function setUpAttributesAndUniforms(){
    "use strict";
    ctx.aVertexPositionId = gl.getAttribLocation(ctx.shaderProgram, "aVertexPosition");
    ctx.uColorId = gl.getUniformLocation(ctx.shaderProgram, "uColor");

    ctx.uProjectionMatId = gl.getUniformLocation(ctx.shaderProgram, "uProjectionMat");
    ctx.uModelMatId = gl.getUniformLocation(ctx.shaderProgram, "uModelMat");
}

/**
 * Function to set up the buffers
 */
function setUpBuffers(){
    "use strict";
    rectangleObject.buffer = gl.createBuffer();
    var vertices = [
        -0.5, -0.5,
        0.5, -0.5,
        0.5, 0.5,
        -0.5, 0.5];
    gl.bindBuffer(gl.ARRAY_BUFFER, rectangleObject.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
}

/**
 * Function to draw the game scene
 */
function draw() {
    "use strict";
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.bindBuffer(gl.ARRAY_BUFFER, rectangleObject.buffer);
    gl.vertexAttribPointer(ctx.aVertexPositionId, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(ctx.aVertexPositionId);


    if(COUNTER % 50 == 0) {
        COLORS = generateRandomColors();
    }

    COUNTER++;

    gl.uniform4f(ctx.uColorId, COLORS[0], COLORS[1], COLORS[2], 1);


    /**
     * Section to define the behaviour of the players
     */

    // Movement of the right player
    if(isDown(key.UP)){
        playerRight.position[1] < gameObjectForces.playerThresholdPosition ? playerRight.position[1] += gameObjectForces.playerMovement: playerRight.position[1] = gameObjectForces.playerBorderPosition;
    }

    if(isDown(key.DOWN)){
        playerRight.position[1] > -(gameObjectForces.playerThresholdPosition) ? playerRight.position[1] -= gameObjectForces.playerMovement : playerRight.position[1] = -(gameObjectForces.playerBorderPosition);
    }

    // Movement of the left player
    if (isDown(key.W)){
        playerLeft.position[1] < gameObjectForces.playerThresholdPosition ? playerLeft.position[1] += gameObjectForces.playerMovement : playerLeft.position[1] = gameObjectForces.playerBorderPosition;
    }

    if(isDown(key.S)){
        playerLeft.position[1] > -(gameObjectForces.playerThresholdPosition) ? playerLeft.position[1] -= gameObjectForces.playerMovement : playerLeft.position[1] = -(gameObjectForces.playerBorderPosition);
    }


    /**
     * Section to define the behaviour of the ball
     */

    // Collision on the right side
    if (ball.position[0] > gameObjectForces.ballThresholdRange1 && ball.position[0] < gameObjectForces.ballThresholdRange2) {
        if (ball.position[1] < playerRight.position[1] + 50 && ball.position[1] > playerRight.position[1] - 50) {
            ball.movement[0] *= -1;
        }
    }

    // Collision on the left side
    if (ball.position[0] < -(gameObjectForces.ballThresholdRange1) && ball.position[0] > -(gameObjectForces.ballThresholdRange2)) {
        console.log(playerRight.position[0])
        console.log(ball.position[0])
        if (ball.position[1] < playerLeft.position[1] + 50 && ball.position[1] > playerLeft.position[1] - 50) {
            ball.movement[0] *= -1;
        }
    }

    // Ball outside the field
    if (ball.position[0] > gameObjectForces.gameBorder) {
        ball.position[0] = 0;
        ball.position[1] = 0;

        playerLeft.points++;
        document.getElementById("pointsPlayerLeft").innerHTML = playerLeft.points.toString();
    }

    if (ball.position[0] < -(gameObjectForces.gameBorder)) {
        ball.position[0] = 0;
        ball.position[1] = 0;

        playerRight.points++;
        document.getElementById("pointsPlayerRight").innerHTML = playerRight.points.toString();
    }

    if (Math.abs(ball.position[1]) >= 292) {
        ball.movement[1] *= -1;
    }

    ball.position[0] += ball.movement[0];
    ball.position[1] += ball.movement[1];


    drawGameElement(playerLeft);
    drawGameElement(playerRight);
    drawGameElement(middle);
    drawGameElement(ball);

    requestAnimationFrame(draw);

}



/**
 * Function to draw the rectangles
 */
function drawGameElement(gameElement) {
    var modelMat = mat3.create();
    mat3.fromTranslation(modelMat, gameElement.position);
    mat3.scale(modelMat, modelMat, gameElement.size);
    gl.uniformMatrix3fv(ctx.uModelMatId, false, modelMat);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
}



/**
 * Function to generate random colors
 */
function generateRandomColors() {
    x = Math.random() * (1 - 0.2) + 0.1;
    y = Math.random() * (1 - 0.2) + 0.1;
    z = Math.random() * (1 - 0.2) + 0.1;
    return [x, y, z];
}




/**
 * Event handling for interacting with keyboard
 */
function isDown (keyCode) {
    return key._pressed[keyCode];
}

function onKeydown(event) {
    key._pressed[event.keyCode] = true;
}

function onKeyup(event) {
    delete key._pressed[event.keyCode];
}




