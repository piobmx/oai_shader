import React, { useState } from 'react';
import { Input } from 'antd';
import { useAtom } from 'jotai';
import { fragAtom } from './App';

const { TextArea } = Input

function ShaderComponent() {
    const [fragCode, setFragCode] = useAtom(fragAtom)

    return (
        <div>
            {/* Textarea for entering the fragment shader code */}
            <TextArea
                value={fragCode}
                onChange={e => {
                    setFragCode(e.target.value)
                }}
                bordered
                placeholder="Enter your fragment shader code here..."
                style={{
                    fontFamily: "monospace"
                }}
            ></TextArea>

            {/* Hidden div containing the fragment shader code */}
            <div id="fragmentShader" style={{ display: 'none' }}>
                {fragCode}
            </div>
        </div>
    );
}

export default ShaderComponent;
