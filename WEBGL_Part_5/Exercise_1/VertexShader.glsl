attribute vec3 aVertexPosition;
attribute vec3 aVertexColor;

uniform mat4 uProjMat;
uniform mat4 uViewMat;
uniform mat4 uWorldMat;

varying vec3 fragColor;


void main () {
    fragColor = aVertexColor;
    gl_Position = uProjMat * uViewMat * uWorldMat * vec4(aVertexPosition, 1);
}