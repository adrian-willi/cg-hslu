attribute vec3 aVertexPosition;
attribute vec3 aVertexColor;
attribute vec2 aVertexTexCoord;

uniform mat4 uProjMat;
uniform mat4 uViewMat;
uniform mat4 uWorldMat;

varying vec3 fragColor;
varying vec2 vTexCoord;

void main () {
    fragColor = aVertexColor;
    vTexCoord = aVertexTexCoord;
    gl_Position = uProjMat * uViewMat * uWorldMat * vec4(aVertexPosition, 1);
}