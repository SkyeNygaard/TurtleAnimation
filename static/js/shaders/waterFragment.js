const waterFragmentShader = `
uniform float time;
varying vec2 vUv;

void main() {
    vec2 uv = vUv;
    
    // Create murky water effect
    float noise = fract(sin(dot(uv, vec2(12.9898, 78.233))) * 43758.5453);
    
    vec3 waterColor = vec3(0.0, 0.1, 0.2);
    vec3 murkColor = vec3(0.05, 0.07, 0.1);
    
    float murk = smoothstep(0.0, 1.0, noise + sin(time * 0.5) * 0.5);
    vec3 finalColor = mix(waterColor, murkColor, murk);
    
    gl_FragColor = vec4(finalColor, 0.9);
}
`;

export default waterFragmentShader;
