precision mediump float;
uniform vec4 uColor ;
varying vec4 vColor ;

void main() {
    gl_FragColor = vColor;

    // gl_FragColor = vColor; - BLOCK 2 - AUFGABE 2 (COLORING)

    // gl_FragColor = vec4(uColor); - BLOCK 2 - AUFGABE 1

    // gl_FragColor = vec4(1,1,0,0); - ursprünglich: Farbe wird im FragmentShader selbst festgelegt - BLOCK 1
}