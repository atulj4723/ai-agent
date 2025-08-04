import { loadMemoryIndex } from "../memory/loadMemoryIndex.js";

export const search_memory = ({ query }) => {
    const memoryIndex = loadMemoryIndex();
    const searchTerms = query.toLowerCase().split(" ");
    const results = memoryIndex
        .map((item) => {
            let score = 0;
            const combinedText = `${item.summary.toLowerCase()} ${item.keywords.join(
                " "
            )}`;
            searchTerms.forEach((term) => {
                if (combinedText.includes(term)) score++;
            });
            return { ...item, score };
        })
        .filter((item) => item.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 3);
    if (results.length === 0) {
        return `❌ No relevant memories found for "${query}".`;
    }
    const resultForAI = results.map((r) => ({
        key: r.key,
        summary: r.summary,
    }));
    return `Found ${
        results.length
    } relevant memory blocks. Summaries & keys: ${JSON.stringify(resultForAI)}`;
};
export const searchMemoryDescription={
    name: "search_memory",
    description: "Searches the long-term memory archives to find relevant past conversations. Use this as the FIRST step when the user asks about something not in the recent chat.",
    parameters: {
        type: "object",
        properties: {
            query: {
                type: "string",
                description:
                    "A search query describing the topic you are looking for.",
            },
        },
        required: ["query"],
    },
}