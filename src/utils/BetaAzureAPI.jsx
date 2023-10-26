import { AzureKeyCredential, OpenAIClient } from "@azure/openai";

import getPromptObject from "./PromptObjectGenerator";

const endpoint = "https://zyoaiinstance.openai.azure.com";
const apiKey = process.env.OAI_KEY_AZURE;
const deploymentID = "gpt4-deployment";
let cleanApiKey = apiKey;
if (apiKey.startsWith("sk-")) {
  cleanApiKey = apiKey.replace("sk-", "");
}

const client = new OpenAIClient(endpoint, new AzureKeyCredential(cleanApiKey));

const chatOptions = {
  temperature: 0.0,
  // maxTokens: 128,
};

export async function getCompletions(userPrompt) {
  const promptObj = getPromptObject(userPrompt);
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

export async function getStreamedCompletions(userPrompt, callback) {
  fe;
  const promptObj = getPromptObject(userPrompt);
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
