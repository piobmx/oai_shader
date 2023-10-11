import "prismjs/themes/prism-funky.css";

import { Button, Input } from "antd";
import {
    PromptComponentStyle,
    buttonStyles,
    containerStyle,
    textareaComponentStyle,
} from "../../styles";
import React, { useState } from "react";
import {
    cleanPromptAtom,
    fragAtom,
    loadingAtom,
    promptAtom,
    shaderErrorMsgAtom,
    shaderHasErrorAtom,
} from "../../App";
import {
    getCompletions,
    getStreamedCompletions,
} from "../../utils/BetaAzureAPI";
import { useAtom, useAtomValue } from "jotai";

import Editor from "react-simple-code-editor";
import ExtendedPrism from "../../utils/ExtendPrism";
import PromptComponent from "./PromptComponent";
import UIComponents from "./Buttons";
import { getCompletionsFromOpenai } from "../../utils/BetaOpenaiAPI";
import { highlight } from "prismjs/components/prism-core";

const { TextArea } = Input;

function ShaderComponent() {
    const [fragCode, setFragCode] = useAtom(fragAtom);
    const [prompt, setPrompt] = useAtom(promptAtom);
    const [loading, setLoading] = useAtom(loadingAtom);
    const [inputVisibility, setInputVisibility] = useState(true);
    const [shaderHasError, setShaderHasError] = useAtom(shaderHasErrorAtom);
    const [shaderErrorMsg, setShaderErrorMsg] = useAtom(shaderErrorMsgAtom);
    const [APIError, setAPIError] = useState("");
    const cleanPrompt = useAtomValue(cleanPromptAtom);
    const openAI = true;

    const emptyResult = () => {
        // setResult("");
        // setFragCode("");
    };

    const setFragCodeCb = (input) => {
        setFragCode(input);
    };

    const eventPrompt = async () => {
        emptyResult();
        setAPIError("");

        console.log(cleanPrompt);
        if (openAI) {
            try {
                const response = await getCompletionsFromOpenai(
                    cleanPrompt,
                    setFragCodeCb
                );
                return response;
            } catch (error) {
                console.error("Fetch OpenAI API Error:", error);
                setAPIError(error);
            } finally {
                setLoading(false);
            }
        } else {
            try {
                const response = await getStreamedCompletions(
                    cleanPrompt,
                    setFragCodeCb
                );
                return response;
            } catch (error) {
                console.error("Fetch OpenAI API Error:", error);
                setAPIError(error);
            } finally {
                setLoading(false);
            }
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

        setFragCode(validated_result);
    };

    return (
        <div style={containerStyle}>
            {inputVisibility ? (
                <>
                    <PromptComponent
                        style={PromptComponentStyle}
                        generateShader={eventPrompt}
                        validator={validateResult}
                    />

                    <UIComponents
                        toggleInputVisibility={toggleInputVisibility}
                        generateShader={eventPrompt}
                        validator={validateResult}
                    />

                    <Editor
                        value={fragCode}
                        padding={10}
                        highlight={(code) =>
                            hightlightWithLineNumbers(
                                code,
                                ExtendedPrism.languages.glsl
                            )
                        }
                        onValueChange={(code) => setFragCode(code)}
                        textareaId="codeArea"
                        className="editor"
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
                        style={{
                            ...buttonStyles,
                            backgroundColor: "#ef12ef",
                        }}
                    >
                        ToggleUI
                    </Button>
                </>
            )}
        </div>
    );
}
const hightlightWithLineNumbers = (input, language) => {
    return highlight(input, language)
        .split("\n")
        .map(
            (line, i) => `<span class='editorLineNumber'>${i + 1}</span>${line}`
        )
        .join("\n");
};

export default ShaderComponent;
