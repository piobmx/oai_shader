import { useRef, useMemo, useState, Suspense } from "react";
import { extend, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { MyMaterial } from "./MyMaterial";
import { useEffect } from "react";
import { fragAtom, shaderHasErrorAtom, shaderErrorMsgAtom } from "./App";
import { OrbitControls } from "@react-three/drei";
import { useAtom } from "jotai";

extend({ MyMaterial });

export function ShaderPlane({ fs, vs }) {
    const ref = useRef();
    const refB = useRef();

    const { gl, viewport, size, get, clock } = useThree();
    const [fragCode, setFragCode] = useAtom(fragAtom);
    const [pseudoFrag, setPseudoFrag] = useState(fragCode);
    const [shaderHasError, setShaderHasError] = useAtom(shaderHasErrorAtom);
    const [shaderErrorMsg, setShaderErrorMsg] = useAtom(shaderErrorMsgAtom);

    const [currentErrMsg, setCurrentErrMsg] = useState("");
    const [lastErrorMsg, setLastErrMessage] = useState("");

    // console.log("scale:", viewport.width, viewport.height);
    gl.debug.onShaderError = (
        gl,
        program,
        glVertexShader,
        glFragmentShader
    ) => {
        const infoLog = gl.getProgramInfoLog(program);
        const vertexShaderInfoLog = gl.getShaderInfoLog(glVertexShader);
        const fragmentShaderInfoLog = gl.getShaderInfoLog(glFragmentShader);
        const logs = {
            program: infoLog,
            vertex: vertexShaderInfoLog,
            frament: fragmentShaderInfoLog,
        };
        // setShaderErrorMsg(fragmentShaderInfoLog);
        // setShaderHasError(true);
    };

    useEffect(() => {
        ref.current.version = ref.current.version + 1;
        ref.current.fragmentShader = fragCode;
        // setPseudoFrag("#define das 3.141592653" + fragCode)
        clock.start();
    }, [fragCode]);


    useFrame((state) => {
        if (gl.info.programs.length > 0) {
            const l = gl.info.programs.length;
            // console.log(l);
            let dg = [];
            gl.info.programs.map((o) => dg.push(o));
            // console.log(dg);
            let ei = "";
            try {
                if (dg.length > 1) {
                    let lastProgram = dg[dg.length - 1];
                    const tempShader = gl
                        .getContext()
                        .createShader(gl.getContext().FRAGMENT_SHADER);

                    const fragmentToCompile =
                        " precision mediump float;" + fragCode;
                    gl.getContext().shaderSource(tempShader, fragmentToCompile);
                    gl.getContext().compileShader(tempShader);

                    if (
                        !gl
                            .getContext()
                            .getShaderParameter(
                                tempShader,
                                gl.getContext().COMPILE_STATUS
                            )
                    ) {
                        const info = gl
                            .getContext()
                            .getShaderInfoLog(tempShader);
                        ei = info;
                        // throw `Could not compile WebGL program. \n\n${info}`;
                        // console.log("Could not compile", info);
                        // setShaderErrorMsg(info)
                        // setShaderHasError(true)
                    }
                }
            } catch (err) {
                // console.log("ERR!!", err);
            } finally {
                if (ei === "") {
                    setShaderHasError(false);
                    setShaderErrorMsg(ei);
                } else {
                    setShaderHasError(true);
                    setShaderErrorMsg(ei);
                }
            }
        }
        if (ref.current) {
            ref.current.uniforms.u_time.value = clock.getElapsedTime();
        }
    });

    const uniforms = useMemo(
        () => ({
            u_time: {
                type: "f",
                value: 0.0,
            },
            u_resolution: {
                type: "v2",
                value: new THREE.Vector2(4.0, 4.0),
            },
        }),
        []
    );

    return (
        <mesh
            ref={refB}
            // scale={[viewport.width, viewport.height, 1.0]}
            position={[1, 0, 0]}
            onClick={() => {
                clock.start();
                console.log(ref.current);
                console.log(gl);
                console.log(refB);
            }}
        >
            <OrbitControls enableZoom={true} />
            <Suspense fallback={<h1>Waiting...</h1>}>
                <sphereGeometry args={[1, 32]} />

                <shaderMaterial
                    ref={ref}
                    key={THREE.ShaderMaterial.key}
                    // fragmentShader={fragCode}
                    vertexShader={vs}
                    uniforms={uniforms}
                    side={THREE.DoubleSide}
                />
            </Suspense>
        </mesh>
    );
}
