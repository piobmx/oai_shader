import { Suspense } from "react";
import * as THREE from "three";

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
        <mesh
            // scale={[
            //     viewport.width * 0.6,
            //     viewport.height * 0.6,
            //     viewport.height * 0.6,
            // ]}
            position={position}
            onClick={onClickAction}
        >
            <Suspense fallback={<h1>Waiting...</h1>}>
                <torusKnotGeometry args={[5, 1, 100, 100]} />

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
