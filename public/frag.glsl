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
    float pct = 0.0;
     pct = distance(uv,vec2(0.5));
    vec3 c = vec3(pct);

    gl_FragColor=vec4(c, 1.0);
}
