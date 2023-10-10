import { Suspense } from "react";
import * as THREE from "three";

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
    const scaleToScreen = true
    console.log(viewport.width);
    const b = 1
    const heightScale = viewport.width / b 
    return (
        <mesh
            scale={[viewport.width * 0.6, viewport.height * 0.6, viewport.height * 0.6]}
            position={position}
            onClick={onClickAction}
        >
            <Suspense fallback={<h1>Waiting...</h1>}>
                <boxGeometry args={[b, b, b]} />

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
