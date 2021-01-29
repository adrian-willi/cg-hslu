
function WireFrameCube(gl, color) {

    function defineVertices(gl) {

        // define the vertices of the cube
        var vertices = [

            // X,   Y,   Z                      R,   G,   B

            // bottom
            -0.5,  0.5, -0.5,  /* V0 / 0 */   0.0, 0.0, 0.0,
            -0.5, -0.5, -0.5,  /* V1 / 1 */   1.0, 1.0, 1.0,
            0.5, -0.5, -0.5,  /* V2 / 2 */   0.0, 0.0, 0.0,
            0.5,  0.5, -0.5,  /* V3 / 3 */   1.0, 1.0, 1.0,

            // top
            0.5,  0.5,  0.5,  /* V4 / 4 */   0.0, 0.0, 0.0,
            -0.5,  0.5,  0.5,  /* V5 / 5 */   1.0, 1.0, 1.0,
            -0.5, -0.5,  0.5,  /* V6 / 6 */   0.0, 0.0, 0.0,
            0.5, -0.5,  0.5,  /* V7 / 7 */   1.0, 1.0, 1.0,

            // front
            -0.5, -0.5, -0.5,  /* V1 / 8 */   1.0, 1.0, 1.0,
            0.5, -0.5, -0.5,  /* V2 / 9 */   0.0, 0.0, 0.0,
            0.5, -0.5,  0.5,  /* V7 / 10 */  1.0, 1.0, 1.0,
            -0.5, -0.5,  0.5,  /* V6 / 11 */  0.0, 0.0, 0.0,

            // back
            -0.5,  0.5, -0.5,  /* V0 / 12 */  0.0, 0.0, 0.0,
            0.5,  0.5, -0.5,  /* V3 / 13 */  1.0, 1.0, 1.0,
            0.5,  0.5,  0.5,  /* V4 / 14 */  0.0, 0.0, 0.0,
            -0.5,  0.5,  0.5,  /* V5 / 15 */  1.0, 1.0, 1.0,

            // left
            -0.5,  0.5, -0.5,  /* V0 / 16 */  0.0, 0.0, 0.0,
            -0.5, -0.5, -0.5,  /* V1 / 17 */  1.0, 1.0, 1.0,
            -0.5, -0.5,  0.5,  /* V6 / 18 */  0.0, 0.0, 0.0,
            -0.5,  0.5,  0.5,  /* V5 / 19 */  1.0, 1.0, 1.0,

            // right
            0.5, -0.5, -0.5,  /* V2 / 20 */  0.0, 0.0, 0.0,
            0.5,  0.5, -0.5,  /* V3 / 21 */  1.0, 1.0, 1.0,
            0.5,  0.5,  0.5,  /* V4 / 22 */  0.0, 0.0, 0.0,
            0.5, -0.5,  0.5,  /* V7 / 23 */  1.0, 1.0, 1.0,
        ];

        var buffer  = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        return buffer;
    }


    function defineEdges(gl) {
        // define the edges for the cube, there are 12 edges in a cube
       var vertexIndices = [
            // bottom
            2, 1, 0,
            0, 3, 2,

            // top
            4, 5, 6,
            6, 7, 4,

            // front
            8, 9, 10,
            10, 11, 8,

            // back
            14, 13, 12,
            12, 15, 14,

            // left
            16, 17, 18,
            18, 19, 16,

            // right
            20, 21, 22,
            22, 23, 20,
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
            gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferVertices);
            gl.vertexAttribPointer(aVertexPositionId, 3, gl.FLOAT, false, 6 * Float32Array.BYTES_PER_ELEMENT, 0);
            gl.enableVertexAttribArray(aVertexPositionId);

            gl.vertexAttribPointer(aVertexColorId, 3, gl.FLOAT, false, 6 * Float32Array.BYTES_PER_ELEMENT, 3 * Float32Array.BYTES_PER_ELEMENT);
            gl.enableVertexAttribArray(aVertexColorId);

            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.bufferEdges);
            gl.drawElements(gl.TRIANGLES, 36 /* Anzahl Indices */ , gl.UNSIGNED_SHORT, 0);
        }
    }
}
