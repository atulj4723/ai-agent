import { ai } from "../config.js";
export const runSearch = async ({ query }) => {
    const groundingTool = { googleSearch: {} };
    const config = { tools: [groundingTool] };
    const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: query,
        config,
    });
    return response.text;
};
export const runSearchDescription={
    name: "runSearch",
    description: "Run a search query using AI model",
    parameters: {
        type: "object",
        properties: {
            query: {
                type: "string",
                description: "The search query to run",
            },
        },
        required: ["query"],
    },
}