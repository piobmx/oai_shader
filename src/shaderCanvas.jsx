import React from "react";
import Sketch from "react-p5";

let varying = "precision highp float; varying vec2 vPos;";

let vs = varying +
	`
	attribute vec3 aPosition; 
	void main() {
	vPos = (gl_Position = vec4(aPosition,1.0)).xy; 
	}`;

// the fragment shader is called for each pixel
let fs = varying +
	`uniform vec2 p; 
	uniform vec2 usize;
	uniform float r; 
	uniform vec2 u_mouse;
	uniform float utime;

	const int I = 500; 
	void main() { 
 	// 	vec2 c = p + vPos * r, z = c; 
		// vec2 st = c;
		vec2 st = vec2(0.0);
		st.x *= usize.x/usize.y;

		vec3 color = vec3(0.);
		color = vec3(st.x, st.y, abs(sin(utime/10.0)));

		gl_FragColor = vec4(color, 1);


	}`;

export default (props) => {
	let mandel;
	const Y_AXIS = 1;
	const X_AXIS = 2;

	const setup = (p5, canvasParentRef) => {
		p5.createCanvas(props.width, props.height, p5.WEBGL).parent(
			canvasParentRef,
		);
		mandel = p5.createShader(vs, fs);
		p5.shader(mandel);
		p5.noStroke();
		mandel.setUniform("p", [-0.74364388703, 0.13182590421]);
	};

	const draw = (p5) => {
		mandel.setUniform(
			"usize",
			[p5.displayWidth, p5.displayHeight]

		);
		mandel.setUniform(
			"r",
			1.5 * Math.exp(-6.5 * (1 + Math.sin(p5.millis() / 2000))),
		);

		const d = new Date()
		const utime = d.getMilliseconds() / 440
		mandel.setUniform(
			"utime",
			utime
		);
		p5.quad(-1, -1, 1, -1, 1, 1, -1, 1);

		// p5.background(232);
		// setGradient(p5)
	};

	return <Sketch style={
		{padding: "3rem"}
		} className="p5sketch" setup={setup} draw={draw} />;
};

