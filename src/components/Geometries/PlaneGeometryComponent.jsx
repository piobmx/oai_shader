import * as THREE from "three";

const PlaneGeometryComponent = ({
  uniforms,
  viewport,
  position,
  clock,
  vs,
  fs,
  rref,
  meshRef,
  onClickAction,
}) => {
  const isScale = true;
  console.log("vp", viewport);

  return (
    <mesh
      ref={meshRef}
      scale={isScale ? [viewport.width, viewport.height, 1.0] : [3, 3, 3]}
      position={position}
      onClick={onClickAction}
    >
      <planeGeometry />

      {/* <meshStandardMaterial ref={rref} color={"orange"} /> */}

      <shaderMaterial
        ref={rref}
        key={THREE.ShaderMaterial.key}
        vertexShader={vs}
        fragmentShader={fs}
        uniforms={uniforms}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

export default PlaneGeometryComponent;
