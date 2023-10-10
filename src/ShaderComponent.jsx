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
import UIComponents from "./Buttons";
import { CodeBlock, dracula } from "react-code-blocks";
import SyntaxHighlighter from "react-syntax-highlighter";
import Editor from "react-simple-code-editor";
import Prism from "prismjs";
import { highlight, languages } from "prismjs/components/prism-core";
import CornerComponent from "./Corners";
// import "prismjs/components/prism-cooklang";
import CascaderGeometrySelector from "./CascaderGeometrySelector";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/themes/prism-funky.css";
(Prism.languages.c = Prism.languages.extend("clike", {
    comment: {
        pattern:
            /\/\/(?:[^\r\n\\]|\\(?:\r\n?|\n|(?![\r\n])))*|\/\*[\s\S]*?(?:\*\/|$)/,
        greedy: !0,
    },
    string: { pattern: /"(?:\\(?:\r\n|[\s\S])|[^"\\\r\n])*"/, greedy: !0 },
    "class-name": {
        pattern:
            /(\b(?:enum|struct)\s+(?:__attribute__\s*\(\([\s\S]*?\)\)\s*)?)\w+|\b[a-z]\w*_t\b/,
        lookbehind: !0,
    },
    keyword:
        /\b(?:_Alignas|_Alignof|_Atomic|_Bool|_Complex|_Generic|_Imaginary|_Noreturn|_Static_assert|_Thread_local|__attribute__|asm|auto|break|case|char|const|continue|default|do|double|else|enum|extern|float|for|goto|if|inline|int|long|register|return|short|signed|sizeof|static|struct|switch|typedef|typeof|union|unsigned|void|volatile|while)\b/,
    function: /\b[a-z_]\w*(?=\s*\()/i,
    number: /(?:\b0x(?:[\da-f]+(?:\.[\da-f]*)?|\.[\da-f]+)(?:p[+-]?\d+)?|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:e[+-]?\d+)?)[ful]{0,4}/i,
    operator: />>=?|<<=?|->|([-+&|:])\1|[?:~]|[-+*/%&|^!=<>]=?/,
})),
    Prism.languages.insertBefore("c", "string", {
        char: {
            pattern: /'(?:\\(?:\r\n|[\s\S])|[^'\\\r\n]){0,32}'/,
            greedy: !0,
        },
    }),
    Prism.languages.insertBefore("c", "string", {
        macro: {
            pattern:
                /(^[\t ]*)#\s*[a-z](?:[^\r\n\\/]|\/(?!\*)|\/\*(?:[^*]|\*(?!\/))*\*\/|\\(?:\r\n|[\s\S]))*/im,
            lookbehind: !0,
            greedy: !0,
            alias: "property",
            inside: {
                string: [
                    { pattern: /^(#\s*include\s*)<[^>]+>/, lookbehind: !0 },
                    Prism.languages.c.string,
                ],
                char: Prism.languages.c.char,
                comment: Prism.languages.c.comment,
                "macro-name": [
                    { pattern: /(^#\s*define\s+)\w+\b(?!\()/i, lookbehind: !0 },
                    {
                        pattern: /(^#\s*define\s+)\w+\b(?=\()/i,
                        lookbehind: !0,
                        alias: "function",
                    },
                ],
                directive: {
                    pattern: /^(#\s*)[a-z]+/,
                    lookbehind: !0,
                    alias: "keyword",
                },
                "directive-hash": /^#/,
                punctuation: /##|\\(?=[\r\n])/,
                expression: { pattern: /\S[\s\S]*/, inside: Prism.languages.c },
            },
        },
    }),
    Prism.languages.insertBefore("c", "function", {
        constant:
            /\b(?:EOF|NULL|SEEK_CUR|SEEK_END|SEEK_SET|__DATE__|__FILE__|__LINE__|__TIMESTAMP__|__TIME__|__func__|stderr|stdin|stdout)\b/,
    }),
    delete Prism.languages.c.boolean;

Prism.languages.glsl = Prism.languages.extend("c", {
    keyword:
        /\b(?:active|asm|atomic_uint|attribute|[ibdu]?vec[234]|bool|break|buffer|case|cast|centroid|class|coherent|common|const|continue|d?mat[234](?:x[234])?|default|discard|do|double|else|enum|extern|external|false|filter|fixed|flat|float|for|fvec[234]|goto|half|highp|hvec[234]|[iu]?sampler2DMS(?:Array)?|[iu]?sampler2DRect|[iu]?samplerBuffer|[iu]?samplerCube|[iu]?samplerCubeArray|[iu]?sampler[123]D|[iu]?sampler[12]DArray|[iu]?image2DMS(?:Array)?|[iu]?image2DRect|[iu]?imageBuffer|[iu]?imageCube|[iu]?imageCubeArray|[iu]?image[123]D|[iu]?image[12]DArray|if|in|inline|inout|input|int|interface|invariant|layout|long|lowp|mediump|namespace|noinline|noperspective|out|output|partition|patch|precise|precision|public|readonly|resource|restrict|return|sample|sampler[12]DArrayShadow|sampler[12]DShadow|sampler2DRectShadow|sampler3DRect|samplerCubeArrayShadow|samplerCubeShadow|shared|short|sizeof|smooth|static|struct|subroutine|superp|switch|template|this|true|typedef|uint|uniform|union|unsigned|using|varying|void|volatile|while|writeonly)\b/,
});

import {
    textareaComponentStyle,
    containerStyle,
    buttonStyles,
    PromptComponentStyle,
} from "./styles";

const { TextArea } = Input;
let apiUrl;
if (import.meta.env.MODE === "development") {
    apiUrl = "http://127.0.0.1:3000/v1/api";
} else {
    apiUrl = "https://vercel-flask-fawn.vercel.app/v1/api"
}

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
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    promptMessage: prompt.toLowerCase(),
                }),

                // body: prompt.toLowerCase(),
                // promptMessage: prompt.toLowerCase(),
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
                    {/* <CascaderGeometrySelector /> */}

                    <UIComponents
                        toggleInputVisibility={toggleInputVisibility}
                        generateShader={eventPrompt}
                        validator={validateResult}
                    />

                    {/* <TextArea
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
                    /> */}
                    <Editor
                        value={fragCode}
                        padding={10}
                        highlight={(code) =>
                            hightlightWithLineNumbers(
                                code,
                                Prism.languages.glsl
                            )
                        }
                        onValueChange={(code) => setFragCode(code)}
                        textareaId="codeArea"
                        className="editor"
                    />

                    {/* <Editor></Editor> */}

                    {/* <TextArea
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
                    /> */}
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
            <div id="fragmentShader" style={{ display: "none" }}>
                {fragCode}
            </div>
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
