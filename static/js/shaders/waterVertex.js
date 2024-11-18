const waterVertexShader = `
varying vec2 vUv;
uniform float time;

void main() {
    vUv = uv;
    vec3 pos = position;
    
    float amp = 0.5;
    float freq = 0.5;
    pos.y += sin(pos.x * freq + time) * amp;
    pos.y += sin(pos.z * freq + time) * amp;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
`;

export default waterVertexShader;
