import { Configuration, OpenAIApi } from "openai";

const apiKey = process.env.OAI_KEY;
const configuration = new Configuration({
  organization: organization,
  apiKey: apiKey,
});
const openai = new OpenAIApi(configuration);

export const testResponse = async () => {
  const response = await openai.listEngines();
  return response;
};
