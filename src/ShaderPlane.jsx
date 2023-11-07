import * as THREE from "three";

import { Suspense, useMemo, useRef, useState } from "react";
import {
  downloadAtom,
  errorAtom,
  fragAtom,
  geometryAtom,
  pivotAxesAtom,
} from "./atoms/shaderAtoms";
import { extend, useFrame, useThree } from "@react-three/fiber";
import { useAtom, useAtomValue, useSetAtom } from "jotai";

import BoxGeometryComponent from "./components/Geometries/BoxGeometryComponent";
import { PivotControls } from "@react-three/drei";
import PlaneGeometryComponent from "./components/Geometries/PlaneGeometryComponent";
import SphereGeometryComponent from "./components/Geometries/SphereGeometryComponent";
import Text3DGeometryComponent from "./components/Geometries/Text3DGeometryComponent";
import TorusKnotGeometryComponent from "./components/Geometries/TorusGeometryComponent";
import { useEffect } from "react";

const GeometryComponentMap = {
  BoxGeometry: BoxGeometryComponent,
  SphereGeometry: SphereGeometryComponent,
  PlaneGeometry: PlaneGeometryComponent,
  TorusKnotGeometry: TorusKnotGeometryComponent,
  Text3DGeometry: Text3DGeometryComponent,
};

export function ShaderPlane(props) {
  const ref = useRef();
  const meshRef = useRef();
  const reflexionRef = useRef();

  const { gl, viewport, size, get, clock } = useThree();
  const [prevViewport, setPrevViewport ] = useState(viewport)
  const fragCode = useAtomValue(fragAtom);
  const geometry = useAtomValue(geometryAtom);
  const pivotAxes = useAtomValue(pivotAxesAtom);
  const setShaderErr = useSetAtom(errorAtom);
  const setDownloadLink = useSetAtom(downloadAtom);

  gl.debug.onShaderError = (gl, program, glVertexShader, glFragmentShader) => {
    const infoLog = gl.getProgramInfoLog(program);
    const vertexShaderInfoLog = gl.getShaderInfoLog(glVertexShader);
    const fragmentShaderInfoLog = gl.getShaderInfoLog(glFragmentShader);
    const logs = {
      program: infoLog,
      vertex: vertexShaderInfoLog,
      frament: fragmentShaderInfoLog,
    };
  };

  useEffect(() => {
    console.log("viewport:", viewport);
    ref.current.version = ref.current.version + 1;
    ref.current.fragmentShader = fragCode;
    clock.start();
    validateScript(gl, fragCode, setShaderErr);
  }, [fragCode]);

  useFrame((state) => {
    if (reflexionRef.current) {
      // reflexionRef.current.rotation.x += 0.001
    }
    if (ref.current) {
      ref.current.uniforms.u_time.value = clock.getElapsedTime();
    }
  });

  const uniforms = useMemo(
    () => ({
      u_time: {
        type: "f",
        value: 0.0,
      },
      u_resolution: {
        type: "v2",
        value: new THREE.Vector2(4.0, 4.0),
      },
    }),
    []
  );

  const onClickAction = () => {
    // console.log(ref.current);
    // console.log(gl);
    const screenshot = gl.domElement.toDataURL("image/png", 1.0);
    setDownloadLink(screenshot);
  };
  //   useHelper(condition && meshRef, BoxHelper, "red"); // you can pass false instead of the object ref to hide the helper



  const GeometryProps = {
    uniforms: uniforms,
    position: props.position,
    clock: clock,
    vs: props.vs,
    fs: fragCode,
    viewport: viewport,
    scaledWidth: viewport.width * (viewport.factor / prevViewport.factor),
    scaledHeight: viewport.height * (viewport.factor / prevViewport.factor),
    rref: ref,
    meshRef: meshRef,
    onClickAction: onClickAction,
  };
  const GeometryToRender = GeometryComponentMap[geometry];
  const reflextion = true;

  return pivotAxes ? (
    <PivotControls offset={[1, 1, 1]}>
      <GeometryToRender {...GeometryProps} />
    </PivotControls>
  ) : (
    <GeometryToRender {...GeometryProps} />
  );
}

const validateScript = (gl, fragScript, setShaderErr) => {
  let errorInfo = "";
  const renderer = gl.getContext();
  if (gl.info.programs.length > 0) {
    let programArray = [];
    gl.info.programs.map((o) => programArray.push(o));
    try {
      const tempShader = gl.getContext().createShader(renderer.FRAGMENT_SHADER);

      const fragmentToCompile = "precision highp float; " + fragScript;
      renderer.shaderSource(tempShader, fragmentToCompile);
      renderer.compileShader(tempShader);

      if (!renderer.getShaderParameter(tempShader, renderer.COMPILE_STATUS)) {
        const info = renderer.getShaderInfoLog(tempShader);
        errorInfo = info;
      }
    } catch (err) {
    } finally {
      setShaderErr({
        hasError: errorInfo === "" ? false : true,
        errorMsg: errorInfo,
      });
    }
  }
};
