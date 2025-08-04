import {
    ai,
    conversation_limit,
    conversationHistoryAllTimeFolder,
    messagesToSummerize,
} from "../config.js";
import { loadMemoryIndex } from "../memory/loadMemoryIndex.js";
import { saveMemoryIndex } from "../memory/saveMemoryIndex.js";
import path from "path";
import fs from "fs";

export const summarizeConversation = async (conversation) => {
    if (conversation.length === 0) return [];
    if (conversation.length <= conversation_limit) return conversation;
    const toSummarize = conversation.slice(0, messagesToSummerize);
    const toKeep = conversation.slice(messagesToSummerize);
    try {
        const summaryResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            config: { tools: [] }, // No tools needed for summarization
            contents: `Concisely summarize the key points, facts, and topics from this conversation: ${JSON.stringify(
                toSummarize
            )}`,
        });
        const summary = summaryResponse.candidates[0].content.parts[0].text;

        const keywordsResult = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            config: { tools: [] }, // No tools needed for keyword extraction
            contents: `Based on the following summary, generate a list of 5-7 relevant JSON keywords in an array format (e.g., ["keyword1", "keyword2"]): "${summary}".Only give valid  array of keywords.`,
        });
        let keywords = [];
        try {
            keywords = JSON.parse(
                keywordsResult.response.text().replace(/```json\n?|```/g, "")
            );
        } catch {
            keywords = summary
                .toLowerCase()
                .split(" ")
                .filter((word) => word.length > 3)
                .slice(0, 5); // Fallback
        }
        
        const summaryKey = `summary-${Date.now()}.json`;
        if (!fs.existsSync(conversationHistoryAllTimeFolder)) {
            fs.mkdirSync(conversationHistoryAllTimeFolder, { recursive: true });
        }
        const historyPath = path.join(
            conversationHistoryAllTimeFolder,
            summaryKey
        );
        fs.writeFileSync(historyPath, JSON.stringify(toSummarize, null, 2));

        let memoryIndex = loadMemoryIndex();
        memoryIndex.push({
            key: summaryKey,
            timestamp: Date.now(),
            summary: summary,
            keywords,
        });
        saveMemoryIndex(memoryIndex);
        const systemMessage = {
            role: "model",
            parts: [
                {
                    text: `Conversation summarized and archived. Summary: ${summary}`,
                },
            ],
        };
        return [systemMessage, ...toKeep];
    } catch (error) {
        console.error("Error during summarization:", error);
        return conversation;
    }
};
