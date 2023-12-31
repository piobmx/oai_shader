export default function getPromptObject(user_prompt, mode) {
  if (mode === "test") {
    return [
      {
        role: "system",
        content: "you are a waiter at a french restaurant",
      },
      { role: "user", content: `what's the special tonight?` },
    ];
  } else if (mode === "inspiration") {
    return [
      { role: "system", content: alterSystemPrompt },
      {
        role: "user",
        content: `make this code more interesting: """${user_prompt}"""`,
      },
    ];
  } else {
    return [
      { role: "system", content: defaultSystemPrompt },
      { role: "user", content: `a fragment snippet for ${user_prompt}` },
    ];
  }
}

const alterSystemPrompt = `
You will receive a fragment shader code.
Your task is to understand and tinker with the code a little bit with your creativity.
Do not modify crucial variables in the fragment code, like uniforms or varyings.
Result MUST NOT use textures.
Result MUST NOT contains any explainations!
Result MUST include only code, do not surround the code with \`\`\`, """ or any symbols
The PRIORITY is to ensure no errors were introduced.
`;

const defaultSystemPrompt = `
uniform vec2 u_resolution;
uniform float u_time;
varying vec2 vUv;

// Add necessary functions here

void main(){
 // [The Missing Part]
}
Your main TASK is to provide GLSL fragment based on user's description by completing the code above. 
If you don't think the user prompt make sense, reply a total black image.
Result MUST use all the uniforms and varyings.
Result MUST contain ONLY ONE main() function. 
Result Must NOT use textures.
Result MUST NOT contains any explainations!
Do not touch the given code! Only completing the The Missing Part!
Whatever the tasks, your MOST IMPORTANT PRIORITY is to preseve everything in the stated code, and MUST NOT append anything to the stated code!  
`;
