import * as THREE from "three";

import { Text3D } from "@react-three/drei";
import { text3dAtom } from "../../App";
import { useAtomValue } from "jotai";

const Text3DGeometryComponent = ({
  uniforms,
  viewport,
  position,
  clock,
  vs,
  fs,
  rref,
  onClickAction,
}) => {
  const textContent = useAtomValue(text3dAtom);
  return (
    <mesh
      // scale={[viewport.width, viewport.height, 1.0]}
      position={position}
      onClick={onClickAction}
    >
      <Text3D font={"/fonts.json"}>
        {textContent}
        <shaderMaterial
          ref={rref}
          key={THREE.ShaderMaterial.key}
          vertexShader={vs}
          fragmentShader={fs}
          uniforms={uniforms}
          side={THREE.DoubleSide}
        />
      </Text3D>
    </mesh>
  );
};

export default Text3DGeometryComponent;
