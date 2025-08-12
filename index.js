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
(async () => {
    // Initial system prompt
    speak("Activating JARVIS system...");
    const startupPrompt = "System activated. Acknowledge status and check for daily tasks as per your core directive.Give initial response as good morning or good afternoon or good evening based on current time.And say 'Jarvis is ready. How can I assist you today?'";
    conversation.push({ role: "user", parts: [{ text: startupPrompt }] });
    await processAIResponse(conversation);
    conversation = await summarizeConversation(conversation);
    saveConversationHistory(conversation);
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
        const text=await processAIResponse(conversation);
        speak(text);
        conversation = await summarizeConversation(conversation);
        saveConversationHistory(conversation);
    }
})();
