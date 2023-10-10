export const fs = `
precision highp float; 
#define pi 3.1415926535
uniform vec2 u_resolution;
uniform float u_time;
varying vec2 vUv;
void main() { 
	gl_FragColor = vec4(0.5, 0.1, 0.04, 1.0);
}
	`;
export const vs = `
precision highp float; 
varying vec2 vUv;
void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectionPosition = projectionMatrix * viewPosition;
    gl_Position = projectionPosition;
    vUv = uv;
}
`;

export const defaultFrag = `
precision highp float; 
#define pi 3.1415926535
uniform vec2 u_resolution;
uniform float u_time;
varying vec2 vUv;
vec3 inverseColor(vec3 inputColor) {
    return vec3(1.0 - inputColor.r, 1.0 - inputColor.g, 1.0 - inputColor.b);
}
void main(){
    vec2 fragCoord = vUv *u_resolution ; 
    vec2 uv = fragCoord.xy/u_resolution.xy;
    vec3 c = vec3(uv.y, sin(uv.y), uv.x);
    if(cos((1.0 + uv.x/(.01*u_time) )*pi) < 0.1) {
        c = inverseColor(c);
    }
    if(sin(uv.y/0.1*pi) < 0.1) {
        c = inverseColor(c);
    }
    gl_FragColor=vec4(c, 1.0);
}
`;