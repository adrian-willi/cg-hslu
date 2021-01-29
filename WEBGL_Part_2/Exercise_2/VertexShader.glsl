attribute vec2 aVertexPosition;

// BLOCK 2 - AUFGABE 2 (COLORING)
// attribute vec4 aVertexColor;
// varying vec4 fragColor;


// BLOCK 2 - AUFGABE 3 (TEXTURE MAPPING)
attribute vec2 aVertexTextureCoord;
varying vec2 vTextureCoord;

void main () {
    // BLOCK 2 - AUFGABE 2 (COLORING)
    // fragColor = aVertexColor;

    // an FragmentShader übergeben
    vTextureCoord = aVertexTextureCoord; // BLOCK 2 - AUFGABE 3 (TEXTURE MAPPING)
    
    gl_Position = vec4(aVertexPosition, 0, 1);
}