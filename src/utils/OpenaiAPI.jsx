import { Configuration, OpenAIApi } from "openai";

const apiKey = process.env.OAI_KEY;
const organization = "org-pIR1knw6Phpxe52AHBzqsxKQ";
const configuration = new Configuration({
    organization: organization,
    apiKey: apiKey,
});
const openai = new OpenAIApi(configuration);

export const testResponse = async () => {
    const response = await openai.listEngines();
    return response;
};
