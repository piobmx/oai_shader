import * as THREE from "three";

import { GizmoHelper, PivotControls, useHelper } from "@react-three/drei";
import { Suspense, useMemo, useRef, useState } from "react";
import { extend, useFrame, useThree } from "@react-three/fiber";
import {
  fragAtom,
  geometryAtom,
  shaderErrorMsgAtom,
  shaderHasErrorAtom,
} from "./App";

import BoxGeometryComponent from "./components/Geometries/BoxGeometryComponent";
import PlaneGeometryComponent from "./components/Geometries/PlaneGeometryComponent";
import SphereGeometryComponent from "./components/Geometries/SphereGeometryComponent";
import Text3DGeometryComponent from "./components/Geometries/Text3DGeometryComponent";
import TorusKnotGeometryComponent from "./components/Geometries/TorusGeometryComponent";
import { downloadAtom } from "./App";
import { useAtom } from "jotai";
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

  const { gl, viewport, size, get, clock } = useThree();
  const [fragCode, setFragCode] = useAtom(fragAtom);
  const [shaderHasError, setShaderHasError] = useAtom(shaderHasErrorAtom);
  const [shaderErrorMsg, setShaderErrorMsg] = useAtom(shaderErrorMsgAtom);

  const [debugTriggered, setDebugTriggered] = useState(false);

  const [geometry, setGeometry] = useAtom(geometryAtom);
  const [downloadLink, setDownloadLink] = useAtom(downloadAtom);

  // console.log("scale:", viewport.width, viewport.height);
  gl.debug.onShaderError = (gl, program, glVertexShader, glFragmentShader) => {
    setDebugTriggered(true);
    const infoLog = gl.getProgramInfoLog(program);
    const vertexShaderInfoLog = gl.getShaderInfoLog(glVertexShader);
    const fragmentShaderInfoLog = gl.getShaderInfoLog(glFragmentShader);
    const logs = {
      program: infoLog,
      vertex: vertexShaderInfoLog,
      frament: fragmentShaderInfoLog,
    };

    // setShaderErrorMsg(fragmentShaderInfoLog);
    // setShaderHasError(true);
  };

  useEffect(() => {
    ref.current.version = ref.current.version + 1;
    ref.current.fragmentShader = fragCode;
    // setPseudoFrag("#define das 3.141592653" + fragCode)
    clock.start();
    setDebugTriggered(false);
    validateScript(gl, fragCode, setShaderHasError, setShaderErrorMsg);
  }, [fragCode]);

  useFrame((state) => {
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
    console.log(gl);
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
    rref: ref,
    meshRef: meshRef,
    onClickAction: onClickAction,
  };
  const GeometryToRender = GeometryComponentMap[geometry];

  const pc = false;
  return pc ? (
    <PivotControls>
      <GeometryToRender {...GeometryProps} />
    </PivotControls>
  ) : (
    <GeometryToRender {...GeometryProps} />
  );
}

const validateScript = (
  gl,
  fragScript,
  setShaderHasError,
  setShaderErrorMsg
) => {
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
      setShaderHasError(errorInfo === "" ? false : true);
      setShaderErrorMsg(errorInfo);
    }
  }
};
