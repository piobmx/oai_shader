import * as THREE from "three";

import { Suspense } from "react";

const TorusKnotGeometryComponent = ({
  uniforms,
  viewport,
  position,
  clock,
  vs,
  fs,
  rref,
  onClickAction,
}) => {
  return (
    <mesh position={position} onClick={onClickAction}>
      <Suspense fallback={<h1>Waiting...</h1>}>
        <torusKnotGeometry args={[1.5, 0.3, 100, 100, 4]} />

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

export default TorusKnotGeometryComponent;
