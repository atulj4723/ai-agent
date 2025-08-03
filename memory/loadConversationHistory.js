import { conversationHistoryFile } from "../config.js";
import fs from "fs";
export const loadConversationHistory = () => {
    if (fs.existsSync(conversationHistoryFile)) {
        try {
            return JSON.parse(
                fs.readFileSync(conversationHistoryFile, "utf-8")
            );
        } catch {
            return [];
        }
    }
    return [];
};