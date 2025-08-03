import fs from "fs";
import path from "path";
import { conversationHistoryAllTimeFolder } from "../config.js";
export const search_particular_memory = ({ query }) => {
    const filePath = path.join(conversationHistoryAllTimeFolder, query);
    if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, "utf-8");
        return `Successfully retrieved details from archive ${query}: ${content}`;
    }
    return `❌ Memory block "${query}" not found.`;
};
