import "./App.css";

import {
  Center,
  GizmoHelper,
  GizmoViewport,
  OrbitControls,
  PerformanceMonitor,
  TransformControls,
  useGLTF,
} from "@react-three/drei";
import { atom, useAtom, useAtomValue } from "jotai";
import { defaultFrag, fs, vs } from "./utils/fragments";
import { useEffect, useRef, useState } from "react";

import { Canvas } from "@react-three/fiber";
import { Color } from "three";
import CornerComponent from "./components/UI/Corners";
import SettingComponent from "./components/SettingComponent";
import ShaderComponent from "./components/UI/ShaderComponent";
import { ShaderPlane } from "./ShaderPlane";

export const vertAtom = atom("");
// export const fragAtom = atom(defaultFrag);
export const fragAtom = atom(fs);
export const promptAtom = atom("create a fractal");
export const cleanPromptAtom = atom((get) =>
  get(promptAtom).slice(0, 1000).toLowerCase()
);
export const text3dAtom = atom("Hello");

export const loadingAtom = atom(false);
export const shaderHasErrorAtom = atom(false);
export const shaderErrorMsgAtom = atom("");
export const geometryAtom = atom("PlaneGeometry");
export const downloadAtom = atom("");
export const cameraAtom = atom(false);

function App() {
  const ref = useRef();
  const [vertex, setVert] = useState(vs);
  const [fragment, setFragment] = useAtom(fragAtom);
  const bgColor = new Color(0x20201b);
  const cameraOn = useAtomValue(cameraAtom);
  const orbitref = useRef();
  useEffect(() => {
    const handleLoad = () => {
      localStorage.clear();
    };

    window.addEventListener("load", handleLoad);

    return () => {
      window.removeEventListener("load", handleLoad);
    };
  }, []);

  return (
    <>
      <div style={mainStyle}>
        <Canvas
          ref={ref}
          // camera={{ position: [0.0, 0.0, 8.0] }}
          gl={{ preserveDrawingBuffer: true }}
          style={{ width: "100%", zIndex: "0" }}
        >
          <color attach="background" args={[bgColor.r, bgColor.g, bgColor.b]} />
          <ambientLight intensity={1} />
          <directionalLight color="red" position={[0, 0, 5]} />
          {/* <directionalLight position={[0, 0, 0.0]} intensity={2} /> */}
          {/* <TransformControls> */}
          <ShaderPlane position={[0, 0, 0]} vs={vertex} />
          {/* </TransformControls> */}
          <OrbitControls
            ref={orbitref}
            enableZoom={true}
            panSpeed={10}
            // zoomSpeed={3}
            enablePan={false}
            zoomToCursor={true}
            dampingFactor={0.2}
          />
          {cameraOn ? (
            <GizmoHelper
              makeDefault
              alignment="bottom-right"
              onUpdate={() => {
                console.log(orbitref.current.minPolarAngle);
              }}
              margin={[100, 100]}
            >
              <GizmoViewport labelColor="white" axisHeadScale={1} />
            </GizmoHelper>
          ) : (
            <></>
          )}
        </Canvas>
        <ShaderComponent />
        <CornerComponent />
        <SettingComponent />
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
