import fs from "fs";
import path from "path";

import { conversationHistoryAllTimeFolder } from "../../config.js";
export const search_particular_memory = ({ query }) => {
    const filePath = path.join(conversationHistoryAllTimeFolder, query);
    if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, "utf-8");
        return `Successfully retrieved details from archive ${query}: ${content}`;
    }
    return `❌ Memory block "${query}" not found.`;
};
export const searchParticularMemoryDescription = {
    name: "search_particular_memory",
    description:
        "SECOND step. After finding a memory with 'search_memory_archives', use this tool with the 'summary_key' to retrieve the full, detailed conversation content.",
    parameters: {
        type: "object",
        properties: {
            query: {
                type: "string",
                description:
                    "The summary_key of the memory you want to retrieve.The unique key for the archive file, e.g., 'summary-123456789.json'.",
            },
        },
        required: ["query"],
    },
};
