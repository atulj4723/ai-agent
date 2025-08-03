import { loadConversationHistory } from "./memory/loadConversationHistory.js";
import readline from "readline";
import { printBanner } from "./utils/banner.js";
import { processAIResponse } from "./ai/processAIResponse.js";
import { summarizeConversation } from "./ai/summarizeConversation.js";
import { saveConversationHistory } from "./memory/saveConversationHistory.js";
import { speak } from "./utils/speak.js";
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});
// Load conversation history
let conversation = loadConversationHistory() || [];
printBanner();
speak("Welcome to JARVIS CLI AI Assistant! Type 'quit' to exit.");
(async () => {
    while (true) {
        const input = await new Promise((resolve) =>
            rl.question("You: ", resolve)
        );
        if (input.toLowerCase() === "quit") {
            speak("Session ended. Goodbye.");
            rl.close();
            break;
        }
        conversation.push({ role: "user", parts: [{ text: input }] });
        await processAIResponse(conversation);
        conversation = await summarizeConversation(conversation);
        saveConversationHistory(conversation);
    }
})();