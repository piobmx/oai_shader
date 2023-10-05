import React, { useState } from "react";
import { Button, Input } from "antd";
import { useAtom } from "jotai";
import {
    promptAtom,
    fragAtom,
    shaderErrorMsgAtom,
    shaderHasErrorAtom,
    loadingAtom,
} from "./App";
import PromptComponent from "./PromptComponent";
import Buttons from "./Buttons";
import {
    textareaComponentStyle,
    containerStyle,
    buttonStyles,
    PromptComponentStyle,
} from "./styles";

const { TextArea } = Input;
const apiUrl = "http://127.0.0.1:3000/v1/api";

function ShaderComponent() {
    const [fragCode, setFragCode] = useAtom(fragAtom);
    const [prompt, setPrompt] = useAtom(promptAtom);
    const [loading, setLoading] = useAtom(loadingAtom);
    const [result, setResult] = useState("");
    const [inputVisibility, setInputVisibility] = useState(true);
    const [shaderHasError, setShaderHasError] = useAtom(shaderHasErrorAtom);
    const [shaderErrorMsg, setShaderErrorMsg] = useAtom(shaderErrorMsgAtom);

    const emptyResult = () => {
        setResult("");
    };

    const eventPrompt = async () => {
        emptyResult();
        console.log(`processing prompt: ${prompt}`);
        try {
            const response = await fetch(apiUrl, {
                method: "POST",
                body: prompt.toLowerCase(),
            });

            const reader = response.body.getReader();
            let streamText = "";
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                setLoading(true);
                streamText += new TextDecoder().decode(value);
                setFragCode(streamText);
                setResult(streamText);
            }
            setLoading(false);
            return streamText;
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const toggleInputVisibility = () => {
        setInputVisibility((visibility) => !visibility);
    };

    const validateResult = (streamedResult) => {
        if (streamedResult === "") {
            console.log("2");
            return;
        }
        const prefixes = [
            // "varying vec2 vUv;",
            "uniform vec2 u_resolution;",
            "uniform float u_time;",
            "varying vec2 vUv;",
        ];

        let validated_result = streamedResult;

        prefixes.forEach((prefix) => {
            if (validated_result.indexOf(prefix) === -1) {
                validated_result = prefix + "\n" + validated_result;
            }
        });

        validated_result = validated_result.replace(
            new RegExp("gl_FragCoord", "g"),
            "vUv"
        );
        // validated_result = validated_result.replace("gl_FragCoord", "vUv");

        setResult(validated_result);
        setFragCode(validated_result);
    };

    return (
        <div style={containerStyle}>
            {inputVisibility ? (
                <>
                    <PromptComponent
                        style={PromptComponentStyle}
                        getShader={eventPrompt}
                        validator={validateResult}
                    />
                    <Buttons
                        toggleInputVisibility={toggleInputVisibility}
                        generateShader={eventPrompt}
                        validator={validateResult}
                    />

                    <TextArea
                        className={"InputArea"}
                        value={fragCode}
                        bordered={false}
                        onChange={(e) => {
                            setFragCode(e.target.value);
                        }}
                        rows={20}
                        placeholder="Enter your fragment shader code here..."
                        spellCheck={false}
                        style={{
                            fontStyle: loading ? "italic" : "normal",
                            ...textareaComponentStyle,
                        }}
                    ></TextArea>
                    <TextArea
                        className={"ResultArea"}
                        bordered={false}
                        value={result}
                        onChange={(e) => {}}
                        rows={20}
                        placeholder="Results from ChatGPT"
                        spellCheck={false}
                        style={{
                            ...textareaComponentStyle,
                            fontStyle: loading ? "italic" : "normal",
                            display: "none",
                        }}
                    />
                    <TextArea
                        className={"ErrorMessageArea"}
                        bordered={false}
                        value={
                            loading
                                ? "Generating and compiling fragment shader ..."
                                : shaderHasError
                                ? `${shaderErrorMsg}`
                                : "No error detected!"
                        }
                        onChange={(e) => {}}
                        rows={10}
                        placeholder="Results from ChatGPT"
                        style={{
                            ...textareaComponentStyle,
                            color: "rgba(255, 0, 0,1)",
                            fontStyle: loading ? "italic" : "normal",
                            // display: shaderHasError ? "block" : "none",
                        }}
                        spellCheck={false}
                    />
                </>
            ) : (
                <>
                    <Button
                        type="primary"
                        onClick={toggleInputVisibility}
                        style={buttonStyles}
                    >
                        Show All
                    </Button>
                </>
            )}
            <div id="fragmentShader" style={{ display: "none" }}>
                {fragCode}
            </div>
        </div>
    );
}

export default ShaderComponent;
