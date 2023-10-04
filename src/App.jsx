import { useRef, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import ThreeCanvas from "./threeCanvas";
import ShaderComponent from "./ShaderComponent";
import PromptComponent from "./PromptComponent";
import { ShaderPlane } from "./ShaderPlane";
import { Button } from "antd";
import axios from "axios";
import { useEffect } from "react";
import { atom, useAtom } from "jotai";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";

export const vertAtom = atom("");
export const fragAtom = atom(
  `
	    precision highp float; 
	    #define pi 3.1415926535
	    uniform vec2 u_resolution;
	    uniform float u_time;
	    varying vec2 vUv;
	    void main() { 
	    gl_FragColor = vec4(0.0, 1.0, 0.0, 1.0); // simple shader that sets all pixels to red
	}
	`
);
export const testAtom = atom(true);
export const promptAtom = atom("a sine wave in pink");

const defaultFrag = `
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
const fs1 = `precision highp float; 
#define pi 3.1415926535
uniform vec2 u_resolution;
uniform float u_time;
varying vec2 vUv;
void main(){
    gl_FragColor=vec4(1.0, 1.0, 0.0, 1.0);
}
`;

const vs = `
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
function App() {
  const ref = useRef();
  const [count, setCount] = useState(0);
  // const [vertex, setVertex] = useAtom(vertAtom);
  // const [fragment, setFragment] = useAtom(fragAtom);
  const [vertex, setVert] = useState(vs);
  const [fragment, setFragment] = useState(defaultFrag);
  const [ff, toggleFs] = useState(true);
  const [switchCanvas, toggleSc] = useState(true);

  console.log("App.jsx RELOADED");
  // console.log("fragment atom", fragment)
  // useEffect(() => {
  // 	const glfile = ff ? "frag.glsl" : "rec.glsl"
  // 	axios.get(glfile).then((res) => {
  // 		setFragment(res.data)
  // 	});
  // });

  return (
    <>
      <PromptComponent
        style={{
          position: "relative",
          zIndex: "2",
          border: "1px solid rgb(244, 123, 99)",
        }}
      />
      <div
        style={{
          marginTop: "1rem",
		  marginBottom: "1rem",
          display: "flex",
          position: "relative",
          width: "100%",
          height: window.innerHeight * 0.9,
          border: "1px solid rgb(1,1,1)",
        }}
      >
        <Button
          style={{ margin: "1rem", position: "fixed", zIndex: 1 }}
          type="primary"
          onClick={() => {
            toggleSc(!switchCanvas);
          }}
        >
          Toggle Canvas
        </Button>
        <Canvas style={{ width: "100%", zIndex:"0"}} frameloop="always">
          <ShaderPlane fs={fragment} vs={vertex} switchCanvas={switchCanvas} />
        </Canvas>
        <Button
          style={{
            margin: "1rem",
            position: "fixed",
            right: "1rem",
            zIndex: 1,
          }}
          type="default"
          onClick={() => {
            const userFrag =
              document.getElementById("fragmentShader").textContent;
            setFragment(userFrag);
          }}
        >
          Load Frag
        </Button>
        <ShaderComponent />
      </div>
    </>
  );
}

export default App;
