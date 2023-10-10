import React from "react";
import { Button, Popover, Space } from "antd";

const AboutContent = (
    <div>
        <p>
            This page allows you to generate shader code in real-time using the
            OpenAI API. By writing a simple prompt or specification, you can
            instantly obtain shader codes tailored to your request.
        </p>
        <p>
            To bring these generated shaders to life, Three.js and WebGL are
            integrated the system. This allows the fragment code to be
            visualized on-the-fly seamlessly as you can see. It also allows
            users to display the result on different geometries.
        </p>
        <p>
            <b>Cautious: </b>
            Be aware that shaders operate differently than typical tool with
            high level drawing functionality. Graphics were generated based on
            mathematical functions and algorithms. Also, this application can
            not be regarded as typical generateive AI models. It might not
            produce literal interpretations of human language sometimes since it
            wasn't invented to. You can read more about shader{" "}
            <a href="https://en.wikipedia.org/wiki/Shader">here</a>.
        </p>
        <b>Stay Tuned for More!</b>
    </div>
);

const CornerComponent = () => {
    return (
        <>
            <Space wrap style={cornerStyle} split="|">
                <Popover content={AboutContent} title="About" trigger="click">
                    <Button
                        id="about"
                        className="cornerButton"
                        style={buttonStyle}
                    >
                        About
                    </Button>
                </Popover>

                <a href="https://zhang-yi-wu.dev/" target="_blank" id="name">
                    Zhangyi Wu @ 2023
                </a>
            </Space>
        </>
    );
};

const popoverStyle = {
    width: "3rem",
};
const cornerStyle = {
    position: "absolute",
    zIndex: "10",
    right: "26%",
    bottom: "2rem",
    fontFamily: "'Chakra Petch', sans-serif",
};

const buttonStyle = {
    background: "none",
    border: "none",
    fontFamily: "'Chakra Petch', sans-serif",
    fontWeight: "bold",
    padding: 0,
};

export default CornerComponent;
