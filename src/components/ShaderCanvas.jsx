import "../App.css";

import { Leva, button, buttonGroup, folder, useControls } from "leva";
import { fragAtom, statsAtom } from "../atoms/shaderAtoms";
import { useAtom, useAtomValue } from "jotai";
import { useEffect, useRef, useState } from "react";

import { CameraControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Color } from "three";
import CornerComponent from "../components/UI/Corners";
import { DEG2RAD } from "three/src/math/MathUtils";
import Ground from "./Ground";
import ReflexionMaterial from "./ReflexionMaterial";
import SettingComponent from "../components/SettingComponent";
import ShaderComponent from "../components/UI/ShaderComponent";
import { ShaderPlane } from "../ShaderPlane";
import { Stats } from "@react-three/drei";
import { vs } from "../utils/fragments";

let startXY = { x: 0, y: 0 };
let endXY = { x: 0, y: 0 };

const truckCalculation = (startTruck, newXY) => {
  return { x: newXY.x - startTruck.x, y: newXY.y - startTruck.y };
};

function ShaderCanvas() {
  const ref = useRef();
  const cameraRef = useRef();
  const reflexRef = useRef();
  const dirLightRef = useRef();
  const [vertex, setVertex] = useState(vs);
  const [fragment, setFragment] = useAtom(fragAtom);
  const bgColor = new Color(0x20201b);
  const orbitref = useRef();
  const enableLeva = true;
  const enableStats = useAtomValue(statsAtom);
  useControls({
    directionalLight: folder({
      position: {
        x: 0,
        y: 0,
        z: 0,
        onChange: (s) => {
          if (dirLightRef.current !== undefined) {
            dirLightRef.current.position.x = s.x;
            dirLightRef.current.position.y = s.y;
            dirLightRef.current.position.z = s.z;
          }
        },
      },

      color: {
        value: "#aaa",
        onChange: (c, _, t) => {
          const { r, g, b } = hexToRgb(c);
          if (dirLightRef.current !== undefined) {
            dirLightRef.current.color.r = r / 256;
            dirLightRef.current.color.g = g / 256;
            dirLightRef.current.color.b = b / 256;
          }
        },
      },
      intensity: {
        value: 1,
        min: 0,
        max: 10,
        onChange: (a, b, bc) => {
          if (dirLightRef.current !== undefined) {
            dirLightRef.current.intensity = a;
          }
        },
      },
    }),
    thetaGrp: buttonGroup({
      label: "rotate theta",
      opts: {
        "-π/4": () => cameraRef.current?.rotate(-45 * DEG2RAD, 0, true),
        "-π/8": () => cameraRef.current?.rotate(-22.5 * DEG2RAD, 0, true),
        "π/8": () => cameraRef.current?.rotate(22.5 * DEG2RAD, 0, true),
        "π/4": () => cameraRef.current?.rotate(45 * DEG2RAD, 0, true),
      },
    }),
    phiGrp: buttonGroup({
      label: "rotate phi",
      opts: {
        "-π/10": () => cameraRef.current?.rotate(0, -18 * DEG2RAD, true),
        "-π/20": () => cameraRef.current?.rotate(0, -9 * DEG2RAD, true),
        "π/20": () => cameraRef.current?.rotate(0, 9 * DEG2RAD, true),
        "π/10": () => cameraRef.current?.rotate(0, 18 * DEG2RAD, true),
      },
    }),
    reset: button(() => cameraRef.current?.reset(true)),
    truckJoystick: {
      label: "Truck",
      value: {
        x: 0,
        y: 0,
      },
      x: {
        step: 0.1,
        max: 5,
        min: -5,
        pad: 1,
      },

      y: {
        step: 0.1,
        max: 5,
        min: -5,
        pad: 1,
      },

      onEditStart: (startTruckValues, s, t) => {
        startXY = {
          ...startXY,
          x: startTruckValues.x,
          y: startTruckValues.y,
        };
      },
      onChange: (truckValues, s, t) => {},

      onEditEnd: (endTruckValues, s, t) => {
        endXY = { ...endXY, x: endTruckValues.x, y: endTruckValues.y };
        const n = truckCalculation(startXY, endXY);
        const xx = n.x;
        const yy = n.y;

        cameraRef.current?.truck(xx, yy, true);
      },
    },
  });
  useEffect(() => {
    const handleLoad = () => {
      localStorage.clear();
    };
    window.addEventListener("load", handleLoad);
    return () => {
      window.removeEventListener("load", handleLoad);
    };
  }, []);
  const [dpr, setDpr] = useState(1.5);

  return (
    <>
      <div style={mainStyle}>
        <Leva
          flat
          titleBar={{ title: "Controller", drag: true, filter: true }}
          theme={{
            fontSizes: { root: "0.6rem" },
          }}
          hidden={enableLeva ? false : true}
        />
        <Canvas ref={ref} shadows gl={{ preserveDrawingBuffer: true }}>
          <CameraControls makeDefault ref={cameraRef} enabled={enableLeva} />
          {/* <Ground /> */}
          <color attach="background" args={[bgColor.r, bgColor.g, bgColor.b]} />
          <ambientLight color={"#000"} intensity={1} />
          <directionalLight
            ref={dirLightRef}
            args={[rgbToHex(120, 120, 120), 1]}
            position={[0, 1, 1]}
          />
          <ShaderPlane position={[0, 0, 0]} vs={vertex} />
          <ReflexionMaterial rref={reflexRef} />
          {enableStats ? <Stats /> : <></>}
        </Canvas>
        <ShaderComponent />
        <CornerComponent />
        <SettingComponent />
      </div>
    </>
  );
}

function rgbToHex(r, g, b, a = 255) {
  const toHex = (value) => {
    const hex = value.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };

  const redHex = toHex(r);
  const greenHex = toHex(g);
  const blueHex = toHex(b);
  const alphaHex = toHex(a);

  return `#${redHex}${greenHex}${blueHex}`;
}
function hexToRgb(hex) {
  hex = hex.charAt(0) === "#" ? hex.slice(1) : hex;
  if (hex.length !== 3 && hex.length !== 6) {
    throw new Error("Invalid HEX color.");
  }
  if (hex.length === 3) {
    hex = hex
      .split("")
      .map((val) => val + val)
      .join("");
  }
  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  return { r, g, b };
}
const mainStyle = {
  //   marginTop: "1rem",
  display: "flex",
  position: "relative",
  width: "100%",
  height: window.innerHeight,
};

export default ShaderCanvas;
