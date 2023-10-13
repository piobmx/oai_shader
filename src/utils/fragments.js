export const fs = `varying vec2 vUv;
uniform float u_time;
uniform vec2 u_resolution;
void main() {
    vec2 uv = (vUv.xy - 0.8 * u_resolution.xy) / min(u_resolution.y, u_resolution.x);
    vec2 c = vec2(0.3 * sin(u_time), 0.01 * cos(u_time));
    vec2 z = uv;
    float iter = 0.0;
    for (int i = 0; i < 100; i++) {
        if (length(z) > 2.0) break;
        vec2 temp = vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y) + c;
        z = temp;
        iter++;
    }
    float color = iter / 50.0;
    gl_FragColor = vec4(vec3(color), 1.0);
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
