
precision mediump float;

// BLOCK 2 - AUFGABE 1
// vec4 für Farbe definieren - so kann Farbe im JS-Teil festgelegt werden
// uniform vec4 uColor;


// BLOCK 2 - AUFGABE 2 (COLORING)
// varying vec4 fragColor;

// BLOCK 2 - AUFGABE 3 (TEXTURE MAPPING)
varying vec2 vTextureCoord;
uniform sampler2D uSampler;


void main() {
    gl_FragColor = texture2D(uSampler, vTextureCoord);

    // gl_FragColor = fragColor; - BLOCK 2 - AUFGABE 2 (COLORING)

    // gl_FragColor = vec4(uColor); - BLOCK 2 - AUFGABE 1

    // gl_FragColor = vec4(1,1,0,0); - ursprünglich: Farbe wird im FragmentShader selbst festgelegt - BLOCK 1
}