const canvas = document.querySelector('canvas');
const gl = canvas.getContext('webgl');

const program = gl.createProgram();

const vertexShader = gl.createShader(gl.VERTEX_SHADER);
const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

const vShaderSource = `
attribute vec2 position;
uniform float width;

#define M_PI 3.1415926535897932384626433832795

void main() {
    gl_PointSize = 2.0;
    gl_Position = vec4(position.x, cos(position.y * M_PI), 0, 1);
}
`;

const fShaderSource = `
    void main() {
        gl_FragColor = vec4(1, 0, 0, 1);
    }
`;

function compileShader(shader, source) {
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    const log = gl.getShaderInfoLog(shader);

    if (log) {
        throw new Error(log);
    }
}

compileShader(vertexShader, vShaderSource);
compileShader(fragmentShader, fShaderSource);

gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);

gl.linkProgram(program);

gl.useProgram(program);

const positionPointer = gl.getAttribLocation(program, 'position');
const widthUniformLocation = gl.getUniformLocation(program, 'width');

gl.uniform1f(widthUniformLocation, canvas.width);

const points = [];

for (let i = 0; i < canvas.width; i++) {
    const x = i / canvas.width * 2 - 1;
    points.push(x, x);
}

const positionData = new Float32Array(points);

const positionBuffer = gl.createBuffer(gl.ARRAY_BUFFER);

gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bufferData(gl.ARRAY_BUFFER, positionData, gl.STATIC_DRAW);

const attributeSize = 2;
const type = gl.FLOAT;
const nomralized = false;
const stride = 0;
const offset = 0;

gl.enableVertexAttribArray(positionPointer);
gl.vertexAttribPointer(positionPointer, attributeSize, type, nomralized, stride, offset);

gl.drawArrays(gl.POINTS, 0, positionData.length / 2);
