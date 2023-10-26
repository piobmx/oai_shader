import * as THREE from "three";

import { Center, Text3D } from "@react-three/drei";

import { text3dAtom } from "../../atoms/shaderAtoms";
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
    <Center>
      <Text3D font={"/fonts.json"} position={[0, 1, 0]}>
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
    </Center>
  );
};

export default Text3DGeometryComponent;
