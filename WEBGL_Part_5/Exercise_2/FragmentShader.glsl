precision mediump float;

varying vec3 fragColor;
varying vec2 vTexCoord;

uniform sampler2D uSampler;

uniform int uEnableTexture;

void main() {
    if(uEnableTexture == 0) {
        gl_FragColor = vec4(fragColor, 1.0);
    } else {
        gl_FragColor = texture2D(uSampler, vTexCoord);
    }
}