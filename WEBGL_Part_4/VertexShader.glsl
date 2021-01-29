attribute vec3 aVertexPosition;
attribute vec4 aVertexColor;

uniform mat4 uProjMat;
uniform mat4 uViewMat;
uniform mat4 uWorldMat;

varying vec4 fragColor;

void main () {
    fragColor = vec4(aVertexColor);
    gl_Position = uProjMat * uViewMat * uWorldMat * vec4(aVertexPosition, 1);
}