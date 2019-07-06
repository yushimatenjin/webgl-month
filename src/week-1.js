import vShaderSource from './shaders/vertex.glsl';
import fShaderSource from './shaders/fragment.glsl';

import { createRect } from './shape-helpers';


const canvas = document.querySelector('canvas');
const gl = canvas.getContext('webgl');

const program = gl.createProgram();

const vertexShader = gl.createShader(gl.VERTEX_SHADER);
const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

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

const positionLocation = gl.getAttribLocation(program, 'position');
const colorLocation = gl.getAttribLocation(program, 'color');

const resolutionUniformLocation = gl.getUniformLocation(program, 'resolution');

gl.uniform2fv(resolutionUniformLocation, [canvas.width, canvas.height]);

const rainbowColors = [
    [255, 0.0, 0.0, 255], // red
    [255, 165, 0.0, 255], // orange
    [255, 255, 0.0, 255], // yellow
    [0.0, 255, 0.0, 255], // green
    [0.0, 101, 255, 255], // skyblue
    [0.0, 0.0, 255, 255], // blue,
    [128, 0.0, 128, 255], // purple
];

const triangles = createRect(0, 0, canvas.height, canvas.height);

function fillWithColors(segmentsCount) {
    const colors = [];

    for (let i = 0; i < segmentsCount; i++) {
        for (let j = 0; j < 3; j++) {
            colors.push(...rainbowColors[i]);
        }
    }

    return colors;
}

const vertexData = new Float32Array(triangles);
const vertexBuffer = gl.createBuffer(gl.ARRAY_BUFFER);

const indexBuffer = gl.createBuffer(gl.ARRAY_BUFFER);

const indexData = new Uint8Array([
    0, 1, 2, // first triangle
    1, 2, 3, // second trianlge
]);

gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indexData, gl.STATIC_DRAW);

gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
gl.bufferData(gl.ARRAY_BUFFER, vertexData, gl.STATIC_DRAW);
gl.lineWidth(10);

const attributeSize = 2;
const type = gl.FLOAT;
const nomralized = false;
const stride = 0;
const offset = 0;

gl.enableVertexAttribArray(positionLocation);
gl.vertexAttribPointer(positionLocation, attributeSize, type, nomralized, stride, offset);

// gl.enableVertexAttribArray(colorLocation);
// gl.vertexAttribPointer(colorLocation, 4, type, nomralized, stride, 8);

gl.drawElements(gl.TRIANGLES, indexData.length, gl.UNSIGNED_BYTE, 0);
