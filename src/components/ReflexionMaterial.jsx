import { MeshReflectorMaterial } from "@react-three/drei";

const ReflexionMaterial = (props) => {
  return (
    <mesh
      ref={props.rref}
      position={[0, -4, 0]}
      rotation={[-Math.PI / 2, 0, 0]}
    >
      <planeGeometry args={[20, 20]} />
      <MeshReflectorMaterial
        blur={[400, 200]}
        resolution={2048}
        mixBlur={1}
        mixStrength={80}
        roughness={1}
        depthScale={1.2}
        metalness={1}
        minDepthThreshold={0.4}
        maxDepthThreshold={1.4}
      />
    </mesh>
  );
};

export default ReflexionMaterial;
