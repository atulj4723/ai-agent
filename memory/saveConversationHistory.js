import fs from "fs";
import { conversationHistoryFile } from "../config.js";
export const saveConversationHistory = (conversation) => {
    fs.writeFileSync(
        conversationHistoryFile,
        JSON.stringify(conversation, null, 2)
    );
};
