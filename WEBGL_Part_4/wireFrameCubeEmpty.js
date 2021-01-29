/**
 *
 * Define a wire frame cube with methods for drawing it.
 *
 * @param gl
 * @param color the color of the cube
 * @returns object with draw method
 * @constructor
 */
function WireFrameCube(gl, color) {
    function defineVertices(gl) {
        // define the vertices of the cube
        var vertices = [
            // X,   Y,   Z
            // BACK
            -0.5,  0.5, -0.5,  // V0 / 0
            -0.5, -0.5, -0.5,  // V1 / 1
            0.5, -0.5, -0.5,  // V2 / 2
            0.5,  0.5, -0.5,  // V3 / 3

            // FRONT
            0.5,  0.5,  0.5,  // V4 / 4
            -0.5,  0.5,  0.5,  // V5 / 5
            -0.5, -0.5,  0.5,  // V6 / 6
            0.5, -0.5,  0.5,  // V7 / 7

            // BOTTOM
            -0.5, -0.5, -0.5,  // V1 / 8
            0.5, -0.5, -0.5,  // V2 / 9
            0.5, -0.5,  0.5,  // V7 / 10
            -0.5, -0.5,  0.5,  // V6 / 11

            // TOP
            -0.5,  0.5, -0.5,  // V0 / 12
            0.5,  0.5, -0.5,  // V3 / 13
            0.5,  0.5,  0.5,  // V4 / 14
            -0.5,  0.5,  0.5,  // V5 / 15

            // LEFT
            -0.5,  0.5, -0.5,  // V0 / 16
            -0.5, -0.5, -0.5,  // V1 / 17
            -0.5, -0.5,  0.5,  // V6 / 18
            -0.5,  0.5,  0.5,  // V5 / 19

            // right
            0.5, -0.5, -0.5,  // V2 / 20
            0.5,  0.5, -0.5,  // V3 / 21
            0.5,  0.5,  0.5,  // V4 / 22
            0.5, -0.5,  0.5,  // V7 / 23
        ];

        var buffer  = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        return buffer;
    }


    function defineEdges(gl) {
        // define the edges for the cube, there are 12 edges in a cube
        var vertexIndices = [
            // BACK
            0, 1,
            1, 2,
            2, 3,
            3, 0,

            // FRONT
            4, 5,
            5, 6,
            6, 7,
            7, 4,

            // BOTTOM
            8, 9,
            9, 10,
            10, 11,
            11, 8,

            // TOP
            12, 13,
            13, 14,
            14, 15,
            15, 12,

            // LEFT
            16, 17,
            17, 18,
            18, 19,
            19, 16,

            // RIGHT
            20, 21,
            21, 22,
            22, 23,
            23, 20,
        ];
        var buffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(vertexIndices), gl.STATIC_DRAW);
        return buffer;
    }

    return {
        bufferVertices: defineVertices(gl),
        bufferEdges: defineEdges(gl),
        color: color,

        draw: function(gl, aVertexPositionId, aVertexColorId) {
            var colorBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.color), gl.STATIC_DRAW);
            gl.vertexAttribPointer(aVertexColorId, 4, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(aVertexColorId);

            gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferVertices);
            gl.vertexAttribPointer(aVertexPositionId, 3, gl.FLOAT, false, 3 * Float32Array.BYTES_PER_ELEMENT, 0);
            gl.enableVertexAttribArray(aVertexPositionId);

            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.bufferEdges);
            gl.drawElements(gl.LINES, 48 /* Anzahl Indices */ , gl.UNSIGNED_SHORT, 0);
        }
    }
}
