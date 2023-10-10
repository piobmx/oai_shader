import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { useAtom } from "jotai";
import { testAtom, fragAtom, vertAtom } from "../../App";
import * as THREE from "three";

const Cube = (props) => {
    const ref = useRef();
    const [hovered, hover] = useState(false);
    const [clicked, click] = useState(false);
    // const [frag, setFrag] = useAtom(fragAtom);
    // const [vert, setVert] = useAtom(vertAtom)
    const [test, setTest] = useAtom(testAtom);

    const [seconds, setSeconds] = useState(0);
    const [fs, setFs] = useAtom(fragAtom);
    const [vs, setVs] = useAtom(vertAtom);
    // const vs = props.vertex
    useFrame((state, delta) => {
        const d = new Date();
        const s = d.getMilliseconds() / 100.0;
        // ref.current.material.uniforms.u_time.value = s
        // ref.current.material.fragmentShader = fs
        // ref.current.rotation.x += delta
    });

    const uniforms = useMemo(
        () => ({
            u_time: {
                type: "f",
                value: seconds,
            },
            u_resolution: {
                type: "v2",
                value: new THREE.Vector2(40, 30),
            },
        }),
        []
    );

    return (
        <mesh
            {...props}
            ref={ref}
            scale={clicked ? 1.5 : 1}
            onClick={(event) => {
                setTest((test) => test + 1);
                console.log(test);
                console.log(ref.current.material);
                click(!clicked);
            }}
            onPointerOver={(event) => (event.stopPropagation(), hover(true))}
            onPointerOut={(event) => hover(false)}
        >
            <boxGeometry args={[2, 2, 2]} />
            {/* <shaderMaterial
				fragmentShader={fs}
				vertexShader={vs}
				uniforms={uniforms}
				side={THREE.DoubleSide}
			/> */}
        </mesh>
    );
};

export default Cube;
