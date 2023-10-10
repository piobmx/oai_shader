import { OpenAIClient, AzureKeyCredential } from "@azure/openai";

const endpoint = "https://zyoaiinstance.openai.azure.com";
const apiKey = process.env.OAI_KEY_AZURE;
const deploymentID = "gpt4-deployment";
let cleanApiKey = apiKey;
if (apiKey.startsWith("sk-")) {
    cleanApiKey = apiKey.replace("sk-", "");
}

const client = new OpenAIClient(endpoint, new AzureKeyCredential(cleanApiKey));

const getPromptObject = (user_prompt, mode) => {
    if (mode === "test") {
        return [
            {
                role: "system",
                content: "you are a waiter at a french restaurant",
            },
            { role: "user", content: `what's the special tonight?` },
        ];
    } else {
        return [
            { role: "system", content: defaultSystemPrompt },
            { role: "user", content: `a fragment snippet for ${user_prompt}` },
        ];
    }
};

const chatOptions = {
    temperature: 0.0,
    // maxTokens: 128,
};

export async function getCompletions(user_prompt) {
    const promptObj = getPromptObject(user_prompt);
    const { id, created, choices, usage } = await client.getChatCompletions(
        deploymentID,
        promptObj,
        chatOptions
    );
    let result = "";
    for (const choice of choices) {
        let c = choice.message.content;
        result = result + c;
    }
    return result;
}

export async function getStreamedCompletions(user_prompt, callback) {
    const promptObj = getPromptObject(user_prompt);
    const events = client.listChatCompletions(
        deploymentID,
        promptObj,
        chatOptions
    );
    const stream = new ReadableStream({
        async start(controller) {
            for await (const event of events) {
                controller.enqueue(event);
            }
            controller.close();
        },
    });

    const reader = stream.getReader();
    let result = "";
    while (true) {
        const { done, value } = await reader.read();
        if (done) {
            break;
        }
        for (const choice of value.choices) {
            if (choice.delta?.content !== undefined) {
                result += choice.delta?.content;
                callback(result);
            }
        }
    }
    return result;
}

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
