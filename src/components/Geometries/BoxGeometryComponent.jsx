import * as THREE from "three";

import { Suspense } from "react";

const BoxGeometryComponent = ({
  uniforms,
  viewport,
  position,
  clock,
  vs,
  fs,
  rref,
  onClickAction,
}) => {
  const bSize = 4
  return (
    <mesh
      scale={[ 1, 1, 1
        // viewport.width * 0.6,
        // viewport.height * 0.6,
        // viewport.height * 0.6,
      ]}
      position={position}
      onClick={onClickAction}
    >
      <Suspense fallback={<h1>Waiting...</h1>}>
        <boxGeometry args={[bSize, bSize, bSize]} />

        <shaderMaterial
          ref={rref}
          key={THREE.ShaderMaterial.key}
          vertexShader={vs}
          fragmentShader={fs}
          uniforms={uniforms}
          side={THREE.DoubleSide}
        />
      </Suspense>
    </mesh>
  );
};

export default BoxGeometryComponent;
