import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useRef } from "react";

import Cube from "./Cube";

export default (props) => {
	return(
		<div id="canvas-container" style={ containerStyle } >
			<Canvas>
				<OrbitControls />
				<ambientLight intensity={1} />
				<spotLight position={[10, 1, 1]} angle={0.43} />
				<mesh>
					<Cube position={[0, 0, 0]} {...props} />
				</mesh>
			</Canvas>
		</div>
	);
};

const containerStyle = {
	border: "1px solid rgb(0,1,1,1)",
	width: "800px",
	height: "600px",
	padding: "3rem",
};
