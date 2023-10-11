import OpenAI from "openai";
import getPromptObject from "./PromptObjectGenerator";

const apiKey = process.env.OAI_KEY;
const organization = "org-pIR1knw6Phpxe52AHBzqsxKQ";
const openai = new OpenAI({
    apiKey: apiKey,
    dangerouslyAllowBrowser: true,
});

export async function getCompletionsFromOpenai(userPrompt, callback) {
    const promptObject = getPromptObject(userPrompt);
    try {
        const stream = await openai.chat.completions.create({
            model: "gpt-4",
            messages: promptObject,
            stream: true,
        });
    } catch (error) {
        if (error instanceof OpenAI.APIError) {
            console.error(error.status);
            console.error(error.message);
            console.error(error.code);
            console.error(error.type);
        } else {
            console.log(error);
        }
    }

    let result = "";
    for await (const part of stream) {
        let token = part.choices[0].delta;
        let content = token?.content;
        if (token?.content !== undefined) {
            result += content;
            callback(result);
        }
    }

    return result;
}
