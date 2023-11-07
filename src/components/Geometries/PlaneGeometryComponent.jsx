import * as THREE from "three";

const PlaneGeometryComponent = ({
  uniforms,
  position,
  clock,
  vs,
  fs,
  rref,
  meshRef,
  onClickAction,
  scaledHeight,
  scaledWidth,
}) => {
  const isScale = true;
  return (
    <mesh
      ref={meshRef}
      scale={isScale ? [scaledWidth, scaledHeight, 1.0] : [1, 1, 1]}
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
