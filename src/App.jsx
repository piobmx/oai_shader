import { useRef, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import ThreeCanvas from "./threeCanvas";
import ShaderComponent from "./ShaderComponent";
import { ShaderPlane } from "./ShaderPlane";
import { atom, useAtom } from "jotai";
import { Canvas } from "@react-three/fiber";
import { fs, vs, defaultFrag } from "./fragments";

// TODOS:
// [x] loading state
// [x] search bar styles
// [] personal informations
// [] shader error handling
// [] limit prompt length
// [] api environments

export const vertAtom = atom("");
export const fragAtom = atom(defaultFrag);
export const testAtom = atom(true);
export const promptAtom = atom("a sine wave in pink");
export const loadingAtom = atom(false);
export const shaderHasErrorAtom = atom(false);
export const shaderErrorMsgAtom = atom("");

function App() {
    const ref = useRef();
    const [vertex, setVert] = useState(vs);
    const [fragment, setFragment] = useAtom(fragAtom);

    return (
        <>
            <div style={mainStyle}>
                <Canvas
                    ref={ref}
                    camera={{ position: [0.0, 0.0, 8.0] }}
                    style={{ width: "100%", zIndex: "0" }}
					
                >
                    <ambientLight intensity={0.03} />
                    <directionalLight
                        position={[0.3, 0.15, 0.0]}
                        intensity={2}
                    />

                    <ShaderPlane fs={fragment} vs={vertex} />
                </Canvas>
                <ShaderComponent />
            </div>
        </>
    );
}

const mainStyle = {
    //   marginTop: "1rem",
    display: "flex",
    position: "relative",
    width: "100%",
    height: window.innerHeight,
};

export default App;
