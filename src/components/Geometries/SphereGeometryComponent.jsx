import * as THREE from "three";

import { Suspense } from "react";
import { extend } from "@react-three/fiber";

const SphereGeometryComponent = ({
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
        <mesh
            // scale={[viewport.width, viewport.height, 1.0]}
            position={position}
            onClick={onClickAction}
        >
            <Suspense fallback={<h1>Waiting...</h1>}>
                <sphereGeometry args={[3]} />

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

export default SphereGeometryComponent;
