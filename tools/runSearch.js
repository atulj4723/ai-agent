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
