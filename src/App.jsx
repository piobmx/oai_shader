import { useRef, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import ThreeCanvas from "./threeCanvas";
import ShaderComponent from "./components/UI/ShaderComponent";
import { ShaderPlane } from "./ShaderPlane";
import { atom, useAtom } from "jotai";
import { Canvas } from "@react-three/fiber";
import { fs, vs, defaultFrag } from "./utils/fragments";
import { OrbitControls } from "@react-three/drei";
import CornerComponent from "./components/UI/Corners";

// TODOS:
// [x] loading state
// [x] search bar styles
// [] personal informations
// [] shader error handling
// [] limit prompt length // https://ant.design/components/message
// [x] api environments

export const vertAtom = atom("");
// export const fragAtom = atom(defaultFrag);
export const fragAtom = atom(fs);
export const testAtom = atom(true);
export const promptAtom = atom("a fractal graph");
export const loadingAtom = atom(false);
export const shaderHasErrorAtom = atom(false);
export const shaderErrorMsgAtom = atom("");
export const geometryAtom = atom("PlaneGeometry");

function App() {
    const ref = useRef();
    const [vertex, setVert] = useState(vs);
    const [fragment, setFragment] = useAtom(fragAtom);

    return (
        <>
            <div style={mainStyle}>
                <Canvas
                    ref={ref}
                    // camera={{ position: [0.0, 0.0, 8.0] }}
                    style={{ width: "100%", zIndex: "0" }}
                >
                    <OrbitControls enableZoom={true} />
                    <ambientLight intensity={0.03} />
                    <directionalLight position={[0, 0, 0.0]} intensity={2} />

                    {/* <ShaderPlane
                        position={[1.2, 0, 0]}
                        fs={fragment}
                        vs={vertex}
                    /> */}
                    <ShaderPlane position={[0, 0, 0]} vs={vertex} />
                </Canvas>
                <ShaderComponent />
                <CornerComponent />
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
