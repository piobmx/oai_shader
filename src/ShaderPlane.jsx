import { useRef, useMemo, useState, Suspense } from "react";
import { extend, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { MyMaterial } from "./MyMaterial";
import { useEffect } from "react";
import CustomShaderMaterial from "three-custom-shader-material";
import { useSpring, animated } from "@react-spring/three";
import { fragAtom, promptAtom } from "./App";
import { OrbitControls } from "@react-three/drei";
extend({ MyMaterial });
import { useAtom } from "jotai";

const unf = {
  u_time: { value: 0.0 },
  u_resolution: { value: new THREE.Vector2(1.0, 1.0) },
};

export function ShaderPlane({ fs, vs, switchCanvas }) {
  console.log("ShaderPlane is Reloading");
  const ref = useRef();
  const refB = useRef();

  const { viewport, size, clock } = useThree();
  const [reload, setReload] = useState(false);
  // useFrame((state, delta) => {
  //     ref.current.u_time += delta
  const [fragCode, setFragCode] = useAtom(fragAtom);

  useEffect(() => {
    console.log("Component is re-rendering due to someValue change.");
    ref.current.version = ref.current.version + 1;
    ref.current.fragmentShader = fragCode;
    clock.start();
  }, [fragCode]);

  useFrame((state) => {
    const { clock } = state;
    if (ref.current) {
      ref.current.uniforms.u_time.value = clock.getElapsedTime();
    }
    // if (refB) { refB.current.uniforms.u_time.value = clock.getElapsedTime() }
  });

  const uniforms = useMemo(
    () => ({
      u_time: {
        type: "f",
        value: 0.0,
      },
      u_resolution: {
        type: "v2",
        value: new THREE.Vector2(1.0, 1.0),
      },
    }),
    []
  );

  return (
    <mesh
      scale={[viewport.width, viewport.height, 1.0]}
      onClick={() => {
        console.log(ref.current);
        ref.current.version = ref.current.version + 1;
        ref.current.fragmentShader = fragCode;

        // ref.current.copy = function (source) {
        // THREE.ShaderMaterial.copy.call(this, source);
        // this.shader = source.shader;
        // this.shaderVersion = this.shader.version;
        // this.vertexShader = this.shader.vertex;
        // this.fragmentShader = fragCode;

        // return this;
        //   };
      }}
    >
      <OrbitControls />
      <Suspense fallback={<h1>Waiting...</h1>}>
        <planeGeometry />

        {switchCanvas ? (
          <shaderMaterial
            ref={ref}
            key={THREE.ShaderMaterial.key}
            fragmentShader={fragCode}
            vertexShader={vs}
            uniforms={uniforms}
            side={THREE.DoubleSide}
          />
        ) : (
          // <shaderMaterial args={[uniforms, vs, fragCode]}/>
          <myMaterial
            ref={ref}
            key={MyMaterial.key}
            u_resolution={[
              size.width * viewport.dpr,
              size.height * viewport.dpr,
            ]}
          />
        )}
      </Suspense>
    </mesh>
  );
}
