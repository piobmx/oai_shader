import { useRef, useState } from "react";
import "./App.css";
import { Color } from "three";
import ShaderComponent from "./components/UI/ShaderComponent";
import { ShaderPlane } from "./ShaderPlane";
import { atom, useAtom } from "jotai";
import { Canvas } from "@react-three/fiber";
import { fs, vs, defaultFrag } from "./utils/fragments";
import CornerComponent from "./components/UI/Corners";
import {
    useGLTF,
    GizmoHelper,
    GizmoViewport,
    OrbitControls,
    Center,
    TransformControls,
    PerformanceMonitor,
} from "@react-three/drei";

export const vertAtom = atom("");
// export const fragAtom = atom(defaultFrag);
export const fragAtom = atom(fs);
export const testAtom = atom(true);
export const promptAtom = atom("create a fractal");
export const cleanPromptAtom = atom((get) =>
    get(promptAtom).slice(0, 1000).toLowerCase()
);

export const loadingAtom = atom(false);
export const shaderHasErrorAtom = atom(false);
export const shaderErrorMsgAtom = atom("");
export const geometryAtom = atom("PlaneGeometry");
export const downloadAtom = atom("");

function App() {
    const ref = useRef();
    const [vertex, setVert] = useState(vs);
    const [fragment, setFragment] = useAtom(fragAtom);
    const bgColor = new Color(0x20201b);

    return (
        <>
            <div style={mainStyle}>
                <Canvas
                    ref={ref}
                    // camera={{ position: [0.0, 0.0, 8.0] }}
                    gl={{ preserveDrawingBuffer: true }}
                    style={{ width: "100%", zIndex: "0" }}
                >
                    <color
                        attach="background"
                        args={[bgColor.r, bgColor.g, bgColor.b]}
                    />
                    <ambientLight intensity={1} />
                    <directionalLight color="red" position={[0, 0, 5]} />
                    {/* <directionalLight position={[0, 0, 0.0]} intensity={2} /> */}
                    {/* <TransformControls> */}
                    <ShaderPlane position={[0, 0, 0]} vs={vertex} />
                    {/* </TransformControls> */}
                    <OrbitControls
                        enableZoom={true}
                        panSpeed={10}
                        // zoomSpeed={3}
                        zoomToCursor={true}
                        dampingFactor={0.2}
                    />
                    {/* <GizmoHelper alignment="bottom-right" margin={[100, 100]}>
                        <GizmoViewport labelColor="white" axisHeadScale={1} />
                    </GizmoHelper> */}
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
