import * as THREE from 'three'
import { extend } from '@react-three/fiber'
import { shaderMaterial } from '@react-three/drei'

export const MyMaterial = shaderMaterial(
    {
        u_time: 0,
        u_resolution: new THREE.Vector2(),
        pointer: new THREE.Vector2(1, 1)
    },
    `precision highp float; 
    varying vec2 vUv;
    void main() {
        vec4 modelPosition = modelMatrix * vec4(position, 1.0);
        vec4 viewPosition = viewMatrix * modelPosition;
        vec4 projectionPosition = projectionMatrix * viewPosition;
        gl_Position = projectionPosition;
        vUv = uv;
    }
    `,
    `precision highp float; 

    #define pi 3.1415926535
    uniform vec2 u_resolution;
    uniform float u_time;
    varying vec2 vUv;
    
    
    vec3 inverseColor(vec3 inputColor) {
        return vec3(1.0 - inputColor.r, 1.0 - inputColor.g, 1.0 - inputColor.b);
    }
    
    void main(){
        vec2 fragCoord = vUv * u_resolution ; 
        vec2 uv = fragCoord.xy/u_resolution.xy;
        
        vec3 c = vec3(uv.y, uv.y, uv.y);
        
        if(cos((1.0 + uv.x/(.1*u_time) )*pi) < 0.2) {
            c = inverseColor(c);
        }
        if(sin(uv.y/0.1*pi) < 0.8) {
            c = inverseColor(c);
        }
    
        gl_FragColor=vec4(c, 1.0);
    }
    `
);
