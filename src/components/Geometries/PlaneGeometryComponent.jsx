import { Suspense } from "react";
import * as THREE from "three";

const PlaneGeometryComponent = ({
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
            scale={[viewport.width, viewport.height, 1.0]}
            position={position}
            onClick={onClickAction}
        >
            <Suspense fallback={<h1>Waiting...</h1>}>
                <planeGeometry />

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

export default PlaneGeometryComponent;