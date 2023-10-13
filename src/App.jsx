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
import { cameraAtom, fragAtom, vertAtom } from "./atoms/shaderAtoms";
import { useEffect, useRef, useState } from "react";

import { Canvas } from "@react-three/fiber";
import { Color } from "three";
import CornerComponent from "./components/UI/Corners";
import SettingComponent from "./components/SettingComponent";
import ShaderComponent from "./components/UI/ShaderComponent";
import { ShaderPlane } from "./ShaderPlane";
import { vs } from "./utils/fragments";

function App() {
  const ref = useRef();
  const [vertex, setVertex] = useState(vs);
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
          camera={{ position: [0.0, 0.0, 5.0] }}
          gl={{ preserveDrawingBuffer: true }}
          style={{ width: "100%", zIndex: "0" }}
        >
          <color attach="background" args={[bgColor.r, bgColor.g, bgColor.b]} />
          <ambientLight intensity={1} />
          <directionalLight color="red" position={[0, 0, 1]} />
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
              //   onUpdate={() => {
              //     console.log(orbitref.current.minPolarAngle);
              //   }}
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
